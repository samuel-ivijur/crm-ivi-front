import { DebounceCombobox } from "@/components/debounce-combo-box"
import CustomMaskedInput from "@/components/masked-input"
import PopConfirm from "@/components/popconfirm"
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "@/components/ui"
import { BeneficiaryQualificationOptions, PersonType, UF } from "@/constants"
import { BeneficiaryFormData } from "@/context/useProcessModalForm"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { addressService } from "@/services/api/address"
import { beneficiariesService } from "@/services/api/beneficiaries"
import { Search, Trash } from "lucide-react"
import { useEffect, useState } from "react"

interface ClientFormProps {
    index: number
    formData: BeneficiaryFormData
    updateBeneficiary: (index: number, field: keyof BeneficiaryFormData, value: any) => void
    errors: Record<string, string>
    removeBeneficiary: (index: number) => void
    isLoading?: boolean
}

const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
}

export const ClientForm = ({ index, formData, updateBeneficiary: updateBeneficiaries, errors, removeBeneficiary, isLoading }: ClientFormProps) => {
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<{ value: string, label: string } | null>(null)
    const { getSelectedOrganization } = useAuth();
    const [beneficiaryOptions, setBeneficiaryOptions] = useState<Array<{ value: string, label: string }>>([])
    const [cep, setCep] = useState('')
    const [address, setAddress] = useState({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    })
    const [isLoadingCep, setIsLoadingCep] = useState(false)

    const handleFetchBeneficiary = async (value: string, selectedBeneficiary: { value: string, label: string } | null): Promise<void> => {
        const idOrganization = getSelectedOrganization()
        const response = await beneficiariesService.findAll({
            idOrganization,
            searchTerm: value,
            limit: 10,
            page: 1
        })

        const newBeneficiaryOptions = response.beneficiaries.map((beneficiary) => ({
            value: beneficiary.id.toString(),
            label: `${beneficiary.name}${beneficiary.phone ? ` - ${beneficiary.phone}` : ''}`
        }))

        if (selectedBeneficiary && !newBeneficiaryOptions.some(option => option.value === selectedBeneficiary.value)) {
            newBeneficiaryOptions.unshift({
                value: selectedBeneficiary.value,
                label: selectedBeneficiary.label,
            })
        }

        setBeneficiaryOptions(newBeneficiaryOptions)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        value = value.replace(/\D/g, '')
        if (value.length <= 8) {
            value = formatDate(value)
        }
        updateBeneficiaries(index, "beneficiary", { ...formData.beneficiary, birthDate: value })
    }
    const fetchAddress = async () => {
        setIsLoadingCep(true)
        try {
            const cleanCep = cep.replace(/\D/g, '')
            const response = await addressService.getCep(cleanCep)
            if (response) {
                setAddress({
                    street: response.street,
                    number: address?.number || '',
                    complement: address?.complement || '',
                    neighborhood: response.neighborhood,
                    city: response.city,
                    state: response.state
                })
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error)
        } finally {
            setIsLoadingCep(false)
        }
    }

    const handleSelectBeneficiary = (value: string) => {
        const beneficiary = beneficiaryOptions.find(option => option.value === value)
        if (beneficiary) {
            setSelectedBeneficiary(beneficiary)
            updateBeneficiaries(index, "idClient", beneficiary.value)
        }
    }

    useEffect(() => {
        let selectedBeneficiary = formData.idClient ? { value: formData.idClient, label: `${formData.beneficiary?.name} - ${formData.beneficiary?.phone}` } : null
        selectedBeneficiary && setSelectedBeneficiary(selectedBeneficiary)

        setTimeout(() => {
            handleFetchBeneficiary('', selectedBeneficiary)
        }, 100)
    }, [])

    return (
        <div>
            {formData && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Cliente {index + 1}</h3>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="use-existing" className="text-sm text-muted-foreground">
                                Selecionar Cliente
                            </Label>
                            <Switch
                                id="use-existing"
                                checked={formData.selectClient}
                                onCheckedChange={(checked) => {
                                    updateBeneficiaries(index, "selectClient", checked)
                                }}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border pb-4 px-4 pt-2 bg-white">
                        <div className="flex justify-end">
                            <PopConfirm
                                title="Tem certeza que deseja remover o cliente?"
                                description="Esta ação não pode ser revertida."
                                onConfirm={async () => {
                                    removeBeneficiary(index)
                                }}
                            >
                                <Button variant="ghost" size="icon" disabled={isLoading}>
                                    <Trash className="w-4 h-4" style={{ color: '#dc3545' }} />
                                </Button>
                            </PopConfirm>
                        </div>
                        {formData.selectClient ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="select-client">
                                        Selecione o Cliente <span className="text-red-500">*</span>
                                    </Label>
                                    <DebounceCombobox
                                        id="idClient"
                                        fetchOptions={(value: string) => handleFetchBeneficiary(value, selectedBeneficiary)}
                                        options={beneficiaryOptions}
                                        className={cn(
                                            "w-full",
                                            errors[`idClient-${index}`] && "border-red-500"
                                        )}
                                        value={formData.idClient ? formData.idClient : null}
                                        setValue={handleSelectBeneficiary}
                                        buttonWidth="200px"
                                        placeholder="Selecione o cliente"
                                        inputPlaceholder="Digite o nome do cliente"
                                        emptyMessage="Nenhum cliente encontrado"
                                    />
                                    {errors[`idClient-${index}`] && <p className="text-red-500 text-sm">{errors[`idClient-${index}`]}</p>}
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="qualification" className="font-medium">
                                            Qualificação do cliente
                                        </Label>
                                        <Select
                                            name="qualification"
                                            value={formData.idQualification ? formData.idQualification.toString() : undefined}
                                            onValueChange={(value) => updateBeneficiaries(index, "idQualification", Number(value))}
                                            required
                                        >
                                            <SelectTrigger className={cn(
                                                "transition-colors focus:border-[#0146cf]",
                                                errors[`idQualification-${index}`] && "border-red-500"
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
                                        {errors[`idQualification-${index}`] && <p className="text-red-500 text-sm">{errors[`idQualification-${index}`]}</p>}
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
                                            onChange={(e) => updateBeneficiaries(index, "nick", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="font-medium">
                                            Nome <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Digite o nome"
                                            className={cn(
                                                "transition-colors focus:border-[#0146cf]",
                                                errors[`name-${index}`] && "border-red-500"
                                            )}
                                            value={formData.beneficiary?.name}
                                            onChange={(e) => updateBeneficiaries(index, "beneficiary", { ...formData.beneficiary, name: e.target.value })}
                                            required
                                        />
                                        {errors[`name-${index}`] && <p className="text-red-500 text-sm">{errors[`name-${index}`]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="font-medium">
                                            Celular
                                        </Label>
                                        <CustomMaskedInput
                                            id="phone"
                                            value={formData.beneficiary?.phone || ''}
                                            onChangeValue={(value: string) => updateBeneficiaries(index, "beneficiary", { ...formData.beneficiary, phone: value })}
                                            placeholder="(00) 00000-0000"
                                            className={cn(
                                                "transition-colors focus:border-[#0146cf]",
                                                errors[`phone-${index}`] && "border-red-500"
                                            )}
                                            required
                                            mask="(11) 11111-1111"
                                        />
                                        {errors[`phone-${index}`] && <p className="text-red-500 text-sm">{errors[`phone-${index}`]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="person-type">
                                            Tipo Pessoa <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.beneficiary?.idType ? String(formData.beneficiary?.idType) : undefined}
                                            onValueChange={(value) => updateBeneficiaries(index, "beneficiary", { ...formData.beneficiary, idType: Number(value) })}
                                        >
                                            <SelectTrigger
                                                className={`transition-colors focus:border-[#0146cf] ${errors[`type-${index}`] ? "border-red-500" : ""}`}
                                            >
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={String(PersonType.PERSON)}>Pessoa Física</SelectItem>
                                                <SelectItem value={String(PersonType.COMPANY)}>Pessoa Jurídica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors[`type-${index}`] && (
                                            <p className="text-red-500 text-sm">Tipo de pessoa é obrigatório</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {formData.beneficiary?.idType === PersonType.COMPANY ? (
                                            <>
                                                <Label htmlFor={`document-${PersonType.COMPANY}`}>
                                                    CNPJ
                                                </Label>
                                                <CustomMaskedInput
                                                    id={`document-${PersonType.COMPANY}`}
                                                    key={`document-${PersonType.COMPANY}`}
                                                    mask="11.111.111/1111-11"
                                                    value={formData.beneficiary?.document || ''}
                                                    onChangeValue={(value: string) => updateBeneficiaries(index, "beneficiary", { ...formData.beneficiary, document: String(value).replace(/\D/g, '') })}
                                                    className="transition-colors focus:border-[#0146cf]"
                                                    disabled={formData.beneficiary?.idType !== PersonType.COMPANY}
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
                                                    value={formData.beneficiary?.document || ''}
                                                    onChangeValue={(value: string) => updateBeneficiaries(index, "beneficiary", { ...formData.beneficiary, document: String(value).replace(/\D/g, '') })}
                                                    className="transition-colors focus:border-[#0146cf]"
                                                    disabled={formData.beneficiary?.idType !== PersonType.PERSON}
                                                />
                                            </>

                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="qualification" className="font-medium">
                                            Qualificação do cliente
                                        </Label>
                                        <Select
                                            name="qualification"
                                            value={formData.idQualification ? formData.idQualification.toString() : ''}
                                            onValueChange={(value) => updateBeneficiaries(index, "idQualification", Number(value))}
                                            required
                                        >
                                            <SelectTrigger className={cn(
                                                "transition-colors focus:border-[#0146cf]",
                                                errors[`idQualification-${index}`] && "border-red-500"
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
                                        {errors[`idQualification-${index}`] && <p className="text-red-500 text-sm">{errors[`idQualification-${index}`]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="identification">
                                            Como você quer ser identificado pelo cliente?
                                        </Label>
                                        <Input
                                            id="identification"
                                            placeholder="Escritório/Nome"
                                            value={formData.nick}
                                            onChange={(e) => updateBeneficiaries(index, "nick", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-medium">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@exemplo.com"
                                            className="transition-colors focus:border-[#0146cf]"
                                            value={formData.beneficiary?.email}
                                            onChange={(e) => updateBeneficiaries(index, "beneficiary", { ...formData.beneficiary, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birth-date" className="font-medium">
                                            Data de Nascimento
                                        </Label>
                                        <Input
                                            id="birth-date"
                                            value={formData.beneficiary?.birthDate}
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
                                                    onChangeValue={(value: string) => setCep(value)}
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
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}