"use client"

import { useState } from "react"
import { Download, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { HabilitadosStats } from "@/components/comunicacao/habilitados/habilitados-stats"
import { HabilitadosTable } from "@/components/comunicacao/habilitados/habilitados-table"
import { EnabledDataTableToolbar } from "@/components/comunicacao/habilitados/data-table-toolbar"

export default function HabilitadosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Habilitados</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button 
            className="gap-2 bg-[#0146cf] hover:bg-[#0146cf]/90 transition-transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Habilitado
          </Button>
        </div>
      </div>
      <HabilitadosStats />
      <div className="bg-white rounded-lg shadow">
        <div className="px-4">
          <EnabledDataTableToolbar
            isExporting={false}
            selectedRows={new Set()}
            setSelectedRows={() => {}}
            total={0}
          />
        </div>
        <div className="p-4">
          <HabilitadosTable />
        </div>
      </div>
    </div>
  )
} 