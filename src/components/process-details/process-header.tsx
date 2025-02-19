import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "../ui/skeleton"
import { GetLitigation } from "@/services/api/litigations"
import { User, CheckCircle } from 'lucide-react'
import { TaskStatus } from "@/constants"

type ProcessHeaderProps = {
  data: GetLitigation.Result["data"] | null
  isLoading: boolean
}

export function ProcessHeader({ data, isLoading }: ProcessHeaderProps) {

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
          {isLoading ? <HeaderSkeleton n={3} /> :
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
              {isLoading ? <HeaderSkeleton n={1} /> :
                (<>
                  {(data?.beneficiaries || []).length > 0 ? (
                    <>
                      {data?.beneficiaries.slice(0, 2).map(beneficiary => (
                        <div key={beneficiary.id} className="text-sm text-gray-500">{beneficiary.name}</div>
                      ))}
                      {((data?.beneficiaries || []).length > 2) && (
                        <div className="text-sm text-gray-500">+{(data?.beneficiaries || []).length - 2}</div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">-</div>
                  )}
                </>)
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
              {isLoading ? <HeaderSkeleton n={1} /> :
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
                  <div className="text-lg font-bold">{isLoading ? <HeaderSkeleton n={1} /> : data?.tasks?.length}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{isLoading ? <HeaderSkeleton n={1} /> : (data?.tasks || []).filter(task => [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.LATE].includes(task.status.id)).length}</div>
                  <div className="text-xs text-gray-500">Pendentes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{isLoading ? <HeaderSkeleton n={1} /> : (data?.tasks || []).filter(task => task.status.id === TaskStatus.COMPLETED).length}</div>
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