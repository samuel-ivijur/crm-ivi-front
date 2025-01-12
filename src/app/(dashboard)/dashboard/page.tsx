import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DashboardStats, DashboardCharts, RecentActivities, WelcomeModal } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <WelcomeModal />
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardStats />
      <DashboardCharts />
      <RecentActivities />
    </DashboardLayout>
  )
} 