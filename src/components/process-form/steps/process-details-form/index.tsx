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
import { instanciaOptions } from "@/lib/constants/instancia-types"

export function ProcessDetailsForm() {
  return (
    <div className="space-y-4">
      {/* ... outros campos ... */}
      <div className="space-y-2">
        <Label htmlFor="instance">
          Instância <span className="text-red-500">*</span>
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a instância" />
          </SelectTrigger>
          <SelectContent>
            {instanciaOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* ... outros campos ... */}
    </div>
  )
} 