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
import { GetLitigation } from "@/services/api/litigations"
import { useEffect } from "react"
import { TaskPriorities, TaskPriorityColors, TaskPriorityLabels, TaskStatus, TaskStatusColors, TaskStatusLabels } from "@/constants"
import { toast } from "@/hooks/use-toast"
import { TaskService } from "@/services/api/tasks"
import { Skeleton } from "../ui/skeleton"
import PopConfirm from "../popconfirm"

interface Deadline {
  id: number
  name: string
  idResponsible?: number
  date: Date
  idPriority: number
  idStatus: number
}

interface DeadlinesTabProps {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
  invalidateLitigation: (id: string) => void
}

export function DeadlinesTab({ data, isLoading, invalidateLitigation }: DeadlinesTabProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("08:00")
  const [name, setName] = useState("")
  const [responsible, setResponsible] = useState("")
  const [idPriority, setIdPriority] = useState(TaskPriorities.WithoutPriority)

  const addDeadline = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      if (!data) throw new Error()

      if (!selectedDate || !name) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }

      const newDate = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(':')
      newDate.setHours(parseInt(hours), parseInt(minutes))

      await TaskService.save({
        idLitigationLink: data.id,
        idOrganization: data.organizationid,
        title: name,
        deadline: newDate.toISOString(),
        idPriority,
        idResponsible: responsible ? parseInt(responsible) : undefined,
      })
      invalidateLitigation(data.id)
      setSelectedDate(undefined)
      setSelectedTime("08:00")
    } catch (error) {
      console.log(error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o prazo/tarefa",
        variant: "destructive",
      })
    }
  }

  const updateDeadlineStatus = async (id: number, status: number) => {
    try{
      if (!data) throw new Error()
      await TaskService.changeStatus({
        idOrganization: data.organizationid,
        idStatus: status,
        idTask: id,
      })
      invalidateLitigation(data.id)
    } catch (error) {
      console.log(error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do prazo/tarefa",
        variant: "destructive",
      })
    }
  }

  const removeDeadline = async (id: number) => {
    try{
      if (!data) throw new Error()
      await TaskService.delete({
        id,
        idOrganization: data.organizationid,
      })
      invalidateLitigation(data.id)
    } catch (error) {
      console.log(error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o prazo/tarefa",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (!data) return

    setDeadlines(data.tasks.map((task) => ({
      id: task.id,
      name: task.title,
      idResponsible: task.responsible?.id,
      date: new Date(task.deadline),
      idPriority: task.priority.id,
      idStatus: task.status.id
    })))
  }, [data])

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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
            />
          </div>

          <div className="space-y-2 w-[180px]">
            <Label htmlFor="priority">Prioridade</Label>
            <Select name="priority" defaultValue="normal" 
              value={String(idPriority)} 
              onValueChange={(value) => setIdPriority(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TaskPriorities).map(([key, value]) => (
                  <SelectItem key={key} value={String(value)}>{TaskPriorityLabels[value]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="bg-[#0146cf] hover:bg-[#0146cf]/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </form>
        {isLoading && (
          <>
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[200px]" />
          </>
        )}
        {(deadlines.length > 0 && !isLoading) && (
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
                    <TableCell>{'-' || deadline.idResponsible}</TableCell>
                    <TableCell>
                      {format(deadline.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{ borderColor: TaskPriorityColors[deadline.idPriority], color: TaskPriorityColors[deadline.idPriority] }}
                      >
                        {TaskPriorityLabels[deadline.idPriority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{ borderColor: TaskStatusColors[deadline.idStatus], color: TaskStatusColors[deadline.idStatus] }}
                      >
                        {TaskStatusLabels[deadline.idStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:text-[#0146cf]" disabled>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizar</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:text-[#0146cf]" disabled>
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
                                onClick={() => updateDeadlineStatus(deadline.id, TaskStatus.COMPLETED)}
                                disabled={deadline.idStatus === TaskStatus.COMPLETED}
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
                                onClick={() => updateDeadlineStatus(deadline.id, TaskStatus.CANCELLED)}
                                disabled={deadline.idStatus === TaskStatus.CANCELLED}
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
                              <PopConfirm
                                title="Excluir prazo/tarefa"
                                description="Tem certeza que deseja excluir o prazo/tarefa?"
                                onConfirm={() => removeDeadline(deadline.id)}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PopConfirm>
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