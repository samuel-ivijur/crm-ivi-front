"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, ChevronDown, ChevronRight, LinkIcon, Loader2, Edit } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { toPhone } from "@/utils/format"
import { Beneficiary } from "@/types/beneficiarie"
import { BeneficiaryStatus, CommunicationStatus, LitigationMonitoringType } from "@/constants"
import PopConfirm from "../popconfirm"
import { beneficiariesService, GetBeneficiariesParams } from "@/services/api/beneficiaries"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"
import { GetLitigations, litigationsService } from "@/services/api/litigations"
import { Switch } from "../ui"
import Pagination from "../pagination"
import { StepId } from "./client-form/types"
import ConfirmModal from "../confirm-modal"

type ClientTableProps = {
  data: Beneficiary[]
  total: number
  refresh: () => void
  changeBeneficiaryFilter: (params: Partial<GetBeneficiariesParams>) => void
  filter: GetBeneficiariesParams
  isLoading: boolean
  beneficiaryLitigations: Record<string, GetLitigations.LitigationInfo[] | null>
  setBeneficiaryLitigations: Dispatch<SetStateAction<Record<string, GetLitigations.LitigationInfo[] | null>>>
  expandedRows: Set<string>
  setExpandedRows: Dispatch<SetStateAction<Set<string>>>
  litigationMonitoring: Record<string, GetLitigations.LitigationMonitoring>
  setLitigationMonitoring: Dispatch<SetStateAction<Record<string, GetLitigations.LitigationMonitoring>>>
  handleViewClient: (beneficiary: Beneficiary, page?: StepId) => Promise<void>
  selectedRows: Set<string>
  setSelectedRows: (rows: Set<string>) => void
}

enum Actions {
  DELETE_BENEFICIARY = "delete_beneficiary",
  DELETE_LITIGATION = "delete_litigation",
  ADD_COMMUNICATION = "add_communication",
  ADD_MONITORING = "add_monitoring",
  VIEW_CLIENT = "view_client",
}

export function ClientTable({
  data,
  refresh,
  changeBeneficiaryFilter,
  total,
  filter,
  isLoading,
  beneficiaryLitigations,
  setBeneficiaryLitigations,
  expandedRows,
  setExpandedRows,
  litigationMonitoring,
  setLitigationMonitoring,
  handleViewClient,
  selectedRows,
  setSelectedRows
}: ClientTableProps) {
  const { getSelectedOrganization } = useAuth()

  const idOrganization = getSelectedOrganization()
  const [performingAction, setPerformingAction] = useState<Record<string, Actions>>({})
  const [performChangeMonitoringData, setPerformChangeMonitoringData] = useState<{ idLitigation: string | null, checked: boolean }>({ idLitigation: null, checked: false })
  const getLitigationBeneficiary = (idBeneficiary: string) => litigationsService.getLitigations({
    idOrganization: getSelectedOrganization(),
    limit: 100,
    page: 1,
    idBeneficiary: [idBeneficiary]
  })

  const toggleRow = (idBeneficiary: string) => {
    if (!beneficiaryLitigations[idBeneficiary]) {
      setBeneficiaryLitigations(prev => ({
        ...prev,
        [idBeneficiary]: null
      }))
      getLitigationBeneficiary(idBeneficiary)
        .then(res => {
          setBeneficiaryLitigations(prev => ({
            ...prev,
            [idBeneficiary]: res.data
          }))
          const newLitigationMonitoring: Record<string, GetLitigations.LitigationMonitoring> = {}
          res.data.forEach(litigation => litigation.monitoring.forEach(monitoring => {
            if (monitoring.type.id !== LitigationMonitoringType.PUBLICATIONS) return
            newLitigationMonitoring[litigation.id] = {
              id: monitoring.id,
              monitoring: monitoring.monitoring,
              type: { id: monitoring.type.id, description: monitoring.type.description }
            }
          })
          )
          setLitigationMonitoring(prev => ({
            ...prev,
            ...newLitigationMonitoring
          }))
        }).catch(() => {
          setBeneficiaryLitigations(prev => ({
            ...prev,
            [idBeneficiary]: []
          }))
        })
    }

    const newExpandedRows = new Set(expandedRows)
    expandedRows.has(idBeneficiary) ? newExpandedRows.delete(idBeneficiary) : newExpandedRows.add(idBeneficiary)
    setExpandedRows(newExpandedRows)
  }

  const handleDeleteBeneficiary = async (id: string) => {
    try {
      setPerformingAction({
        [id]: Actions.DELETE_BENEFICIARY
      })
      await beneficiariesService.delete({
        idOrganization,
        idBeneficiary: id
      })
      refresh()
    } catch (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: "Ocorreu um erro ao excluir o cliente",
        variant: "destructive",
      })
    } finally {
      setPerformingAction({})
    }
  }

  const handleDeleteLitigationBeneficiary = async (idLitigation: string, idBeneficiary: string) => {
    try {
      setPerformingAction({
        [idLitigation]: Actions.DELETE_BENEFICIARY
      })
      await litigationsService.deleteLitigationBeneficiary({
        idOrganization,
        idLitigation,
        idBeneficiary
      })
      const newBeneficiaryLitigations = beneficiaryLitigations[idBeneficiary]?.filter(litigation => litigation.id !== idLitigation)

      setBeneficiaryLitigations(prev => ({
        ...prev,
        [idBeneficiary]: newBeneficiaryLitigations || null
      }))

    } catch (error) {
      toast({
        title: "Erro ao excluir beneficiário do processo",
        description: "Ocorreu um erro ao excluir o beneficiário do processo",
        variant: "destructive",
      })
    } finally {
      setPerformingAction({})
    }
  }

  const getState = (id: string, action?: Actions): "loading" | "iddle" | "disabled" => {
    if (performingAction[id] && action) {
      return performingAction[id] === action ? "loading" : "iddle"
    }
    else if (Object.values(performingAction).length > 0) return "disabled"
    return "iddle"
  }

  const getMonitoring = (idLitigation: string) => {
    return litigationMonitoring[idLitigation] || { monitoring: false }
  }

  const performChangeMonitoring = async (idLitigation: string, checked: boolean) => {
    try {
      if (!litigationMonitoring[idLitigation]) {
        litigationMonitoring[idLitigation] = { id: idLitigation, monitoring: checked, type: { id: LitigationMonitoringType.PUBLICATIONS, description: "Publicações" } }
      }
      setPerformingAction({
        [idLitigation]: Actions.ADD_MONITORING
      })
      await litigationsService.updateLitigationMonitoring({
        idOrganization,
        idLitigation,
        monitore: checked,
        idType: LitigationMonitoringType.PUBLICATIONS
      })

      setLitigationMonitoring(prev => ({
        ...prev,
        [idLitigation]: { id: idLitigation, monitoring: checked, type: { id: LitigationMonitoringType.PUBLICATIONS, description: "Publicações" } }
      }))

    } catch (error) {
      toast({
        title: "Erro ao atualizar monitoramento",
        description: "Ocorreu um erro ao atualizar o monitoramento",
        variant: "destructive",
      })
    } finally {
      setPerformingAction({})
    }
  }

  const handleChangeMonitoring = async (idLitigation: string, checked: boolean) => {
    setPerformingAction({
      [idLitigation]: Actions.ADD_MONITORING
    })

    if (!checked) {
      const isMoreThanOneBeneficiary = await litigationsService.findLitigationBeneficiary({
        idOrganization,
        idLitigation
      })
      if (isMoreThanOneBeneficiary.total > 1) return setPerformChangeMonitoringData({ idLitigation, checked })
    }
    await performChangeMonitoring(idLitigation, checked)
  }

  const handleChangeCommunicate = async (idLitigation: string, idBeneficiary: string, checked: boolean) => {
    try {
      setPerformingAction({
        [idLitigation]: Actions.ADD_COMMUNICATION
      })
      await litigationsService.updateBeneficiaryCommunication({
        idOrganization,
        idLitigation: idLitigation,
        idBeneficiary: idBeneficiary,
        communicate: checked
      })
      if (!beneficiaryLitigations[idBeneficiary]) return
      const indexData = beneficiaryLitigations[idBeneficiary].findIndex(d => d.id === idLitigation)

      if (indexData !== undefined && indexData !== -1) {
        const newBeneficiaryLitigations = beneficiaryLitigations[idBeneficiary]
        newBeneficiaryLitigations[indexData].beneficiaries[0].communicate = checked

        setBeneficiaryLitigations(prev => ({
          ...prev,
          [idBeneficiary]: newBeneficiaryLitigations
        }))
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar comunicação",
        description: "Ocorreu um erro ao atualizar a comunicação",
        variant: "destructive",
      })
    } finally {
      setPerformingAction({})
    }
  }

  const viewClient = async (beneficiary: Beneficiary, page: StepId = "step-1") => {
    setPerformingAction({
      [beneficiary.id]: Actions.VIEW_CLIENT
    })
    await handleViewClient(beneficiary, page)
    setPerformingAction({})
  }

  const PagePagination = () => (
    <Pagination
      limit={filter.limit || 10}
      page={filter.page || 1}
      setLimit={(limit) => changeBeneficiaryFilter({ limit, page: 1 })}
      setPage={(page) => changeBeneficiaryFilter({ page })}
      total={total}
    />
  )

  const handleChecked = (id: string, checked: boolean) => {
    if (checked) {
      const newSet = new Set(selectedRows)
      newSet.add(id)
      setSelectedRows(newSet)
    } else {
      const newSet = new Set(selectedRows)
      newSet.delete(id)
      setSelectedRows(newSet)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSet = new Set(data.map(beneficiary => beneficiary.id))
      setSelectedRows(newSet)
    } else {
      const ids = data.map(beneficiary => beneficiary.id)
      const newSet = new Set(selectedRows)
      ids.forEach(id => newSet.delete(id))
      setSelectedRows(newSet)
    }
  }

  const columns = [
    {
      render: (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          style={{ cursor: data.length === 0 ? 'not-allowed' : 'pointer' }}
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={data.length > 0 && data.filter(beneficiary => !selectedRows.has(beneficiary.id)).length === 0}
          disabled={data.length === 0}
        />
      ),
      className: "w-12",
    },
    {
      render: (<></>),
      className: "w-4",
    },
    {
      render: (<>Nome</>),
    },
    {
      render: (<>CPF/CNPJ</>),
    },
    {
      render: (<>Telefone</>),
    },
    {
      render: (<>Data Cadastro</>),
    },
    {
      render: (<>Status</>),
    },
    {
      render: (<>Comunicação</>),
    },
    {
      render: (<>Habilitado</>),
    },
    {
      render: (<>Ações</>),
      className: "text-right",
    }
  ]

  return (
    <>
      <div className="mb-4">
        <PagePagination />
      </div>
      <TooltipProvider>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow key={1}>
                {columns.map((column) => (
                  <TableHead className={column.className}>
                    {column.render}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex justify-center items-center h-full">
                      <p>Nenhum cliente encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (data || []).map((beneficiary) => (
                <>
                  <TableRow key={beneficiary.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedRows.has(beneficiary.id)}
                        onChange={(e) => handleChecked(beneficiary.id, e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRow(beneficiary.id)}
                      >
                        {expandedRows.has(beneficiary.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{beneficiary.name}</TableCell>
                    <TableCell>{beneficiary.document}</TableCell>
                    <TableCell>{beneficiary.phone ? toPhone(beneficiary.phone) : '-'}</TableCell>
                    <TableCell>{beneficiary.createdAt ? new Date(beneficiary.createdAt).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={beneficiary.status.id === BeneficiaryStatus.ACTIVE ? "success" : "destructive"}
                      >
                        {beneficiary.status.description}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={beneficiary.communicate ? "success" : "destructive"}
                      >
                        {beneficiary.communicate ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={beneficiary.communicationStatus.id === CommunicationStatus.ACCEPTED ? "success" : "destructive"}
                      >
                        {beneficiary.communicationStatus.description}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-[#0146cf]"
                              disabled={getState(beneficiary.id) === "disabled"}
                              loading={getState(beneficiary.id, Actions.VIEW_CLIENT) === "loading"}
                              onClick={() => viewClient(beneficiary)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar dados do cliente</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PopConfirm
                              title="Excluir cliente"
                              description="Tem certeza que deseja excluir este cliente?"
                              onConfirm={async () => handleDeleteBeneficiary(beneficiary.id)}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-red-600"
                                disabled={getState(beneficiary.id) === "disabled"}
                                loading={getState(beneficiary.id, Actions.DELETE_BENEFICIARY) === "loading"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PopConfirm>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir cliente</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(beneficiary.id) && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Processos Vinculados</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => viewClient(beneficiary, "step-2")}
                            >
                              <LinkIcon className="h-4 w-4" />
                              Vincular Processo
                            </Button>
                          </div>
                          {beneficiaryLitigations[beneficiary.id] === null ? (
                            <div className="flex justify-center items-center h-full">
                              <Loader2 className="animate-spin" />
                            </div>
                          ) :
                            (Array.isArray(beneficiaryLitigations[beneficiary.id]) && beneficiaryLitigations[beneficiary.id]!.length > 0) ? (
                              <div className="space-y-2">
                                {beneficiaryLitigations[beneficiary.id]!.map((process) => (
                                  <div
                                    key={process.id}
                                    className="flex items-center justify-between p-2 bg-white rounded border"
                                  >
                                    <div className="flex items-center gap-10">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Nº {process.processnumber}</span>
                                        <Badge variant="outline">
                                          {(process.instance && +process.instance < 3) && `${process.instance}ª Instância`}
                                          {(process.instance && +process.instance === 3) && `Instância superior`}
                                        </Badge>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                      <div className="flex items-center gap-2">
                                        <label htmlFor={`process-monitoring-${beneficiary.id}-${process.id}`}>{getMonitoring(process.id).monitoring ? "Monitorando" : "Não monitorando"}</label>
                                        <Switch
                                          id={`process-monitoring-${beneficiary.id}-${process.id}`}
                                          onCheckedChange={(checked) => handleChangeMonitoring(process.id, checked)}
                                          checked={getMonitoring(process.id).monitoring}
                                          disabled={getState(beneficiary.id) === "disabled"}
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <label style={{ width: "130px", textAlign: "right" }} htmlFor={`process-communicating-${beneficiary.id}-${process.id}`}>{process.beneficiaries[0].communicate ? "Comunicando" : "Não comunicando"}</label>
                                        <Switch
                                          id={`process-communicating-${beneficiary.id}-${process.id}`}
                                          onCheckedChange={(checked) => handleChangeCommunicate(process.id, beneficiary.id, checked)}
                                          checked={process.beneficiaries[0].communicate}
                                          disabled={getState(beneficiary.id) === "disabled"}
                                        />
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => window.open(`/processos/${process.id}`, '_blank')}
                                              disabled={getState(process.id) === "disabled"}
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Visualizar processo</p>
                                          </TooltipContent>
                                        </Tooltip>

                                        <PopConfirm
                                          title="Remover processo"
                                          description="Tem certeza que deseja remover este processo vinculado ao cliente?"
                                          onConfirm={async () => await handleDeleteLitigationBeneficiary(process.id, beneficiary.id)}
                                        >
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={getState(process.id) === "disabled"}
                                            loading={getState(process.id) === "loading"}
                                          >
                                            <Trash2 />
                                          </Button>
                                        </PopConfirm>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                Nenhum processo vinculado
                              </div>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>

      </TooltipProvider>
      <div className="mt-4">
        <PagePagination />
      </div>
      <ConfirmModal
        title="Alterar monitoramento"
        description="Este processo possui mais de um cliente vinculado, a alteração irá impactar no monitoramento para todos os clientes. Deseja continuar?"
        onConfirm={async () => {
          if (!performChangeMonitoringData.idLitigation) return
          await performChangeMonitoring(performChangeMonitoringData.idLitigation, performChangeMonitoringData.checked)
        }}
        open={performChangeMonitoringData.idLitigation !== null}
        onClose={() => {
          setPerformingAction({})
          setPerformChangeMonitoringData({ idLitigation: null, checked: false })
        }}
      />
    </>
  )
} 