import React from "react";
import * as ReactPopover from "@radix-ui/react-popover";
import "./styles.css";

type PopoverProps = {
    children: React.ReactNode
    content: React.ReactNode
}
const Popover = ({ children, content }: PopoverProps) => (
    <ReactPopover.Root>
        <ReactPopover.Trigger asChild>{children}</ReactPopover.Trigger>
        <ReactPopover.Portal>
            <ReactPopover.Content className="PopoverContent" sideOffset={5}>
                {content}
            </ReactPopover.Content>
        </ReactPopover.Portal>
    </ReactPopover.Root>
);

export default Popover;
