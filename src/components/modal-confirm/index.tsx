import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "../ui";
type ModalConfirmProps = {
    title: string,
    description: string,
    onConfirm: () => void,
    onCancel: () => void,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

const ModalConfirm = ({ title, description, onConfirm, onCancel, onOpenChange, open }: ModalConfirmProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl space-y-6">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <DialogDescription>{description}</DialogDescription>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button variant="default" onClick={onConfirm}>Confirmar</Button>
            </div>
        </DialogContent>
    </Dialog>
);

export default ModalConfirm;