"use client"

import { useEffect, useState } from "react"
import { Download, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ClientStats } from "@/components/clientes/client-stats"
import { ClientTable } from "@/components/clientes/client-table"
import { ClientFormModal } from "@/components/clientes/client-form/client-form-modal"
import { useAuth } from "@/hooks/useAuth"
import { useBeneficiary } from "@/hooks/useBeneficiary"

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { 
    getBeneficiariesQuery, 
    changeFilter: changeBeneficiaryFilter,
    reportBeneficiaryQuery,
    invalidateBeneficiariesQuery
  } = useBeneficiary()
  const { getSelectedOrganization } = useAuth();

   useEffect(() => {
    const idOrganization = getSelectedOrganization()
    changeBeneficiaryFilter({ idOrganization })
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lista de Clientes</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Importar Planilha
          </Button>
          <Button 
            className="gap-2 bg-[#0146cf] hover:bg-[#0146cf]/90"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar um cliente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <ClientStats data={reportBeneficiaryQuery.data} />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lista de Clientes</h2>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
        <div className="p-4">
          <ClientTable 
            data={getBeneficiariesQuery.data?.beneficiaries || []} 
            refresh={() => { invalidateBeneficiariesQuery() }}
          />
        </div>
      </div>

      <ClientFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
} 