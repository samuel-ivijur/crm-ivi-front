"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"
import { Eye, MessageSquare, Bell, Trash } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export type Process = {
  id: string
  numero: string
  instancia: string
  cliente: string
  dataCadastro: string
  status: string
  comunicacao: string
  monitoramento: string
}

export const columns: ColumnDef<Process>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "numero",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número do Processo" />
    ),
  },
  {
    accessorKey: "instancia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Instância" />
    ),
  },
  {
    accessorKey: "cliente",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
  },
  {
    accessorKey: "dataCadastro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Cadastro" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "Ativo" ? "success" : "destructive"}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "comunicacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comunicação" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("comunicacao") as string
      return (
        <Badge
          variant={status === "Ativa" ? "success" : "destructive"}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "monitoramento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monitoramento" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("monitoramento") as string
      return (
        <Badge
          variant={status === "Ativo" ? "success" : "destructive"}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      const router = useRouter()
      const process = row.original

      return (
        <div className="flex justify-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push(`/processos/${process.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 