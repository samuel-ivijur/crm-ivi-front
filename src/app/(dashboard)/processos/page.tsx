import { ProcessTable } from "@/components/processos/table"
import { AddProcessButton } from "@/components/processos/add-process-button"
import { ProcessStats } from "@/components/processos/stats"

export default function ProcessosPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Processos</h1>
        <AddProcessButton />
      </div>
      
      <ProcessStats />
      
      <ProcessTable />
    </div>
  )
} 