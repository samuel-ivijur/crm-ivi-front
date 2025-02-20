"use client"

import { useEffect, useState } from "react"
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
import { useProcessForm } from "@/context/useProcessModalForm"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { RelatedProcess } from "@/types/process"

const formatCNJ = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/, '$1-$2.$3.$4.$5.$6')
}

export function RelatedProcessesForm() {
  const { formData, updateFormData, errors, steps, currentStep } = useProcessForm()
  const [processes, setProcesses] = useState<RelatedProcess[]>(
    formData.relatedProcesses ? formData.relatedProcesses.map((p, i) => ({ ...p, id: i })) : []
  )
  const validate = steps.find(step => step.id === currentStep)!.validate

  const addProcess = () => {
    if (!validate()) {
      toast({
        title: "Erro ao adicionar processo relacionado",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }
    const newProcess = processes.map((p, i) => ({ ...p, id: i }))
    newProcess.push({ id: newProcess.length + 1, processNumber: "", instance: 0 })
    setProcesses(newProcess)
    updateFormData("relatedProcesses", newProcess)
    console.log(newProcess)
  }

  const removeProcess = (id: number) => {
    const newProcess = processes.filter(p => p.id !== id).map((p, i) => ({ ...p, id: i }))
    setProcesses(newProcess)
    updateFormData("relatedProcesses", newProcess)
    console.log(newProcess)
  }

  const handleNumberChange = (id: number, value: string) => {
    let formattedValue = value.replace(/\D/g, '')
    if (formattedValue.length <= 20) {
      formattedValue = formatCNJ(formattedValue)
    }
    setProcesses(processes.map(p =>
      p.id === id ? { ...p, processNumber: formattedValue } : p
    ))
    updateFormData("relatedProcesses", processes.map(p =>
      p.id === id ? { ...p, processNumber: formattedValue } : p
    ))
  }

  const handleInstanceChange = (id: number, value: string) => {
    setProcesses(processes.map(p =>
      p.id === id ? { ...p, instance: Number(value) } : p
    ))
    updateFormData("relatedProcesses", processes.map(p =>
      p.id === id ? { ...p, instance: Number(value) } : p
    ))
  }

  const getError = (index: number, field: keyof RelatedProcess) => {
    console.log({errors, index, field})
    return errors[`${index}->${field}`]
  }

  useEffect(() => {
    console.log(errors)
  }, [errors])

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
              <Label htmlFor={`processNumber-${process.id}`} className="font-medium">
                Número do processo <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`processNumber-${process.id}`}
                value={process.processNumber}
                onChange={(e) => handleNumberChange(process.id, e.target.value)}
                placeholder="0000000-00.0000.0.00.0000"
                className={cn("transition-colors focus:border-[#0146cf]", getError(index, 'processNumber') && "border-red-500")}
                maxLength={25}
                required
              />
              {process.processNumber && process.processNumber.length < 25 && (
                <p className="text-sm text-muted-foreground">
                  Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
                </p>
              )}
              {getError(index, 'processNumber') && (
                <p className="text-sm text-red-500">
                  {getError(index, 'processNumber')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`instance-${process.id}`} className="font-medium">
                Instância <span className="text-red-500">*</span>
              </Label>
              <Select
                value={process.instance.toString()}
                onValueChange={(value) => handleInstanceChange(process.id, value)}
                required
              >
                <SelectTrigger className={cn("transition-colors focus:border-[#0146cf]", getError(index, 'instance') && "border-red-500")}>
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
              {getError(index, 'instance') && (
                <p className="text-sm text-red-500">
                  {getError(index, 'instance')}
                </p>
              )}
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