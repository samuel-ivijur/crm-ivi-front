"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, X, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GetLitigation, litigationsService } from "@/services/api/litigations"
import { Party } from "@/types/parties"
import { adversePartyTypeOptions, PersonType, personTypeOptions } from "@/constants"
import CustomMaskedInput from "../masked-input"
import { toast } from "@/hooks/use-toast"
import PopConfirm from "../popconfirm"
import Image from "next/image";
import NoData from "@/assets/svg/nodata.svg"

interface PartiesTabProps {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
  invalidateLitigation: (id: string) => void
}

type PageParty = Party & {
  modified: boolean
}

export function PartiesTab({ data, isLoading: isLoadingLitigation, invalidateLitigation }: PartiesTabProps) {
  const [parties, setParties] = useState<PageParty[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (!data) return

    setParties(data.adverseParties.map((party) => ({
      id: party.id,
      name: party.name,
      document: party.document || "",
      personType: party.personType?.id,
      partyType: party.type.id,
      modified: false,
    })))
  }, [data])

  const addParty = () => {
    const partNotSaved = parties.find(party => party.id === 0)
    if (partNotSaved) {
      toast({
        title: "Atenção!",
        description: "Finalize a edição da parte selecionada antes de adicionar uma nova parte.",
        variant: "destructive",
      })
      return
    }
    const newParty: PageParty = {
      id: 0,
      name: "Parte",
      document: "",
      personType: undefined,
      partyType: undefined,
      modified: false,
    }
    setParties(prevParties => [...prevParties, newParty])
  }

  const updateParty = (id: number, field: keyof Party, value: string) => {
    setParties(prevParties => {
      const updatedParties = [...prevParties]
      const index = updatedParties.findIndex(party => party.id === id)
      if (index !== -1) {
        const updatedParty = { ...updatedParties[index], [field]: value, modified: true }
        if (field === 'personType' && +value === PersonType.PERSON) {
          updatedParty.document = String(updatedParty.document).replace(/\D/g, '').slice(0, 11)
        }
        updatedParties[index] = updatedParty
      }
      return updatedParties
    })
  }

  const handleCancel = (id: number) => {
    const originalPartyData = data?.adverseParties.find(party => party.id === id)
    if (originalPartyData) {
      setParties(prevParties => {
        const updatedParties = [...prevParties]
        const index = updatedParties.findIndex(party => party.id === originalPartyData.id)
        if (index !== -1) updatedParties[index] = {
          ...originalPartyData,
          personType: originalPartyData.personType?.id,
          partyType: originalPartyData.type.id,
          modified: false,
        }
        return updatedParties
      })
    }
  }

  const validateParty = (party: PageParty): boolean => {
    if (!data || !party) {
      toast({
        title: "Erro ao salvar a parte!",
        description: "Não foi possível salvar a parte. Tente novamente mais tarde.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSave = async (party: PageParty) => {
    try {
      if (!validateParty(party)) return
      if (!party.partyType || !party.personType || !party.name) {
        toast({
          title: "Atenção!",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return false
      }

      setIsSaving(true)
      if (party.id) {
        await litigationsService.removeAdverseParty({
          id: data!.id,
          idAdverseParty: party.id,
          idOrganization: data!.organization.id,
        })
        invalidateLitigation(data!.id)
      }
      await litigationsService.addAdverseParty({
        idLitigation: data!.id,
        idOrganization: data!.organization.id,
        adverseParty: {
          name: party.name,
          document: party.document || '',
          idType: +party.partyType,
          idPersonType: party.personType ? +party.personType : PersonType.PERSON,
        },
      })
      invalidateLitigation(data!.id)
      toast({
        title: "Sucesso!",
        description: "A parte foi salva com sucesso.",
      })
    }
    catch (error) {
      toast({
        title: "Erro ao salvar a parte!",
        description: "Não foi possível salvar a parte. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
    finally {
      setIsSaving(false)
    }
  }

  const handleRemoveParty = async (party: PageParty) => {
    try {
      if (!validateParty(party)) return

      setIsRemoving(true)
      if (party.id) {
        await litigationsService.removeAdverseParty({
          id: data!.id,
          idAdverseParty: party.id,
          idOrganization: data!.organization.id,
        })
        invalidateLitigation(data!.id)
      }
      setParties(prevParties => prevParties.filter(p => p.id !== party.id))
      toast({
        title: "Sucesso!",
        description: "A parte foi removida com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover a parte!",
        description: "Não foi possível remover a parte. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="space-y-6">
      {(data?.adverseParties || []).length > 0 ? (
        <>
          {parties.map(party => (
            <div className="space-y-4 rounded-lg border p-4 w-full" key={party.id}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Parte Selecionada</h3>
                <PopConfirm
                  title="Deseja realmente excluir a parte?"
                  onConfirm={() => handleRemoveParty(party)}
                  autoConfirm={party.id === 0 && !party.modified}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    disabled={isSaving}
                    loading={isRemoving}
                  >
                    <Trash2 className="h-4 w-4" /> Remover
                  </Button>
                </PopConfirm>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`name-${party.id}`}>
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`name-${party.id}`}
                    placeholder="Nome da parte"
                    value={party.name}
                    onChange={(e) => updateParty(party.id, 'name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {((party.personType && +party.personType) || PersonType.PERSON) === PersonType.PERSON ? (
                    <>
                      <Label htmlFor={`document-${party.id}-${PersonType.PERSON}`}>
                        CPF
                      </Label>
                      <CustomMaskedInput
                        id={`document-${party.id}-${PersonType.PERSON}`}
                        key={`document-${party.id}-${PersonType.PERSON}`}
                        mask="111.111.111-11"
                        placeholder="___.___.___-__"
                        value={party.document || ''}
                        onChange={(e) => updateParty(party.id, 'document', e.target.value)}
                        placeholderChar="_"
                        disabled={!party.personType}
                      />
                    </>
                  ) : (
                    <>
                      <Label htmlFor={`document-${party.id}-${PersonType.COMPANY}`}>
                        CNPJ
                      </Label>
                      <CustomMaskedInput
                        id={`document-${party.id}-${PersonType.COMPANY}`}
                        key={`document-${party.id}-${PersonType.COMPANY}`}
                        mask="11.111.111/1111-11"
                        placeholder="__.___.___/____-__"
                        value={party.document || ''}
                        onChange={(e) => updateParty(party.id, 'document', e.target.value)}
                        placeholderChar="_"
                        disabled={!party.personType}
                      />
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`person-type-${party.id}`}>
                    Tipo de pessoa <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={party.personType?.toString()}
                    onValueChange={(value) => updateParty(party.id, 'personType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {personTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`party-type-${party.id}`}>
                    Tipo de parte <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={party.partyType?.toString()}
                    onValueChange={(value) => updateParty(party.id, 'partyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo da parte" />
                    </SelectTrigger>
                    <SelectContent>
                      {adversePartyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {
                  party.id !== 0 &&
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(party.id)}
                    disabled={!party.modified}> <X size={16} className="mr-2"
                    />
                    Cancelar edição
                  </Button>
                }
                <Button
                  variant="default"
                  onClick={() => handleSave(party)}
                  disabled={!party.modified || isRemoving}
                  loading={isSaving}
                > <Save size={16} className="mr-2" /> Salvar</Button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Image src={NoData} alt="No data" />
          <p className="text-sm text-gray-500">Nenhuma parte adicionada</p>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={addParty} className="w-full">
          <Plus className="w-4 h-4" />
          Adicionar parte
        </Button>
      </div>
    </div>
  )
} 