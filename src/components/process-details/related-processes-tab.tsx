"use client"

import { useState } from "react"
import { Trash2, Plus, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GetLitigation } from "@/services/api/litigations"
import { useEffect } from "react"
import PopConfirm from "../popconfirm"
import { RelatedProcessService } from "@/services/api/related-process"
import { toast } from "@/hooks/use-toast"
import CustomMaskedInput from "../masked-input"

interface RelatedProcess {
  id: number
  number: string
  instance: string
}

interface RelatedProcessesTabProps {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
  invalidateLitigation: (id: string) => void
}

export function RelatedProcessesTab({ data, isLoading, invalidateLitigation }: RelatedProcessesTabProps) {
  const [processes, setProcesses] = useState<RelatedProcess[]>([])
  const [number, setNumber] = useState<string>("")
  const [instance, setInstance] = useState<string>("")
  const [idGroup, setIdGroup] = useState<number | null>(null)

  const addProcess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!data) throw new Error()
      if (!number || !instance) {
        toast({
          title: "Atenção!",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return
      }
      const formData = new FormData(e.currentTarget)
      const newProcess = {
        number: formData.get("number") as string,
        instance: formData.get("instance") as string,
      }
      if (idGroup) {
        await RelatedProcessService.add({
          idOrganization: data.organization.id,
          idGroup,
          relations: [
            {
              processNumber: newProcess.number,
              instance: Number(newProcess.instance),
            }
          ]
        })
      } else {
        await RelatedProcessService.save({
          idOrganization: data.organization.id,
          relations: [
            {
              idLitigationLink: data.id,
              isMainLitigation: true,
            },
            {
              processNumber: newProcess.number,
              instance: Number(newProcess.instance),
            }
          ]
        })
      }
      invalidateLitigation(data.id)
      setNumber("")
      setInstance("")
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao adicionar processo!",
        description: "Não foi possível adicionar o processo. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const removeProcess = async (id: number) => {
    try {
      if (!data) throw new Error()
      await RelatedProcessService.delete({
        idOrganization: data.organization.id,
        idRelatedProcess: id,
      })
      invalidateLitigation(data.id)
    } catch (error) {
      toast({
        title: "Erro ao remover processo!",
        description: "Não foi possível remover o processo. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    setIdGroup(data?.idRelatedProcessesGroup || null)
    if (!data || !Array.isArray(data.relatedProcesses) || data.relatedProcesses.length === 0) return
    const p1 = data.processnumber.replace(/[^\d.-]/g, '')
    setProcesses((data.relatedProcesses || [])
      .filter((process) => {
        const p2 = process.processnumber.replace(/[^\d.-]/g, '')
        return (+process.instance !== +data.instance!) || (p1 !== p2)
      })
      .map((process) => ({
          id: process.id,
          number: process.processnumber,
          instance: process.instance,
        })))
}, [data])

return (
  <Card>
    <CardHeader>
      <CardTitle>Processos Relacionados</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <form onSubmit={addProcess} className="flex gap-4 items-end">
        <div className="space-y-2 flex-1 max-w-xs">
          <Label htmlFor="number">
            Número do processo <span className="text-red-500">*</span>
          </Label>
          <CustomMaskedInput
            id="number"
            name="number"
            mask="1111111-11.1111.1.11.1111"
            value={number}
            onChangeValue={(value: string) => setNumber(value)}
            required
          />
        </div>

        <div className="space-y-2 w-[180px]">
          <Label htmlFor="instance">
            Instância <span className="text-red-500">*</span>
          </Label>
          <Select name="instance" required value={instance} onValueChange={(value) => setInstance(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1ª Instância</SelectItem>
              <SelectItem value="2">2ª Instância</SelectItem>
              <SelectItem value="3">Instância Superior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="bg-[#0146cf] hover:bg-[#0146cf]/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : processes.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </TableHead>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Instância</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </TableCell>
                  <TableCell>{process.number}</TableCell>
                  <TableCell>{+process.instance <= 2 ? `${process.instance}ª Instância` : 'Instância Superior'}</TableCell>
                  <TableCell className="text-right">
                    <PopConfirm
                      title="Deseja realmente remover este processo?"
                      description="Esta ação não pode ser desfeita."
                      onConfirm={() => removeProcess(process.id)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PopConfirm>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Nenhum processo relacionado encontrado.</p>
        </div>
      )}
    </CardContent>

  </Card>
)
} 