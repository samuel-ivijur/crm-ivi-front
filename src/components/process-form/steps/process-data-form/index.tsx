"use client"

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
import { courtSystems, LitigationStatus, UF } from '@/constants'
import { DebounceCombobox } from '@/components/debounce-combo-box'
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
import { SelectSearch } from "@/components/ui/select-search"
import { LitigationParams } from '@/services/api/litigations'
import CustomMaskedInput from '@/components/masked-input'

type ProcessDataFormData = {
  processNumber: string
  instance: number
  idStatus?: LitigationStatus
  uf?: number
  caseCover?: LitigationParams['caseCover']
}

type ProcessDataFormProps = {
  formData: ProcessDataFormData
  setFormData: (field: keyof ProcessDataFormData, value: any) => void
  errors?: Record<string, string>
}

export function ProcessDataForm({ formData, setFormData, errors }: ProcessDataFormProps) {
  const { getCourtsQuery } = useCourt()
  const { getCountiesQuery, changeFilter: changeCountyFilter } = useCounty()

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    const formattedValue = rawValue ? formatCurrency(rawValue) : ''
    setFormData('caseCover', formData.caseCover ? { ...formData.caseCover, claimValue: formattedValue } : { claimValue: formattedValue })
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData('idStatus', checked ? LitigationStatus.ACTIVE : LitigationStatus.ARCHIVED)
  }

  const handleChangeUF = (value: string | number) => {
    setFormData('uf', +value)
    changeCountyFilter({
      idUf: +value,
      searchTerm: '',
      page: 1
    })
  }

  const handleFetchCounty = async (value: string) => {
    const idUf = formData.uf ? +formData.uf : undefined;
    changeCountyFilter({
      searchTerm: value,
      limit: 10,
      page: 1,
      idUf
    });
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
                  checked={formData?.idStatus === LitigationStatus.ACTIVE}
                  onCheckedChange={handleStatusChange}
                />
                <span className={cn(
                  "text-sm font-medium",
                  formData?.idStatus === LitigationStatus.ACTIVE ? "text-green-600" : "text-red-600"
                )}>
                  {formData?.idStatus === LitigationStatus.ACTIVE ? 'Ativo' : 'Baixado'}
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
              <CustomMaskedInput
                id="cnj"
                value={formData?.processNumber}
                onChange={(e) => setFormData('processNumber', e.target.value)}
                mask="1111111-11.1111.1.11.1111"
                className={cn(
                  "transition-colors",
                  errors?.processNumber && "border-red-200 focus:border-red-400"
                )}
              />
              {errors?.processNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.processNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instance">
                Instância <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setFormData('instance', +value)}
                value={formData?.instance ? String(formData?.instance) : ''}
              >
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
              {errors?.instance && (
                <p className="text-red-500 text-sm mt-1">{errors.instance}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor da Causa</Label>
              <Input
                id="value"
                value={formData?.caseCover?.claimValue}
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
              value={formData?.caseCover?.alternativeNumber}
              onChange={(e) => setFormData('caseCover', { ...formData.caseCover, alternativeNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distribution-date">Data Distribuição</Label>
            <Input
              id="distribution-date"
              type="date"
              value={formData?.caseCover?.distributionDate}
              onChange={(e) => setFormData('caseCover', { ...formData.caseCover, distributionDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distribution-type">Tipo da Distribuição</Label>
            <Input
              id="distribution-type"
              placeholder="Digite o tipo"
              value={formData?.caseCover?.distributionType}
              onChange={(e) => setFormData('caseCover', { ...formData.caseCover, distributionType: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-6">
        <h3 className="text-sm font-medium text-muted-foreground">Área e Assuntos</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="area">
              Área
            </Label>
            <SelectSearch
              options={areaOptions}
              value={formData?.caseCover?.area}
              onValueChange={(value) => setFormData('caseCover', { ...formData.caseCover, area: value })}
              placeholder="Selecione a área"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              placeholder="Digite o assunto"
              value={formData?.caseCover?.nature}
              onChange={(e) => setFormData('caseCover', { ...formData.caseCover, nature: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra-subject">Assunto Extra</Label>
            <Input
              id="extra-subject"
              placeholder="Digite o assunto extra"
              value={formData?.caseCover?.extraSubject}
              onChange={(e) => setFormData('caseCover', { ...formData.caseCover, extraSubject: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-6">
        <h3 className="text-sm font-medium text-muted-foreground">Informações do Tribunal</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="uf">UF Comarca</Label>
            <Combobox
              id="uf"
              value={formData?.uf || ''}
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
              value={formData?.caseCover?.idCounty ? String(formData?.caseCover?.idCounty) : ''}
              setValue={(value) => setFormData('caseCover', { ...formData.caseCover, idCounty: +value })}
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
              value={formData?.caseCover?.idCourt ? String(formData?.caseCover?.idCourt) : ''}
              setValue={(value) => setFormData('caseCover', { ...formData.caseCover, idCourt: +value })}
              className="w-full"
              buttonWidth="200px"
              placeholder="Selecione o tribunal"
              inputPlaceholder="Digite o tribunal"
              emptyMessage=""
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="court-system">Sistema Tribunal</Label>
            <Combobox
              id="court-system"
              options={courtSystems.map((courtSystem) => ({ value: courtSystem.id.toString(), label: courtSystem.name }))}
              value={formData?.caseCover?.idCourtSystem ? String(formData?.caseCover?.idCourtSystem) : ''}
              setValue={(value) => setFormData('caseCover', { ...formData.caseCover, idCourtSystem: +value })}
              className="w-full"
              buttonWidth="200px"
              placeholder="Selecione o sistema do tribunal"
              inputPlaceholder="Digite o sistema do tribunal"
              emptyMessage=""
            />
          </div>
        </div>
      </div>
    </div>
  )
} 