"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, ArrowRightLeft, Send, UserCog, Bell } from 'lucide-react'

const metrics = [
  {
    title: "Atendimentos",
    value: "6.471",
    icon: MessageSquare,
  },
  {
    title: "Movimentações",
    value: "409",
    icon: ArrowRightLeft,
  },
  {
    title: "Disparo de iniciais",
    value: "349",
    icon: Send,
  },
  {
    title: "Secretariado",
    value: "17",
    icon: UserCog,
  },
  {
    title: "Lembrete de Monitoramento",
    value: "5.303",
    icon: Bell,
  },
]

export function AtendimentosStats() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-[#0146cf]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div className="space-y-1">
                <p className="text-sm font-medium">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <metric.icon className="h-5 w-5 opacity-70" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 