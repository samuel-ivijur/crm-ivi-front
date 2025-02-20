import { Card } from "@/components/ui/card"
import { useLitigationReport } from "@/hooks/use-litigation-report"
import { ReportLitigations } from "@/services/api/litigations"
import { useEffect, useState } from "react"

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
              <div className={`text-lg font-bold ${stat.type === 'success' ? 'text-green-600' :
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
  const { getLitigationReportQuery } = useLitigationReport()
  const [report, setReport] = useState<ReportLitigations.Result>({
    status: {
      active: 0,
      archived: 0,
    },
    externalCourt: {
      registered: 0,
      archived: 0,
      error: 0,
      judicial: 0,
    },
    communication: {
      active: 0,
      inactive: 0,
    },
    monitoring: {
      publications: 0,
      progress: 0,
    },
  })

  useEffect(() => {
    if (!getLitigationReportQuery.data) return
    const newReport: ReportLitigations.Result = {
      status: {
        active: getLitigationReportQuery.data.status.active,
        archived: getLitigationReportQuery.data.status.archived,
      },
      externalCourt: {
        registered: getLitigationReportQuery.data.externalCourt.registered,
        archived: getLitigationReportQuery.data.externalCourt.archived,
        error: getLitigationReportQuery.data.externalCourt.error,
        judicial: getLitigationReportQuery.data.externalCourt.judicial,
      },
      communication: {
        active: getLitigationReportQuery.data.communication.active,
        inactive: getLitigationReportQuery.data.communication.inactive,
      },
      monitoring: {
        publications: getLitigationReportQuery.data.monitoring.publications,
        progress: getLitigationReportQuery.data.monitoring.progress,
      },
    }
    setReport(newReport)
  }, [getLitigationReportQuery.data])

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <BaseStatsCard
        title="Total de Processos"
        total={report.status.active + report.status.archived}
        stats={[
          { label: "Ativos", value: report.status?.active , type: "success" },
          { label: "Baixados", value: report.status?.archived , type: "error" },
        ]}
      />
      <BaseStatsCard
        title="Status Tribunal"
        total={Object.values(report.externalCourt).reduce((acc, curr) => acc + curr, 0)}
        stats={[
          { label: "Cadastrado", value: report.externalCourt?.registered , type: "success" },
          { label: "S. Justiça", value: report.externalCourt?.judicial , type: "info" },
          { label: "Arquivado/Baixado", value: report.externalCourt?.archived , type: "warning" },
          { label: "Erro", value: report.externalCourt?.error , type: "error" },
        ]}
      />
      <BaseStatsCard
        title="Em Comunicação"
        total={report.communication.active + report.communication.inactive}
        stats={[
          { label: "Habilitados", value: report.communication?.active , type: "success" },
          { label: "Desabilitados", value: report.communication?.inactive , type: "error" },
        ]}
      />
      <BaseStatsCard
        title="Em Monitoramento"
        total={report.monitoring.progress + report.monitoring.publications}
        stats={[
          { label: "Andamentos", value: report.monitoring?.progress , type: "success" },
          { label: "Publicações", value: report.monitoring?.publications , type: "info" },
        ]}
      />
    </div>
  )
}