"use client"

import { useEffect, useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../ui"
import { Pencil, Save, X } from "lucide-react"
import ModalConfirm from "../modal-confirm"
import { LitigationStatus } from "@/constants/litigation"
import ProcessDataTabSkeleton from "./process-data-tab-skeleton"
import { formatCurrency } from "@/utils/format"
import { GetLitigation } from "@/services/api/litigations"
import AutoComplete from "../autocomplete"
import InputTags from "../input-tags"
import { DatePicker } from "../datepicker"

type FormData = {
  isActive: boolean | null;
  cnj: string | null;
  alternative: string | null;
  instance: string | null;
  distributionDate: string | null;
  distributionType: string | null;
  area: string | null;
  subject: string | null;
  extraSubject: string | null;
  court: string | null;
  courtSystem: string | null;
  causeValue: string | null;
  classes: string[];
}

type ProcessDataTabProps = {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
}
export function ProcessDataTab({ data, isLoading }: ProcessDataTabProps) {

  const [isEditing, setIsEditing] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    isActive: null,
    cnj: null,
    alternative: null,
    instance: null,
    distributionDate: null,
    distributionType: null,
    area: null,
    subject: null,
    extraSubject: null,
    court: null,
    courtSystem: null,
    causeValue: null,
    classes: []
  })

  const parseDataToFormData = (data: GetLitigation.Result["data"]) => {
    setFormData({
      isActive: data.idstatus === LitigationStatus.ACTIVE,
      cnj: data.processnumber || '',
      alternative: data.case_cover?.alternative_number || '',
      instance: String(data.instance || ''),
      distributionDate: data.case_cover?.distribution_date || '',
      distributionType: data.case_cover?.distribution_type || '',
      area: data.case_cover?.area || '',
      subject: data.case_cover?.subject || '',
      extraSubject: data.case_cover?.extra_subject || '',
      court: data.case_cover?.court || '',
      courtSystem: data.case_cover?.court_system || '',
      causeValue: data.case_cover?.cause_value || '',
      classes: ['Promessa de Compra e Venda / Coisas C/C']
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const editProcess = () => {
    setIsEditing(false)
  }

  const handleClosePopover = () => {
    setIsCancelModalOpen(false)
    setIsSaveModalOpen(false)
  }

  const handleConfirmCancel = () => {
    setIsEditing(false)
    setIsCancelModalOpen(false)
    if (data)parseDataToFormData(data)
  }

  const handleConfirmSave = () => {
    setIsSaveModalOpen(false)
    editProcess()
  }

  const handleValueChange = (value: string) => {
    const formattedValue = value ? formatCurrency(value) : ''
    setFormData((prev) => ({ ...prev, causeValue: formattedValue }))
  }

  const toggleEditing = () => {
    const newIsEditing = !isEditing
    if (newIsEditing) {
      handleValueChange(formData.causeValue || '')
    }
    setIsEditing(newIsEditing)
  }

  useEffect(() => {
    if (data) parseDataToFormData(data)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-around">
          Dados do Processo
          {
            !isEditing && (
              <Button
                variant="default"
                size="sm"
                onClick={toggleEditing}
                disabled={isEditing || isLoading}
              >
                <Pencil size={16} />
              </Button>
            )
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {
          isLoading ? <ProcessDataTabSkeleton /> :
            (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <Label>Status Processo</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={(formData.isActive !== null && formData.isActive) || false}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        className="data-[state=checked]:bg-[#0146cf]"
                      />
                      <span className="text-sm font-medium">{formData.isActive ? 'Ativo' : 'Arquivado'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <Label className="text-sm text-gray-500">Valor da causa</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={formData.causeValue || ''}
                        onChange={(e) => handleValueChange(e.target.value.replace(/\D/g, ''))}
                        onBlur={() => handleValueChange(formData.causeValue || '')}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-[#0146cf]">
                        {formatCurrency(String(formData.causeValue) || '')}
                      </div>
                    )
                    }
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="cnj">Nº Processo CNJ</Label>
                    <Input id="cnj" name="cnj" value={formData.cnj || ''} onChange={handleInputChange} className="w-full" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternative">Nº Alternativo</Label>
                    <Input id="alternative" name="alternative" value={formData.alternative || ''} onChange={handleInputChange} className="w-full" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instance">Instância</Label>
                    <Select value={formData.instance || ''} onValueChange={handleSelectChange("instance")} disabled={!isEditing}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1ª</SelectItem>
                        <SelectItem value="2">2ª</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distribution-date">Data Distribuição</Label>
                    < DatePicker 
                      className="w-full"
                      value={formData?.distributionDate ? new Date(formData.distributionDate) : null}
                      setValue={handleSelectChange("distributionDate")}
                      placeholder="Selecione a data de distribuição"
                      disabled={!isEditing}
                    />
                    {/* <Input 
                      id="distribution-date" 
                      name="distributionDate" 
                      value={formData.distributionDate || ''} 
                      onChange={handleInputChange} 
                      className="w-full" 
                      disabled={!isEditing} 
                    /> */}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distribution-type">Tipo da Distribuição</Label>
                    <AutoComplete
                      suggestions={['SORTEIO', 'DEPENDÊNCIA', 'PREVENÇÃO']}
                      placeholder="Digite o tipo da distribuição"
                      setValue={handleSelectChange("distributionType")}
                      value={formData.distributionType || ''}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área</Label>
                    <AutoComplete
                      suggestions={['CÍVEL', 'CRIMINAL', 'ADMINISTRATIVO', 'TRABALHISTA', 'FISCAL', 'TRIBUTÁRIO', 'CONCILIATÓRIO', 'ESPECIAL', 'ESPECIALISTA', 'ESPECIALIZADO']}
                      placeholder="Digite a área"
                      setValue={handleSelectChange("area")}
                      value={formData.area || ''}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input id="subject" name="subject" value={formData.subject || ''} onChange={handleInputChange} className="w-full" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extra-subject">Assunto Extra</Label>
                    <Input id="extra-subject" name="extraSubject" value={formData.extraSubject || ''} onChange={handleInputChange} className="w-full" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classes">Classes</Label>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    <InputTags 
                      placeholder="Digite a classe"
                      setTags={handleSelectChange("classes")}
                      disabled={!isEditing}
                      tags={formData.classes || []}
                    />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court">Tribunal</Label>
                    <Select value={formData.court || ''} onValueChange={handleSelectChange("court")} disabled={!isEditing}>
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
                    <Select value={formData.courtSystem || ''} onValueChange={handleSelectChange("courtSystem")} disabled={!isEditing}>
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
                {
                  isEditing && (
                    <div className="flex justify-end gap-2">

                      <Button variant="outline" onClick={() => setIsCancelModalOpen(true)}> <X size={16} className="mr-2" /> Cancelar edição</Button>
                      <Button variant="default" onClick={() => setIsSaveModalOpen(true)}> <Save size={16} className="mr-2" /> Salvar</Button>
                    </div>
                  )
                }
              </>
            )
        }

      </CardContent>
      <ModalConfirm
        title="Cancelar edição"
        description={"Tem certeza que deseja cancelar a edição?"}
        onConfirm={handleConfirmCancel}
        onCancel={handleClosePopover}
        open={isCancelModalOpen}
        onOpenChange={handleClosePopover}
      />
      <ModalConfirm
        title="Salvar edição"
        description={"Tem certeza que deseja salvar a edição?"}
        onConfirm={handleConfirmSave}
        onCancel={handleClosePopover}
        open={isSaveModalOpen}
        onOpenChange={handleClosePopover}
      />
    </Card>
  )
} 