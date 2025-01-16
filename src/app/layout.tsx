import '../styles/globals.css'
import { Inter } from 'next/font/google'
import ReactQueryProvider from '@/utils/react-query'
import { Sidebar } from "@/components/common/sidebar"
import { SidebarProvider } from "@/components/common/sidebar/sidebar-context"
import { MainContent } from "@/components/common/main-content"

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
      <ReactQueryProvider>
        <body className={inter.className}>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
          </SidebarProvider>
        </body>
      </ReactQueryProvider>
    </html>
  )
} 