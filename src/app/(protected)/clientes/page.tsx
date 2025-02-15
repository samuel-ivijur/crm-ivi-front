"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ClientStats } from "@/components/clientes/client-stats"
import { ClientTable } from "@/components/clientes/client-table"
import { ClientFormModal } from "@/components/clientes/client-form/client-form-modal"
import { useAuth } from "@/hooks/useAuth"
import { useBeneficiary } from "@/hooks/useBeneficiary"
import { Beneficiary } from "@/types/beneficiarie"
import { LitigationClient, StepId } from "@/components/clientes/client-form/types"
import { toPhone } from "@/utils/format"
import { GetLitigations, litigationsService } from "@/services/api/litigations"
import { toast } from "@/hooks/use-toast"
import { BeneficiaryDataTableToolbar } from "@/components/clientes/data-table-toolbar"

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { getSelectedOrganization } = useAuth();

  const {
    getBeneficiariesQuery,
    changeFilter: changeBeneficiaryFilter,
    reportBeneficiaryQuery,
    invalidateBeneficiariesQuery,
    filter,
    resetParams
  } = useBeneficiary(getSelectedOrganization())
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary & { litigations: LitigationClient[] } | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [beneficiaryLitigations, setBeneficiaryLitigations] = useState<Record<string, GetLitigations.LitigationInfo[] | null>>({})
  const [litigationMonitoring, setLitigationMonitoring] = useState<Record<string, GetLitigations.LitigationMonitoring>>({})
  const [currentModalBeneficiaryStep, setCurrentModalBeneficiaryStep] = useState<StepId>("step-1")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  
  const handleFinishRegisterModal = (open: boolean, finish?: boolean) => {
    setIsModalOpen(open)
    if (!open && finish) {
      invalidateBeneficiariesQuery()
      if (selectedBeneficiary?.id) resetRow(selectedBeneficiary?.id)
    }
    setSelectedBeneficiary(null)
  }

  const handleAddClient = () => {
    setSelectedBeneficiary(null)
    setIsModalOpen(true)
  }

  const resetRow = (idBeneficiary: string) => {
    setBeneficiaryLitigations(prev => ({
      ...prev,
      [idBeneficiary]: null
    }))
    const newExpandedRows = new Set(expandedRows)
    newExpandedRows.delete(idBeneficiary)
    setExpandedRows(newExpandedRows)
  }

  const handleViewClient = (beneficiary: Beneficiary, page: StepId = "step-1"): Promise<void> => {
    return new Promise(async (resolve) => {
      try {
        const litigations = beneficiaryLitigations[beneficiary.id] ||
          (await litigationsService.getLitigations({
            idOrganization: getSelectedOrganization(),
            limit: 100,
            page: 1,
            idBeneficiary: [beneficiary.id]
          })).data

        setSelectedBeneficiary({
          ...beneficiary,
          litigations: litigations?.map(litigation => ({
            id: litigation.id,
            processNumber: litigation.processnumber,
            instance: +litigation.instance
          })) || []
        })
        setTimeout(() => {
          setCurrentModalBeneficiaryStep(page)
          setIsModalOpen(true)
          resolve()
        }, 100)
      } catch (error) {
        console.log(error)
        toast({
          title: "Erro ao visualizar cliente",
          description: "Ocorreu um erro ao visualizar o cliente",
          variant: "destructive",
        })
        resolve()
      }
    })
  }

  const handleSetSelectedRows = (rows: Set<string>) => {
    if (rows.size > 100) {
      toast({
        title: "Limite de clientes atingido",
        description: "Você só pode selecionar até 100 clientes",
        variant: "destructive",
      })
      return
    }
    setSelectedRows(rows)
  }

  const resetFilters = () => {
    resetParams()
  }

  useEffect(() => {
    resetFilters()
  }, [])

  useMemo(() => {
    setBeneficiaryLitigations({})
    setLitigationMonitoring({})
    setExpandedRows(new Set())
  }, [getBeneficiariesQuery.data])

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
            onClick={handleAddClient}
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
        <div className="px-4">
          <BeneficiaryDataTableToolbar
            filter={filter}
            changeFilter={changeBeneficiaryFilter}
            total={getBeneficiariesQuery.data?.total || 0}
            selectedRows={selectedRows}
            setSelectedRows={handleSetSelectedRows}
            resetFilter={resetFilters}
          />
        </div>
        <div className="p-4">
          <ClientTable
            data={getBeneficiariesQuery.data?.beneficiaries || []}
            total={getBeneficiariesQuery.data?.total || 0}
            refresh={() => { invalidateBeneficiariesQuery() }}
            changeBeneficiaryFilter={changeBeneficiaryFilter}
            filter={filter}
            isLoading={getBeneficiariesQuery.isLoading}
            handleViewClient={handleViewClient}
            beneficiaryLitigations={beneficiaryLitigations}
            setBeneficiaryLitigations={setBeneficiaryLitigations}
            expandedRows={expandedRows}
            setExpandedRows={setExpandedRows}
            litigationMonitoring={litigationMonitoring}
            setLitigationMonitoring={setLitigationMonitoring}
            selectedRows={selectedRows}
            setSelectedRows={handleSetSelectedRows}
          />
        </div>
      </div>

      <ClientFormModal
        open={isModalOpen}
        onOpenChange={handleFinishRegisterModal}
        setCurrentStep={setCurrentModalBeneficiaryStep}
        currentStep={currentModalBeneficiaryStep}
        beneficiary={selectedBeneficiary ? {
          id: selectedBeneficiary.id,
          name: selectedBeneficiary.name,
          document: selectedBeneficiary.document,
          email: selectedBeneficiary.email,
          phone: toPhone(selectedBeneficiary.phone),
          birthDate: selectedBeneficiary.birthDate,
          communicate: selectedBeneficiary.communicate,
          status: selectedBeneficiary.status.id === 1,
          type: selectedBeneficiary.type.id,
          litigations: selectedBeneficiary.litigations,
          address: {
            cep: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
          },
          nick: '',
        } : undefined}
      />
    </div>
  )
} 