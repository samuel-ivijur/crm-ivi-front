"use client"

import { useState } from 'react'
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
import { formatCurrency } from '@/utils/format'

export function ProcessDataForm() {
  const { formData, updateFormData } = useProcessForm()
  const [isChecked, setIsChecked] = useState(true)
  const [value, setValue] = useState('')

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="space-y-2 w-full lg:w-auto">
          <Label htmlFor="status">Status</Label>
          <div className="flex items-center gap-2 rounded-lg border bg-white p-2">
            <Switch 
              id="status" 
              defaultChecked 
              className="data-[state=checked]:bg-[#0146cf]"
              checked={isChecked}
              onCheckedChange={setIsChecked}
            />
            <span className="text-sm">{isChecked ? 'Ativo' : 'Baixado'}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="space-y-2 flex-1">
            <Label htmlFor="cnj">
              Nº Processo CNJ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cnj"
              placeholder="00000000011111112222"
              value={formData.processData.cnjNumber}
              onChange={(e) => handleInputChange('cnjNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2 w-full lg:w-[180px]">
            <Label htmlFor="instance">
              Instância <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.processData.instance}
              onValueChange={(value) => handleInputChange('instance', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="1ª" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1ª</SelectItem>
                <SelectItem value="2">2ª</SelectItem>
                <SelectItem value="3">3ª</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full lg:w-[200px]">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="alternative">Nº Alternativo</Label>
          <Input 
            id="alternative"
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
            placeholder="Digite o tipo da distribuição"
            value={formData.processData.distributionType}
            onChange={(e) => handleInputChange('distributionType', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Área</Label>
          <Input 
            id="area"
            placeholder="Digite a área"
            value={formData.processData.area}
            onChange={(e) => handleInputChange('area', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input 
            id="subject"
            value={formData.processData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="extra-subject">Assunto Extra</Label>
          <Input 
            id="extra-subject"
            value={formData.processData.extraSubject}
            onChange={(e) => handleInputChange('extraSubject', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">UF Com.</Label>
          <Select
            value={formData.processData.state}
            onValueChange={(value) => handleInputChange('state', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="MG" />
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
              <SelectValue placeholder="BELO HORIZONTE - MG" />
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
              <SelectValue placeholder="TRESC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tresc">TRESC</SelectItem>
              <SelectItem value="tresp">TRESP</SelectItem>
              <SelectItem value="trerj">TRERJ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="court-system">Sistema Tribunal</Label>
          <Select
            value={formData.processData.courtSystem}
            onValueChange={(value) => handleInputChange('courtSystem', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="ESAJ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="esaj">ESAJ</SelectItem>
              <SelectItem value="pje">PJE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 