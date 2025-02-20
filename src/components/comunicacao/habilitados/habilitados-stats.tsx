"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, XCircle, AlertTriangle, FileText, AlertOctagon, ShieldCheck, ShieldX } from 'lucide-react'

export function HabilitadosStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Total de Habilitados</CardTitle>
          <Badge variant="outline" className="text-[#0146cf] text-lg">1000</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Aceites</span>
              <div className="flex items-center gap-2">
                <span className="text-base">700</span>
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Não aceites</span>
              <div className="flex items-center gap-2">
                <span className="text-base">250</span>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Números inválidos</span>
              <div className="flex items-center gap-2">
                <span className="text-base">50</span>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Processos</CardTitle>
          <Badge variant="outline" className="text-[#0146cf] text-lg">950</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Cadastrados</span>
              <div className="flex items-center gap-2">
                <span className="text-base">900</span>
                <FileText className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Erro</span>
              <div className="flex items-center gap-2">
                <span className="text-base">50</span>
                <AlertOctagon className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Status do Cadastro</CardTitle>
          <Badge variant="outline" className="text-[#0146cf] text-lg">1000</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Incluídos no plano</span>
              <div className="flex items-center gap-2">
                <span className="text-base">850</span>
                <ShieldCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Excluídos do plano</span>
              <div className="flex items-center gap-2">
                <span className="text-base">150</span>
                <ShieldX className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 