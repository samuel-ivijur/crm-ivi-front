import { Card, CardContent } from "@/components/ui/card"
import { GetLitigations } from "@/services/api/litigations"
import dayjs from "dayjs"

type ProcessFooterProps = {
  data?: GetLitigations.LitigationInfo | null
}
export function ProcessFooter({ data }: ProcessFooterProps) {
  return (
    <Card className="rounded-none border-t">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-500">Data de Cadastro</div>
            <div>{data?.createdAt ? dayjs(data.createdAt).format('DD/MM/YYYY HH:mm') : '-'}</div>
          </div>
          <div>
            <div className="font-medium text-gray-500">Cadastrado por</div>
            <div>-</div>
          </div>
          <div>
            <div className="font-medium text-gray-500">Data de Encerramento</div>
            <div>-</div>
          </div>
          <div>
            <div className="font-medium text-gray-500">Encerrado por</div>
            <div>-</div>
          </div>
          <div>
            <div className="font-medium text-gray-500">Motivo Encerramento</div>
            <div>-</div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          IVIJur ©{dayjs().year()}
        </div>
      </CardContent>
    </Card>
  )
} 