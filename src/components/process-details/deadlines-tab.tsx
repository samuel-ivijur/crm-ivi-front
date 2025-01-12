"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock, Eye, Trash2, Edit2, Check, X, Plus } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Deadline {
  id: number
  name: string
  responsible: string
  date: Date
  priority: string
  status: "Pendente" | "Concluído" | "Cancelado"
}

export function DeadlinesTab() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    {
      id: 1,
      name: "Audiência de Conciliação",
      responsible: "-",
      date: new Date("2025-01-20T08:00:00"),
      priority: "Urgente",
      status: "Pendente"
    }
  ])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("08:00")

  const addDeadline = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (!selectedDate) return

    const newDate = new Date(selectedDate)
    const [hours, minutes] = selectedTime.split(':')
    newDate.setHours(parseInt(hours), parseInt(minutes))

    const newDeadline = {
      id: deadlines.length + 1,
      name: formData.get("name") as string,
      responsible: formData.get("responsible") as string,
      date: newDate,
      priority: formData.get("priority") as string,
      status: "Pendente" as const,
    }
    setDeadlines([...deadlines, newDeadline])
    e.currentTarget.reset()
    setSelectedDate(undefined)
    setSelectedTime("08:00")
  }

  const updateDeadlineStatus = (id: number, status: "Pendente" | "Concluído" | "Cancelado") => {
    setDeadlines(deadlines.map(deadline => 
      deadline.id === id ? { ...deadline, status } : deadline
    ))
  }

  const removeDeadline = (id: number) => {
    setDeadlines(deadlines.filter((deadline) => deadline.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prazos e Tarefas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addDeadline} className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label htmlFor="name">
              Nome do Prazo/Tarefa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome do prazo/tarefa"
              required
            />
          </div>

          <div className="space-y-2 w-[280px]">
            <Label htmlFor="date">
              Data Fatal <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[180px] justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <div className="relative w-[90px]">
                <Input
                  type="text"
                  value={selectedTime}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length > 4) value = value.slice(0, 4)
                    const hours = value.slice(0, 2)
                    const minutes = value.slice(2, 4)
                    
                    if (parseInt(hours) > 23) value = '23' + minutes
                    if (parseInt(minutes) > 59) value = hours + '59'
                    
                    const formatted = value.padEnd(4, '0')
                    setSelectedTime(`${formatted.slice(0, 2)}:${formatted.slice(2, 4)}`)
                  }}
                  className="pl-8"
                  placeholder="00:00"
                />
                <Clock className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2 w-[200px]">
            <Label htmlFor="responsible">Responsável</Label>
            <Input
              id="responsible"
              name="responsible"
              placeholder="Digite o responsável"
            />
          </div>

          <div className="space-y-2 w-[180px]">
            <Label htmlFor="priority">Prioridade</Label>
            <Select name="priority" defaultValue="normal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="bg-[#0146cf] hover:bg-[#0146cf]/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </form>

        {deadlines.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </TableHead>
                  <TableHead>Nome do Prazo/Tarefa</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data Fatal</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deadlines.map((deadline) => (
                  <TableRow key={deadline.id}>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </TableCell>
                    <TableCell>{deadline.name}</TableCell>
                    <TableCell>{deadline.responsible}</TableCell>
                    <TableCell>
                      {format(deadline.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          deadline.priority === "urgente"
                            ? "border-red-500 text-red-500"
                            : deadline.priority === "alta"
                            ? "border-orange-500 text-orange-500"
                            : deadline.priority === "normal"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-green-500 text-green-500"
                        }
                      >
                        {deadline.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          deadline.status === "Pendente"
                            ? "border-yellow-500 text-yellow-500"
                            : deadline.status === "Concluído"
                            ? "border-green-500 text-green-500"
                            : "border-red-500 text-red-500"
                        }
                      >
                        {deadline.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizar</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:text-[#0146cf]">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-green-600"
                                onClick={() => updateDeadlineStatus(deadline.id, "Concluído")}
                                disabled={deadline.status === "Concluído"}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Concluir</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-red-600"
                                onClick={() => updateDeadlineStatus(deadline.id, "Cancelado")}
                                disabled={deadline.status === "Cancelado"}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cancelar</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-red-600"
                                onClick={() => removeDeadline(deadline.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 