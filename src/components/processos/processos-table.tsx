"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageCircle, Bell, Trash2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { instanciaOptions } from "@/lib/constants/instancia-types"

interface Processo {
  numero: string
  instancia: string
  cliente: string
  dataCadastro: string
  status: string
  comunicacao: string
  monitoramento: string
}

const processos: Processo[] = [
  {
    numero: "5019340000000000000",
    instancia: "1",
    cliente: "Matildes Inacio de Abreu",
    dataCadastro: "17/01/2025 13:33",
    status: "Ativo",
    comunicacao: "Ativo",
    monitoramento: "Ativo"
  },
  {
    numero: "5071660000000000000",
    instancia: "1",
    cliente: "Marcelo Gonçalves de Oliveira",
    dataCadastro: "17/01/2025 13:33",
    status: "Ativo",
    comunicacao: "Ativo",
    monitoramento: "Ativo"
  },
  {
    numero: "5051870000000000000",
    instancia: "1",
    cliente: "Francisco Sergio Quadri",
    dataCadastro: "17/01/2025 13:26",
    status: "Ativo",
    comunicacao: "Ativo",
    monitoramento: "Ativo"
  }
]

export function ProcessosTable() {
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Número do Processo</TableHead>
            <TableHead>Instância</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data Cadastro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comunicação</TableHead>
            <TableHead>Monitoramento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processos.map((processo) => (
            <TableRow key={processo.numero}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{processo.numero}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {instanciaOptions.find(opt => opt.value === processo.instancia)?.label}
                </Badge>
              </TableCell>
              <TableCell>{processo.cliente}</TableCell>
              <TableCell>{processo.dataCadastro}</TableCell>
              <TableCell>
                <Badge variant={processo.status === "Ativo" ? "success" : "destructive"}>
                  {processo.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={processo.comunicacao === "Ativo" ? "success" : "destructive"}>
                  {processo.comunicacao}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={processo.monitoramento === "Ativo" ? "success" : "destructive"}>
                  {processo.monitoramento}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:text-[#0146cf]"
                          onClick={() => console.log('Visualizar', processo.numero)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white" sideOffset={5}>
                        <p>Visualizar processo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:text-[#0146cf]"
                          onClick={() => console.log('Habilitar comunicação', processo.numero)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white" sideOffset={5}>
                        <p>Habilitar comunicação</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:text-[#0146cf]"
                          onClick={() => console.log('Ativar monitoramento', processo.numero)}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white" sideOffset={5}>
                        <p>Ativar monitoramento</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:text-red-600"
                          onClick={() => console.log('Excluir', processo.numero)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white" sideOffset={5}>
                        <p>Excluir processo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 