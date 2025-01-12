import { Card, CardContent, CardHeader, CardTitle, Progress } from "@/components/ui"
import { DashboardCard } from "./card"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total Economizado"
        value="R$ 62.000"
        description="Dinheiro e tempo economizados"
        tooltip="Soma total de economia em dinheiro e tempo convertido em valor monetário"
      />
      <DashboardCard
        title="Total de Clientes"
        value="150"
        description="100 ativos"
        tooltip="Número total de clientes e quantos estão atualmente ativos"
      />
      <DashboardCard
        title="Processos Monitorados"
        value="75"
        description="Em andamento"
        tooltip="Número total de processos atualmente sendo monitorados"
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Uso do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">75%</div>
          <Progress value={75} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">150/200 cadastros utilizados</p>
        </CardContent>
      </Card>
    </div>
  )
} 