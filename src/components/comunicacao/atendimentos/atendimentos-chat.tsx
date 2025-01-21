"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageSquare, ArrowRightLeft, Send, UserCog, Bell } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: "bot" | "user" | "system"
  content: string
  timestamp: string
}

interface Cliente {
  id: string
  nome: string
  status: string
  metrics: {
    atendimentos: number
    movimentacoes: number
    disparoIniciais: number
    secretariado: number
    lembreteMonitoramento: number
  }
  lastInteraction: string
  messages: ChatMessage[]
}

const mockClientes: Cliente[] = [
  {
    id: "1",
    nome: "Samuel Tapas",
    status: "Iniciada",
    metrics: {
      atendimentos: 12,
      movimentacoes: 3,
      disparoIniciais: 2,
      secretariado: 1,
      lembreteMonitoramento: 8
    },
    lastInteraction: "20/01/2024, 15:06",
    messages: [
      {
        id: "1",
        sender: "system",
        content: "15 de Janeiro de 2024",
        timestamp: "00:00"
      },
      {
        id: "2",
        sender: "system",
        content: "Agente Ivijur - Autoatendimento iniciou o atendimento.",
        timestamp: "09:30"
      },
      {
        id: "3",
        sender: "bot",
        content: "Olá Samuel! Sou a IVi, assistente virtual da Ivi. Notei que você tem uma audiência marcada para a próxima semana. Gostaria de receber mais informações sobre ela?",
        timestamp: "09:30"
      },
      {
        id: "4",
        sender: "user",
        content: "Sim, por favor!",
        timestamp: "10:15"
      },
      {
        id: "5",
        sender: "bot",
        content: "Sua audiência está marcada para dia 22/01/2024 às 14h, na 3ª Vara Cível. Você deve chegar com 30 minutos de antecedência. Deseja que eu te envie um lembrete no dia?",
        timestamp: "10:15"
      },
      {
        id: "6",
        sender: "user",
        content: "Sim, seria ótimo!",
        timestamp: "10:20"
      },
      {
        id: "7",
        sender: "system",
        content: "20 de Janeiro de 2024",
        timestamp: "00:00"
      },
      {
        id: "8",
        sender: "system",
        content: "Agente Ivijur - Autoatendimento entrou no atendimento.",
        timestamp: "15:03"
      },
      {
        id: "9",
        sender: "bot",
        content: "Olá, samuel! Tudo bem? Aqui é a IVi, a nova assistente virtual da Ivi. O seu escritório de advocacia nos contratou para te informar, por aqui 👇, o passo a passo do que acontece em seu processo, para que você fique por dentro das...",
        timestamp: "15:03"
      },
      {
        id: "10",
        sender: "user",
        content: "Quero sim!",
        timestamp: "15:06"
      },
      {
        id: "11",
        sender: "bot",
        content: "Ótimo! Vou te manter atualizado sobre todas as movimentações importantes do seu processo. Você receberá notificações sempre que houver novidades relevantes.",
        timestamp: "15:06"
      },
      {
        id: "12",
        sender: "system",
        content: "Agente Ivijur - Autoatendimento saiu do atendimento.",
        timestamp: "15:10"
      }
    ]
  },
  {
    id: "2",
    nome: "CREUSA DE ALCANTARA MESQUITA",
    status: "Iniciada",
    metrics: {
      atendimentos: 5,
      movimentacoes: 1,
      disparoIniciais: 0,
      secretariado: 0,
      lembreteMonitoramento: 3
    },
    lastInteraction: "20/01/2024, 14:30",
    messages: [
      {
        id: "1",
        sender: "user",
        content: "Oi",
        timestamp: "14:30"
      }
    ]
  }
]

export function AtendimentosChat({ selectedMonth }: { selectedMonth: string }) {
  const [selectedClient, setSelectedClient] = useState<Cliente>(mockClientes[0])
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 border rounded-lg bg-white h-[800px]">
      {/* Sidebar com lista de clientes */}
      <div className="border-r h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversa"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-full">
          {mockClientes.map((cliente) => (
            <div
              key={cliente.id}
              className={`p-4 cursor-pointer hover:bg-slate-50 ${
                selectedClient.id === cliente.id ? "bg-slate-50" : ""
              }`}
              onClick={() => setSelectedClient(cliente)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  {cliente.nome.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{cliente.nome}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Área principal do chat */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header com métricas do cliente */}
        <div className="p-4 border-b bg-white">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{selectedClient.nome}</h2>
              <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                {selectedClient.status}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              Última interação em {selectedClient.lastInteraction}
            </span>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-[#0146cf] font-medium">{selectedClient.metrics.atendimentos}</span>
              <span className="text-sm text-muted-foreground">Atendimentos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0146cf] font-medium">{selectedClient.metrics.movimentacoes}</span>
              <span className="text-sm text-muted-foreground">Movimentações</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0146cf] font-medium">{selectedClient.metrics.disparoIniciais}</span>
              <span className="text-sm text-muted-foreground">Disparo de iniciais</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0146cf] font-medium">{selectedClient.metrics.secretariado}</span>
              <span className="text-sm text-muted-foreground">Secretariado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0146cf] font-medium">{selectedClient.metrics.lembreteMonitoramento}</span>
              <span className="text-sm text-muted-foreground">Lembrete de Monitoramento</span>
            </div>
          </div>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4 py-4">
            {selectedClient.messages.map((message) => (
              <div
                key={message.id}
                className={`
                  ${message.sender === "system" ? "flex justify-center" : ""}
                  ${message.sender === "bot" ? "flex justify-start" : ""}
                  ${message.sender === "user" ? "flex justify-end" : ""}
                `}
              >
                <div
                  className={`
                    max-w-[80%] rounded-lg p-3
                    ${message.sender === "system" ? "bg-slate-100 text-sm" : ""}
                    ${message.sender === "bot" ? "bg-[#0146cf] text-white" : ""}
                    ${message.sender === "user" ? "bg-slate-200" : ""}
                  `}
                >
                  {message.content}
                  <div className={`
                    text-xs mt-1
                    ${message.sender === "bot" ? "text-white/70" : "text-slate-500"}
                  `}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 