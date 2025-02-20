import { Sidebar } from "@/components/common/sidebar"
import { SidebarProvider } from "@/components/common/sidebar/sidebar-context"
import { MainContent } from "@/components/common/main-content"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  )
} 