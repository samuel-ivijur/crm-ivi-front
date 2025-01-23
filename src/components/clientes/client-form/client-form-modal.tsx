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

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface FormData {
  name: string
  document: string
  email: string
  phone: string
  birthDate: string
  type: string
  address: {
    cep: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }
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

export function ClientFormModal({ open, onOpenChange }: ClientFormModalProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("step-1")
  const [formData, setFormData] = useState<FormData>({
    name: '',
    document: '',
    email: '',
    phone: '',
    birthDate: '',
    type: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    }
  })
  const [isActive, setIsActive] = useState(true)
  const [isCommunicationEnabled, setIsCommunicationEnabled] = useState(false)
  const [clientIdentification, setClientIdentification] = useState('')

  const handleNext = () => {
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

  const handleFinish = () => {
    console.log("Form submitted", formData)
    onOpenChange(false)
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
                      {isActive ? "Ativo" : "Inativo"}
                    </span>
                    <Switch
                      id="active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="space-y-2">
                    <span className="block text-sm font-medium">Comunicação</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {isCommunicationEnabled ? "Habilitada" : "Desabilitada"}
                      </span>
                      <Switch
                        id="communication"
                        checked={isCommunicationEnabled}
                        onCheckedChange={setIsCommunicationEnabled}
                      />
                    </div>
                  </div>

                  {isCommunicationEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="identification" className="text-sm font-medium">
                        Como você quer ser identificado pelo cliente?
                      </Label>
                      <Input
                        id="identification"
                        value={clientIdentification}
                        onChange={(e) => setClientIdentification(e.target.value)}
                        placeholder="Ex: Dr. João Souza ou Escritório Souza Advogados"
                        className="w-[300px] transition-colors focus:border-[#0146cf]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <ClientDataForm 
                formData={formData}
                setFormData={setFormData}
                phoneRequired={isCommunicationEnabled}
              />
            </div>
          )}
          {currentStep === "step-2" && <ClientProcessForm />}
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
            <Button onClick={handleFinish} className="bg-[#0146cf] hover:bg-[#0146cf]/90">
              Concluir
            </Button>
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