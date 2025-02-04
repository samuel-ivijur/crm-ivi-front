"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, MessageSquarePlus, Bell, ChevronDown, ChevronRight, LinkIcon, Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LinkProcessModal } from "./link-process-modal"
import { toPhone } from "@/utils/format"
import { Beneficiary } from "@/types/beneficiarie"
import { BeneficiaryStatus, CommunicationStatus } from "@/constants"
import PopConfirm from "../popconfirm"
import { beneficiariesService } from "@/services/api/beneficiaries"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"
import { GetLitigations, litigationsService } from "@/services/api/litigations"

type ClientTableProps = {
  data: Beneficiary[]
  refresh: () => void
}

enum Actions {
  DELETE = "delete",
  ADD_COMMUNICATION = "add_communication",
  ADD_MONITORING = "add_monitoring"
}

export function ClientTable({ data, refresh }: ClientTableProps) {
  const router = useRouter()
  const { getSelectedOrganization } = useAuth()

  const idOrganization = getSelectedOrganization()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isLinkProcessOpen, setIsLinkProcessOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Beneficiary | null>(null)
  const [performingAction, setPerformingAction] = useState<{ [k: string]: Actions }>({})
  const [beneficiaryLitigations, setBeneficiaryLitigations] = useState<{ [k: string]: GetLitigations.LitigationInfo[] | null }>({})

  const toggleRow = (clientId: string) => {
    if (!beneficiaryLitigations[clientId]) {
      setBeneficiaryLitigations(prev => ({
        ...prev,
        [clientId]: null
      }))
      litigationsService.getLitigations({
        idOrganization: getSelectedOrganization(),
        limit: 100,
        page: 1,
        idBeneficiary: [clientId]
      })
        .then(res => {
          setBeneficiaryLitigations(prev => ({
            ...prev,
            [clientId]: res.data
          }))
        }).catch(() => {
          setBeneficiaryLitigations(prev => ({
            ...prev,
            [clientId]: []
          }))
        })
    }

    const newExpandedRows = new Set(expandedRows)
    expandedRows.has(clientId) ? newExpandedRows.delete(clientId) : newExpandedRows.add(clientId)
    setExpandedRows(newExpandedRows)
  }

  const openLinkProcessDialog = (client: Beneficiary) => {
    setSelectedClient(client)
    setIsLinkProcessOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      setPerformingAction({
        [id]: Actions.DELETE
      })
      await beneficiariesService.delete({
        idOrganization,
        idBeneficiary: id
      })
      refresh()
      setPerformingAction({})

    } catch (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: "Ocorreu um erro ao excluir o cliente",
        variant: "destructive",
      })
    }
  }

  const getState = (id: string, action?: Actions): "loading" | "iddle" | "disabled" => {
    if (performingAction[id] && action) {
      return performingAction[id] === action ? "loading" : "iddle"
    }
    else if (Object.values(performingAction).length > 0) return "disabled"
    return "iddle"
  }

  const columns = [
    {
      render: (
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
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
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead className={column.className}>
                  {column.render}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data || []).map((client) => (
              <>
                <TableRow key={client.id}>
                  <TableCell>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRow(client.id)}
                    >
                      {expandedRows.has(client.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.document}</TableCell>
                  <TableCell>{client.phone ? toPhone(client.phone) : '-'}</TableCell>
                  <TableCell>{client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={client.status.id === BeneficiaryStatus.ACTIVE ? "success" : "destructive"}
                    >
                      {client.status.description}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.communicate ? "success" : "destructive"}
                    >
                      {client.communicate ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.communicationStatus.id === CommunicationStatus.ACCEPTED ? "success" : "destructive"}
                    >
                      {client.communicationStatus.description}
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
                            disabled={getState(client.id) === "disabled"}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar cliente</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-[#0146cf]"
                            disabled={getState(client.id) === "disabled"}
                          >
                            {getState(client.id, Actions.ADD_COMMUNICATION) === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquarePlus className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar comunicação</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-[#0146cf]"
                            disabled={getState(client.id) === "disabled"}
                          >
                            {getState(client.id, Actions.ADD_MONITORING) === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar monitoramento</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <PopConfirm
                            title="Excluir cliente"
                            description="Tem certeza que deseja excluir este cliente?"
                            onConfirm={async () => handleDelete(client.id)}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-red-600"
                              disabled={getState(client.id) === "disabled"}
                            >
                              {getState(client.id, Actions.DELETE) === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
                {expandedRows.has(client.id) && (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Processos Vinculados</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => openLinkProcessDialog(client)}
                          >
                            <LinkIcon className="h-4 w-4" />
                            Vincular Processo
                          </Button>
                        </div>
                        {beneficiaryLitigations[client.id] === null ? (
                          <Loader2 />
                        ) :
                          (Array.isArray(beneficiaryLitigations[client.id]) && beneficiaryLitigations[client.id]!.length > 0) ? (
                            <div className="space-y-2">
                              {beneficiaryLitigations[client.id]!.map((process) => (
                                <div
                                  key={process.id}
                                  className="flex items-center justify-between p-2 bg-white rounded border"
                                >
                                  <div className="flex items-center gap-4">
                                    <span className="font-medium">Nº {process.processnumber}</span>
                                    <Badge variant="outline">
                                    {(process.instance && +process.instance < 3) && `${process.instance}ª Instância`}
                                    {(process.instance && +process.instance === 3) && `Instância superior`}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => window.open(`/processos/${process.id}`, '_blank')}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
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

      <LinkProcessModal
        open={isLinkProcessOpen}
        onOpenChange={setIsLinkProcessOpen}
        client={selectedClient}
      />
    </TooltipProvider>
  )
} 