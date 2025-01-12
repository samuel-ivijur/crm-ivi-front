"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ClientForm() {
  const [isNewClient, setIsNewClient] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Informações do Cliente</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={!isNewClient}
            onCheckedChange={(checked) => setIsNewClient(!checked)}
          />
          <span className="text-sm">Selecionar Cliente</span>
        </div>
      </div>

      {isNewClient ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input id="name" placeholder="Digite o nome" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Celular <span className="text-red-500">*</span>
            </Label>
            <Input id="phone" placeholder="(__) _____-____" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@email.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">
              Qualificação do cliente <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a qualificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advogado">Advogado</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="parte">Parte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="identification">
              Como você quer ser identificado pelo cliente?
            </Label>
            <Input id="identification" placeholder="Escritório/Nome" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="select-client">
              Selecione o Cliente <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client1">Cliente 1</SelectItem>
                <SelectItem value="client2">Cliente 2</SelectItem>
                <SelectItem value="client3">Cliente 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">
              Qualificação do cliente <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a qualificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advogado">Advogado</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="parte">Parte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="identification">
              Como você quer ser identificado pelo cliente?
            </Label>
            <Input id="identification" placeholder="Escritório/Nome" />
          </div>
        </div>
      )}
    </div>
  )
} 