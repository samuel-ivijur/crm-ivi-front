import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui"
import { useState } from "react";
import { Check, X } from "lucide-react";

type ConfirmModalProps = {
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    open: boolean;
    onClose: () => void;
    okText?: string;
    cancelText?: string;
}

const ConfirmModal = ({ title, description, onConfirm, open, onClose, okText = "Confirmar", cancelText = "Cancelar" }: ConfirmModalProps) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {description}
                <DialogTrigger className="flex justify-center gap-6">
                    <Button
                        variant="outline"
                        disabled={loading}
                        onClick={onClose}
                    ><X />{cancelText}</Button>
                    <Button
                        variant="default"
                        loading={loading}
                        onClick={handleConfirm}
                    ><Check />{okText}</Button>
                </DialogTrigger>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmModal;
