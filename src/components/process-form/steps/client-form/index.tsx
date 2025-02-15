"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BeneficiaryQualificationOptions, UF } from "@/constants"
import { useBeneficiary } from "@/hooks/useBeneficiary"
import { DebounceCombobox } from "@/components/debounce-combo-box"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import CustomMaskedInput from "@/components/masked-input"
import { useProcessForm } from "@/context/useProcessModalForm"

const formatDate = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
}

interface AddressData {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
}

export function ClientForm() {
  const { getSelectedOrganization } = useAuth();
  const { formData, updateFormData, errors } = useProcessForm()
  const { getBeneficiariesQuery, changeFilter } = useBeneficiary(getSelectedOrganization())
  const [beneficiaryOptions, setBeneficiaryOptions] = useState<Array<{ value: string, label: string }>>([])

  const [birthDate, setBirthDate] = useState('')

  const [cep, setCep] = useState('')

  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    city: '',
    state: ''
  })
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/\D/g, '')
    if (value.length <= 8) {
      value = formatDate(value)
    }
    setBirthDate(value)
  }

  const handleFetchBeneficiary = async (value: string): Promise<void> => {
    changeFilter({ searchTerm: value, idOrganization: getSelectedOrganization() })
  }

  const fetchAddress = async () => {
    if (cep.length < 8) return

    setIsLoadingCep(true)
    try {
      const cleanCep = cep.replace(/\D/g, '')
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data: AddressData = await response.json()

      if (data.logradouro) {
        console.log({ data })
        setAddress({
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        })
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      setIsLoadingCep(false)
    }
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
          <Label htmlFor="use-existing" className="text-sm text-muted-foreground">
            Selecionar Cliente
          </Label>
          <Switch
            id="use-existing"
            checked={formData.selectClient}
            onCheckedChange={(checked) => {
              updateFormData("selectClient", checked)
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-white space-y-6">
        {formData.selectClient ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="select-client">
                Selecione o Cliente <span className="text-red-500">*</span>
              </Label>
              <DebounceCombobox
                id="idClient"
                fetchOptions={handleFetchBeneficiary}
                options={beneficiaryOptions}
                className={cn(
                  "w-full",
                  errors.idClient && "border-red-500"
                )}
                value={formData.idClient ? formData.idClient : null}
                setValue={(value) => updateFormData("idClient", value)}
                buttonWidth="200px"
                placeholder="Selecione o cliente"
                inputPlaceholder="Digite o nome do cliente"
                emptyMessage="Nenhum cliente encontrado"
              />
              {errors.idClient && <p className="text-red-500 text-sm">{errors.idClient}</p>}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qualification" className="font-medium">
                  Qualificação do cliente <span className="text-red-500">*</span>
                </Label>
                <Select 
                  name="qualification" 
                  value={formData.client?.idQualification ? formData.client.idQualification.toString() : ''}
                  onValueChange={(value) => updateFormData("client", { ...formData.client, idQualification: Number(value) })}
                  required 
                >
                  <SelectTrigger className={cn(
                    "transition-colors focus:border-[#0146cf]",
                    errors.idClient && "border-red-500"
                  )}>
                    <SelectValue placeholder="Selecione a qualificação" />
                  </SelectTrigger>
                  <SelectContent>
                    {BeneficiaryQualificationOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idClient && <p className="text-red-500 text-sm">{errors.idClient}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="identification" className="font-medium">
                  Como você quer ser identificado pelo cliente?
                </Label>
                <Input
                  id="identification"
                  placeholder="Escritório/Nome"
                  className="transition-colors focus:border-[#0146cf]"
                  value={formData.nick}
                  onChange={(e) => updateFormData("nick", e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Digite o nome"
                  className={cn(
                    "transition-colors focus:border-[#0146cf]",
                    errors.name && "border-red-500"
                  )}
                  value={formData.client?.name}
                  onChange={(e) => updateFormData("client", { ...formData.client, name: e.target.value })}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium">
                  Celular <span className="text-red-500">*</span>
                </Label>
                <CustomMaskedInput
                  id="phone"
                  value={formData.client?.phone}
                  onChange={(e) => updateFormData("client", { ...formData.client, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className={cn(
                    "transition-colors focus:border-[#0146cf]",
                    errors.phone && "border-red-500"
                  )}
                  required
                  mask="(11) 11111-1111"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification" className="font-medium">
                  Qualificação do cliente <span className="text-red-500">*</span>
                </Label>
                <Select 
                  name="qualification" 
                  value={formData.client?.idQualification ? formData.client.idQualification.toString() : ''} 
                  onValueChange={(value) => updateFormData("client", { ...formData.client, idQualification: Number(value) })}
                  required 
                >
                  <SelectTrigger className={cn(
                    "transition-colors focus:border-[#0146cf]",
                    errors.idQualification && "border-red-500"
                  )}>
                    <SelectValue placeholder="Selecione a qualificação" />
                  </SelectTrigger>
                  <SelectContent>
                    {BeneficiaryQualificationOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idQualification && <p className="text-red-500 text-sm">{errors.idQualification}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="identification">
                  Como você quer ser identificado pelo cliente?
                </Label>
                <Input 
                  id="identification" 
                  placeholder="Escritório/Nome" 
                  value={formData.nick}
                  onChange={(e) => updateFormData("nick", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  className="transition-colors focus:border-[#0146cf]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth-date" className="font-medium">
                  Data de Nascimento
                </Label>
                <Input
                  id="birth-date"
                  value={birthDate}
                  onChange={handleDateChange}
                  placeholder="dd/mm/aaaa"
                  className="transition-colors focus:border-[#0146cf]"
                  maxLength={10}
                />
              </div>

            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Endereço</Label>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative">
                  <Label htmlFor="cep" className="font-medium">CEP</Label>
                  <div className="relative">
                    <CustomMaskedInput
                      id="cep"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="pr-8 transition-colors focus:border-[#0146cf]"
                      mask="11111-111"
                      onBlur={fetchAddress}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={fetchAddress}
                      disabled={String(cep).replace(/\D/g, '').length < 8 || isLoadingCep}
                      className="absolute right-0 top-0 h-full px-2 hover:bg-transparent hover:text-[#0146cf] disabled:opacity-50"
                    >
                      <Search className={cn(
                        "h-4 w-4",
                        isLoadingCep && "animate-spin"
                      )} />
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="street" className="font-medium">Rua</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="transition-colors focus:border-[#0146cf]"
                  />
                </div>

                <div>
                  <Label htmlFor="number" className="font-medium">Número</Label>
                  <Input
                    id="number"
                    className="transition-colors focus:border-[#0146cf]"
                  />
                </div>

                <div>
                  <Label htmlFor="complement" className="font-medium">Complemento</Label>
                  <Input
                    id="complement"
                    className="transition-colors focus:border-[#0146cf]"
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood" className="font-medium">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={address.neighborhood}
                    onChange={(e) => setAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                    className="transition-colors focus:border-[#0146cf]"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="font-medium">Cidade</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="transition-colors focus:border-[#0146cf]"
                  />
                </div>
              </div>

              <div className="w-[200px]">
                <Label htmlFor="state" className="font-medium">Estado</Label>
                <Select
                  value={address.state}
                  onValueChange={(value) => setAddress(prev => ({ ...prev, state: value }))}
                >
                  <SelectTrigger className="transition-colors focus:border-[#0146cf]">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {UF.map((uf) => (
                      <SelectItem
                        key={uf.id}
                        value={uf.uf}
                      >
                        {uf.uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 