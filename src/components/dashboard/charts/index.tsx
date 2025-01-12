import { SavingsChart } from "./savings-chart/index"
import { ClientStatusChart } from "./client-status-chart/index"

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-4">
      <SavingsChart />
      <ClientStatusChart />
    </div>
  )
} 