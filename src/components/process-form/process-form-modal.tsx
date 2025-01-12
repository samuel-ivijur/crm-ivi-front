"use client"

import { useProcessForm } from '@/hooks/useProcessForm'
import { ProcessFormStepper } from './process-form-stepper'
import { ProcessDataForm, PartiesForm, DeadlinesForm, RelatedProcessesForm, ClientForm } from './steps'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProcessFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps = [
  {
    id: 1,
    title: "Dados do Processo",
    component: ProcessDataForm,
  },
  {
    id: 2,
    title: "Partes",
    component: PartiesForm,
  },
  {
    id: 3,
    title: "Prazos/Tarefas",
    component: DeadlinesForm,
  },
  {
    id: 4,
    title: "Processos Relacionados",
    component: RelatedProcessesForm,
  },
  {
    id: 5,
    title: "Cliente",
    component: ClientForm,
  },
]

export function ProcessFormModal({ open, onOpenChange }: ProcessFormModalProps) {
  const { currentStep, handleNext, handlePrevious, handleSubmit } = useProcessForm()

  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component

  const handleFinish = async () => {
    const success = await handleSubmit()
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Cadastro de Processo</DialogTitle>
        </DialogHeader>
        <ProcessFormStepper steps={steps} currentStep={currentStep} />
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