'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/index"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { 
    name: 'Jan',
    economiaTotal: 50000,
    economiaComparativa: 45000,
    totalClientes: 130,
    clientesComparativo: 110,
    clientesAtivos: 90,
    ativosComparativo: 85,
    processosMonitorados: 65,
    processosComparativo: 60,
    usoPlanoPorcentagem: 60,
    usoPlanoComparativo: 55
  },
  { 
    name: 'Fev',
    economiaTotal: 55000,
    economiaComparativa: 48000,
    // ... outros dados
  },
  { 
    name: 'Mar',
    economiaTotal: 58000,
    economiaComparativa: 52000,
  },
  { 
    name: 'Abr',
    economiaTotal: 61000,
    economiaComparativa: 54000,
  },
  { 
    name: 'Mai',
    economiaTotal: 59000,
    economiaComparativa: 56000,
  },
  { 
    name: 'Jun',
    economiaTotal: 62000,
    economiaComparativa: 58000,
  }
]

const metrics = [
  { 
    key: 'economiaTotal',
    compareKey: 'economiaComparativa',
    name: 'Economia Total',
    color: '#22C55E',
    compareColor: '#86EFAC',
    prefix: 'R$ ',
  },
  { 
    key: 'totalClientes',
    compareKey: 'clientesComparativo',
    name: 'Total de Clientes',
    color: '#3B82F6',
    compareColor: '#93C5FD',
  },
  { 
    key: 'clientesAtivos',
    compareKey: 'ativosComparativo',
    name: 'Clientes Ativos',
    color: '#6366F1',
    compareColor: '#A5B4FC',
  },
  { 
    key: 'processosMonitorados',
    compareKey: 'processosComparativo',
    name: 'Processos Monitorados',
    color: '#8B5CF6',
    compareColor: '#C4B5FD',
  },
  { 
    key: 'usoPlanoPorcentagem',
    compareKey: 'usoPlanoComparativo',
    name: 'Uso do Plano',
    color: '#EC4899',
    compareColor: '#F9A8D4',
    suffix: '%',
  }
]

const CustomTooltip = ({ active, payload, metric }: any) => {
  if (active && payload && payload.length) {
    const currentValue = payload[0].value
    const compareValue = payload[1]?.value
    const difference = currentValue - (compareValue || 0)
    const percentChange = ((difference / (compareValue || 1)) * 100).toFixed(1)

    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-medium">
          {metric?.prefix || ''}{currentValue.toLocaleString('pt-BR')}{metric?.suffix || ''}
        </p>
        {compareValue && (
          <p className={`text-xs font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {difference >= 0 ? '↑' : '↓'} {Math.abs(Number(percentChange))}% em relação ao mês anterior
          </p>
        )}
      </div>
    )
  }
  return null
}

export function SavingsChart() {
  const [selectedMetric, setSelectedMetric] = useState(metrics[0].key)
  const selectedMetricInfo = metrics.find(m => m.key === selectedMetric)

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Visão Geral Mensal</CardTitle>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione uma métrica" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((metric) => (
              <SelectItem key={metric.key} value={metric.key}>
                {metric.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              tickFormatter={(value) => {
                if (selectedMetricInfo?.prefix) {
                  return `${selectedMetricInfo.prefix}${value/1000}k`
                }
                return value
              }}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} metric={selectedMetricInfo} />} />
            <Bar 
              dataKey={selectedMetricInfo?.key || ''}
              fill={selectedMetricInfo?.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey={selectedMetricInfo?.compareKey || ''}
              fill={selectedMetricInfo?.compareColor}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 