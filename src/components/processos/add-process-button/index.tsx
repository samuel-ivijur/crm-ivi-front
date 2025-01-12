"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProcessFormModal } from '@/components/process-form'
import { Plus } from 'lucide-react'

export function AddProcessButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#0146cf] hover:bg-[#0146cf]/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar um processo
      </Button>

      <ProcessFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  )
} 