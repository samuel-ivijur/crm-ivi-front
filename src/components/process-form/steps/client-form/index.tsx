"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Search } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { tiposParteOptions } from "@/lib/constants/parte-types"

interface Client {
  id: number
  name: string
  email: string
  phone: string
}

// Simulação de dados de clientes
const mockClients: Client[] = [
  { id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 99999-9999" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", phone: "(11) 88888-8888" },
  { id: 3, name: "Pedro Oliveira", email: "pedro@email.com", phone: "(11) 77777-7777" },
]

// Função para formatar telefone
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return value
}

// Função para formatar CEP
const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// Função para formatar data
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

// Simulação de busca de clientes
const searchClients = async (searchTerm: string) => {
  // Aqui você implementaria a chamada real à API
  return mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  )
}

export function ClientForm() {
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

  const [useExistingClient, setUseExistingClient] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [openClientSearch, setOpenClientSearch] = useState(false)
  const [birthDate, setBirthDate] = useState('')

  // Estados para controlar os valores com máscara
  const [phone, setPhone] = useState('')
  const [cep, setCep] = useState('')

  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    city: '',
    state: ''
  })
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Client[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/\D/g, '')
    if (value.length <= 11) {
      value = formatPhone(value)
    }
    setPhone(value)
  }

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/\D/g, '')
    if (value.length <= 8) {
      value = formatCEP(value)
    }
    setCep(value)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/\D/g, '')
    if (value.length <= 8) {
      value = formatDate(value)
    }
    setBirthDate(value)
  }

  const fetchAddress = async () => {
    if (cep.length < 8) return

    setIsLoadingCep(true)
    try {
      const cleanCep = cep.replace(/\D/g, '')
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data: AddressData = await response.json()

      if (data.logradouro) {
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

  const handleSearch = async (value: string) => {
    setSearchTerm(value)
    if (!value) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchClients(value)
      setSearchResults(results)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setIsSearching(false)
    }
  }

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
            checked={useExistingClient}
            onCheckedChange={(checked) => {
              setUseExistingClient(checked)
              if (!checked) {
                setSelectedClient(null)
                setSearchTerm("")
              }
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-white space-y-6">
        {useExistingClient ? (
          <div className="space-y-4">
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
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qualification" className="font-medium">
                  Qualificação do cliente <span className="text-red-500">*</span>
                </Label>
                <Select name="qualification" required>
                  <SelectTrigger className="transition-colors focus:border-[#0146cf]">
                    <SelectValue placeholder="Selecione a qualificação" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposParteOptions.map((tipo) => (
                      <SelectItem
                        key={tipo.value}
                        value={tipo.value}
                      >
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identification" className="font-medium">
                  Como você quer ser identificado pelo cliente?
                </Label>
                <Input
                  id="identification"
                  placeholder="Escritório/Nome"
                  className="transition-colors focus:border-[#0146cf]"
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
                  className="transition-colors focus:border-[#0146cf]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium">
                  Celular <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  className="transition-colors focus:border-[#0146cf]"
                  maxLength={15}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification" className="font-medium">
                  Qualificação do cliente <span className="text-red-500">*</span>
                </Label>
                <Select name="qualification" required>
                  <SelectTrigger className="transition-colors focus:border-[#0146cf]">
                    <SelectValue placeholder="Selecione a qualificação" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposParteOptions.map((tipo) => (
                      <SelectItem
                        key={tipo.value}
                        value={tipo.value}
                      >
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identification">
                  Como você quer ser identificado pelo cliente?
                </Label>
                <Input id="identification" placeholder="Escritório/Nome" />
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
                    <Input
                      id="cep"
                      value={cep}
                      onChange={handleCEPChange}
                      placeholder="00000-000"
                      className="pr-8 transition-colors focus:border-[#0146cf]"
                      maxLength={9}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={fetchAddress}
                      disabled={cep.length < 9 || isLoadingCep}
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
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
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