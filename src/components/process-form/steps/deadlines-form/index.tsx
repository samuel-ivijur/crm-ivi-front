"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Trash2, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react'
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface Deadline {
  id: number
  name: string
  responsible: string
  date: string
  time: string
  priority: string
  status: "Pendente" | "Concluído" | "Cancelado"
}

// Constantes para prioridades com cores
const priorities = [
  { value: "baixa", label: "Baixa", color: "text-green-600" },
  { value: "normal", label: "Normal", color: "text-yellow-600" },
  { value: "alta", label: "Alta", color: "text-orange-600" },
  { value: "urgente", label: "Urgente", color: "text-red-600" }
] as const

export function DeadlinesForm() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("08:00")

  const addDeadline = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (!selectedDate) return

    const newDeadline = {
      id: deadlines.length + 1,
      name: formData.get("name") as string,
      responsible: formData.get("responsible") as string,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      priority: formData.get("priority") as string,
      status: "Pendente" as const,
    }
    setDeadlines([...deadlines, newDeadline])
    e.currentTarget.reset()
    setSelectedDate(undefined)
    setSelectedTime("08:00")
  }

  const removeDeadline = (id: number) => {
    setDeadlines(deadlines.filter((deadline) => deadline.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addDeadline} className="rounded-lg border p-4 bg-white">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">
              Nome do Prazo/Tarefa <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name"
              name="name"
              placeholder="Ex: Audiência de Conciliação"
              className="transition-colors focus:border-[#0146cf]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">
              Data e Hora Fatal <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[180px] justify-start text-left font-normal transition-colors hover:border-[#0146cf] ${
                      !selectedDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>

              <div className="relative w-[90px]">
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="pl-8 transition-colors focus:border-[#0146cf]"
                  required
                />
                <Clock className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible" className="font-medium">
              Responsável
            </Label>
            <Input 
              id="responsible"
              name="responsible"
              placeholder="Nome do responsável"
              className="transition-colors focus:border-[#0146cf]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="font-medium">
              Prioridade
            </Label>
            <Select name="priority" defaultValue="normal">
              <SelectTrigger className="transition-colors focus:border-[#0146cf]">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem 
                    key={priority.value} 
                    value={priority.value}
                    className={priority.color}
                  >
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 bg-[#0146cf] hover:bg-[#0146cf]/90 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Prazo/Tarefa
        </Button>
      </form>

      {deadlines.length > 0 && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left font-medium">Nome do Prazo/Tarefa</th>
                <th className="py-3 px-4 text-left font-medium">Responsável</th>
                <th className="py-3 px-4 text-left font-medium">Data Fatal</th>
                <th className="py-3 px-4 text-left font-medium">Prioridade</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map((deadline) => (
                <tr key={deadline.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{deadline.name}</td>
                  <td className="py-3 px-4">{deadline.responsible}</td>
                  <td className="py-3 px-4">
                    {format(new Date(`${deadline.date}T${deadline.time}`), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={priorities.find(p => p.value === deadline.priority)?.color}>
                      {priorities.find(p => p.value === deadline.priority)?.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={
                      deadline.status === "Pendente" ? "text-yellow-600" :
                      deadline.status === "Concluído" ? "text-green-600" : "text-red-600"
                    }>
                      {deadline.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                      onClick={() => removeDeadline(deadline.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 