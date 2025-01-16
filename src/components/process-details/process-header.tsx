import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useProcessDetails } from "@/hooks/useProcessDetails"
import { User, CheckCircle } from 'lucide-react'
import { Skeleton } from "../ui/skeleton"

export function ProcessHeader() {
  const { getLitigationQuery } = useProcessDetails()

  const HeaderSkeleton = ({ n }: { n: number }) => {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: n }, (_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-full lg:col-span-1">
        <CardContent className="p-4">
          {getLitigationQuery.isLoading ? <HeaderSkeleton n={3} /> :
            (
              <div className="flex flex-wrap gap-2">
                <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
                  Validando
                </Badge>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  Não Monitorado
                </Badge>
              </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div className="w-full">
              <div className="text-sm font-medium">Cliente</div>
              {getLitigationQuery.isLoading ? <HeaderSkeleton n={1} /> :
                (<div className="text-sm text-gray-500">Teste 123</div>)
              }
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div className="w-full">
              <div className="text-sm font-medium">Responsável</div>
              {getLitigationQuery.isLoading ? <HeaderSkeleton n={1} /> :
                (<div className="text-sm text-gray-500">-</div>)
              }
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Total de tarefas</div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="text-center">
                  <div className="text-lg font-bold">{getLitigationQuery.isLoading ? <HeaderSkeleton n={1} /> : 1}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{getLitigationQuery.isLoading ? <HeaderSkeleton n={1} /> : 1}</div>
                  <div className="text-xs text-gray-500">Pendentes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{getLitigationQuery.isLoading ? <HeaderSkeleton n={1} /> : 0}</div>
                  <div className="text-xs text-gray-500">Concluídas</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 