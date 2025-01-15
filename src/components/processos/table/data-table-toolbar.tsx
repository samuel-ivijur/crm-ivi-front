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
import { GetLitigations } from "@/services/api/litigations"
import { useLitigation } from "@/hooks/useLitigations"
import { ValueOf } from "next/dist/shared/lib/constants"
import { LitigationStatus, LitigationStatusLabels } from "@/constants/litigation"

interface LitigationDataTableToolbarProps {
  table: Table<GetLitigations.LitigationInfo>
}

export function LitigationDataTableToolbar({
  table,
}: LitigationDataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getSelectedRowModel().rows
  const { getAllLitigationsQuery, filter, changeFilter } = useLitigation()
  const debounceTime = 500

  let debounceTimeout: NodeJS.Timeout | null = null
  const debounceFilter = async (key: keyof typeof filter, value: any): Promise<void> => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    debounceTimeout = setTimeout(() => changeFilter({ [key]: value }), debounceTime)
  }

  const handleExport = () => {
    const selectedData = selectedRows.map(row => {
      const rowData = row.original as GetLitigations.LitigationInfo
      return {
        'Número do Processo': rowData.processnumber,
        'Instância': rowData.instance,
        'Cliente': rowData.clientname,
        'Data Cadastro': rowData.createdat,
        'Status': rowData.statusdescription,
        'Comunicação': rowData.statusdescription,
        'Monitoramento': rowData.statusdescription,
      }
    })

    const ws = XLSX.utils.json_to_sheet(selectedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Processos")
    XLSX.writeFile(wb, "processos.xlsx")
  }

  const handleSelectChange = (key: keyof typeof filter, value: ValueOf<typeof LitigationStatus> | string | null) => {
    if (value === "null") value = null
    changeFilter({ [key]: value })
  }

  return (
    <div className="flex items-center justify-between gap-2 py-4">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {isFiltered && (
                <div className="rounded-full bg-primary/10 px-1 text-xs">
                  {table.getState().columnFilters.length}
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
                  value={filter?.litigation ?? ""}
                  onChange={(event) => debounceFilter("litigation", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Input
                  placeholder="Nome do cliente..."
                  value={filter?.beneficiary ?? ""}
                  onChange={(event) => debounceFilter("beneficiary", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filter.idStatusLitigation?.toString() ?? "null"}
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
                <Label>Comunicação</Label>
                <Select

                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Inativa">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monitoramento</Label>
                <Select

                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={() => table.resetColumnFilters()}
                  className="w-full"
                >
                  Limpar Filtros
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {selectedRows.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Exportar {selectedRows.length} {selectedRows.length === 1 ? 'processo' : 'processos'}
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {selectedRows.length} selecionado(s) | Total: {getAllLitigationsQuery.data?.total}
      </div>
    </div>
  )
} 