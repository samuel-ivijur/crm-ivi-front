import '../styles/globals.css'
import { Inter } from 'next/font/google'
import ReactQueryProvider from '@/utils/react-query'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IVijur CRM',
  description: 'CRM IVijur',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
} 