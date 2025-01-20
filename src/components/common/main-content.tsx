"use client"

import { cn } from "@/utils/cn"
import { useSidebar } from "./sidebar/sidebar-context"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main 
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isCollapsed ? "pl-20" : "pl-64",
        "p-4"
      )}
    >
      {children}
    </main>
  )
} 