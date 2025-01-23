"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { instanciaOptions } from "@/lib/constants/instancia-types"

interface RelatedProcess {
  id: string
  number: string
  instance: string
}

// Função para formatar número CNJ
const formatCNJ = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/, '$1-$2.$3.$4.$5.$6')
}

export function RelatedProcessesForm() {
  const [processes, setProcesses] = useState<RelatedProcess[]>([])

  const addProcess = () => {
    setProcesses([
      ...processes,
      { id: String(processes.length + 1), number: "", instance: "" }
    ])
  }

  const removeProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id))
  }

  const handleNumberChange = (id: string, value: string) => {
    let formattedValue = value.replace(/\D/g, '')
    if (formattedValue.length <= 20) {
      formattedValue = formatCNJ(formattedValue)
    }
    setProcesses(processes.map(p =>
      p.id === id ? { ...p, number: formattedValue } : p
    ))
  }

  return (
    <div className="space-y-6">
      {processes.map((process, index) => (
        <div key={process.id} className="rounded-lg border p-4 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Processo relacionado {index + 1}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeProcess(process.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`number-${process.id}`} className="font-medium">
                Número do processo <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`number-${process.id}`}
                value={process.number}
                onChange={(e) => handleNumberChange(process.id, e.target.value)}
                placeholder="0000000-00.0000.0.00.0000"
                className="transition-colors focus:border-[#0146cf]"
                maxLength={25}
                required
              />
              {process.number && process.number.length < 25 && (
                <p className="text-sm text-muted-foreground">
                  Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`instance-${process.id}`} className="font-medium">
                Instância <span className="text-red-500">*</span>
              </Label>
              <Select
                value={process.instance}
                onValueChange={(value) => {
                  setProcesses(processes.map(p =>
                    p.id === process.id ? { ...p, instance: value } : p
                  ))
                }}
                required
              >
                <SelectTrigger className="transition-colors focus:border-[#0146cf]">
                  <SelectValue placeholder="Selecione a instância" />
                </SelectTrigger>
                <SelectContent>
                  {instanciaOptions.map((instance) => (
                    <SelectItem 
                      key={instance.value} 
                      value={instance.value}
                    >
                      {instance.label}
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
        onClick={addProcess}
        className="w-full bg-[#0146cf] hover:bg-[#0146cf]/90 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar processo relacionado
      </Button>
    </div>
  )
} 