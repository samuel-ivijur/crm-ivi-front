'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Home, Files, HeadphonesIcon } from 'lucide-react'

export function Sidebar() {
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted) {
    return <div className="w-16 border-r" />
  }

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white transition-all duration-300",
        isHovered ? "w-64" : "w-16",
        "border-r"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center justify-between">
            {isHovered && <span className="text-xl font-bold">IVI LAW</span>}
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isHovered ? "px-4" : "px-2",
                isActive('/dashboard') && "bg-blue-50 text-[#0146cf]"
              )}
            >
              <Home className={cn("h-4 w-4", isActive('/dashboard') && "text-[#0146cf]")} />
              {isHovered && <span className="ml-2">Página Inicial</span>}
            </Button>
          </Link>
          
          <Link href="/processos">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isHovered ? "px-4" : "px-2",
                isActive('/processos') && "bg-blue-50 text-[#0146cf]"
              )}
            >
              <Files className={cn("h-4 w-4", isActive('/processos') && "text-[#0146cf]")} />
              {isHovered && <span className="ml-2">Processos</span>}
            </Button>
          </Link>

          <Link href="/atendimentos">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isHovered ? "px-4" : "px-2",
                isActive('/atendimentos') && "bg-blue-50 text-[#0146cf]"
              )}
            >
              <HeadphonesIcon className={cn("h-4 w-4", isActive('/atendimentos') && "text-[#0146cf]")} />
              {isHovered && <span className="ml-2">Atendimentos</span>}
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
} 