'use client'

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

// Importação dinâmica dos ícones
const Home = dynamic(() => import('lucide-react').then(mod => mod.Home))
const Files = dynamic(() => import('lucide-react').then(mod => mod.Files))
const HeadphonesIcon = dynamic(() => import('lucide-react').then(mod => mod.Headphones))

export function Sidebar() {
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const isActive = useCallback((path: string) => {
    return pathname.startsWith(path)
  }, [pathname])

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

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white transition-all duration-300",
        isHovered ? "w-64" : "w-16",
        "border-r"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center justify-between">
            {isHovered && <span className="text-xl font-bold">IVI LAW</span>}
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-2">
          <Link 
            href="/dashboard" 
            prefetch={true}
          >
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
          
          <Link href="/processos" prefetch={true}>
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

          <Link href="/atendimentos" prefetch={true}>
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