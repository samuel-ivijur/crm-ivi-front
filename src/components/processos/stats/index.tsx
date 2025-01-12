import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from 'lucide-react'

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
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Badge variant="outline" className="text-[#0146cf] text-lg font-semibold px-3 py-1">
          {total}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ativos</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{active}</span>
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Inativos</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{inactive}</span>
              <XCircle className="h-3.5 w-3.5 text-red-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProcessStats() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatsCard title="Total de Processos" total={3497} active={2500} inactive={997} />
      <StatsCard title="Status" total={6994} active={5000} inactive={1994} />
      <StatsCard title="Comunicações" total={6994} active={4500} inactive={2494} />
      <StatsCard title="Monitoramentos" total={6994} active={6000} inactive={994} />
    </div>
  )
} 