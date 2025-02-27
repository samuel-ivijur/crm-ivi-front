"use client"

import dayjs from "dayjs"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { GetLitigations } from "@/services/api/litigations"
import { LitigationMonitoringType, LitigationStatus } from "@/constants"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"
import { Archive, ArchiveRestore, Bell, Eye, File, Trash } from "lucide-react"
import PopConfirm from "@/components/popconfirm"
import { LitigationTableAction } from "./type"
import { toast } from "@/hooks/use-toast"

export const getMonitoringPublication = (row: Row<GetLitigations.LitigationInfo>) => {
  const monitoring = (Array.isArray(row.original.monitoring) ? row.original.monitoring : []) as GetLitigations.LitigationInfo["monitoring"]
  const publicationMonitoring = monitoring.find((m) => m.type?.id === LitigationMonitoringType.PUBLICATIONS)
  const isMonitoring = publicationMonitoring?.monitoring
  return { isMonitoring }
}

type LitigationTableColumnsProps = {
  rowSelection: Set<string>
  setRowSelection: (rowSelection: Set<string>) => void
  selectAll: (data: GetLitigations.LitigationInfo[], checked: boolean) => void
  isAllSelected: boolean
  data: GetLitigations.LitigationInfo[]
  changeMonitoring: (id: string, isMonitoring: boolean) => Promise<void>
  deleteLitigation: (id: string) => Promise<void>
  archiveLitigation: (id: string, archive: boolean) => Promise<void>
  viewLitigation: (id: string) => void
  performingActions: LitigationTableAction | null
  setPerformingActions: (performingActions: LitigationTableAction | null) => void
}

export const litigationTableColumns = ({
  rowSelection,
  setRowSelection,
  selectAll,
  isAllSelected,
  data,
  changeMonitoring,
  deleteLitigation,
  archiveLitigation,
  viewLitigation,
  performingActions,
  setPerformingActions
}: LitigationTableColumnsProps): ColumnDef<GetLitigations.LitigationInfo>[] => {

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(value) => selectAll(data, !!value)}
          aria-label="Selecionar tudo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={rowSelection.has(row.original.id)}
          onCheckedChange={(value) => {
            if (value) rowSelection.add(row.original.id)
            else rowSelection.delete(row.original.id)
            setRowSelection(new Set(rowSelection))
          }}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "processnumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Número do Processo" />
      ),
    },
    {
      accessorKey: "instance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instância" />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Cadastro" />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") ? dayjs(row.getValue("createdAt")).format("DD/MM/YYYY HH:ss") : ""
        return (
          <>
            {createdAt}
          </>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = (row.getValue("status") || {}) as { id: number, description: string }
        const id = status.id
        const description = status.description
        const variant = id === 1 ? "success" : "destructive"
        return (
          <Badge variant={variant}>{description}</Badge>
        )
      },
    },
    {
      id: "monitoring",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Monitoramento" />
      ),
      cell: ({ row }) => {
        const { isMonitoring } = getMonitoringPublication(row)
        return (
          <Badge
            variant={isMonitoring ? "success" : "destructive"}
          >
            {isMonitoring ? "Ativo" : "Inativo"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }: { row: Row<GetLitigations.LitigationInfo> }) => {
        const idLitigation = row.original.id
        const { isMonitoring } = getMonitoringPublication(row)
        const isActive = +row.original.status.id === LitigationStatus.ACTIVE

        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                viewLitigation(idLitigation)
                //router.push(`/processos/${idLitigation}`)
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopConfirm
                  disabled={!isActive || performingActions !== null}
                  title={isMonitoring ? "Desativar monitoramento" : "Ativar monitoramento"}
                  description={isMonitoring
                    ? "Tem certeza que deseja desativar o monitoramento? Isso irá parar o envio de notificações do processo para todos os clientes vinculados."
                    : "Tem certeza que deseja ativar o monitoramento? Isso irá iniciar o envio de notificações para o processo."}
                  onConfirm={async () => {
                    try{
                      setPerformingActions({ id: idLitigation, action: 'changeMonitoring' })
                      await changeMonitoring(idLitigation, !isMonitoring)
                    } catch (error) {
                      toast({
                        title: "Erro ao alterar monitoramento",
                        description: "Ocorreu um erro ao alterar o monitoramento do processo. Por favor, tente novamente.",
                        variant: "destructive"
                      })
                    } finally {
                      setPerformingActions(null)
                    }
                  }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={!isActive}
                    loading={performingActions?.action === 'changeMonitoring' && performingActions?.id === idLitigation}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </PopConfirm>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMonitoring ? "Desativar" : "Ativar"} monitoramento</p>
              </TooltipContent>
            </Tooltip>
            {
              row.original.status?.id === LitigationStatus.ARCHIVED ? (
                <PopConfirm
                title="Deseja realmente restaurar o processo?"
                disabled={performingActions !== null}
                onConfirm={async () => {
                  try{
                    setPerformingActions({ id: idLitigation, action: 'archiveLitigation' })
                    await archiveLitigation(idLitigation, false)
                  } catch (error) {
                    toast({
                      title: "Erro ao restaurar processo",
                      description: "Ocorreu um erro ao restaurar o processo. Por favor, tente novamente.",
                      variant: "destructive"
                    })
                  } finally {
                      setPerformingActions(null)
                    }
                  }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={performingActions !== null}
                    loading={performingActions?.action === 'archiveLitigation' && performingActions?.id === idLitigation}
                  >
                    <ArchiveRestore className="h-4 w-4" />
                  </Button>
                </PopConfirm>
              ) : (
                <PopConfirm
                title="Deseja realmente arquivar o processo?"
                description="Isso irá arquivar o processo, mas ele continuará visível na lista de processos."
                onConfirm={() => archiveLitigation(idLitigation, true)}
              >
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                </Button>
              </PopConfirm>
              )
            }
            <PopConfirm
              title="Deseja realmente remover o processo?"
              description="Isso irá remover o processo da lista de processos."
                onConfirm={async () => {
                  try{
                    setPerformingActions({ id: idLitigation, action: 'deleteLitigation' })
                    await deleteLitigation(idLitigation)
                  } catch (error) {
                    toast({
                      title: "Erro ao remover processo",
                      description: "Ocorreu um erro ao remover o processo. Por favor, tente novamente.",
                      variant: "destructive"
                    })
                  } finally {
                    setPerformingActions(null)  
                  }
                }}
            >
              <Button 
                variant="ghost"
                size="icon"
                className="text-red-500"
                disabled={performingActions !== null}
                loading={performingActions?.action === 'deleteLitigation' && performingActions?.id === idLitigation}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </PopConfirm>
          </div>
        )
      },
    }
  ]
}