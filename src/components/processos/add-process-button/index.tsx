"use client"

import { Dispatch, SetStateAction } from 'react'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AddProcessButtonProps = {
  setIsModalRegisterOpen: Dispatch<SetStateAction<boolean>>
  setIsModalImportOpen: Dispatch<SetStateAction<boolean>>
}
export function AddProcessButton({
  setIsModalRegisterOpen,
  setIsModalImportOpen,
}: AddProcessButtonProps) {
  return (
    <>
      <div className="flex gap-2">
      <Button variant="outline" className="gap-2" onClick={() => setIsModalImportOpen(true)}>
            <Download className="h-4 w-4" />
            Importar Planilha
          </Button>
        <Button
          onClick={() => setIsModalRegisterOpen(true)}
          className="bg-[#0146cf] hover:bg-[#0146cf]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar um processo
        </Button>
      </div>
    </>
  )
} 