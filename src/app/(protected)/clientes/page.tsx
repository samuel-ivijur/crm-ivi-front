"use client"

import { useState } from "react"
import { Download, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ClientStats } from "@/components/clientes/client-stats"
import { ClientTable } from "@/components/clientes/client-table"
import { ClientFormModal } from "@/components/clientes/client-form/client-form-modal"

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lista de Clientes</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Importar Planilha
          </Button>
          <Button 
            className="gap-2 bg-[#0146cf] hover:bg-[#0146cf]/90 transition-transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar um cliente
          </Button>
        </div>
      </div>
      <ClientStats />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lista de Clientes</h2>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
        <ClientTable />
      </div>
      <ClientFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
} 