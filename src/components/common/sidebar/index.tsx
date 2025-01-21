'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, ChevronLeft, ChevronRight, ChevronDown, LayoutDashboard, Users, GavelIcon, MessagesSquare, UserCheck, PhoneCall } from "lucide-react"
import { SidebarProvider, useSidebar } from "./sidebar-context"

// Importação dinâmica dos ícones
const Home = dynamic(() => import('lucide-react').then(mod => mod.Home))
const Files = dynamic(() => import('lucide-react').then(mod => mod.Files))
const HeadphonesIcon = dynamic(() => import('lucide-react').then(mod => mod.Headphones))
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users))

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Clientes",
    icon: UsersIcon,
    href: "/clientes",
  },
  {
    title: "Processos",
    icon: GavelIcon,
    href: "/processos",
  },
  {
    title: "Comunicação",
    icon: MessagesSquare,
    subitems: [
      {
        title: "Habilitados",
        icon: UserCheck,
        href: "/comunicacao/habilitados",
      },
      {
        title: "Atendimentos",
        icon: PhoneCall,
        href: "/comunicacao/atendimentos",
      },
    ],
  },
]

function SidebarContent() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false)

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
            <div key={item.title}>
              {item.subitems ? (
                // Item com subitens (Comunicação)
                <div>
                  <button
                    onClick={() => setIsCommunicationOpen(!isCommunicationOpen)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg p-2 hover:bg-gray-100",
                      pathname.startsWith("/comunicacao") && "bg-gray-100"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {isCommunicationOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {isCommunicationOpen && !isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subitems.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100",
                            pathname === subitem.href && "bg-gray-100"
                          )}
                        >
                          <subitem.icon className="h-5 w-5" />
                          <span>{subitem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Itens normais (Dashboard, Clientes, Processos)
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100",
                    pathname === item.href && "bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </div>
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