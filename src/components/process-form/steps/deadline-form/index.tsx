"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Calendar, Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface Deadline {
  id: string
  name: string
  date: string
  time: string
  responsible: string
  priority: string
}

const priorities = [
  { value: "baixa", label: "Baixa", color: "text-green-600" },
  { value: "media", label: "Média", color: "text-yellow-600" },
  { value: "alta", label: "Alta", color: "text-orange-600" },
  { value: "urgente", label: "Urgente", color: "text-red-600" }
]

export function DeadlineForm() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    { id: '1', name: '', date: '', time: '', responsible: '', priority: '' }
  ])

  const addDeadline = () => {
    setDeadlines([
      ...deadlines,
      { id: String(deadlines.length + 1), name: '', date: '', time: '', responsible: '', priority: '' }
    ])
  }

  const removeDeadline = (id: string) => {
    if (deadlines.length === 1) return
    setDeadlines(deadlines.filter(deadline => deadline.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'text-green-600'
      case 'media': return 'text-yellow-600'
      case 'alta': return 'text-orange-600'
      case 'urgente': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatDateTime = (date: string, time: string) => {
    if (!date) return ""
    const dateObj = new Date(`${date}T${time || '00:00'}`)
    return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR })
  }

  return (
    <div className="space-y-6">
      {deadlines.map((deadline, index) => (
        <div 
          key={deadline.id}
          className="rounded-lg border p-4 space-y-6 relative bg-white"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Prazo/Tarefa {index + 1}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "text-red-500 hover:text-red-600 hover:bg-red-50",
                deadlines.length === 1 && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => removeDeadline(deadline.id)}
              disabled={deadlines.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`name-${deadline.id}`}>
                Nome do Prazo/Tarefa <span className="text-red-500">*</span>
              </Label>
              <Input 
                id={`name-${deadline.id}`}
                placeholder="Ex: Audiência de Conciliação"
                value={deadline.name}
                onChange={(e) => {
                  setDeadlines(deadlines.map(d => 
                    d.id === deadline.id ? { ...d, name: e.target.value } : d
                  ))
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Data e Hora Fatal <span className="text-red-500">*</span></Label>
                {deadline.date && deadline.time && (
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(deadline.date, deadline.time)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline.date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {deadline.date ? (
                          format(new Date(deadline.date), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={deadline.date ? new Date(deadline.date) : undefined}
                        onSelect={(date) => {
                          setDeadlines(deadlines.map(d => 
                            d.id === deadline.id ? { 
                              ...d, 
                              date: date ? format(date, "yyyy-MM-dd") : '' 
                            } : d
                          ))
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="w-[140px]">
                  <div className="relative">
                    <Input
                      type="time"
                      value={deadline.time}
                      onChange={(e) => {
                        setDeadlines(deadlines.map(d => 
                          d.id === deadline.id ? { ...d, time: e.target.value } : d
                        ))
                      }}
                      className="pl-9"
                      placeholder="Hora"
                    />
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`responsible-${deadline.id}`}>Responsável</Label>
              <Input 
                id={`responsible-${deadline.id}`}
                placeholder="Nome do responsável"
                value={deadline.responsible}
                onChange={(e) => {
                  setDeadlines(deadlines.map(d => 
                    d.id === deadline.id ? { ...d, responsible: e.target.value } : d
                  ))
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`priority-${deadline.id}`}>Prioridade</Label>
              <Select
                value={deadline.priority}
                onValueChange={(value) => {
                  setDeadlines(deadlines.map(d => 
                    d.id === deadline.id ? { ...d, priority: value } : d
                  ))
                }}
              >
                <SelectTrigger>
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
        </div>
      ))}

      <Button
        type="button"
        className="w-full bg-[#0146cf] hover:bg-[#0146cf]/90 text-white"
        onClick={addDeadline}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Prazo/Tarefa
      </Button>
    </div>
  )
} 