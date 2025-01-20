'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { SidebarProvider, useSidebar } from "./sidebar-context"

// Importação dinâmica dos ícones
const Home = dynamic(() => import('lucide-react').then(mod => mod.Home))
const Files = dynamic(() => import('lucide-react').then(mod => mod.Files))
const HeadphonesIcon = dynamic(() => import('lucide-react').then(mod => mod.Headphones))
const Users = dynamic(() => import('lucide-react').then(mod => mod.Users))

const menuItems = [
  {
    title: "Página Inicial",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "Processos",
    path: "/processos",
    icon: Files,
  },
  {
    title: "Atendimentos",
    path: "/atendimentos",
    icon: HeadphonesIcon,
  },
  {
    title: "Clientes",
    path: "/clientes",
    icon: Users,
  },
]

function SidebarContent() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <div 
      className="flex h-full flex-col"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <SidebarHeader />
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} prefetch={true}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  isCollapsed ? "px-2" : "px-4",
                  isActive(item.path) && "bg-blue-50 text-[#0146cf]",
                  "hover:scale-105 hover:bg-blue-100"
                )}
              >
                <item.icon 
                  className={cn(
                    "h-4 w-4", 
                    isActive(item.path) && "text-[#0146cf]"
                  )} 
                />
                {!isCollapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function SidebarHeader() {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b">
      {!isCollapsed && <span className="text-xl font-bold">IVI LAW</span>}
    </div>
  )
}

export function Sidebar() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-16 border-r" />
  }

  return (
    <SidebarProvider>
      <SidebarRoot />
    </SidebarProvider>
  )
}

function SidebarRoot() {
  const { isCollapsed } = useSidebar()

  return (
    <>
      {/* Versão Mobile */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-[240px] p-0"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Versão Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white hidden lg:block border-r",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </div>
    </>
  )
} 