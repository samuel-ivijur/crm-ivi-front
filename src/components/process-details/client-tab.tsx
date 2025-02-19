import { GetLitigation, litigationsService } from "@/services/api/litigations"
import { useEffect, useState } from "react"
import { Save, Plus, Loader2 } from "lucide-react"
import { Button } from "../ui"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { ClientForm } from "../process-form/steps/client-form/client-form"
import { BeneficiaryFormData } from "@/context/useProcessModalForm"
import { beneficiariesService } from "@/services/api/beneficiaries"

interface ClientTabProps {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
  invalidateLitigation: (id: string) => void
}

export function ClientTab({ data, isLoading, invalidateLitigation }: ClientTabProps) {
  const { getSelectedOrganization } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<Array<BeneficiaryFormData & { new: boolean }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUpdatingBeneficiary, setIsUpdatingBeneficiary] = useState(false)
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({})

  const updateBeneficiaries = (index: number, field: keyof BeneficiaryFormData, value: any) => {
    if (field === 'idClient') {
      const isBeneficiaryInserted = beneficiaries.some(beneficiary => beneficiary.idClient === value)
      if (isBeneficiaryInserted) {
        toast({
          title: 'Beneficiário já inserido',
          description: 'Por favor, insira um beneficiário diferente',
          variant: 'destructive'
        })
        return
      }
    }
    setBeneficiaries(prev => prev.map((beneficiary, i) => i === index ? { ...beneficiary, [field]: value } : beneficiary))
    setIsEditing(prev => ({ ...prev, [index]: true }))
  }

  const removeBeneficiary = async (index: number) => {
    setIsUpdatingBeneficiary(true)
    if (beneficiaries[index].new) {
      setBeneficiaries(prev => prev.filter((_, i) => i !== index))
    } else {
      await litigationsService.deleteLitigationBeneficiary({
        idOrganization: getSelectedOrganization(),
        idLitigation: data!.id,
        idBeneficiary: data!.beneficiaries[index].id
      })
      invalidateLitigation(data!.id)
    }
    setIsUpdatingBeneficiary(false)
  }

  const addBeneficiary = () => {
    if (!validateBeneficiaries()) {
      toast({
        title: 'Complete os campos obrigatórios',
        description: 'Por favor, verifique os campos obrigatórios',
        variant: 'destructive'
      })
      return
    }

    setIsEditing(prev => ({ ...prev, [beneficiaries.length]: true }))
    setBeneficiaries(prev => [...prev, {
      new: true,
      selectClient: true,
      idClient: '',
      beneficiary: { name: '', phone: '', email: '', birthDate: '', document: '', address: { street: '', number: '', complement: '', neighborhood: '' } },
    }])
  }

  const validateBeneficiaries = (index?: number) => {
    const newErrors: Record<string, string> = {}
    const validateBeneficiary = (beneficiary: BeneficiaryFormData & { new: boolean }, index: number) => {
      if (beneficiary.selectClient) {
        if (!beneficiary.idClient) {
          newErrors[`idClient-${index}`] = 'Campo obrigatório'
        }
      } else {
        if (!beneficiary.beneficiary?.name) {
          newErrors[`name-${index}`] = 'Campo obrigatório'
        }
        if (!beneficiary.beneficiary?.idType) {
          newErrors[`idType-${index}`] = 'Campo obrigatório'
        }
      }
    }
    if (index !== undefined) {
      validateBeneficiary(beneficiaries[index], index)
    } else {
      beneficiaries.forEach((beneficiary, index) => validateBeneficiary(beneficiary, index))
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveBeneficiary = async (index: number): Promise<string> => {
    const { id } = await beneficiariesService.save({
      idOrganization: getSelectedOrganization(),
      name: beneficiaries[index].beneficiary?.name!,
      idType: beneficiaries[index].beneficiary?.idType!,
      phone: beneficiaries[index].beneficiary?.phone! || undefined,
      email: beneficiaries[index].beneficiary?.email! || undefined,
      birthDate: beneficiaries[index].beneficiary?.birthDate! || undefined,
      document: beneficiaries[index].beneficiary?.document! || undefined,
    })
    return id
  }

  const saveLitigationBeneficiary = async (index: number) => {
    const idBeneficiary = beneficiaries[index].selectClient ? beneficiaries[index].idClient! : await saveBeneficiary(index)
    await litigationsService.saveLitigationBeneficiary({
      idOrganization: getSelectedOrganization(),
      idLitigation: data!.id,
      communicate: true,
      idBeneficiary,
      idQualification: beneficiaries[index].idQualification!,
      nick: beneficiaries[index].nick
    })
  }

  const updateLitigationBeneficiary = async (index: number) => {
    const currentBeneficiary = data!.beneficiaries[index]

    await litigationsService.deleteLitigationBeneficiary({
      idOrganization: getSelectedOrganization(),
      idLitigation: data!.id,
      idBeneficiary: currentBeneficiary.id,
    })
    await saveLitigationBeneficiary(index)
  }

  const handleSave = async (index: number) => {
    try{

      if (!validateBeneficiaries(index)) return
      
      beneficiaries[index].new ? await saveLitigationBeneficiary(index) : await updateLitigationBeneficiary(index)
      setIsEditing(prev => ({ ...prev, [index]: false }))
      
      const msg = beneficiaries[index].new ? 'adicionado' : 'atualizado'
      toast({
        title: 'Finalizado',
        description: `O beneficiário foi ${msg} com sucesso`,
        variant: 'success'
      })
      invalidateLitigation(data!.id)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o beneficiário',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    if (data?.beneficiaries) {
      setBeneficiaries(data.beneficiaries.map(beneficiary => ({
        new: false,
        selectClient: true,
        idClient: beneficiary.id,
        beneficiary: {
          name: '',
          phone: '',
          email: '',
          birthDate: '',
          document: '',
          address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
          },
        },
        idQualification: beneficiary.qualification.id,
        nick: beneficiary.nick
      })))
    }
  }, [data])

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {beneficiaries.length === 0 && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Nenhum beneficiário adicionado
              </p>
            </>
          )}
          {beneficiaries.map((beneficiary, index) => (
            <>
              <ClientForm
                key={index}
                index={index}
                formData={beneficiary}
                updateBeneficiary={updateBeneficiaries}
                errors={errors}
                removeBeneficiary={removeBeneficiary}
                isLoading={isUpdatingBeneficiary}
              />
              {isEditing[index] && (
                <div style={{ marginBottom: '40px' }}>
                  <Button onClick={() => handleSave(index)}>
                    <Save /> Salvar Beneficiário
                  </Button>
                </div>
              )}
            </>
          ))}
          <div className="flex" style={{ marginTop: '50px' }}>
            <Button onClick={addBeneficiary} variant="outline" className="w-full">
              <Plus /> Adicionar Beneficiário
            </Button>

          </div>
        </div>
      )}
    </>
  )
} 