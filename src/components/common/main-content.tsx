"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar/sidebar-context"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main 
      className={cn(
        "min-h-screen transition-[margin] duration-300 ease-in-out",
        "p-6",
        isCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}
    >
      <div className="flex justify-center">
        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  )
} 