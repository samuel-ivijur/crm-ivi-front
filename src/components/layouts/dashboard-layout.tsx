'use client'

import { Sidebar } from "@/components/common/sidebar/index"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 space-y-6 p-8">
        {children}
      </main>
    </div>
  )
} 