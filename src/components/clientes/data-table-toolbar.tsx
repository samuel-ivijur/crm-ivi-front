"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, X, FileDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from 'xlsx'
import { ValueOf } from "next/dist/shared/lib/constants"
import { LitigationStatus } from "@/constants/litigation"
import { beneficiariesService, GetBeneficiariesParams } from "@/services/api/beneficiaries"
import { useRef, useState } from "react"
import PopConfirm from "../popconfirm"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import dayjs from "dayjs"
import { toPhone } from "@/utils/format"
import { BeneficiaryStatus, BeneficiaryStatusLabels, personTypeOptions } from "@/constants"
import CustomMaskedInput from "../masked-input"

interface BeneficiaryDataTableToolbarProps {
  filter: GetBeneficiariesParams
  changeFilter: (params: Partial<GetBeneficiariesParams>) => void
  total: number
  selectedRows: Set<string>
  setSelectedRows: (rows: Set<string>) => void
  resetFilter: () => void
}

export function BeneficiaryDataTableToolbar({
  filter,
  changeFilter,
  total,
  selectedRows,
  setSelectedRows,
  resetFilter
}: BeneficiaryDataTableToolbarProps) {
  const debounceTime = 500
  const [isExporting, setIsExporting] = useState(false)
  const { getSelectedOrganization } = useAuth()
  const [values, setValues] = useState<GetBeneficiariesParams>(filter)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null) // Use useRef

  const debounceFilter = async (key: keyof typeof filter, value: any): Promise<void> => {
    setValues(prev => ({ ...prev, [key]: value }))
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(() => changeFilter({ [key]: value }), debounceTime)
  }

  const handleExport = async () => {
    setIsExporting(true)
    const selectedData = Array.from(selectedRows)
    if (selectedData.length === 0) {
      toast({
        title: "Nenhum cliente selecionado",
        description: "Selecione pelo menos um cliente para exportar",
        variant: "destructive",
      })
      return
    }

    const beneficiaries = await beneficiariesService.findAll({
      ids: selectedData,
      idOrganization: getSelectedOrganization(),
      limit: 100,
      page: 1
    })

    const ws = XLSX.utils.json_to_sheet(beneficiaries.beneficiaries.map(beneficiary => ({
      nome: beneficiary.name,
      telefone: beneficiary.phone ? toPhone(beneficiary.phone) : '-',
      tipo: beneficiary.type.description,
      documento: beneficiary.document || '-',
      status: beneficiary.status.description,
      email: beneficiary.email || '-',
      "cadastrado em": dayjs(beneficiary.createdAt).format('DD/MM/YYYY'),
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Clientes")
    XLSX.writeFile(wb, "IVijur_clientes.xlsx")
    setTimeout(() => {
      toast({
        variant: "success",
        title: "Exportação concluída",
        description: "Os clientes foram exportados com sucesso.",
      })
      setSelectedRows(new Set())
      setIsExporting(false)
    }, 1000)
  }

  const handleSelectChange = (key: keyof typeof filter, value: ValueOf<typeof LitigationStatus> | string | null) => {
    setValues(prev => ({ ...prev, [key]: value }))
    if (value === "null") value = null
    changeFilter({ [key]: value })
  }

  return (
    <div className="flex items-center justify-between gap-2 py-4">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {Object.keys(filter).length > 0 && (
                <div className="rounded-full bg-primary/10 px-1 text-xs">
                  {Object.keys(filter).filter(key => !["idOrganization", "page", "limit"].includes(key)).length}
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Digite o nome..."
                  value={values.name ?? ""}
                  onChange={(event) => debounceFilter("name", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Monitoramento</Label>
                <Select
                  value={values.idStatus ? String(values.idStatus) : null as unknown as string}
                  onValueChange={(value) => handleSelectChange("idStatus", +value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null as unknown as string}>Todos</SelectItem>
                    {Object.values(BeneficiaryStatus).map(status => (
                      <SelectItem key={status} value={String(status)}>{BeneficiaryStatusLabels[status]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="email@email.com"
                  value={values.email ?? ""}
                  onChange={(event) => debounceFilter("email", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <CustomMaskedInput
                  placeholder="(__) _____-____"
                  value={values.phone ?? ""}
                  onChange={(event) => debounceFilter("phone", event.target.value)}
                  mask="(11) 11111-1111"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={values.idType ? String(values.idType) : null as unknown as string}
                  onValueChange={(value) => handleSelectChange("idType", +value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null as unknown as string}>Todos</SelectItem>
                    {Object.values(personTypeOptions).map(type => (
                      <SelectItem key={type.value} value={String(type.value)}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Documento</Label>
                <Input
                  placeholder="CPF/CNPJ"
                  value={values.document ?? ""}
                  onChange={(event) => debounceFilter("document", event.target.value)}
                />
              </div>

              {Object.keys(filter).length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    resetFilter()
                    setValues({})
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {selectedRows.size > 0 && (
          <>
            <PopConfirm
              title="Confirmar Exportação"
              description="Tem certeza que deseja exportar os clientes selecionados?"
              onConfirm={handleExport}
            >
              <Button
                variant="outline"
                className="gap-2"
                loading={isExporting}
              >
                <FileDown className="h-4 w-4" />
                Exportar {selectedRows.size} {selectedRows.size === 1 ? 'cliente' : 'clientes'}
              </Button>
            </PopConfirm>
            <PopConfirm
              title="Confirmar"
              description="Tem certeza que deseja limpar a seleção?"
              onConfirm={async () => setSelectedRows(new Set())}
            >
              <Button
                variant="outline"
                className="gap-2"
                disabled={isExporting}
              >
                <X className="h-4 w-4" />
                Limpar Seleção
              </Button>
            </PopConfirm>
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {selectedRows.size} selecionado(s) | Total: {total}
      </div>
    </div>
  )
} 