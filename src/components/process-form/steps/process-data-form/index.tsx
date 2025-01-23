"use client"

import { useState, useCallback } from 'react'
import { useProcessForm } from '@/hooks/useProcessForm'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { instanciaOptions } from "@/lib/constants/instancia-types"
import { areaOptions } from "@/lib/constants/area-types"
import { Combobox } from "@/components/ui/combobox"
import { SelectSearch } from "@/components/ui/select-search"

export function ProcessDataForm() {
  const { formData, updateFormData } = useProcessForm()
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

  const formatCNJ = useCallback((value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{7})(\d)/, '$1-$2')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{4})(\d)/, '$1.$2')
      .replace(/(\d{1})(\d{2})/, '$1.$2')
      .replace(/(\d{4})(\d)/, '$1.$2')
  }, [])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    const formattedValue = rawValue ? formatCurrency(rawValue) : ''
    setValue(formattedValue)
    updateFormData('processData', { ...formData.processData, value: formattedValue })
  }

  const handleStatusChange = (checked: boolean) => {
    setIsChecked(checked)
    updateFormData('processData', { ...formData.processData, status: checked })
  }

  const handleInputChange = (field: string, value: string) => {
    updateFormData('processData', { ...formData.processData, [field]: value })
  }

  const handleCNJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNJ(e.target.value)
    handleInputChange('cnjNumber', formatted)
  }

  const isFieldRequired = (field: string) => {
    const requiredFields = ['cnjNumber', 'instance', 'area']
    return requiredFields.includes(field)
  }

  const getFieldError = (field: string) => {
    if (!isFieldRequired(field)) return false
    return !formData.processData[field as keyof typeof formData.processData]
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border p-4 space-y-6">
        <h3 className="text-sm font-medium text-muted-foreground">Informações Principais</h3>
        
        <div className="flex flex-col lg:flex-row items-start gap-4">
          <div className="w-full lg:w-auto flex items-center gap-4 p-2 rounded-lg border bg-white">
            <div className="space-y-2">
              <Label htmlFor="status">Status do Processo</Label>
              <div className="flex items-center gap-2">
                <Switch 
                  id="status" 
                  defaultChecked 
                  className="data-[state=checked]:bg-[#0146cf]"
                  checked={isChecked}
                  onCheckedChange={setIsChecked}
                />
                <span className={cn(
                  "text-sm font-medium",
                  isChecked ? "text-green-600" : "text-red-600"
                )}>
                  {isChecked ? 'Ativo' : 'Baixado'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 h-6">
                <Label htmlFor="cnj">
                  Nº Processo CNJ <span className="text-red-500">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Número do processo no formato CNJ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="cnj"
                placeholder="0000000-00.0000.0.00.0000"
                value={formData.processData.cnjNumber}
                onChange={handleCNJChange}
                maxLength={25}
                className={cn(
                  "transition-colors",
                  getFieldError('cnjNumber') && "border-red-200 focus:border-red-400"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instance">
                Instância <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue 
                    placeholder="Selecione" 
                    className="text-sm"
                  />
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

            <div className="space-y-2">
              <Label htmlFor="value">Valor da Causa</Label>
              <Input
                id="value"
                value={value}
                onChange={handleValueChange}
                placeholder="R$ 0,00"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-6">
        <h3 className="text-sm font-medium text-muted-foreground">Informações de Distribuição</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="alternative">Nº Alternativo</Label>
            <Input 
              id="alternative"
              placeholder="Digite o número alternativo"
              value={formData.processData.alternativeNumber}
              onChange={(e) => handleInputChange('alternativeNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distribution-date">Data Distribuição</Label>
            <Input 
              id="distribution-date" 
              type="date"
              value={formData.processData.distributionDate}
              onChange={(e) => handleInputChange('distributionDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distribution-type">Tipo da Distribuição</Label>
            <Input 
              id="distribution-type"
              placeholder="Digite o tipo"
              value={formData.processData.distributionType}
              onChange={(e) => handleInputChange('distributionType', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-6">
        <h3 className="text-sm font-medium text-muted-foreground">Área e Assuntos</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="area">
              Área <span className="text-red-500">*</span>
            </Label>
            <SelectSearch
              options={areaOptions}
              value={formData.processData.area}
              onValueChange={(value) => handleInputChange('area', value)}
              placeholder="Selecione a área"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input 
              id="subject"
              placeholder="Digite o assunto"
              value={formData.processData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra-subject">Assunto Extra</Label>
            <Input 
              id="extra-subject"
              placeholder="Digite o assunto extra"
              value={formData.processData.extraSubject}
              onChange={(e) => handleInputChange('extraSubject', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-6">
        <h3 className="text-sm font-medium text-muted-foreground">Informações do Tribunal</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="state">UF Com.</Label>
            <Select
              value={formData.processData.state}
              onValueChange={(value) => handleInputChange('state', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione UF" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mg">MG</SelectItem>
                <SelectItem value="sp">SP</SelectItem>
                <SelectItem value="rj">RJ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="county">Comarca</Label>
            <Select
              value={formData.processData.county}
              onValueChange={(value) => handleInputChange('county', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a comarca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bh">BELO HORIZONTE - MG</SelectItem>
                <SelectItem value="sp">SÃO PAULO - SP</SelectItem>
                <SelectItem value="rj">RIO DE JANEIRO - RJ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="court">Tribunal</Label>
            <Select
              value={formData.processData.court}
              onValueChange={(value) => handleInputChange('court', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tribunal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tresc">TRESC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
} 