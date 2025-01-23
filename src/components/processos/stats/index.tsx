import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from 'lucide-react'

interface StatsCardProps {
  title: string
  total?: number | string
  stats?: {
    label: string
    value: number
    type: 'success' | 'warning' | 'error' | 'info'
  }[]
  active?: number
  inactive?: number
}

function StatsCard({ title, total, stats, active, inactive }: StatsCardProps) {
  if (stats) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {total && (
            <Badge variant="outline" className="text-[#0146cf] text-lg font-semibold px-3 py-1">
              {total}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{stat.value}</span>
                  <CheckCircle className={`h-3.5 w-3.5 ${
                    stat.type === 'success' ? 'text-green-500' :
                    stat.type === 'warning' ? 'text-yellow-500' :
                    stat.type === 'error' ? 'text-red-500' :
                    'text-blue-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

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
            <span className="text-xs text-muted-foreground">Baixados</span>
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

function BaseStatsCard({ title, total, stats }: { 
  title: string, 
  total?: number | string, 
  stats: StatsCardProps['stats'] 
}) {
  if (!stats) return null;
  
  const isSingleColumn = stats.length <= 2;
  
  return (
    <Card className="p-3">
      <div className="space-y-3">
        {/* Header com título e total */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-medium text-[#1e1b4b]">{title}</h3>
          <div className="h-[36px]">
            {total && <span className="text-3xl font-bold text-[#0146cf]">{total}</span>}
          </div>
        </div>

        {/* Grid de status */}
        <div className={`grid ${isSingleColumn ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-md border p-2 text-center space-y-0.5"
            >
              <span className="text-xs text-slate-600 font-medium">{stat.label}</span>
              <div className={`text-lg font-bold ${
                stat.type === 'success' ? 'text-green-600' :
                stat.type === 'info' ? 'text-blue-600' :
                stat.type === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function ProcessStats() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <BaseStatsCard 
        title="Total de Processos"
        total={3497}
        stats={[
          { label: "Ativos", value: 2500, type: "success" },
          { label: "Baixados", value: 997, type: "error" },
        ]}
      />
      <BaseStatsCard 
        title="Status Tribunal"
        total={6994}
        stats={[
          { label: "Cadastrado", value: 2500, type: "success" },
          { label: "S. Justiça", value: 2500, type: "info" },
          { label: "Arquivado/Baixado", value: 1500, type: "warning" },
          { label: "Erro", value: 494, type: "error" },
        ]}
      />
      <BaseStatsCard 
        title="Em Comunicação"
        stats={[
          { label: "Habilitados", value: 4500, type: "success" },
          { label: "Desabilitados", value: 2494, type: "error" },
        ]}
      />
      <BaseStatsCard 
        title="Em Monitoramento"
        total={6994}
        stats={[
          { label: "Andamentos", value: 4000, type: "success" },
          { label: "Publicações", value: 2994, type: "info" },
        ]}
      />
    </div>
  )
}