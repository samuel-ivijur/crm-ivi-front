"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { PersonType, UF } from "@/constants"
import CustomMaskedInput from "@/components/masked-input"
import { toast } from "@/hooks/use-toast"
import { FormData } from "../types"

interface ClientDataFormProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  phoneRequired: boolean
  errors: string[]
}

export function ClientDataForm({ formData, setFormData, phoneRequired, errors }: ClientDataFormProps) {
  const handleDateChange = (value: string) => {
    const date = new Date(value)
    if (!date || isNaN(date.getTime())) return
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date > today) {
      toast({
        title: "Data inválida",
        description: "A data de nascimento não pode ser maior que a data atual",
        variant: "destructive"
      })
      return
    }
    setFormData(prev => ({ ...prev, birthDate: value }))
  }

  const handleCepChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formattedValue = numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, cep: formattedValue }
    }))
  }

  const fetchAddress = async () => {
    if (formData.address.cep.length < 8) return

    try {
      const cleanCep = formData.address.cep.replace(/\D/g, '')
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (data.logradouro) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Campos principais */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium">
            Nome <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Digite o nome"
            className={`transition-colors focus:border-[#0146cf] ${errors.includes("name") ? "border-red-500" : ""}`}
            required
          />
          {errors.includes("name") && (
            <p className="text-red-500 text-sm">Nome é obrigatório</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="person-type">
            Tipo Pessoa <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type ? String(formData.type) : undefined}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: +value }))}
          >
            <SelectTrigger
              className={`transition-colors focus:border-[#0146cf] ${errors.includes("type") ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={String(PersonType.PERSON)}>Pessoa Física</SelectItem>
              <SelectItem value={String(PersonType.COMPANY)}>Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
          {errors.includes("type") && (
            <p className="text-red-500 text-sm">Tipo de pessoa é obrigatório</p>
          )}
        </div>

        <div className="space-y-2">
          {formData.type === PersonType.COMPANY ? (
            <>
              <Label htmlFor={`document-${PersonType.COMPANY}`}>
                CNPJ
              </Label>
              <CustomMaskedInput
                id={`document-${PersonType.COMPANY}`}
                key={`document-${PersonType.COMPANY}`}
                mask="11.111.111/1111-11"
                value={formData.document || ''}
                onChangeValue={(value: string) => setFormData(prev => ({ ...prev, document: String(value).replace(/\D/g, '') }))}
                className="transition-colors focus:border-[#0146cf]"
                disabled={formData.type !== PersonType.COMPANY}
              />
            </>
          ) : (
            <>
              <Label htmlFor={`document-${PersonType.PERSON}`}>
                CPF
              </Label>
              <CustomMaskedInput
                id={`document-${PersonType.PERSON}`}
                key={`document-${PersonType.PERSON}`}
                mask="111.111.111-11"
                value={formData.document || ''}
                onChangeValue={(value: string) => setFormData(prev => ({ ...prev, document: String(value).replace(/\D/g, '') }))}
                className="transition-colors focus:border-[#0146cf]"
                disabled={formData.type !== PersonType.PERSON}
              />
            </>

          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            type="email"
            placeholder="email@exemplo.com"
            className="transition-colors focus:border-[#0146cf]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Telefone {phoneRequired && <span className="text-red-500">*</span>}
          </Label>
          <CustomMaskedInput
            id="phone"
            value={formData.phone || ''}
            onChangeValue={(value: string) => setFormData(prev => ({ ...prev, phone: String(value).replace(/\D/g, '') }))}
            className="transition-colors focus:border-[#0146cf]"
            required={phoneRequired}
            mask="(11) 11111-1111"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth-date">Data de Nascimento</Label>
          <Input
            id="birth-date"
            value={formData.birthDate}
            onChange={(e) => handleDateChange(e.target.value)}
            type="date"
            className="transition-colors focus:border-[#0146cf]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Endereço</Label>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Label htmlFor="cep" className="font-medium">CEP</Label>
            <div className="relative">
              <Input
                id="cep"
                value={formData.address.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="00000-000"
                className="pr-8 transition-colors focus:border-[#0146cf]"
                maxLength={9}
                onBlur={fetchAddress}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={fetchAddress}
                className="absolute right-0 top-0 h-full px-2 hover:bg-transparent hover:text-[#0146cf]"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
              className="transition-colors focus:border-[#0146cf]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              value={formData.address.number}
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, number: e.target.value } }))}
              className="transition-colors focus:border-[#0146cf]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={formData.address.complement}
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, complement: e.target.value } }))}
              className="transition-colors focus:border-[#0146cf]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              value={formData.address.neighborhood}
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, neighborhood: e.target.value } }))}
              className="transition-colors focus:border-[#0146cf]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
              className="transition-colors focus:border-[#0146cf]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Select
              value={formData.address.state}
              onValueChange={(value) => setFormData(prev => ({ ...prev, address: { ...prev.address, state: value } }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {UF.map((uf) => (
                  <SelectItem key={uf.id} value={uf.uf}>{uf.uf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
} 