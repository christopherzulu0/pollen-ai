'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { Toaster as SonnerToaster } from 'sonner'
import { Toaster } from '@/components/ui/toaster'
import { OfflineStatus } from '@/components/offline-status'
import { flushOfflineQueue, installOfflineFetch, offlineQueryStorage } from '@/lib/offline'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    installOfflineFetch()
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          refetchOnWindowFocus: false,
          networkMode: 'offlineFirst',
        },
      },
    })
  })

  useEffect(() => {
    void flushOfflineQueue()
    const persister = createAsyncStoragePersister({ storage: offlineQueryStorage })
    const [unsubscribe] = persistQueryClient({
      queryClient,
      persister,
      maxAge: 24 * 60 * 60 * 1000,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          if (query.state.status !== 'success') return false
          const key = JSON.stringify(query.queryKey).toLowerCase()
          return key.includes('member') || key.includes('group') || key.includes('meeting')
        },
      },
    })
    return unsubscribe
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <OfflineStatus />
      <ReactQueryDevtools initialIsOpen={false} />
      <SonnerToaster position="top-right" richColors />
      <Toaster />
    </QueryClientProvider>
  )
} 