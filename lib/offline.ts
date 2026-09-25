"use client"

export type OfflineSnapshot = {
  offline: boolean
  pending: number
  syncing: boolean
  usingCache: boolean
}

type CacheRecord = {
  body: string
  contentType: string
  status: number
  savedAt: number
}

type OutboxRecord = {
  id: string
  url: string
  method: string
  body: string | null
  contentType: string | null
  idempotencyKey: string
  createdAt: number
}

const DB_NAME = "pollen-offline"
const DB_VERSION = 1
const listeners = new Set<() => void>()

let status: OfflineSnapshot = {
  offline: false,
  pending: 0,
  syncing: false,
  usingCache: false,
}
let installed = false
let nativeFetch: typeof fetch | null = null
let replaying = false

const READ_PREFIXES = [
  "/api/member/overview",
  "/api/groups",
  "/api/meetings",
  "/api/notifications",
  "/api/personal-savings",
  "/api/savings-goals",
  "/api/member/insurance/products",
  "/api/member/insurance/policies",
]

const QUEUED_POSTS = new Set([
  "/api/join-requests",
  "/api/Frontend/request",
  "/api/notifications/mark-read",
  "/api/notifications/mark-all-read",
])

function notify(patch: Partial<OfflineSnapshot>) {
  status = { ...status, ...patch }
  listeners.forEach((listener) => listener())
}

export function getOfflineStatus() {
  return status
}

export function subscribeOffline(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("cache")) db.createObjectStore("cache")
      if (!db.objectStoreNames.contains("outbox")) db.createObjectStore("outbox")
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv")
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore<T>(
  storeName: "cache" | "outbox" | "kv",
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T> | Promise<T>
) {
  const db = await openDb()
  try {
    const tx = db.transaction(storeName, mode)
    const done = new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
    const store = tx.objectStore(storeName)
    const result = await run(store)
    const value = result instanceof IDBRequest ? await requestToPromise(result) : await result
    await done
    return value
  } finally {
    db.close()
  }
}

export const offlineQueryStorage = {
  getItem: async (key: string) => {
    const value = await withStore<string | undefined>("kv", "readonly", (store) => store.get(key))
    return value ?? null
  },
  setItem: (key: string, value: string) =>
    withStore("kv", "readwrite", (store) => store.put(value, key)).then(() => undefined),
  removeItem: (key: string) =>
    withStore("kv", "readwrite", (store) => store.delete(key)).then(() => undefined),
}

function actorKey() {
  const clerk = (window as unknown as { Clerk?: { user?: { id?: string } } }).Clerk
  return clerk?.user?.id || "anon"
}

function resolveUrl(input: RequestInfo | URL) {
  const raw = input instanceof Request ? input.url : input instanceof URL ? input.href : input
  return new URL(raw, window.location.origin)
}

function isSameOriginApi(url: URL) {
  return url.origin === window.location.origin && url.pathname.startsWith("/api/")
}

function isBlockedCache(pathname: string) {
  return (
    pathname.startsWith("/api/aave") ||
    pathname.startsWith("/api/celo") ||
    pathname.startsWith("/api/balances") ||
    pathname.startsWith("/api/kyc")
  )
}

function isReadable(url: URL, method: string) {
  if (method !== "GET" || isBlockedCache(url.pathname)) return false
  return READ_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)
  )
}

function isQueueable(url: URL, method: string) {
  if (method === "PUT" && /^\/api\/meetings\/[^/]+\/minutes$/.test(url.pathname)) return true
  return method === "POST" && QUEUED_POSTS.has(url.pathname)
}

function cacheKey(url: URL) {
  return `${actorKey()}:${url.pathname}${url.search}`
}

async function readCache(url: URL) {
  return withStore<CacheRecord | undefined>("cache", "readonly", (store) => store.get(cacheKey(url)))
}

async function writeCache(url: URL, response: Response) {
  const body = await response.clone().text()
  const record: CacheRecord = {
    body,
    contentType: response.headers.get("content-type") || "application/json",
    status: response.status,
    savedAt: Date.now(),
  }
  await withStore("cache", "readwrite", (store) => store.put(record, cacheKey(url)))
}

function cachedResponse(record: CacheRecord) {
  notify({ usingCache: true, offline: true })
  return new Response(record.body, {
    status: record.status,
    headers: {
      "content-type": record.contentType,
      "x-offline-cache": "1",
    },
  })
}

async function pendingCount() {
  const db = await openDb()
  try {
    const tx = db.transaction("outbox", "readonly")
    const count = await requestToPromise(tx.objectStore("outbox").count())
    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve()
    })
    return count
  } finally {
    db.close()
  }
}

async function enqueue(url: URL, method: string, body: string | null, contentType: string | null) {
  const idempotencyKey = crypto.randomUUID()
  const record: OutboxRecord = {
    id: idempotencyKey,
    url: url.pathname + url.search,
    method,
    body,
    contentType,
    idempotencyKey,
    createdAt: Date.now(),
  }
  await withStore("outbox", "readwrite", (store) => store.put(record, record.id))
  notify({ offline: true, pending: await pendingCount() })
  return new Response(JSON.stringify({ queued: true, offline: true }), {
    status: 202,
    headers: { "content-type": "application/json" },
  })
}

async function offlineError() {
  notify({ offline: true })
  return new Response(
    JSON.stringify({ error: "You are offline. This action needs an internet connection." }),
    { status: 503, headers: { "content-type": "application/json" } }
  )
}

export async function flushOfflineQueue() {
  if (!nativeFetch || replaying || !navigator.onLine) return
  replaying = true
  notify({ syncing: true, offline: false })
  try {
    const records = await withStore<OutboxRecord[]>("outbox", "readonly", (store) => store.getAll())
    records.sort((a, b) => a.createdAt - b.createdAt)
    for (const record of records) {
      const response = await nativeFetch(record.url, {
        method: record.method,
        headers: {
          ...(record.contentType ? { "content-type": record.contentType } : {}),
          "idempotency-key": record.idempotencyKey,
        },
        body: record.body,
      })
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        await withStore("outbox", "readwrite", (store) => store.delete(record.id))
      } else {
        break
      }
    }
  } finally {
    replaying = false
    notify({
      syncing: false,
      offline: !navigator.onLine,
      pending: await pendingCount().catch(() => status.pending),
      usingCache: !navigator.onLine && status.usingCache,
    })
  }
}

async function readBody(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.body != null) {
    if (typeof init.body === "string") return init.body
    if (init.body instanceof URLSearchParams) return init.body.toString()
    if (init.body instanceof Blob) return init.body.text()
    return null
  }
  if (input instanceof Request) {
    return input.clone().text()
  }
  return null
}

export function installOfflineFetch() {
  if (installed || typeof window === "undefined") return
  installed = true
  nativeFetch = window.fetch.bind(window)
  notify({ offline: !navigator.onLine })
  void pendingCount().then((pending) => notify({ pending })).catch(() => undefined)
  window.addEventListener("online", () => {
    notify({ offline: false, usingCache: false })
    void flushOfflineQueue()
  })
  window.addEventListener("offline", () => {
    notify({ offline: true })
  })

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = resolveUrl(input)
    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase()
    if (!isSameOriginApi(url) || replaying || !nativeFetch) {
      return nativeFetch!(input, init)
    }

    if (!navigator.onLine) {
      if (isReadable(url, method)) {
        const cached = await readCache(url)
        if (cached) return cachedResponse(cached)
      }
      if (isQueueable(url, method)) {
        const contentType =
          (init?.headers instanceof Headers
            ? init.headers.get("content-type")
            : new Headers(init?.headers).get("content-type")) || null
        return enqueue(url, method, await readBody(input, init), contentType)
      }
      if (method !== "GET") return offlineError()
    }

    try {
      const response = await nativeFetch(input, init)
      if (response.ok && isReadable(url, method)) {
        await writeCache(url, response)
        notify({ usingCache: false, offline: false })
      }
      return response
    } catch (error) {
      if (isReadable(url, method)) {
        const cached = await readCache(url)
        if (cached) return cachedResponse(cached)
      }
      if (isQueueable(url, method)) {
        const contentType =
          (init?.headers instanceof Headers
            ? init.headers.get("content-type")
            : new Headers(init?.headers).get("content-type")) || null
        return enqueue(url, method, await readBody(input, init), contentType)
      }
      if (method !== "GET") return offlineError()
      throw error
    }
  }
}
