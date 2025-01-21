"use client"

import { useState } from "react"
import { AtendimentosStats } from "@/components/comunicacao/atendimentos/atendimentos-stats"
import { AtendimentosChat } from "@/components/comunicacao/atendimentos/atendimentos-chat"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AtendimentosPage() {
  const [selectedMonth, setSelectedMonth] = useState("current")

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Atendimentos</h1>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mês Atual" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Mês Atual</SelectItem>
            <SelectItem value="previous">Mês Anterior</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <AtendimentosStats />
      <AtendimentosChat selectedMonth={selectedMonth} />
    </div>
  )
} 