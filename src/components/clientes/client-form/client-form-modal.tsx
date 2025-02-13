"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ClientFormStepper } from "./client-form-stepper"
import { ClientDataForm } from "./steps/client-data-form"
import { ClientProcessForm } from "./steps/client-process-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PopConfirm from "@/components/popconfirm"
import { LitigationParams, litigationsService } from "@/services/api/litigations"
import { beneficiariesService } from "@/services/api/beneficiaries"
import { PersonType } from "@/constants"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Litigation = {
  id: string
  processNumber: string
  instance: number
}

export interface FormData {
  name: string
  document: string
  email: string
  phone: string
  birthDate: string
  type?: number
  status: boolean
  communicate: boolean
  nick?: string
  address: {
    cep: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }
  litigations: Litigation[]
}

type StepId = "step-1" | "step-2"

interface Step {
  id: StepId
  name: string
  fields: string[]
}

const steps: Step[] = [
  {
    id: "step-1",
    name: "Dados do Cliente",
    fields: ["name", "document", "email", "phone", "birthDate", "type", "address"]
  },
  {
    id: "step-2",
    name: "Vincular Processo",
    fields: ["processNumber", "instance"]
  }
]

const initialLitigationRegister: LitigationParams = {
  processNumber: "",
  instance: 0,
  caseCover: {},
}
const initialFormData: FormData = {
  name: '',
  document: '',
  email: '',
  phone: '',
  birthDate: '',
  type: undefined,
  status: true,
  communicate: false,
  nick: undefined,
  address: {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  },
  litigations: []
}
export function ClientFormModal({ open, onOpenChange }: ClientFormModalProps) {
  const { getSelectedOrganization } = useAuth()
  const [currentStep, setCurrentStep] = useState<StepId>("step-1")
  const [loading, setLoading] = useState<"search" | "register" | "finish" | null>(null)
  const [isNewProcess, setIsNewProcess] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [litigationRegister, setLitigationRegister] = useState<LitigationParams>(initialLitigationRegister)
  const [litigationRegisterErrors, setLitigationRegisterErrors] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])

  const validate = (): boolean => {
    const newErrors: string[] = []
    if (currentStep === "step-1") {
      if (!formData.name) {
        newErrors.push("name")
      }
      if (!formData.type) {
        newErrors.push("type")
      }
    }
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (!validate()) return

    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setLitigationRegister(initialLitigationRegister)
    setLitigationRegisterErrors({})
    setIsNewProcess(false)
    setCurrentStep("step-1")
  }

  const handleFinish = async () => {
    try {
      console.log("Form submitted", formData)
      setLoading("finish")
      const { id } = await beneficiariesService.save({
        idOrganization: getSelectedOrganization(),
        name: formData.name,
        document: formData.document || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        idType: formData.type || PersonType.PERSON,
        birthDate: formData.birthDate || undefined,
      })
      await Promise.all(formData.litigations.map(async (litigation) => {
        await litigationsService.saveLitigationBeneficiary({
          idOrganization: getSelectedOrganization(),
          idLitigation: litigation.id,
          idBeneficiary: id,
          idQualification: formData.type || PersonType.PERSON,
          communicate: formData.communicate,
          nick: formData.nick || '',
        })
      }))
      toast({
        title: "Finalizado com sucesso",
        description: "O cliente foi registrado com sucesso",
        variant: "success"
      })
      setLoading(null)
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error saving beneficiary", error)
      toast({
        title: "Erro ao registrar cliente",
        description: "Por favor, tente novamente",
        variant: "destructive"
      })
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Cadastro de Cliente</DialogTitle>
        </DialogHeader>

        <ClientFormStepper
          steps={steps}
          currentStep={currentStep}
        />

        <div className="mt-6">
          {currentStep === "step-1" && (
            <div className="space-y-8">
              <div className="flex items-center justify-start gap-8 border-b pb-4">
                <div className="space-y-2">
                  <span className="block text-sm font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formData.status ? "Ativo" : "Inativo"}
                    </span>
                    <Switch
                      id="active"
                      checked={formData.status}
                      onCheckedChange={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                    />
                  </div>
                </div>

                {formData.status && (
                  <div className="flex items-center gap-8">
                    <div className="space-y-2">
                      <span className="block text-sm font-medium">Comunicação</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formData.communicate ? "Habilitada" : "Desabilitada"}
                        </span>
                        <Switch
                          id="communication"
                          checked={formData.communicate}
                          onCheckedChange={() => setFormData(prev => ({ ...prev, communicate: !prev.communicate }))}
                        />
                      </div>
                    </div>

                    {formData.communicate && (
                      <div className="space-y-2">
                        <Label htmlFor="identification" className="text-sm font-medium">
                          Como você quer ser identificado pelo cliente?
                        </Label>
                        <Input
                          id="identification"
                          value={formData.nick}
                          onChange={(e) => setFormData(prev => ({ ...prev, nick: e.target.value }))}
                          placeholder="Ex: Dr. João Souza ou Escritório Souza Advogados"
                          className="w-[400px] transition-colors focus:border-[#0146cf]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <ClientDataForm
                formData={formData}
                setFormData={setFormData}
                phoneRequired={formData.communicate}
                errors={errors}
              />
            </div>
          )}
          {currentStep === "step-2" && <ClientProcessForm
            setLoading={setLoading}
            loading={loading}
            litigationRegister={litigationRegister}
            setLitigationRegister={setLitigationRegister}
            litigationRegisterErrors={litigationRegisterErrors}
            setLitigationRegisterErrors={setLitigationRegisterErrors}
            isNewProcess={isNewProcess}
            setIsNewProcess={setIsNewProcess}
            formData={formData}
            setFormData={setFormData}
          />}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === steps[0].id}
          >
            Anterior
          </Button>
          {currentStep === steps[steps.length - 1].id ? (
            <PopConfirm
              title={isNewProcess ? "Há um registro de processo não finalizado" : "Finalizar registro do cliente?"}
              description={isNewProcess ? "Deseja finalizar e registrar o cliente?" : ""}
              onConfirm={handleFinish}
            >
              <Button className="bg-[#0146cf] hover:bg-[#0146cf]/90">
                Registrar cliente
              </Button>
            </PopConfirm>
          ) : (
            <Button onClick={handleNext} className="bg-[#0146cf] hover:bg-[#0146cf]/90">
              Próximo
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 