import { Suspense } from "react"
import { ProcessDetailsContent } from "@/components/process-details/process-details-content"

export default function ProcessDetailsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ProcessDetailsContent />
    </Suspense>
  )
} 