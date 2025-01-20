"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ClientProcessForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Processo Existente</Label>
        <div className="flex gap-2">
          <Input placeholder="Digite o número do processo" />
          <Button>Buscar</Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            ou cadastre um novo processo
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="process-number">
              Nº Processo <span className="text-red-500">*</span>
            </Label>
            <Input id="process-number" placeholder="Digite o número do processo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instance">
              Instância <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a instância" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1ª Instância</SelectItem>
                <SelectItem value="2">2ª Instância</SelectItem>
                <SelectItem value="3">3ª Instância</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Processo
        </Button>
      </div>
    </div>
  )
} 