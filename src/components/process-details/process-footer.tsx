import { Card, CardContent } from "@/components/ui/card"

export function ProcessFooter() {
  return (
    <Card className="rounded-none border-t">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-500">Data de Cadastro</div>
            <div>01/11/2025 20:56</div>
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
          IVIJur ©2025
        </div>
      </CardContent>
    </Card>
  )
} 