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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../ui"
import { Pencil, Save, X } from "lucide-react"
import ModalConfirm from "../modal-confirm"
import { redirect, useParams } from "next/navigation"
import { useProcessDetails } from "@/hooks/useProcessDetails"
import { LitigationStatus } from "@/constants/litigation"
import { useToast } from "@/hooks/use-toast"
import ProcessDataTabSkeleton from "./process-data-tab-skeleton"
import { formatCurrency } from "@/utils/format"

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
}
export function ProcessDataTab() {
  const { toast } = useToast()
  const { getLitigationQuery } = useProcessDetails()

  const [isEditing, setIsEditing] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
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
    causeValue: null
  })

  const { id } = useParams();

  const parseDataToFormData = () => {
    if (!getLitigationQuery.data) return
    setFormData({
      isActive: getLitigationQuery.data.idstatus === LitigationStatus.ACTIVE,
      cnj: getLitigationQuery.data.processnumber || '',
      alternative: getLitigationQuery.data.case_cover?.alternative_number || '',
      instance: String(getLitigationQuery.data.instance || ''),
      distributionDate: getLitigationQuery.data.case_cover?.distribution_date || '',
      distributionType: getLitigationQuery.data.case_cover?.distribution_type || '',
      area: getLitigationQuery.data.case_cover?.area || '',
      subject: getLitigationQuery.data.case_cover?.subject || '',
      extraSubject: getLitigationQuery.data.case_cover?.extra_subject || '',
      court: getLitigationQuery.data.case_cover?.court || '',
      courtSystem: getLitigationQuery.data.case_cover?.court_system || '',
      causeValue: getLitigationQuery.data.case_cover?.cause_value || ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const editProcess = () => {
    setIsEditing(false)
    console.log(formData)
  }

  const handleClosePopover = () => {
    setIsCancelModalOpen(false)
    setIsSaveModalOpen(false)
  }

  const handleConfirmCancel = () => {
    setIsEditing(false)
    setIsCancelModalOpen(false)
    parseDataToFormData()
  }

  const handleConfirmSave = () => {
    setIsSaveModalOpen(false)
    editProcess()
  }

  const handleValueChange = (value: string) => {
    const formattedValue = value ? formatCurrency(value) : ''
    setFormData((prev) => ({ ...prev, causeValue: formattedValue }))
  }

  const checkData = () => {
    if (
      !getLitigationQuery.data
      && !getLitigationQuery.isFetching
      && (lastUpdated && lastUpdated === getLitigationQuery.dataUpdatedAt)
    ) {
      toast({
        title: 'Erro ao carregar dados do processo',
        description: 'Não foi possível carregar os dados do processo.',
        variant: 'destructive',
      })
      return redirect('/processos')
    }

    parseDataToFormData()
    setLastUpdated(getLitigationQuery.dataUpdatedAt)
  }

  const toggleEditing = () => {
    const newIsEditing = !isEditing
    if (newIsEditing) {
      handleValueChange(formData.causeValue || '')
    }
    setIsEditing(newIsEditing)
  }

  useEffect(() => {
    console.log(getLitigationQuery.isFetching, lastUpdated,getLitigationQuery.data )
    checkData()
  }, [getLitigationQuery.data, id])

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
                disabled={isEditing || getLitigationQuery.isLoading}
              >
                <Pencil size={16} />
              </Button>
            )
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {
          getLitigationQuery.isLoading ? <ProcessDataTabSkeleton /> :
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
                    <Input id="distribution-date" name="distributionDate" value={formData.distributionDate || ''} onChange={handleInputChange} className="w-full" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distribution-type">Tipo da Distribuição</Label>
                    <Select value={formData.distributionType || ''} onValueChange={handleSelectChange("distributionType")} disabled={!isEditing} >
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
                    <Select value={formData.area || ''} onValueChange={handleSelectChange("area")} disabled={!isEditing}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="civel">CÍVEL</SelectItem>
                        <SelectItem value="criminal">CRIMINAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input id="subject" name="subject" value={formData.subject || ''} onChange={handleInputChange} className="w-full" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extra-subject">Assunto Extra</Label>
                    <Input id="extra-subject" name="extraSubject" value={formData.extraSubject || ''} onChange={handleInputChange} className="w-full" />
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