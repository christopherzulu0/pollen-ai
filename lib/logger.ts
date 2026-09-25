type LogFields = {
  event: string
  requestId?: string
  method?: string
  path?: string
  status?: number
  durationMs?: number
  actorId?: string | null
  ip?: string | null
  message?: string
}

export function log(fields: LogFields) {
  const line = {
    time: new Date().toISOString(),
    ...fields,
  }
  console.log(JSON.stringify(line))
}
