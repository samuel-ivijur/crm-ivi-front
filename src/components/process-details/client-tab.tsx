import { GetLitigation, LitigationParams, litigationsService } from "@/services/api/litigations"
import { useEffect, useState } from "react"
import { Loader2, Save, X } from "lucide-react"
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "../ui"
import { useBeneficiary } from "@/hooks/useBeneficiary"
import { DebounceCombobox } from "../debounce-combo-box"
import { BeneficairyQualification, BeneficiaryQualificationLabels } from "@/constants"
import CustomMaskedInput from "../MaskedInput"
import PopConfirm from "../popconfirm"
import { Beneficiary } from "@/types/beneficiarie"
import { Skeleton } from "../ui/skeleton"
import { toast } from "@/hooks/use-toast"

interface ClientTabProps {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
  invalidateLitigation: (id: string) => void
}

export function ClientTab({ data, isLoading, invalidateLitigation }: ClientTabProps) {
  const [isNewClient, setIsNewClient] = useState(false)
  const [idBeneficiary, setIdBeneficiary] = useState<string | null>(null)
  const [idQualification, setIdQualification] = useState<number | null>(null)
  const [nick, setNick] = useState('')
  const [beneficiaryOptions, setBeneficiaryOptions] = useState<Array<{ value: string, label: string }>>([])

  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const { getBeneficiariesQuery, changeFilter } = useBeneficiary()

  const handleCancel = async () => {
    setIsNewClient(true)
  }

  const handleSave = async () => {
    if (!data) return
    setIsSaving(true)
    try {

      const params: Partial<LitigationParams> = {}
      if (isNewClient) {
        if (!newBeneficiary.name || !newBeneficiary.phone || !idQualification) {
          return toast({
            title: 'Erro ao salvar',
            description: 'Preencha todos os campos obrigatórios',
            variant: 'destructive',
          })
        }
        params.client = {
          name: newBeneficiary.name,
          phone: newBeneficiary.phone,
          idQualification: idQualification,
        }
      } else {
        if (!idBeneficiary) {
          return toast({
            title: 'Erro ao salvar',
            description: 'Selecione um cliente',
            variant: 'destructive',
          })
        }
        params.idClient = idBeneficiary || undefined
      }

      await litigationsService.editLitigation({
        id: data.id,
        idOrganization: data.organizationid,
        nick,
        ...params,
      })
      invalidateLitigation(data.id)
      toast({
        title: 'Sucesso',
        description: 'Dados do cliente salvos com sucesso',
      })
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar os dados do cliente',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFetchBeneficiary = async (value: string): Promise<void> => {
    const idOrganization = data!.organizationid
    changeFilter({ searchTerm: value, idOrganization })
  }

  const setInitialForm = async (): Promise<void> => {
    if (!data) return

    const exec = async () => {
      if (beneficiaryOptions.some(option => String(option.value) === String(data.idclient))) return
      setBeneficiaryOptions((prev) => [...prev, {
        value: data.idclient,
        label: `${data.clientname}${data.clientphone ? ` - ${data.clientphone}` : ''}`
      }])
      setIdBeneficiary(data.idclient)
      setIdQualification(+data.idqualification)
      setNick(data.nick)
    }

    setTimeout(exec, 1000)
  }

  useEffect(() => {
    setBeneficiaryOptions(getBeneficiariesQuery.data?.beneficiaries.map((beneficiary) => ({
      value: beneficiary.id.toString(),
      label: `${beneficiary.name}${beneficiary.phone ? ` - ${beneficiary.phone}` : ''}`
    })) || [])
  }, [getBeneficiariesQuery.data])

  useEffect(() => {
    setInitialForm()
  }, [data])

  const SelectQualification = () => {
    return (
      <>
        <Label htmlFor="qualification">
          Qualificação do cliente <span className="text-red-500">*</span>
        </Label>
        <Select value={idQualification?.toString()} onValueChange={(value) => setIdQualification(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a qualificação" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BeneficairyQualification).map((qualification) => (
              <SelectItem key={qualification} value={String(qualification)}>
                {BeneficiaryQualificationLabels[qualification]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    )
  }

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
      {isLoading ?
        <div className="h-full">
          <Skeleton className="h-[270px] w-full" />
          <div className="flex justify-end gap-2 mt-4">
            <Skeleton className="h-[40px] w-[100px]" />
            <Skeleton className="h-[40px] w-[100px]" />
          </div>
        </div> :
        <>
          {isNewClient ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Digite o nome"
                  value={newBeneficiary.name}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Celular <span className="text-red-500">*</span>
                </Label>
                <CustomMaskedInput
                  id="phone"
                  placeholder="(__) _____-____"
                  value={newBeneficiary.phone}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, phone: e.target.value })}
                  required
                  mask="(11) 11111-1111"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@email.com"
                  value={newBeneficiary.email}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <SelectQualification />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="identification">
                  Como você quer ser identificado pelo cliente?
                </Label>
                <Input
                  id="identification"
                  placeholder="Escritório/Nome"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                />
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
                <SelectQualification />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="identification2">
                  Como você quer ser identificado pelo cliente?
                </Label>
                <Input
                  id="identification2"
                  placeholder="Escritório/Nome"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <PopConfirm
              title="Deseja realmente cancelar?"
              description="Ao cancelar, você perderá todas as alterações feitas."
              onConfirm={handleCancel}
            >
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}> <X size={16} className="mr-2" /> Cancelar</Button>
            </PopConfirm>
            <PopConfirm
              title="Deseja realmente salvar?"
              description="Ao salvar, você perderá todas as alterações feitas."
              onConfirm={handleSave}
            >
              <Button variant="default" disabled={isSaving}> <Save size={16} className="mr-2" /> Salvar</Button>
            </PopConfirm>
          </div>
        </>
      }
    </div>
  )
} 