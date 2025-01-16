import React, { useState } from "react";
import * as ReactPopover from "@radix-ui/react-popover";
import "./styles.css";
import { Button } from "../ui/button";

type PopoverProps = {
    children: React.ReactNode
    title?: string
    description?: string
    onConfirm: () => Promise<any>
}
const PopConfirm = ({ children, title, description, onConfirm }: PopoverProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleClickOk = async () => {
        setLoading(true)
        await onConfirm()
        setLoading(false)
        setOpen(false)
    }

    return (
        <ReactPopover.Root open={open} onOpenChange={setOpen}>
            <ReactPopover.Trigger asChild>{children}</ReactPopover.Trigger>
            <ReactPopover.Portal>
                <ReactPopover.Content className="Popconfirm" sideOffset={5}>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-md font-medium">{title}</h4>
                        <p className="text-sm text-gray-500">{description}</p>
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => { setOpen(false) }}>Cancelar</Button>
                            <Button size="sm" onClick={handleClickOk} disabled={loading} loading={loading}>Confirmar</Button>
                        </div>
                    </div>
                </ReactPopover.Content>
            </ReactPopover.Portal>
        </ReactPopover.Root>
    )
}

export default PopConfirm;
