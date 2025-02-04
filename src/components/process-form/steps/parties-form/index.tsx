"use client"

import { useState } from "react"
import { Trash2 } from 'lucide-react'
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
import { Party } from "@/types/process"

export function PartiesForm() {
  const [parties, setParties] = useState<Party[]>([
    { id: 1, name: "", cnpj: "", personType: "", partyType: "" },
  ])

  const addParty = () => {
    const newParty = {
      id: parties.length + 1,
      name: "",
      cnpj: "",
      personType: "",
      partyType: "",
    }
    setParties([...parties, newParty])
  }

  const removeParty = (id: number) => {
    if (parties.length > 1) {
      setParties(parties.filter((party) => party.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {parties.map((party) => (
        <div key={party.id} className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Parte {party.id}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => removeParty(party.id)}
            >
              <Trash2 className="h-4 w-4" /> Remover
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`name-${party.id}`}>
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input id={`name-${party.id}`} placeholder="Nome da parte" />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`cnpj-${party.id}`}>CNPJ</Label>
              <Input id={`cnpj-${party.id}`} placeholder="__.___.___/____-__" />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`person-type-${party.id}`}>
                Tipo de pessoa <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de pessoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">Física</SelectItem>
                  <SelectItem value="juridica">Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`party-type-${party.id}`}>
                Tipo de parte <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo da parte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autor">Autor</SelectItem>
                  <SelectItem value="reu">Réu</SelectItem>
                  <SelectItem value="testemunha">Testemunha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={addParty}
      >
        + Adicionar parte
      </Button>
    </div>
  )
} 