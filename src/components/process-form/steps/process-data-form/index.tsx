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
import { useCourt } from '@/hooks/useCourt'
import { useCounty } from '@/hooks/useCounty'
import { Combobox } from '@/components/combo-box'
import { courtSystems, UF } from '@/constants'
import AutoComplete from '@/components/autocomplete'
import { DatePicker } from '@/components/datepicker'
import { DebounceCombobox } from '@/components/debounce-combo-box'

export function ProcessDataForm() {
  const { formData, updateFormData } = useProcessForm()
  const [isChecked, setIsChecked] = useState(true)
  const [value, setValue] = useState('')
  const { getCourtsQuery } = useCourt()
  const { getCountiesQuery, changeFilter: changeCountyFilter } = useCounty()

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

  const handleChangeUF = (value: string | number) => {
    updateFormData('processData', { ...formData.processData, uf: +value })
    changeCountyFilter({
      idUf: +value,
      page: 1
    })
  }

  const handleFetchCounty = async (value: string) => {
    const idUf = formData.processData.state ? +formData.processData.state : undefined;
    changeCountyFilter({
      searchTerm: value,
      limit: 10,
      page: 1,
      idUf
    });
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
          <DatePicker
            id="distribution-date"
            className="w-full"
            value={formData.processData.distributionDate ? new Date(formData.processData.distributionDate) : null}
            setValue={(value) => handleInputChange("distributionDate", String(value))}
            placeholder="Selecione a data de distribuição"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distribution-type">Tipo da Distribuição</Label>
          <AutoComplete
            suggestions={['SORTEIO', 'DEPENDÊNCIA', 'PREVENÇÃO']}
            placeholder="Digite o tipo da distribuição"
            setValue={(value) => handleInputChange("distributionType", String(value))}
            value={formData.processData.distributionType || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Área</Label>
          <AutoComplete
            suggestions={['CÍVEL', 'CRIMINAL', 'ADMINISTRATIVO', 'TRABALHISTA', 'FISCAL', 'TRIBUTÁRIO', 'CONCILIATÓRIO', 'ESPECIAL', 'ESPECIALISTA', 'ESPECIALIZADO']}
            placeholder="Digite a área"
            setValue={(value) => handleInputChange("area", String(value))}
            value={formData.processData.area || ''}
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
          <Label htmlFor="uf">UF Comarca</Label>
          <Combobox
            id="uf"
            value={formData.processData.state || ''}
            setValue={handleChangeUF}
            className="w-full"
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
            value={formData.processData.county || ''}
            setValue={(value) => handleInputChange("county", String(value))}
            buttonWidth="200px"
            placeholder="Selecione a comarca"
            inputPlaceholder="Digite a comarca"
            emptyMessage="Nenhuma comarca encontrada"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="court">Tribunal</Label>
          <Combobox
            id="court"
            options={(getCourtsQuery.data?.courts || []).map((court) => ({ value: court.id.toString(), label: court.name }))}
            value={String(formData.processData.court)}
            setValue={(value) => handleInputChange("court", String(value))}
            className="w-full"
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
            value={String(formData.processData.courtSystem)}
            setValue={(value) => handleInputChange("courtSystem", String(value))}
            className="w-full"
            buttonWidth="200px"
            placeholder="Selecione o sistema do tribunal"
            inputPlaceholder="Selecione o sistema do tribunal"
            emptyMessage=""
          />
        </div>
      </div>
    </div>
  )
} 