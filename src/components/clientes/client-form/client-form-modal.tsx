"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ClientDataForm } from "./steps/client-data-form"
import { ClientProcessForm } from "./steps/client-process-form"
import { ClientFormStepper } from "./client-form-stepper"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps = [
  {
    id: 1,
    title: "Dados do Cliente",
    component: ClientDataForm,
  },
  {
    id: 2,
    title: "Vincular Processo",
    component: ClientProcessForm,
  },
]

export function ClientFormModal({ open, onOpenChange }: ClientFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    // Handle form submission
    console.log("Form submitted")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Cadastro de Cliente</DialogTitle>
        </DialogHeader>
        <ClientFormStepper steps={steps} currentStep={currentStep} />
        <div className="mt-6">
          {CurrentStepComponent && <CurrentStepComponent />}
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          {currentStep === steps.length ? (
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