"use client"

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProcessDataForm() {
  const [isChecked, setIsChecked] = useState(true)
  const [value, setValue] = useState('')

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(Number(numbers) / 100)
    return formatted
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    setValue(rawValue ? formatCurrency(rawValue) : '')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status Processo</Label>
          <div className="flex items-center gap-2 rounded-lg border bg-white p-2">
            <Switch 
              id="status" 
              defaultChecked 
              className="data-[state=checked]:bg-[#0146cf]"
              checked={isChecked}
              onCheckedChange={setIsChecked}
            />
            <span className="text-sm">{isChecked ? 'Ativo' : 'Arquivado'}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="space-y-2">
            <Label htmlFor="cnj">
              Nº Processo CNJ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cnj"
              placeholder="00000000011111112222"
              className="w-[280px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance">
              Instância <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="1ª" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1ª</SelectItem>
                <SelectItem value="2">2ª</SelectItem>
                <SelectItem value="3">3ª</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Valor da Causa</Label>
          <Input
            id="value"
            value={value}
            onChange={handleValueChange}
            placeholder="R$ 0,00"
            className="w-[200px]"
          />
        </div>
      </div>
    </div>
  )
} 