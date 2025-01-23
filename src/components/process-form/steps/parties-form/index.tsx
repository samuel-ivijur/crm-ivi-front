"use client"

import { useState } from "react"
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
import { tiposParteOptions } from "@/lib/constants/parte-types"

interface Party {
  id: string
  name: string
  document: string
  personType: string
  partyType: string
}

export function PartiesForm() {
  const [parties, setParties] = useState<Party[]>([
    { id: '1', name: '', document: '', personType: '', partyType: '' }
  ])

  const addParty = () => {
    setParties([
      ...parties,
      { id: String(parties.length + 1), name: '', document: '', personType: '', partyType: '' }
    ])
  }

  const removeParty = (id: string) => {
    if (parties.length === 1) return
    setParties(parties.filter(party => party.id !== id))
  }

  const handlePersonTypeChange = (id: string, value: string) => {
    setParties(parties.map(party => {
      if (party.id === id) {
        return { ...party, personType: value, document: '' }
      }
      return party
    }))
  }

  return (
    <div className="space-y-6">
      {parties.map((party, index) => (
        <div 
          key={party.id}
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
                "text-red-500 hover:text-red-600 hover:bg-red-50",
                parties.length === 1 && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => removeParty(party.id)}
              disabled={parties.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`name-${party.id}`}>
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input 
                id={`name-${party.id}`}
                placeholder="Nome da parte"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`person-type-${party.id}`}>
                Tipo de pessoa <span className="text-red-500">*</span>
              </Label>
              <Select
                value={party.personType}
                onValueChange={(value) => handlePersonTypeChange(party.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pf">Pessoa Física</SelectItem>
                  <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`document-${party.id}`}>
                {party.personType === 'pj' ? 'CNPJ' : 'CPF'}
              </Label>
              <Input 
                id={`document-${party.id}`}
                placeholder={party.personType === 'pj' ? '00.000.000/0000-00' : '000.000.000-00'}
                value={party.document}
                onChange={(e) => {
                  // Adicionar máscara de CPF/CNPJ aqui
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`party-type-${party.id}`}>
                Tipo de parte <span className="text-red-500">*</span>
              </Label>
              <Select
                value={party.partyType}
                onValueChange={(value) => {
                  setParties(parties.map(p => 
                    p.id === party.id ? { ...p, partyType: value } : p
                  ))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposParteOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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