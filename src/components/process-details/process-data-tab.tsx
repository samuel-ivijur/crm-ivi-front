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
import { GetLitigation, litigationsService } from "@/services/api/litigations"
import AutoComplete from "../autocomplete"
import InputTags from "../input-tags"
import { DatePicker } from "../datepicker"
import { Combobox } from "../combo-box"
import { courtSystems, UF } from "@/constants"
import { useCourt } from "@/hooks/useCourt"
import { DebounceCombobox } from "../debounce-combo-box"
import { useCounty } from "@/hooks/useCounty"
import { toast } from "@/hooks/use-toast"
import { instanciaOptions } from "@/lib/constants/instancia-types"
import { areaOptions } from "@/lib/constants/area-types"

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
  uf: number | null;
  county: string | null;
}

type ProcessDataTabProps = {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
  invalidateLitigation: (id: string) => void
}
export function ProcessDataTab({ data, isLoading, invalidateLitigation }: ProcessDataTabProps) {

  const [isEditing, setIsEditing] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { getCourtsQuery } = useCourt()
  const { getCountiesQuery, changeFilter: changeCountyFilter } = useCounty()

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
    classes: [],
    uf: null,
    county: null
  })

  const handleFetchCounty = async (value: string) => {
    const idUf = formData.uf ? +formData.uf : undefined;
    changeCountyFilter({
      searchTerm: value,
      limit: 10,
      page: 1,
      idUf
    });
  }

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
      classes: ['Promessa de Compra e Venda / Coisas C/C'],
      uf: data?.iduf || null,
      county: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleClosePopover = () => {
    setIsCancelModalOpen(false)
    setIsSaveModalOpen(false)
  }

  const handleConfirmCancel = () => {
    setIsEditing(false)
    setIsCancelModalOpen(false)
    if (data) parseDataToFormData(data)
  }

  const handleConfirmSave = async () => {
    try {
      setIsSaveModalOpen(false)
      setIsSaving(true)
      if (!data) return toast({
        title: "Erro ao salvar os dados do processo!",
        description: "Não foi possível salvar os dados do processo. Tente novamente mais tarde.",
        variant: "destructive",
      })
      await litigationsService.editLitigation({
        id: data.id,
        idOrganization: data.organizationid,
        caseCover: {
          alternativeNumber: formData?.alternative || '',
          distributionDate: formData?.distributionDate || undefined,
          distributionType: formData?.distributionType || '',
          area: formData?.area || '',
          subject: formData?.subject || '',
          extraSubject: formData?.extraSubject || '',
          idCourt: formData?.court ? +formData.court : undefined,
          idCourtSystem: formData?.courtSystem ? +formData.courtSystem : undefined,
          claimValue: formData?.causeValue || '',
          classes: formData?.classes || [],
          idCounty: formData?.county ? +formData.county : undefined,
        }
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar os dados do processo!",
        description: "Não foi possível salvar os dados do processo. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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

  const handleChangeUF = (value: string | number) => {
    setFormData(prev => ({ ...prev, county: null, uf: +value }))
    changeCountyFilter({
      idUf: +value,
      page: 1
    })
  }

  useEffect(() => {
    if (data) parseDataToFormData(data)
  }, [data])

  useEffect(() => {
    if (getCountiesQuery.data) {
      console.log(getCountiesQuery.data)
    }
  }, [getCountiesQuery.data])

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
                    <Input
                      id="cnj"
                      name="cnj"
                      value={formData.cnj || ''}
                      onChange={handleInputChange}
                      className="w-full"
                      disabled={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternative">Nº Alternativo</Label>
                    <Input id="alternative" name="alternative" value={formData.alternative || ''} onChange={handleInputChange} className="w-full" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instance">Instância</Label>
                    <Select value={formData.instance || ''} onValueChange={handleSelectChange("instance")} disabled={true}>
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
                      id="distribution-date"
                      className="w-full"
                      value={formData?.distributionDate ? new Date(formData.distributionDate) : null}
                      setValue={handleSelectChange("distributionDate")}
                      placeholder="Selecione a data de distribuição"
                      disabled={!isEditing}
                    />
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
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject || ''}
                      onChange={handleInputChange}
                      className="w-full"
                      disabled={!isEditing}
                      placeholder="Digite o assunto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extra-subject">Assunto Extra</Label>
                    <Input
                      id="extra-subject"
                      name="extraSubject"
                      value={formData.extraSubject || ''}
                      onChange={handleInputChange}
                      className="w-full"
                      disabled={!isEditing}
                      placeholder="Digite o assunto extra"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court">Tribunal</Label>
                    <Combobox
                      id="court"
                      options={(getCourtsQuery.data?.courts || []).map((court) => ({ value: court.id.toString(), label: court.name }))}
                      value={formData.court || 1}
                      setValue={handleSelectChange("court")}
                      className="w-full"
                      disabled={!isEditing}
                      buttonWidth="200px"
                      placeholder="Selecione a comarca"
                      inputPlaceholder="Digite a comarca"
                      emptyMessage=""
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="court-system">Sistema Tribunal</Label>
                    <Combobox
                      id="court-system"
                      options={courtSystems.map((courtSystem) => ({ value: courtSystem.id.toString(), label: courtSystem.name }))}
                      value={formData.courtSystem || ''}
                      setValue={handleSelectChange("courtSystem")}
                      className="w-full"
                      disabled={!isEditing}
                      buttonWidth="200px"
                      placeholder="Selecione o sistema do tribunal"
                      inputPlaceholder="Selecione o sistema do tribunal"
                      emptyMessage=""
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uf">UF</Label>
                    <Combobox
                      id="uf"
                      value={formData.uf || ''}
                      setValue={handleChangeUF}
                      className="w-full"
                      disabled={!isEditing}
                      options={Object.values(UF).map(({ id, uf }) => ({ value: String(id), label: uf }))}
                      buttonWidth="200px"
                      placeholder="Selecione a UF"
                      inputPlaceholder="Digite a UF"
                      emptyMessage="UF não encontrada"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">Comarca</Label>
                    <DebounceCombobox
                      id="county"
                      fetchOptions={handleFetchCounty}
                      options={(getCountiesQuery.data?.counties || []).map((county) => ({
                        value: county.id.toString(),
                        label: county.name ? `${county.name} - ${county.uf.name}` : `COMARCA DE ${county.city.name} - ${county.uf.name}`
                      }))}
                      className="w-full"
                      disabled={!isEditing}
                      value={formData.county || ''}
                      setValue={handleSelectChange("county")}
                      buttonWidth="200px"
                      placeholder="Selecione a comarca"
                      inputPlaceholder="Digite a comarca"
                      emptyMessage="Nenhuma comarca encontrada"
                    />
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

                </div>
                {
                  isEditing && (
                    <div className="flex justify-end gap-2">

                      <Button variant="outline" onClick={() => setIsCancelModalOpen(true)} disabled={isSaving}> <X size={16} className="mr-2" /> Cancelar edição</Button>
                      <Button variant="default" onClick={() => setIsSaveModalOpen(true)} disabled={isSaving}> <Save size={16} className="mr-2" /> Salvar</Button>
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