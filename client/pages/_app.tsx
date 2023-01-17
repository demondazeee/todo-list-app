import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import AuthContext from '../store/AuthContext'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext>
        <Component {...pageProps} />
      </AuthContext>
    </QueryClientProvider>
  )
}
