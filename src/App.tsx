import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { errorLogger } from '@/services/errorLogger'
// import { InstallPWA, PWAUpdateNotification, NetworkStatus } from '@/components/pwa'
// import { pwaService } from '@/services/pwaService'
import AppRouter from './routes/AppRouter'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  // Tạm thời tắt PWA service để debug
  // React.useEffect(() => {
  //   pwaService.init();
  // }, []);

  return (
    <ErrorBoundary 
      onError={(error, errorInfo) => {
        errorLogger.logReactError(error, errorInfo, 'App Root');
      }}
    >
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
          <Toaster />
          <SonnerToaster position="top-right" richColors />
          {/* Tạm thời tắt các component PWA gây lỗi */}
          {/* <InstallPWA /> */}
          {/* <PWAUpdateNotification /> */}
          {/* <NetworkStatus /> */}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App