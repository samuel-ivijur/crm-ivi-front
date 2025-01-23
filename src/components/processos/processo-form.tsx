"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { tiposParteOptions } from "@/lib/constants/parte-types"

interface ProcessoFormProps {
  // ... outras props existentes
}

export function ProcessoForm({ ...props }: ProcessoFormProps) {
  return (
    <div>
      {/* ... outros campos do formulário ... */}
      
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o tipo da parte" />
        </SelectTrigger>
        <SelectContent>
          {tiposParteOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ... resto do formulário ... */}
    </div>
  )
} 