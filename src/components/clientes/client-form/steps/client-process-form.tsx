"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { ProcessDataForm } from "@/components/process-form/steps/process-data-form/index"

export function ClientProcessForm() {
  const [isNewProcess, setIsNewProcess] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base">Vincular Processo</Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="new-process" className="text-sm text-muted-foreground">
            {isNewProcess ? 'Cadastrar novo' : 'Buscar existente'}
          </Label>
          <Switch
            id="new-process"
            checked={isNewProcess}
            onCheckedChange={setIsNewProcess}
            className="data-[state=checked]:bg-[#0146cf]"
          />
        </div>
      </div>

      {!isNewProcess ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input 
              placeholder="Digite o número do processo" 
              className="flex-1"
            />
            <Button className="bg-[#0146cf] hover:bg-[#0146cf]/90">
              Buscar
            </Button>
          </div>
        </div>
      ) : (
        <ProcessDataForm />
      )}

      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Processo
      </Button>
    </div>
  )
} 