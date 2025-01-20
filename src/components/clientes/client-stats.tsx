"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, MessageSquare, UserCheck } from 'lucide-react'

interface StatsCardProps {
  title: string
  total: number
  active: number
  inactive: number
}

function StatsCard({ title, total, active, inactive }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge variant="outline" className="text-[#0146cf]">
          {total}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ativos</span>
            <div className="flex items-center gap-2">
              <span>{active}</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Inativos</span>
            <div className="flex items-center gap-2">
              <span>{inactive}</span>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ClientStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard title="Total de Clientes" total={150} active={120} inactive={30} />
      <StatsCard title="Comunicações" total={150} active={100} inactive={50} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Habilitados</CardTitle>
          <Badge variant="outline" className="text-[#0146cf]">150</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aceite</span>
              <div className="flex items-center gap-2">
                <span>80</span>
                <UserCheck className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Não aceite</span>
              <div className="flex items-center gap-2">
                <span>70</span>
                <MessageSquare className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 