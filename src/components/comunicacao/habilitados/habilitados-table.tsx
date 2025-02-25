"use client"

import { useState } from "react"
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
import { UserCheck, UserX, Trash2, Filter } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import Pagination from "@/components/pagination"

interface Habilitado {
  id: string
  cliente: string
  qualificacao: string
  parteContraria: string
  numeroProcesso: string
  instancia: string
  statusCliente: string
  statusProcesso: string
  statusCadastro: string
  dataCadastro: string
}

const habilitados: Habilitado[] = [
  {
    id: "1",
    cliente: "João Silva",
    qualificacao: "Advogado",
    parteContraria: "Empresa XYZ",
    numeroProcesso: "1234567-89.2023.8.26.0000",
    instancia: "1ª",
    statusCliente: "Ativo",
    statusProcesso: "Em andamento",
    statusCadastro: "Incluído",
    dataCadastro: "2024-01-15"
  },
  {
    id: "2",
    cliente: "Maria Santos",
    qualificacao: "Cliente",
    parteContraria: "Empresa ABC",
    numeroProcesso: "9876543-21.2023.8.26.0000",
    instancia: "2ª",
    statusCliente: "Inativo",
    statusProcesso: "Arquivado",
    statusCadastro: "Excluído",
    dataCadastro: "2024-01-14"
  }
]

export function HabilitadosTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const totalItems = 10221
  const filter = {
    limit: 10,
    page: 1
  }
  const total = 0
  const changeBeneficiaryFilter = () => {}
  const PagePagination = () => (
    <Pagination
      limit={filter.limit || 10}
      page={filter.page || 1}
      setLimit={(limit) => {}}
      setPage={(page) => {}}
      total={total}
    />
  )

  return (
    <div className="space-y-4">
       <div className="mb-4">
        <PagePagination />
      </div>
      <TooltipProvider>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Qualificação</TableHead>
                <TableHead>Parte Contrária</TableHead>
                <TableHead>Número do Processo</TableHead>
                <TableHead>Instância</TableHead>
                <TableHead>Status do Cliente</TableHead>
                <TableHead>Status do Processo</TableHead>
                <TableHead>Status do Cadastro</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {habilitados.map((habilitado) => (
                <TableRow key={habilitado.id}>
                  <TableCell>{habilitado.cliente}</TableCell>
                  <TableCell>{habilitado.qualificacao}</TableCell>
                  <TableCell>{habilitado.parteContraria}</TableCell>
                  <TableCell>{habilitado.numeroProcesso}</TableCell>
                  <TableCell>{habilitado.instancia}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        habilitado.statusCliente === "Ativo"
                          ? "border-green-500 text-green-500"
                          : "border-red-500 text-red-500"
                      }
                    >
                      {habilitado.statusCliente}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {habilitado.statusProcesso}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        habilitado.statusCadastro === "Incluído"
                          ? "border-green-500 text-green-500"
                          : "border-red-500 text-red-500"
                      }
                    >
                      {habilitado.statusCadastro}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(habilitado.dataCadastro).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                            {habilitado.statusCliente === "Ativo" ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{habilitado.statusCliente === "Ativo" ? "Inabilitar" : "Habilitar"}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir habilitado</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      <div className="mb-4">
        <PagePagination />
      </div>
    </div>
  )
} 