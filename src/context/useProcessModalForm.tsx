import { useState, createContext, useContext, ReactNode } from 'react'
import { CaseCover, LitigationParamsClient, LitigationParamsTask, litigationsService, RelatedProcesses } from '@/services/api/litigations';
import { LitigationStatus } from '@/constants';
import { DeadlinesForm, PartiesForm, ProcessDataForm, RelatedProcessesForm } from '@/components/process-form';
import { ModalClientForm } from '../components/process-form/steps';
import { AdversyParty } from '@/types/adversy-party';
import { RelatedProcess } from '@/types/process';
import { useAuth } from '@/hooks/useAuth';
import { beneficiariesService } from '@/services/api/beneficiaries';

export type BeneficiaryFormData = {
  selectClient: boolean;
  idClient?: string;
  beneficiary?: LitigationParamsClient 
  idQualification?: number;
  nick?: string;
}
type FormData = {
  processNumber: string;
  instance: number;
  uf?: number;
  idStatus?: LitigationStatus;
  obs?: string;
  adverseParty?: Omit<AdversyParty, 'id'>[];
  caseCover: CaseCover
  tasks?: LitigationParamsTask[];
  relatedProcesses?: RelatedProcesses[];
  beneficiaries: BeneficiaryFormData[]
}
const initialState: FormData = {
  processNumber: '',
  instance: 0,
  idStatus: LitigationStatus.ACTIVE,
  caseCover: {},
  adverseParty: [],
  tasks: [],
  relatedProcesses: [],
  beneficiaries: []
}
interface Step {
  id: number;
  title: string;
  component: JSX.Element;
  validate: () => boolean;
}
interface ProcessModalFormContextProps {
  formData: FormData;
  currentStep: number;
  updateFormData: (step: keyof FormData, data: any) => void;
  addBeneficiary: () => void;
  removeBeneficiary: (index: number) => void;
  updateCaseCover: (key: keyof FormData["caseCover"], data: any) => void;
  handleNext: () => boolean;
  handlePrevious: () => void;
  handleSubmit: () => Promise<boolean>;
  steps: Step[];
  errors: { [key: string]: string };
  resetForm: () => void;
  updateBeneficiaries: (index: number, field: keyof BeneficiaryFormData, data: any) => void;
}

export const ProcessModalFormContext = createContext<ProcessModalFormContextProps | undefined>(undefined);

export const ProcessFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { getSelectedOrganization } = useAuth()

  const updateFormData = (key: keyof FormData, data: any) => {
    setFormData(prev => ({ ...prev, [key]: data }))
  };

  const steps: Step[] = [
    {
      id: 1,
      title: "Dados do Processo",
      component: <ProcessDataForm
        formData={formData}
        setFormData={updateFormData}
        errors={errors}
      />,
      validate: (): boolean => {
        const requiredFields: Array<keyof FormData> = ['processNumber', 'instance']
        const newErrors: { [key: string]: string } = {}
        if (String(formData.processNumber).replace(/\D/g, '').length < 20) {
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
      component: <PartiesForm />,
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
      component: <DeadlinesForm />,
      validate: () => true
    },
    {
      id: 4,
      title: "Processos Relacionados",
      component: <RelatedProcessesForm />,
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
      component: <ModalClientForm />,
      validate: () => {
        if (!formData.beneficiaries) return true

        const requiredFieldsRegister: Array<keyof LitigationParamsClient> = ['name']
        const newErrors: { [key: string]: string } = {}

        formData.beneficiaries?.forEach((beneficiary, index) => {
          if (beneficiary.selectClient && !beneficiary.idClient) {
            newErrors[`idClient-${index}`] = 'Campo obrigatório'
          } else if (!beneficiary.selectClient) {
            if (beneficiary.beneficiary?.phone && String(beneficiary.beneficiary?.phone).replace(/\D/g, '').length < 10) {
              newErrors[`phone-${index}`] = 'Número de telefone inválido'
            }
            requiredFieldsRegister.forEach(field => {
              !beneficiary.beneficiary?.[field] && (newErrors[`${field}-${index}`] = 'Campo obrigatório')
            })
          }
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    },
  ]

  const updateCaseCover = (key: keyof FormData["caseCover"], data: any) => {
    setFormData(prev => ({ ...prev, caseCover: { ...prev.caseCover, [key]: data } }))
  }

  const updateBeneficiaries = (index: number, field: keyof BeneficiaryFormData, data: any) => {
    const newBeneficiaries = Array.isArray(formData.beneficiaries) ? [...formData.beneficiaries] : []
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: data }
    setFormData(prev => ({ ...prev, beneficiaries: newBeneficiaries }))
  }

  const addBeneficiary = () => {
    if (!steps[currentStep - 1].validate()) return
    setFormData(prev => ({ ...prev, beneficiaries: [...prev.beneficiaries, { selectClient: true, idClient: undefined, beneficiary: undefined }] }))
  }

  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = Array.isArray(formData.beneficiaries) ? [...formData.beneficiaries] : []
    newBeneficiaries.splice(index, 1)
    setFormData(prev => ({ ...prev, beneficiaries: newBeneficiaries }))
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

      const { beneficiaries, ...litigation } = formData
      const { id: idLitigation } = await litigationsService.saveLitigation({
        idOrganization: getSelectedOrganization(),
        ...litigation
      })

      await Promise.all(beneficiaries.map(async (beneficiary) => {
        if (beneficiary.selectClient) {
          await litigationsService.saveLitigationBeneficiary({
            idOrganization: getSelectedOrganization(),
            idLitigation,
            idBeneficiary: beneficiary.idClient!,
            idQualification: beneficiary.idQualification!,
            nick: beneficiary.nick!,
            communicate: true
          })
        } else {
          const { id: idBeneficiary } = await beneficiariesService.save({
            idOrganization: getSelectedOrganization(),
            name: beneficiary.beneficiary?.name!,
            idType: beneficiary.beneficiary?.idType!,
            phone: beneficiary.beneficiary?.phone!,
            birthDate: beneficiary.beneficiary?.birthDate!,
            document: beneficiary.beneficiary?.document!,
            email: beneficiary.beneficiary?.email!,
          })
          await litigationsService.saveLitigationBeneficiary({
            idOrganization: getSelectedOrganization(),
            idLitigation,
            idBeneficiary,
            idQualification: beneficiary.idQualification!,
            nick: beneficiary.nick!,
            communicate: true,
          })
        }
      }))

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
        updateBeneficiaries,
        addBeneficiary,
        removeBeneficiary,
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