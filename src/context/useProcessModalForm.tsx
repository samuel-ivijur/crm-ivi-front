import { useState, createContext, useContext, ReactNode } from 'react'
import { LitigationParams, LitigationParamsClient, litigationsService } from '@/services/api/litigations';
import { LitigationStatus } from '@/constants';
import { DeadlinesForm, PartiesForm, ProcessDataForm, RelatedProcessesForm } from '@/components/process-form';
import { ClientForm } from '../components/process-form/steps';
import { AdversyParty } from '@/types/adversy-party';
import { RelatedProcess } from '@/types/process';
import { useAuth } from '@/hooks/useAuth';

type FormData = LitigationParams & { selectClient: boolean }
const initialState: FormData = {
  processNumber: '',
  instance: 0,
  idStatus: LitigationStatus.ACTIVE,
  caseCover: {},
  adverseParty: [],
  tasks: [],
  relatedProcesses: [],
  client: {
    name: '',
    phone: '',
    idQualification: 0
  },
  selectClient: false
}

interface ProcessModalFormContextProps {
  formData: FormData;
  currentStep: number;
  updateFormData: (step: keyof FormData, data: any) => void;
  updateCaseCover: (key: keyof FormData["caseCover"], data: any) => void;
  handleNext: () => boolean;
  handlePrevious: () => void;
  handleSubmit: () => Promise<boolean>;
  steps: {
    id: number;
    title: string;
    component: React.ComponentType<any>;
    validate: () => boolean;
  }[];
  errors: { [key: string]: string };
  resetForm: () => void;
}

export const ProcessModalFormContext = createContext<ProcessModalFormContextProps | undefined>(undefined);

export const ProcessFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { getSelectedOrganization } = useAuth()

  const steps = [
    {
      id: 1,
      title: "Dados do Processo",
      component: ProcessDataForm,
      validate: (): boolean => {
        const requiredFields: Array<keyof LitigationParams> = ['processNumber', 'instance']
        const newErrors: { [key: string]: string } = {}
        if (String(formData.processNumber).length < 25) {
          newErrors.processNumber = 'Número do processo inválido'
        }
        requiredFields.forEach(field => {
          !formData[field] && (newErrors[field] = 'Campo obrigatório')
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    },
    {
      id: 2,
      title: "Partes",
      component: PartiesForm,
      validate: () => {
        if (!formData.adverseParty) return true
        const requiredFields: Array<keyof Omit<AdversyParty, 'id'>> = ['name', 'idPersonType', 'idType']
        const newErrors: { [key: string]: string } = {}
        formData.adverseParty.forEach((party, index) => {
          requiredFields.forEach(field => {
            !party[field] && (newErrors[`${index}->${field}`] = 'Campo obrigatório')
          })
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    },
    {
      id: 3,
      title: "Prazos/Tarefas",
      component: DeadlinesForm,
      validate: () => true
    },
    {
      id: 4,
      title: "Processos Relacionados",
      component: RelatedProcessesForm,
      validate: () => {
        if (!formData.relatedProcesses) return true
        const requiredFields: Array<keyof Omit<RelatedProcess, 'id'>> = ['processNumber', 'instance']
        const newErrors: { [key: string]: string } = {}
        formData.relatedProcesses.forEach((process, index) => {
          requiredFields.forEach(field => {
            !process[field] && (newErrors[`${index}->${field}`] = 'Campo obrigatório')
          })
          if (String(process.processNumber).length < 25) {
            newErrors[`${index}->processNumber`] = 'Número do processo inválido'
          }
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    },
    {
      id: 5,
      title: "Cliente",
      component: ClientForm,
      validate: () => {
        const requiredFieldsRegister: Array<keyof LitigationParamsClient> = ['name', 'phone', 'idQualification']

        const newErrors: { [key: string]: string } = {}
        if (formData.selectClient && !formData.idClient) {
          newErrors.idClient = 'Campo obrigatório'
        } else if (!formData.selectClient) {
          if (String(formData?.client?.phone).replace(/\D/g, '').length < 10) {
            newErrors.phone = 'Número de telefone inválido'
          }
          requiredFieldsRegister.forEach(field => {
            !formData.client?.[field] && (newErrors[field] = 'Campo obrigatório')
          })
        }
        setErrors(newErrors)
        console.log(newErrors)
        return Object.keys(newErrors).length === 0
      }
    },
  ]

  const updateFormData = (key: keyof FormData, data: any) => {
    setFormData(prev => ({ ...prev, [key]: data }))
  };

  const updateCaseCover = (key: keyof FormData["caseCover"], data: any) => {
    setFormData(prev => ({ ...prev, caseCover: { ...prev.caseCover, [key]: data } }))
  }

  const handleNext = (): boolean => {
    if (!steps[currentStep - 1].validate()) return false
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      return true
    }
    return false
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!steps[currentStep - 1].validate()) return false

      await litigationsService.createLitigation({
        idOrganization: getSelectedOrganization(),
        litigations: [{
          ...formData,
          idClient: formData.selectClient ? formData.idClient : undefined,
          client: formData.selectClient ? undefined : formData.client,
        }]
      })

      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };

  const resetForm = () => {
    setFormData(initialState)
    setCurrentStep(1)
    setErrors({})
  }

  return (
    <ProcessModalFormContext.Provider
      value={{
        formData,
        currentStep,
        updateFormData,
        handleNext,
        handlePrevious,
        handleSubmit,
        updateCaseCover,
        steps,
        errors,
        resetForm
      }}>
      {children}
    </ProcessModalFormContext.Provider>
  );
};

export const useProcessForm = () => {
  const context = useContext(ProcessModalFormContext);
  if (!context) {
    throw new Error('useProcessForm must be used within a ProcessFormProvider');
  }
  return context;
};