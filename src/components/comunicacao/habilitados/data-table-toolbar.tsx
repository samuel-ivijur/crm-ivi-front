"use client"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, X, FileDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from 'xlsx'
import { GetLitigations, litigationsService } from "@/services/api/litigations"
import { GetLitigationParams, useLitigation } from "@/hooks/useLitigations"
import { ValueOf } from "next/dist/shared/lib/constants"
import { LitigationMonitoringType, LitigationStatus, LitigationStatusLabels } from "@/constants/litigation"
import PopConfirm from "@/components/popconfirm"
import { useAuth } from "@/hooks/useAuth"
import { useRef, useState } from "react"

interface EnabledDataTableToolbarProps {
  selectedRows: Set<string>
  setSelectedRows: (rows: Set<string>) => void
  isExporting: boolean
  total: number
}


export function EnabledDataTableToolbar({
  selectedRows,
  setSelectedRows,
  isExporting,
  total
}: EnabledDataTableToolbarProps) {
  const { filter, changeFilter, resetParams } = useLitigation()
  const [values, setValues] = useState<GetLitigationParams>(filter)
  const { getSelectedOrganization } = useAuth()
  const debounceTime = 500
  const idOrganization = getSelectedOrganization()

  const getSelectMonitoringValue = (): string => {
    if (filter.idTypeMonitoring && +filter.idTypeMonitoring === LitigationMonitoringType.PUBLICATIONS && String(filter.idStatusMonitoring) === "true") return "true"
    else if (filter.idStatusMonitoring === undefined) return "all"
    else return "false"
  }

  const [monitoringValue, setMonitoringValue] = useState<string | null>(getSelectMonitoringValue())

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const debounceFilter = async (key: keyof typeof filter, value: any): Promise<void> => {
    setValues(prev => ({ ...prev, [key]: value }))
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(() => changeFilter({ [key]: value }), debounceTime)
  }

  

  const handleExport = async () => {
    const response = await litigationsService.getLitigations({
      idOrganization,
      noPagination: true,
      ids: Array.from(selectedRows)
    })
    const selectedData = response.data.map(row => ({
        'Número do Processo': row.processnumber,
        'Instância': row.instance,
        'Data Cadastro': row.createdAt,
        'Status': row.status.description,
        'Monitoramento': row?.monitoring.find(m => m.type.id === LitigationMonitoringType.PUBLICATIONS)?.monitoring ? 'Ativo' : 'Inativo',
    }))

    const ws = XLSX.utils.json_to_sheet(selectedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Processos")
    XLSX.writeFile(wb, "processos.xlsx")
  }

  const handleSelectChange = (key: keyof typeof filter, value: ValueOf<typeof LitigationStatus> | string | null) => {
    if (value === "null") value = null
    changeFilter({ [key]: value })
  }

  const handleSelectMonitoringChange = (value: string | null) => {
    if (value === "null") value = null
    if (value === "true"){
      changeFilter({ idTypeMonitoring: LitigationMonitoringType.PUBLICATIONS, idStatusMonitoring: true })
      setMonitoringValue("true")
    }
    else if (value === "false"){
      changeFilter({ idTypeMonitoring: undefined, idStatusMonitoring: false })
      setMonitoringValue("false")
    }
    else if (value === "all" || value === null){
      changeFilter({ idTypeMonitoring: undefined, idStatusMonitoring: undefined })
      setMonitoringValue(null)
    }

  }

  return (
    <div className="flex items-center justify-between gap-2 py-4">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {(
                <div className="rounded-full bg-primary/10 px-1 text-xs">
                  {Object.keys(filter).filter(key => !["idOrganization", "page", "limit"].includes(key)).length}
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Número do Processo</Label>
                <Input
                  placeholder="Digite o número..."
                  value={values?.litigation ?? ""}
                  onChange={(event) => debounceFilter("litigation", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Input
                  placeholder="Nome do cliente..."
                  value={values?.beneficiary ?? ""}
                  onChange={(event) => debounceFilter("beneficiary", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={values?.idStatusLitigation?.toString() ?? "null"}
                  onValueChange={(value) => handleSelectChange("idStatusLitigation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(null)}>Todos</SelectItem>
                    <SelectItem value={LitigationStatus.ACTIVE.toString()}>{LitigationStatusLabels[LitigationStatus.ACTIVE]}</SelectItem>
                    <SelectItem value={LitigationStatus.ARCHIVED.toString()}>{LitigationStatusLabels[LitigationStatus.ARCHIVED]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monitoramento</Label>
                <Select
                  value={monitoringValue as string}
                  onValueChange={(value) => handleSelectMonitoringChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null as unknown as string}>Todos</SelectItem>
                    <SelectItem value={"true"}>Monitoramento Ativo</SelectItem>
                    <SelectItem value={"false"}>Monitoramento Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {Object.keys(filter).filter(key => !["idOrganization", "page", "limit"].includes(key)).length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setValues({})
                    setMonitoringValue(null)
                    resetParams()
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {selectedRows.size > 0 && (
          <>
            <PopConfirm
              title="Confirmar Exportação"
              description="Tem certeza que deseja exportar os clientes selecionados?"
              onConfirm={handleExport}
            >
              <Button
                variant="outline"
                className="gap-2"
                loading={isExporting}
              >
                <FileDown className="h-4 w-4" />
                Exportar {selectedRows.size} {selectedRows.size === 1 ? 'cliente' : 'clientes'}
              </Button>
            </PopConfirm>
            <PopConfirm
              title="Confirmar"
              description="Tem certeza que deseja limpar a seleção?"
              onConfirm={async () => setSelectedRows(new Set())}
            >
              <Button
                variant="outline"
                className="gap-2"
                disabled={isExporting}
              >
                <X className="h-4 w-4" />
                Limpar Seleção
              </Button>
            </PopConfirm>
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {selectedRows.size} selecionado(s) | Total: {total}
      </div>
    </div>
  )
} 