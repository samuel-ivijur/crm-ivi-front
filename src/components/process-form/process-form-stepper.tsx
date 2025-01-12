import { Check } from 'lucide-react'

interface Step {
  id: number
  title: string
  component: React.ComponentType
}

interface ProcessFormStepperProps {
  steps: Step[]
  currentStep: number
}

export function ProcessFormStepper({ steps, currentStep }: ProcessFormStepperProps) {
  return (
    <div className="relative mt-4">
      <div className="absolute left-0 top-4 h-[2px] w-full -translate-y-1/2 bg-gray-200" />
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold
                  ${
                    isCompleted
                      ? "border-gray-400 bg-gray-400 text-white"
                      : isCurrent
                      ? "border-[#0146cf] bg-[#0146cf] text-white"
                      : "border-gray-300 bg-white text-gray-300"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span
                className={`text-sm
                  ${
                    isCompleted || isCurrent
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                `}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
} 