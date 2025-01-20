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

interface Process {
  id: string
  number: string
  instance: string
}

interface Client {
  id: string
  name: string
  phone: string
  date: string
  status: string
  communication: string
  enabled: string
  processes: Process[]
}

const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "(11) 99999-9999",
    date: "2024-01-15",
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
    phone: "(11) 88888-8888",
    date: "2024-01-14",
    status: "Ativo",
    communication: "Inativa",
    enabled: "Não aceite",
    processes: []
  }
]

export function ClientTable() {
  const router = useRouter()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isLinkProcessOpen, setIsLinkProcessOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string>("")

  const toggleRow = (clientId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(clientId)) {
      newExpandedRows.delete(clientId)
    } else {
      newExpandedRows.add(clientId)
    }
    setExpandedRows(newExpandedRows)
  }

  const openLinkProcessDialog = (clientId: string) => {
    setSelectedClientId(clientId)
    setIsLinkProcessOpen(true)
  }

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
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{new Date(client.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.status === "Ativo"
                          ? "border-green-500 text-green-500"
                          : "border-red-500 text-red-500"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.communication === "Ativa"
                          ? "border-green-500 text-green-500"
                          : "border-red-500 text-red-500"
                      }
                    >
                      {client.communication}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.enabled === "Aceite"
                          ? "border-green-500 text-green-500"
                          : "border-yellow-500 text-yellow-500"
                      }
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
                            onClick={() => openLinkProcessDialog(client.id)}
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

      <Dialog open={isLinkProcessOpen} onOpenChange={setIsLinkProcessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vincular Processo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Processo Existente</Label>
              <div className="flex gap-2">
                <Input placeholder="Digite o número do processo" />
                <Button>Buscar</Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsLinkProcessOpen(false)
                // Here you would open your process creation modal
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Novo Processo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
} 