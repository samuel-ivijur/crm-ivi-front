'use client'

import dynamic from "next/dynamic"

const DynamicSidebar = dynamic(
  () => import("./index").then(mod => mod.Sidebar),
  { ssr: false }
)

export function SidebarWrapper() {
  return <DynamicSidebar />
} 