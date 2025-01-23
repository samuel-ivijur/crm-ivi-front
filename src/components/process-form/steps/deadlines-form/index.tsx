"use client"

import { useState } from "react"
import { Trash2 } from 'lucide-react'
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
import { Deadline } from "@/types/process"
import { TaskPriorities, TaskPriorityLabels } from "@/constants"

export function DeadlinesForm() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])

  const addDeadline = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newDeadline = {
      id: deadlines.length + 1,
      name: formData.get("name") as string,
      responsible: formData.get("responsible") as string,
      date: formData.get("date") as string,
      priority: formData.get("priority") as string,
      status: "Pendente" as const,
    }
    setDeadlines([...deadlines, newDeadline])
    e.currentTarget.reset()
  }

  const removeDeadline = (id: number) => {
    setDeadlines(deadlines.filter((deadline) => deadline.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addDeadline} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="date">
            Data Fatal <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            id="date"
            name="date"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsible">Responsável</Label>
          <Input
            id="responsible"
            name="responsible"
            placeholder="Digite o nome do responsável"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select name="priority">
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskPriorities).map(priority => (
                <SelectItem key={priority} value={priority.toString()}>
                  {TaskPriorityLabels[priority]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="col-span-full bg-[#0146cf] hover:bg-[#0146cf]/90"
        >
          + Adicionar Prazo/Tarefa
        </Button>
      </form>

      {deadlines.length > 0 && (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Nome do Prazo/Tarefa</th>
                <th className="p-2 text-left">Responsável</th>
                <th className="p-2 text-left">Data Fatal</th>
                <th className="p-2 text-left">Prioridade</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map((deadline) => (
                <tr key={deadline.id} className="border-b">
                  <td className="p-2">{deadline.name}</td>
                  <td className="p-2">{deadline.responsible}</td>
                  <td className="p-2">{deadline.date}</td>
                  <td className="p-2">{deadline.priority}</td>
                  <td className="p-2">{deadline.status}</td>
                  <td className="p-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
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