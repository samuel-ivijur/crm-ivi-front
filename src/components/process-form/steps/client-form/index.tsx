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
import { BeneficairyQualification, BeneficiaryQualificationLabels } from "@/constants"
import { useBeneficiary } from "@/hooks/useBeneficiary"
import { DebounceCombobox } from "@/components/debounce-combo-box"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"

export function ClientForm() {
  const [isNewClient, setIsNewClient] = useState(true)
  const { getBeneficiariesQuery, changeFilter } = useBeneficiary()
  const [beneficiaryOptions, setBeneficiaryOptions] = useState<Array<{ value: string, label: string }>>([])
  const [idBeneficiary, setIdBeneficiary] = useState<string | null>(null)
  const { getSelectedOrganization } = useAuth();

  const handleFetchBeneficiary = async (value: string): Promise<void> => {
    const idOrganization = getSelectedOrganization()
    changeFilter({ searchTerm: value, idOrganization })
  }

  useEffect(() => {
    setBeneficiaryOptions(getBeneficiariesQuery.data?.beneficiaries.map((beneficiary) => ({
      value: beneficiary.id.toString(),
      label: `${beneficiary.name}${beneficiary.phone ? ` - ${beneficiary.phone}` : ''}`
    })) || [])
  }, [getBeneficiariesQuery.data])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Informações do Cliente</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={!isNewClient}
            onCheckedChange={(checked) => setIsNewClient(!checked)}
          />
          <span className="text-sm">Selecionar Cliente</span>
        </div>
      </div>

      {isNewClient ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input id="name" placeholder="Digite o nome" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Celular <span className="text-red-500">*</span>
            </Label>
            <Input id="phone" placeholder="(__) _____-____" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@email.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">
              Qualificação do cliente <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a qualificação" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BeneficairyQualification).map(qualification => (
                  <SelectItem key={qualification} value={qualification.toString()}>
                    {BeneficiaryQualificationLabels[qualification]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="identification">
              Como você quer ser identificado pelo cliente?
            </Label>
            <Input id="identification" placeholder="Escritório/Nome" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="select-client">
              Selecione o Cliente <span className="text-red-500">*</span>
            </Label>
            <DebounceCombobox
              id="idClient"
              fetchOptions={handleFetchBeneficiary}
              options={beneficiaryOptions}
              className="w-full"
              value={idBeneficiary}
              setValue={setIdBeneficiary}
              buttonWidth="200px"
              placeholder="Selecione o cliente"
              inputPlaceholder="Digite o nome do cliente"
              emptyMessage="Nenhum cliente encontrado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">
              Qualificação do cliente <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a qualificação" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BeneficairyQualification).map(qualification => (
                  <SelectItem key={qualification} value={qualification.toString()}>
                    {BeneficiaryQualificationLabels[qualification]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="identification">
              Como você quer ser identificado pelo cliente?
            </Label>
            <Input id="identification" placeholder="Escritório/Nome" />
          </div>
        </div>
      )}
    </div>
  )
} 