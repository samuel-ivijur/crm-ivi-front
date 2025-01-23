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
import { FormData } from "../client-form-modal"
import { Switch } from "@/components/ui/switch"

interface ClientDataFormProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  phoneRequired: boolean
}

export function ClientDataForm({ formData, setFormData, phoneRequired }: ClientDataFormProps) {
  const handleDocumentChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formattedValue = numbers.length <= 11 
      ? numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      : numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    setFormData(prev => ({ ...prev, document: formattedValue }))
  }

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formattedValue = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    setFormData(prev => ({ ...prev, phone: formattedValue }))
  }

  const handleDateChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formattedValue = numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
    setFormData(prev => ({ ...prev, birthDate: formattedValue }))
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
            className="transition-colors focus:border-[#0146cf]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">
            CPF/CNPJ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="document"
            value={formData.document}
            onChange={(e) => handleDocumentChange(e.target.value)}
            placeholder="Digite o CPF ou CNPJ"
            className="transition-colors focus:border-[#0146cf]"
            required
          />
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
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="(00) 00000-0000"
            className="transition-colors focus:border-[#0146cf]"
            required={phoneRequired}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="person-type">
            Tipo Pessoa <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pf">Pessoa Física</SelectItem>
              <SelectItem value="pj">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
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
                <SelectItem value="ac">AC</SelectItem>
                <SelectItem value="al">AL</SelectItem>
                <SelectItem value="ap">AP</SelectItem>
                <SelectItem value="am">AM</SelectItem>
                <SelectItem value="ba">BA</SelectItem>
                <SelectItem value="ce">CE</SelectItem>
                <SelectItem value="df">DF</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="go">GO</SelectItem>
                <SelectItem value="ma">MA</SelectItem>
                <SelectItem value="mt">MT</SelectItem>
                <SelectItem value="ms">MS</SelectItem>
                <SelectItem value="mg">MG</SelectItem>
                <SelectItem value="pa">PA</SelectItem>
                <SelectItem value="pb">PB</SelectItem>
                <SelectItem value="pr">PR</SelectItem>
                <SelectItem value="pe">PE</SelectItem>
                <SelectItem value="pi">PI</SelectItem>
                <SelectItem value="rj">RJ</SelectItem>
                <SelectItem value="rn">RN</SelectItem>
                <SelectItem value="rs">RS</SelectItem>
                <SelectItem value="ro">RO</SelectItem>
                <SelectItem value="rr">RR</SelectItem>
                <SelectItem value="sc">SC</SelectItem>
                <SelectItem value="sp">SP</SelectItem>
                <SelectItem value="se">SE</SelectItem>
                <SelectItem value="to">TO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
} 