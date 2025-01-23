"use client"

import { Check } from 'lucide-react'

interface Step {
  id: string
  name: string
  fields: string[]
}

interface ClientFormStepperProps {
  steps: Step[]
  currentStep: string
}

export function ClientFormStepper({ steps, currentStep }: ClientFormStepperProps) {
  return (
    <div className="relative mt-6">
      <div className="absolute left-0 top-2/4 h-[1px] w-full -translate-y-2/4 bg-gray-200" />
      <div className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id
          const isCompleted = currentStep === "step-2" && step.id === "step-1"

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isCurrent || isCompleted ? "bg-[#0146cf]" : "bg-gray-200"
                }`}
              >
                <span className="text-sm font-medium text-white">
                  {isCompleted ? "✓" : step.id.split("-")[1]}
                </span>
              </div>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
} 