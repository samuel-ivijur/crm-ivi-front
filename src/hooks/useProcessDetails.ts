"use client"

import { useState } from "react"

export function useProcessDetails() {
  const [activeTab, setActiveTab] = useState("dados")

  const tabs = [
    { id: "dados", label: "Dados" },
    { id: "partes", label: "Partes" },
    { id: "prazos", label: "Prazos" },
    { id: "relacionados", label: "Relacionados" },
    { id: "historico", label: "Histórico" },
  ]

  return {
    activeTab,
    setActiveTab,
    tabs
  }
} 