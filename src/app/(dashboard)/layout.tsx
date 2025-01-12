import { Sidebar } from "@/components/common/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden lg:ml-16">
        {children}
      </main>
    </div>
  )
} 