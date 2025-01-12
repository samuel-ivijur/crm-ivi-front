import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HistoryTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico do Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Nenhum histórico disponível para este processo.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 