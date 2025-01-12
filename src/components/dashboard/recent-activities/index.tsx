import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui"

const recentActivities = [
  { id: 1, activity: "Novo cliente cadastrado", date: "2024-04-01" },
  { id: 2, activity: "Processo iniciado", date: "2024-04-02" },
  { id: 3, activity: "Cliente aceitou proposta", date: "2024-04-03" },
  { id: 4, activity: "Processo concluído", date: "2024-04-04" },
  { id: 5, activity: "Cliente em silêncio", date: "2024-04-05" },
]

export function RecentActivities() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atividade</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activity}</TableCell>
                <TableCell>{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 