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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Badge variant="outline" className="text-[#0146cf]">150</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ativos</span>
              <div className="flex items-center gap-2">
                <span>120</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inativos</span>
              <div className="flex items-center gap-2">
                <span>30</span>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comunicações</CardTitle>
          <Badge variant="outline" className="text-[#0146cf]">150</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ativos</span>
              <div className="flex items-center gap-2">
                <span>100</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inativos</span>
              <div className="flex items-center gap-2">
                <span>50</span>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
    </>
  )
} 