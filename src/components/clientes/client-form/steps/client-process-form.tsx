"use client"

import { useState } from "react"
import { Plus, Search, Trash } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ProcessDataForm } from "@/components/process-form/steps/process-data-form/index"
import { LitigationParams, litigationsService } from "@/services/api/litigations"
import { Card, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import CustomMaskedInput from "@/components/masked-input"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/utils/cn"
import NoData from "@/assets/svg/nodata.svg"
import Image from "next/image"
import PopConfirm from "@/components/popconfirm"
import { useAuth } from "@/hooks/useAuth"
import { FormData } from "../client-form-modal"

const initialLitigationRegister: LitigationParams = {
  processNumber: "",
  instance: 0,
  idStatus: 1,
  caseCover: {},
}
type ClientProcessFormProps = {
  setLoading: (loading: "search" | "register" | "finish" | null) => void
  loading: "search" | "register" | "finish" | null
  litigationRegister: LitigationParams
  setLitigationRegister: (litigationRegister: LitigationParams) => void
  litigationRegisterErrors: Record<string, string>
  setLitigationRegisterErrors: (litigationRegisterErrors: Record<string, string>) => void
  isNewProcess: boolean
  setIsNewProcess: (isNewProcess: boolean) => void
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export function ClientProcessForm({
  setLoading,
  loading,
  litigationRegister,
  setLitigationRegister,
  litigationRegisterErrors,
  setLitigationRegisterErrors,
  isNewProcess,
  setIsNewProcess,
  formData,
  setFormData
}: ClientProcessFormProps) {

  const { getSelectedOrganization } = useAuth()
  const [litigationSearch, setLitigationSearch] = useState({
    processNumber: "",
    instance: 0,
  })

  const handleSearchLitigation = async () => {
    try {
      const newErrors: Record<string, string> = {}
      if (!litigationSearch.processNumber) newErrors.processNumberSearch = "Digite o número do processo"
      if (!litigationSearch.instance) newErrors.instanceSearch = "Selecione a instância"

      setLitigationRegisterErrors(newErrors)
      if (Object.keys(newErrors).length > 0) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }

      setLoading("search")
      const { data, total } = await litigationsService.getLitigations({
        idOrganization: getSelectedOrganization(),
        litigation: litigationSearch.processNumber,
        instance: String(litigationSearch.instance),
        limit: 1,
        page: 1,
      })
      if (total === 0) {
        toast({
          title: "Atenção",
          description: "Processo não encontrado. Cadastre o processo para continuar.",
          variant: "warning",
        })
        setLitigationRegister({
          ...initialLitigationRegister,
          processNumber: litigationSearch.processNumber,
          instance: litigationSearch.instance,
        })
        setLitigationRegisterErrors({})
        setIsNewProcess(true)
        setLoading(null)
        return
      }

      const litigationAlreadyExists = formData.litigations.find((litigation) => litigation.id === data[0].id)
      if (litigationAlreadyExists) {
        toast({
          title: "Atenção",
          description: "Processo já inserido.",
          variant: "warning",
        })
        return
      }

      setFormData((prev) => ({
        ...prev,
        litigations: [...prev.litigations, {
          id: data[0].id,
          processNumber: data[0].processnumber,
          instance: data[0].instance ? parseInt(data[0].instance) : 0,
        }],
      }))
      setLitigationSearch({
        processNumber: "",
        instance: 0,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao buscar processo",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleAddLitigation = async () => {
    try {

      const newErrors: Record<string, string> = {}
      if (!litigationRegister.processNumber) newErrors.processNumber = "Digite o número do processo"
      if (!litigationRegister.instance) newErrors.instance = "Selecione a instância"

      setLitigationRegisterErrors(newErrors)
      if (Object.keys(newErrors).length > 0) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }
      setLoading("register")
      const { data, total } = await litigationsService.getLitigations({
        idOrganization: getSelectedOrganization(),
        litigation: litigationRegister.processNumber,
        instance: String(litigationRegister.instance),
        limit: 1,
        page: 1,
      })

      if (total > 0
        && String(data[0].processnumber).replace(/\D/g, '') === litigationRegister.processNumber.replace(/\D/g, '')
        && String(data[0].instance) === String(litigationRegister.instance)) {
        toast({
          title: "Atenção",
          description: "Processo já cadastrado. Os dados do processo não foram alterados.",
          variant: "default",
        })
        setLoading(null)
        setIsNewProcess(false)
        setLitigationRegister(initialLitigationRegister)
        setLitigationRegisterErrors({})
        setFormData((prev) => ({
          ...prev,
          litigations: [
            ...prev.litigations,
            {
              id: data[0].id,
              processNumber: data[0].processnumber,
              instance: data[0].instance ? parseInt(data[0].instance) : 0,
            }
          ]
        }))
        return
      }

      const { id } = await litigationsService.saveLitigation({
        ...litigationRegister,
        idOrganization: getSelectedOrganization(),
      })
      setFormData((prev) => ({
        ...prev,
        litigations: [
          ...prev.litigations,
          {
        id,
        processNumber: litigationRegister.processNumber,
            instance: litigationRegister.instance,
          }
        ]
      }))
      setLitigationRegister(initialLitigationRegister)
      setLitigationRegisterErrors({})
      setIsNewProcess(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar processo",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleRemoveLitigation = async (id: string) => {
    setFormData((prev) => ({
      ...prev,
      litigations: prev.litigations.filter((litigation) => litigation.id !== id)
    }))
  }

  return (
    <div className="space-y-6" style={{ height: "500px", overflowY: "auto" }}>
      <div className="flex items-center justify-between">
        <Label className="text-base">Vincular Processo</Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="new-process" className="text-sm text-muted-foreground">
            {isNewProcess ? 'Cadastrar novo' : 'Buscar existente'}
          </Label>
          <Switch
            id="new-process"
            checked={isNewProcess}
            onCheckedChange={setIsNewProcess}
            className="data-[state=checked]:bg-[#0146cf]"
          />
        </div>
      </div>

      {!isNewProcess ? (
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6 space-y-2">
            <CustomMaskedInput
              placeholder="_______-__.____._.__.____"
              value={litigationSearch.processNumber}
              onChange={(e) => setLitigationSearch({ ...litigationSearch, processNumber: e.target.value })}
              mask="1111111-11.1111.1.11.1111"
              className={cn(
                "transition-colors",
                litigationRegisterErrors.processNumberSearch && "border-red-200 focus:border-red-400"
              )}
            />
            {litigationRegisterErrors.processNumberSearch && (
              <p className="text-red-500 text-sm mt-1">{litigationRegisterErrors.processNumberSearch}</p>
            )}
          </div>
          <div className="col-span-4 space-y-2">
            <Select
              value={
                litigationSearch.instance >= 3 ? "3" : litigationSearch.instance.toString()
              }
              onValueChange={(value) => setLitigationSearch({ ...litigationSearch, instance: parseInt(value) })}
            >
              <SelectTrigger
                className={cn(
                  "transition-colors",
                  litigationRegisterErrors.instanceSearch && "border-red-200 focus:border-red-400"
                )}
              >
                <SelectValue
                  placeholder="Selecione a instância"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem disabled value="0">Selecione a instância</SelectItem>
                <SelectItem value="1">1ª Instância</SelectItem>
                <SelectItem value="2">2ª Instância</SelectItem>
                <SelectItem value="3">Instâncias superiores</SelectItem>
              </SelectContent>
            </Select>
            {litigationRegisterErrors.instanceSearch && (
              <p className="text-red-500 text-sm mt-1">{litigationRegisterErrors.instanceSearch}</p>
            )}
          </div>
          <div className="col-span-2 space-y-2">
            <Button
              className="bg-[#0146cf] hover:bg-[#0146cf]/90 w-full"
              onClick={handleSearchLitigation}
              loading={loading === "search"}
              disabled={!!loading}
            >
              <Search />Buscar
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ProcessDataForm
            formData={litigationRegister}
            setFormData={(field, value) => setLitigationRegister({ ...litigationRegister, [field]: value })}
            errors={litigationRegisterErrors}
          />
          <Button
            className="bg-[#0146cf] hover:bg-[#0146cf]/90 w-full"
            onClick={handleAddLitigation}
            loading={loading === "register"}
            disabled={!!loading}
          >
            <Plus />Registrar processo
          </Button>
        </>
      )}

      {formData.litigations.length > 0 ? formData.litigations.map((litigation) => (
        <Card key={litigation.id}>
          <CardContent style={{ padding: "10px 15px" }} className="flex items-center justify-between">
            <div>{litigation.processNumber}</div>
            <div>{litigation.instance > 2 ? "Instâncias superiores" : `${litigation.instance}ª Instância`}</div>
            <PopConfirm
              title="Tem certeza que deseja remover o processo?"
              onConfirm={async () => await handleRemoveLitigation(litigation.id)}
            >
              <Button
                variant="destructive"
                size="icon"
              >
                <Trash />
              </Button>
            </PopConfirm>
          </CardContent>
        </Card>
      )) : (
        <div className="space-y-4 rounded-lg border p-4 flex flex-col items-center justify-center">
          <Image src={NoData} alt="Nenhum processo selecionado" width={150} height={150} />
          <p className="text-sm text-gray-500">Nenhum processo selecionado</p>
        </div>
      )}

    </div>
  )
} 