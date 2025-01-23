import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Client } from "@/types/client"

interface LinkProcessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
}

export function LinkProcessModal({ open, onOpenChange, client }: LinkProcessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Processo - {client?.name}</DialogTitle>
        </DialogHeader>
        {/* Conteúdo do modal aqui */}
      </DialogContent>
    </Dialog>
  )
} 