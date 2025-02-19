"use client"

import { ProcessFormStepper } from './process-form-stepper'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProcessForm } from '@/context/useProcessModalForm'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useLitigation } from '@/hooks/useLitigations'

interface ProcessFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProcessFormModal({ open, onOpenChange }: ProcessFormModalProps) {
  const {
    currentStep,
    handleNext,
    handlePrevious,
    handleSubmit,
    steps,
    resetForm,
  } = useProcessForm()
  const { invalidateQuery } = useLitigation()
  const [isLoading, setIsLoading] = useState(false)

  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component

  const handleFinish = async () => {
    setIsLoading(true)
    const success = await handleSubmit()
    setIsLoading(false)
    if (!success) return toast({
      title: 'Há erros no formulário. Verifique os campos em destaque.',
      variant: 'destructive'
    })

    onOpenChange(false)
    toast({
      title: 'Formulário enviado com sucesso!',
      variant: 'default'
    })
    resetForm()
    setTimeout(() => {
      invalidateQuery()
    }, 1500)
  }

  const handleClickNext = () => {
    if (!handleNext()) {
      toast({
        title: 'Há erros no formulário. Verifique os campos em destaque.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full lg:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de Processo</DialogTitle>
        </DialogHeader>
        <ProcessFormStepper steps={steps} currentStep={currentStep} />
        <div className="mt-6">
          {CurrentStepComponent}
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
          >
            Anterior
          </Button>
          {currentStep === steps.length ? (
            <Button onClick={handleFinish} className="bg-[#0146cf] hover:bg-[#0146cf]/90" disabled={isLoading} loading={isLoading}>
              Concluir
            </Button>
          ) : (
            <Button onClick={handleClickNext} className="bg-[#0146cf] hover:bg-[#0146cf]/90" disabled={isLoading}>
              Próximo
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 