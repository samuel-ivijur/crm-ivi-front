"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { instanciaOptions } from "@/lib/constants/instancia-types"
import { Label } from "@/components/ui/label"

export function DetailsTab() {
  return (
    <div className="space-y-4">
      {/* ... outros campos ... */}
      <div className="space-y-2">
        <Label htmlFor="instance">Instância</Label>
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