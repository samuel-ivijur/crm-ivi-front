"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { instanciaOptions } from "@/lib/constants/instancia-types"
import { areaOptions } from "@/lib/constants/area-types"

export function ProcessDataTab() {
  const [isActive, setIsActive] = useState(true)
  const [formData, setFormData] = useState({
    cnj: "40028922123456",
    alternative: "12332140029822",
    instance: "2",
    distributionDate: "25/10/2024 10:20",
    distributionType: "sorteio",
    area: "civel",
    subject: "INVENTÁRIO",
    extraSubject: "BUSCA E APREENSÃO EM ALIENAÇÃO FIDUCIARIA",
    court: "pje",
    courtSystem: "pje"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Processo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Label>Status Processo</Label>
            <div className="flex items-center gap-2">
              <Switch 
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-[#0146cf]"
              />
              <span className="text-sm font-medium">{isActive ? 'Ativo' : 'Arquivado'}</span>
            </div>
          </div>

          <div className="text-right">
            <Label className="text-sm text-gray-500">Valor da causa</Label>
            <div className="text-2xl font-bold text-[#0146cf]">R$ 1.000.000,00</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cnj">Nº Processo CNJ</Label>
            <Input id="cnj" name="cnj" value={formData.cnj} onChange={handleInputChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternative">Nº Alternativo</Label>
            <Input id="alternative" name="alternative" value={formData.alternative} onChange={handleInputChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance">
              Instância <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.instance} onValueChange={handleSelectChange("instance")}>
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

          <div className="space-y-2">
            <Label htmlFor="distribution-date">Data Distribuição</Label>
            <Input id="distribution-date" name="distributionDate" value={formData.distributionDate} onChange={handleInputChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distribution-type">Tipo da Distribuição</Label>
            <Select value={formData.distributionType} onValueChange={handleSelectChange("distributionType")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sorteio">SORTEIO</SelectItem>
                <SelectItem value="dependencia">DEPENDÊNCIA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área</Label>
            <Select value={formData.area} onValueChange={handleSelectChange("area")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                {areaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra-subject">Assunto Extra</Label>
            <Input id="extra-subject" name="extraSubject" value={formData.extraSubject} onChange={handleInputChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classes">Classes</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              <Badge className="bg-[#0146cf]">
                Promessa de Compra e Venda / Coisas C/C
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="court">Tribunal</Label>
            <Select value={formData.court} onValueChange={handleSelectChange("court")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pje">PJE</SelectItem>
                <SelectItem value="esaj">ESAJ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="court-system">Sistema Tribunal</Label>
            <Select value={formData.courtSystem} onValueChange={handleSelectChange("courtSystem")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pje">PJE</SelectItem>
                <SelectItem value="esaj">ESAJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 