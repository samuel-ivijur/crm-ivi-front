"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"
import { Eye, MessageSquare, Bell, Trash } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { GetLitigations } from "@/services/api/litigations"
import dayjs from "dayjs"

export const litigationTableColumns: ColumnDef<GetLitigations.LitigationInfo>[] = [
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
    accessorKey: "clientname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
  },
  {
    accessorKey: "createdat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Cadastro" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdat") ? dayjs(row.getValue("createdat")).format("DD/MM/YYYY HH:ss") : ""
      return (
        <>
          {createdAt}
        </>
      )
    },
  },
  {
    accessorKey: "statusdescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("statusdescription") as string
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
    accessorKey: "communication",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comunicação" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("statusdescription") as string
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
    id: "monitoring",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monitoramento" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("statusdescription") as string
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
      const idLitigation = row.id

      return (
        <div className="flex justify-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push(`/processos/${idLitigation}`)}
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