'use client'

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, ChevronDown, LayoutDashboard, Users, GavelIcon, MessagesSquare, UserCheck, HelpCircle } from "lucide-react"
import { BsWhatsapp } from 'react-icons/bs'
import { useSidebar } from "./sidebar-context"
import { Logo } from "./logo"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Clientes",
    icon: Users,
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
    items: [
      {
        title: "Atendimentos",
        icon: BsWhatsapp,
        href: "/comunicacao/atendimentos",
      },
      {
        title: "Habilitados",
        icon: UserCheck,
        href: "/comunicacao/habilitados",
      },
    ],
  },
  {
    title: "Ajuda",
    icon: HelpCircle,
    href: "/faq",
  }
]

function SidebarContent() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false)

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <div 
      className="flex h-full flex-col bg-[#225BE4]"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => {
        setIsCollapsed(true)
        setIsCommunicationOpen(false)
      }}
    >
      {/* Logo Container */}
      <div className={cn(
        "sticky top-0 z-10 border-b border-white/10",
        "flex items-center justify-center",
        isCollapsed ? "p-3" : "p-4"
      )}>
        <Logo className={cn(
          "transition-all duration-300",
          isCollapsed ? "h-8 w-8" : "h-10 w-auto"
        )} />
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 py-3 px-3">
        {sidebarItems.map((item) => (
          <div key={item.title} className="mb-1">
            {item.items ? (
              <>
                <button
                  onClick={() => setIsCommunicationOpen(!isCommunicationOpen)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg p-2",
                    "text-white hover:bg-white/10",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  )}
                </button>

                {isCommunicationOpen && !isCollapsed && (
                  <div className="ml-3 mt-1 space-y-1">
                    {item.items.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-2",
                          isActive(subitem.href)
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <subitem.icon className="h-5 w-5" />
                        <span>{subitem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2",
                  isActive(item.href)
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export function Sidebar() {
  const { isCollapsed } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

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
          className="w-[240px] p-0 lg:hidden"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Versão Desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden lg:block",
          "bg-[#225BE4] border-r border-white/10",
          "transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
} 