"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function ClientDataForm() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome <span className="text-red-500">*</span>
          </Label>
          <Input id="name" placeholder="Digite o nome completo" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Telefone <span className="text-red-500">*</span>
          </Label>
          <Input id="phone" placeholder="(00) 00000-0000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">
            CPF/CNPJ <span className="text-red-500">*</span>
          </Label>
          <Input id="document" placeholder="000.000.000-00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">
            Tipo <span className="text-red-500">*</span>
          </Label>
          <Select>
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
          <Label>Status</Label>
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <span className="text-sm">Ativo</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Comunicação</Label>
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <span className="text-sm">Habilitada</span>
          </div>
        </div>
      </div>
    </div>
  )
} 