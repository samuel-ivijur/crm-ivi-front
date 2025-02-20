"use client"

import { useProcessForm } from "@/context/useProcessModalForm"
import { ClientForm } from "./client-form"
import { Button } from "@/components/ui"


export function ModalClientForm() {
  const { formData, addBeneficiary, updateBeneficiaries, errors, removeBeneficiary } = useProcessForm()

  return (
    <>
      <div className="space-y-8">
        {formData.beneficiaries?.map((_, index) => (
          <ClientForm
            key={index}
            index={index}
            formData={formData.beneficiaries[index]}
            updateBeneficiary={updateBeneficiaries}
            errors={errors}
            removeBeneficiary={removeBeneficiary}
          />
        ))}
      </div>
      <div className="mt-10">
        <Button onClick={addBeneficiary} style={{ width: '100%' }}>
          Adicionar Beneficiário
        </Button>
      </div>
    </>
  )
} 