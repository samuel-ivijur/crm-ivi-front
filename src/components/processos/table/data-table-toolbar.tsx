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
import { Process } from "./columns"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getSelectedRowModel().rows

  const handleExport = () => {
    const selectedData = selectedRows.map(row => {
      const rowData = row.original as Process
      return {
        'Número do Processo': rowData.numero,
        'Instância': rowData.instancia,
        'Cliente': rowData.cliente,
        'Data Cadastro': rowData.dataCadastro,
        'Status': rowData.status,
        'Comunicação': rowData.comunicacao,
        'Monitoramento': rowData.monitoramento,
      }
    })

    const ws = XLSX.utils.json_to_sheet(selectedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Processos")
    XLSX.writeFile(wb, "processos.xlsx")
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
                  value={(table.getColumn("numero")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("numero")?.setFilterValue(event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Input
                  placeholder="Nome do cliente..."
                  value={(table.getColumn("cliente")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("cliente")?.setFilterValue(event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={(table.getColumn("status")?.getFilterValue() as string) ?? "todos"}
                  onValueChange={(value) =>
                    table.getColumn("status")?.setFilterValue(value === "todos" ? "" : value)
                  }
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
              <div className="space-y-2">
                <Label>Comunicação</Label>
                <Select
                  value={(table.getColumn("comunicacao")?.getFilterValue() as string) ?? "todos"}
                  onValueChange={(value) =>
                    table.getColumn("comunicacao")?.setFilterValue(value === "todos" ? "" : value)
                  }
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
                  value={(table.getColumn("monitoramento")?.getFilterValue() as string) ?? "todos"}
                  onValueChange={(value) =>
                    table.getColumn("monitoramento")?.setFilterValue(value === "todos" ? "" : value)
                  }
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
        {selectedRows.length} de {table.getFilteredRowModel().rows.length} selecionado(s)
      </div>
    </div>
  )
} 