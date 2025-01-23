import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/common/sidebar'
import { SidebarProvider } from '@/components/common/sidebar/sidebar-context'
import { MainContent } from '@/components/common/main-content'
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
          <SidebarProvider>
            <div className="min-h-screen bg-gray-50">
              <Sidebar />
              <MainContent>
                {children}
                <Toaster />
              </MainContent>
            </div>
          </SidebarProvider>
          </ReactQueryProvider>
        </body>
    </html>
  )
} 