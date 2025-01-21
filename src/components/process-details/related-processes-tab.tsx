"use client"

import { useState } from "react"
import { Trash2, Plus } from 'lucide-react'
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
import { instanciaOptions } from "@/lib/constants/instancia-types"

interface RelatedProcess {
  id: number
  number: string
  instance: string
}

export function RelatedProcessesTab() {
  const [processes, setProcesses] = useState<RelatedProcess[]>([
    { id: 1, number: "40028922123456", instance: "2" },
  ])

  const addProcess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newProcess = {
      id: processes.length + 1,
      number: formData.get("number") as string,
      instance: formData.get("instance") as string,
    }
    setProcesses([...processes, newProcess])
    e.currentTarget.reset()
  }

  const removeProcess = (id: number) => {
    setProcesses(processes.filter((process) => process.id !== id))
  }

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
            <Input
              id="number"
              name="number"
              placeholder="Digite o número do processo"
              required
            />
          </div>

          <div className="space-y-2 w-[180px]">
            <Label htmlFor="instance">
              Instância <span className="text-red-500">*</span>
            </Label>
            <Select name="instance" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a instância" />
              </SelectTrigger>
              <SelectContent>
                {instanciaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="bg-[#0146cf] hover:bg-[#0146cf]/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </form>

        {processes.length > 0 && (
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
                    <TableCell>
                      {instanciaOptions.find(opt => opt.value === process.instance)?.label}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeProcess(process.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 