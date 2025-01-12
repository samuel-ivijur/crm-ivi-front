import { useState } from 'react'
import { ProcessFormData } from '@/types/process'

const initialState: ProcessFormData = {
  processData: {
    status: true,
    cnjNumber: '',
    instance: '',
    value: '',
    alternativeNumber: '',
    distributionDate: '',
    distributionType: '',
    area: '',
    subject: '',
    extraSubject: '',
    state: '',
    county: '',
    court: '',
    courtSystem: ''
  },
  parties: [],
  deadlines: [],
  relatedProcesses: [],
  client: {
    isNewClient: true,
    qualification: ''
  }
}

export function useProcessForm() {
  const [formData, setFormData] = useState<ProcessFormData>(initialState)
  const [currentStep, setCurrentStep] = useState(1)

  const updateFormData = (step: keyof ProcessFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Implementar a lógica de envio do formulário
      console.log('Form submitted:', formData)
      return true
    } catch (error) {
      console.error('Error submitting form:', error)
      return false
    }
  }

  return {
    formData,
    currentStep,
    updateFormData,
    handleNext,
    handlePrevious,
    handleSubmit
  }
} 