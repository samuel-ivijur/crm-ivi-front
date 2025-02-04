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
  const [selectedParty, setSelectedParty] = useState<PageParty | null>(null)
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

  const handleSelectChange = (id: String) => {
    const party = parties.find(party => party.id === +id)
    if (!party) return toast({
      title: "Erro ao selecionar a parte!",
      description: "Não foi possível selecionar a parte. Tente novamente mais tarde.",
      variant: "destructive",
    })
    setSelectedParty(party)
  }

  const addParty = () => {
    const partNotSaved = parties.find(party => party.id === 0)
    if (partNotSaved) {
      toast({
        title: "Atenção!",
        description: "Finalize a edição da parte selecionada antes de adicionar uma nova parte.",
        variant: "destructive",
      })
      setSelectedParty(partNotSaved)
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
    setParties(prevParties => {
      const updatedParties = [...prevParties, newParty]
      setSelectedParty(newParty)
      return updatedParties
    })
  }

  const updateSelectedParty = (field: keyof Party, value: string) => {
    if (!selectedParty) return
    const updatedParty = { ...selectedParty, [field]: value, modified: true }
    if (field === 'personType' && +value === PersonType.PERSON) {
      updatedParty.document = String(updatedParty.document).replace(/\D/g, '').slice(0, 11)
    }
    setSelectedParty(updatedParty)
    setParties(prevParties => {
      const updatedParties = [...prevParties]
      const index = updatedParties.findIndex(party => party.id === updatedParty.id)
      if (index !== -1) updatedParties[index] = updatedParty
      return updatedParties
    })
  }

  const handleCancel = () => {
    const originalPartyData = data?.adverseParties.find(party => party.id === selectedParty?.id)
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
    setSelectedParty(null)
  }

  const validateParty = (): boolean => {
    if (!data || !selectedParty) {
      toast({
        title: "Erro ao salvar a parte!",
        description: "Não foi possível salvar a parte. Tente novamente mais tarde.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSave = async () => {
    try {
      if (!validateParty()) return
      if (!selectedParty?.partyType || !selectedParty?.personType || !selectedParty?.name) {
        toast({
          title: "Atenção!",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return false
      }

      setIsSaving(true)
      if (selectedParty!.id) {
        await litigationsService.removeAdverseParty({
          id: data!.id,
          idAdverseParty: selectedParty!.id,
          idOrganization: data!.organizationid,
        })
        invalidateLitigation(data!.id)
      }
      await litigationsService.addAdverseParty({
        idLitigation: data!.id,
        idOrganization: data!.organizationid,
        adverseParty: {
          name: selectedParty!.name,
          document: selectedParty?.document || '',
          idType: +selectedParty!.partyType!,
          idPersonType: selectedParty!.personType ? +selectedParty!.personType : PersonType.PERSON,
        },
      })
      invalidateLitigation(data!.id)
      setSelectedParty(null)
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

  const handleRemoveParty = async () => {
    try {
      if (!validateParty()) return

      setIsRemoving(true)
      if (selectedParty!.id) {
        await litigationsService.removeAdverseParty({
          id: data!.id,
          idAdverseParty: selectedParty!.id,
          idOrganization: data!.organizationid,
        })
        invalidateLitigation(data!.id)
      }
      else setParties(prevParties => prevParties.filter(party => party.id !== selectedParty?.id))
      setSelectedParty(null)
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
      <div className="flex items-center space-x-4">
        <Select
          onValueChange={handleSelectChange}
          value={selectedParty?.id !== undefined ? String(selectedParty?.id) : undefined}
          key={parties.length + (selectedParty?.id || 0).toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma parte" />
          </SelectTrigger>
          <SelectContent>
            {parties.length === 0 ? <SelectItem value="0" disabled>Nenhuma parte encontrada</SelectItem> : parties.map((party, index) => (
              <SelectItem key={party.id} value={party.id?.toString()}>
                {index + 1} - {party.name} {party.document && `- ${String(party.document).replace(/\D/g, '')}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="default"
          className="border-dashed"
          onClick={addParty}
          disabled={isSaving || isRemoving}
        >
          <Plus size={16} className="mr-2" /> Adicionar parte
        </Button>
      </div>

      {selectedParty ? (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Parte Selecionada</h3>
            <PopConfirm
              title="Deseja realmente excluir a parte?"
              onConfirm={handleRemoveParty}
              autoConfirm={selectedParty?.id === 0 && !selectedParty.modified}
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
              <Label htmlFor={`name-${selectedParty.id}`}>
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`name-${selectedParty.id}`}
                placeholder="Nome da parte"
                value={selectedParty.name}
                onChange={(e) => updateSelectedParty('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {((selectedParty.personType && +selectedParty.personType) || PersonType.PERSON) === PersonType.PERSON ? (
                <>
                  <Label htmlFor={`document-${selectedParty.id}-${PersonType.PERSON}`}>
                    CPF
                  </Label>
                  <CustomMaskedInput
                    id={`document-${selectedParty.id}-${PersonType.PERSON}`}
                    key={`document-${selectedParty.id}-${PersonType.PERSON}`}
                    mask="111.111.111-11"
                    placeholder="___.___.___-__"
                    value={selectedParty.document || ''}
                    onChange={(e) => updateSelectedParty('document', e.target.value)}
                    placeholderChar="_"
                    disabled={!selectedParty.personType}
                  />
                </>
              ) : (
                <>
                  <Label htmlFor={`document-${selectedParty.id}-${PersonType.COMPANY}`}>
                    CNPJ
                  </Label>
                  <CustomMaskedInput
                    id={`document-${selectedParty.id}-${PersonType.COMPANY}`}
                    key={`document-${selectedParty.id}-${PersonType.COMPANY}`}
                    mask="11.111.111/1111-11"
                    placeholder="__.___.___/____-__"
                    value={selectedParty.document || ''}
                    onChange={(e) => updateSelectedParty('document', e.target.value)}
                    placeholderChar="_"
                    disabled={!selectedParty.personType}
                  />
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`person-type-${selectedParty.id}`}>
                Tipo de pessoa <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedParty.personType?.toString()}
                onValueChange={(value) => updateSelectedParty('personType', value)}
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
              <Label htmlFor={`party-type-${selectedParty.id}`}>
                Tipo de parte <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedParty.partyType?.toString()}
                onValueChange={(value) => updateSelectedParty('partyType', value)}
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
              selectedParty.id !== 0 &&
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={!selectedParty.modified}> <X size={16} className="mr-2"
                />
                Cancelar edição
              </Button>
            }
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!selectedParty.modified || isRemoving}
              loading={isSaving}
            > <Save size={16} className="mr-2" /> Salvar</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border p-4 flex flex-col items-center justify-center">
          <Image src={NoData} alt="Nenhuma parte selecionada" width={200} height={200} />
          <p className="text-sm text-gray-500">Nenhuma parte selecionada</p>
        </div>
      )}
    </div>
  )
} 