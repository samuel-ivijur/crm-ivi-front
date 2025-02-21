"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useProcessForm } from "@/context/useProcessModalForm"
import { AdversyParty } from "@/types/adversy-party"
import { adversePartyTypeOptions, PersonType, personTypeOptions } from "@/constants"
import CustomMaskedInput from "@/components/masked-input"
import { toast } from "@/hooks/use-toast"

export function PartiesForm() {
  const { formData, updateFormData, errors, steps, currentStep } = useProcessForm()
  const [parties, setParties] = useState<Omit<AdversyParty, 'id'>[]>(formData?.adverseParty || [])
  const validate = steps.find(step => step.id === currentStep)!.validate

  const addParty = () => {
    if (!validate()) {
      toast({
        title: 'Preencha os campos obrigatórios',
        variant: 'destructive'
      })
      return
    }

    setParties([
      ...parties,
      { name: '', document: '', idPersonType: 0, idType: 0 }
    ])
  }

  const removeParty = (index: number) => {
    const newParties = [...parties]
    newParties.splice(index, 1)
    setParties(newParties)
  }

  const handlePersonTypeChange = (index: number, value: string) => {
    const newParties = [...parties]
    newParties[index].idPersonType = parseInt(value)
    setParties(newParties)
  }

  const handleAdversePartyTypeChange = (index: number, value: string) => {
    const newParties = [...parties]
    newParties[index].idType = parseInt(value)
    setParties(newParties)
  }

  const handleDocumentChange = (index: number, value: string) => {
    const newParties = [...parties]
    newParties[index].document = value
    setParties(newParties)
  }

  const handleNameChange = (index: number, value: string) => {
    const newParties = [...parties]
    newParties[index].name = value
    setParties(newParties)
  }

  const getError = (index: number, field: string): string | null => {
    if (!errors[`${index}->${field}`]) return null
    return errors[`${index}->${field}`]
  }

  useEffect(() => {
    updateFormData('adverseParty', parties)
  }, [parties])

  return (
    <div className="space-y-6">
      {parties.map((party, index) => (
        <div
          key={index}
          className="rounded-lg border p-4 space-y-6 relative"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Parte {index + 1}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "text-red-500 hover:text-red-600 hover:bg-red-50"
              )}
              onClick={() => removeParty(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`name-${index}`}
                placeholder="Nome da parte"
                value={party.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className={cn(getError(index, 'name') ? 'border-red-500' : '')}
              />
              {getError(index, 'name') && <p className="text-red-500 text-sm">{getError(index, 'name')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`person-type-${index}`}>
                Tipo de pessoa <span className="text-red-500">*</span>
              </Label>
              <Select
                value={party.idPersonType ? party.idPersonType.toString() : ''}
                onValueChange={(value) => handlePersonTypeChange(index, value)}
              >
                <SelectTrigger
                  className={cn(getError(index, 'idPersonType') ? 'border-red-500' : '')}
                >
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {personTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError(index, 'idPersonType') && <p className="text-red-500 text-sm">{getError(index, 'idPersonType')}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`document-${index}`}>
                {party.idPersonType === PersonType.COMPANY ? 'CNPJ' : 'CPF'}
              </Label>
              {party.idPersonType === PersonType.COMPANY ?
                <CustomMaskedInput
                  id={`document-${index}`}
                  placeholder="00.000.000/0000-00"
                  onChangeValue={(value: string) => handleDocumentChange(index, value)}
                  value={party.document || ''}
                  mask="11.111.111/1111-11"
                />
                :
                <CustomMaskedInput
                  id={`document-${index}`}
                  placeholder="000.000.000-00"
                  value={party.document || ''}
                  mask="111.111.111-11"
                  onChangeValue={(value: string) => handleDocumentChange(index, value)}
                />
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor={`party-type-${index}`}>
                Tipo de parte <span className="text-red-500">*</span>
              </Label>
              <Select
                value={party.idType ? party.idType.toString() : ''}
                onValueChange={(value) => handleAdversePartyTypeChange(index, value)}
              >
                <SelectTrigger
                  className={cn(getError(index, 'idType') ? 'border-red-500' : '')}
                >
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {adversePartyTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError(index, 'idType') && <p className="text-red-500 text-sm">{getError(index, 'idType')}</p>}
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        className="w-full bg-[#0146cf] hover:bg-[#0146cf]/90 text-white"
        onClick={addParty}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar parte
      </Button>
    </div>
  )
} 