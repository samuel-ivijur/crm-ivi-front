"use client"

import { useState } from "react"
import { Trash2 } from 'lucide-react'
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
import { RelatedProcess } from "@/types/process"
import { instanciaOptions } from "@/lib/constants/instancia-types"

export function RelatedProcessesForm() {
  const [processes, setProcesses] = useState<RelatedProcess[]>([
    { id: 1, number: "", instance: "" },
  ])

  const addProcess = () => {
    const newProcess = {
      id: processes.length + 1,
      number: "",
      instance: "",
    }
    setProcesses([...processes, newProcess])
  }

  const removeProcess = (id: number) => {
    if (processes.length > 1) {
      setProcesses(processes.filter((process) => process.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {processes.map((process) => (
        <div key={process.id} className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Processo relacionado {process.id}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => removeProcess(process.id)}
            >
              <Trash2 className="h-4 w-4" /> Remover
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`number-${process.id}`}>
                Número do processo <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`number-${process.id}`}
                placeholder="00000000011111112222"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`instance-${process.id}`}>
                Instância <span className="text-red-500">*</span>
              </Label>
              <Select>
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
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={addProcess}
      >
        + Adicionar processo relacionado
      </Button>
    </div>
  )
} 