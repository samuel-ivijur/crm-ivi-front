"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, MessageSquare, UserCheck } from 'lucide-react'
import { useEffect, useState } from "react"
import { ReportBeneficiaryResult } from "@/services/api/beneficiaries"

type ClientStatsProps = {
  data: ReportBeneficiaryResult | undefined
}
export function ClientStats({ data }: ClientStatsProps) {
  const [total, setTotal] = useState({
    clients: 0,
    communication: 0,
    accepts: 0,
  });

  useEffect(() => {
    if (data) {
      setTotal({
        clients: data.total.actives + data.total.inactives,
        communication: data.communication.actives + data.communication.inactives,
        accepts: data.accepts.accepted + data.accepts.notAccepted,
      });
    }
  }, [data]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Badge variant="outline" className="text-[#0146cf]">{total.clients}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ativos</span>
              <div className="flex items-center gap-2">
                <span>{data && data.total.actives}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inativos</span>
              <div className="flex items-center gap-2">
                <span>{data && data.total.inactives}</span>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comunicações</CardTitle>
          <Badge variant="outline" className="text-[#0146cf]">{total.communication}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ativos</span>
              <div className="flex items-center gap-2">
                <span>{data && data.communication.actives}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inativos</span>
              <div className="flex items-center gap-2">
                <span>{data && data.communication.inactives}</span>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Habilitados</CardTitle>
          <Badge variant="outline" className="text-[#0146cf]">{total.accepts}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aceite</span>
              <div className="flex items-center gap-2">
                <span>{data && data.accepts.accepted}</span>
                <UserCheck className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Não aceite</span>
              <div className="flex items-center gap-2">
                <span>{data && data.accepts.notAccepted}</span>
                <MessageSquare className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
} 