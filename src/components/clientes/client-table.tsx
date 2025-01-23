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
import { Eye, Trash2, MessageSquarePlus, Bell, ChevronDown, ChevronRight, Plus, LinkIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from "date-fns"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { LinkProcessModal } from "./link-process-modal"
import { Client, Process } from "@/types/client"

interface ClientWithProcesses extends Client {
  processes: Process[]
}

const clients: ClientWithProcesses[] = [
  {
    id: "1",
    name: "John Doe",
    document: "123.456.789-00",
    phone: "(11) 99999-9999",
    email: "john@example.com",
    date: "2024-01-14",
    status: "Ativo",
    communication: "Ativa",
    enabled: "Aceite",
    processes: [
      { id: "1", number: "40028922123456", instance: "1" },
      { id: "2", number: "40028922123457", instance: "2" },
    ]
  },
  {
    id: "2",
    name: "Jane Smith",
    document: "987.654.321-00",
    phone: "(11) 88888-8888",
    email: "jane@example.com",
    date: "2024-01-13",
    status: "Ativo",
    communication: "Inativa",
    enabled: "Não aceite",
    processes: []
  }
]

const columns: ColumnDef<ClientWithProcesses>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "expand",
    header: "",
    cell: () => <ChevronDown className="h-4 w-4" />,
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "document",
    header: "CPF/CNPJ",
    cell: ({ row }) => {
      const doc = row.getValue("document") as string
      // Formata CPF ou CNPJ
      return doc.length === 11 
        ? doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        : doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "date",
    header: "Data Cadastro",
    cell: ({ row }) => {
      return format(new Date(row.getValue("date")), "dd/MM/yyyy")
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Ativo" ? "success" : "destructive"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "communication",
    header: "Comunicação",
    cell: ({ row }) => {
      const communication = row.getValue("communication") as string
      return (
        <Badge
          variant={communication === "Ativa" ? "success" : "destructive"}
        >
          {communication}
        </Badge>
      )
    },
  },
  {
    accessorKey: "enabled",
    header: "Habilitado",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled") as string
      return (
        <Badge
          variant={enabled === "Aceite" ? "success" : enabled === "Não aceite" ? "destructive" : "default"}
        >
          {enabled}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizar cliente</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar comunicação</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                <Bell className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar monitoramento</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Excluir cliente</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
]

export function ClientTable() {
  const router = useRouter()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isLinkProcessOpen, setIsLinkProcessOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ClientWithProcesses | null>(null)

  const toggleRow = (clientId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(clientId)) {
      newExpandedRows.delete(clientId)
    } else {
      newExpandedRows.add(clientId)
    }
    setExpandedRows(newExpandedRows)
  }

  const openLinkProcessDialog = (client: ClientWithProcesses) => {
    setSelectedClient(client)
    setIsLinkProcessOpen(true)
  }

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              </TableHead>
              <TableHead className="w-4"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Comunicação</TableHead>
              <TableHead>Habilitado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
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
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{new Date(client.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge
                      variant={client.status === "Ativo" ? "success" : "destructive"}
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.communication === "Ativa" ? "success" : "destructive"}
                    >
                      {client.communication}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.enabled === "Aceite" ? "success" : "destructive"}
                    >
                      {client.enabled}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar cliente</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                            <MessageSquarePlus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar comunicação</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                            <Bell className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar monitoramento</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                    <TableCell colSpan={9}>
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
                        {client.processes.length > 0 ? (
                          <div className="space-y-2">
                            {client.processes.map((process) => (
                              <div
                                key={process.id}
                                className="flex items-center justify-between p-2 bg-white rounded border"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="font-medium">Nº {process.number}</span>
                                  <Badge variant="outline">
                                    {process.instance}ª Instância
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/processos/${process.id}`)}
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