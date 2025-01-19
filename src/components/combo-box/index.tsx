"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type ComboboxProps = {
    options: { value: string | number; label: string }[]
    value: string | number
    setValue: (value: string | number) => void
    placeholder?: string
    buttonWidth?: string
    id?: string
    disabled?: boolean
    className?: string
    inputPlaceholder?: string
    emptyMessage?: string
}

export function Combobox({
    options,
    value,
    setValue,
    placeholder = "Select an option...",
    id,
    disabled,
    className,
    inputPlaceholder = "Search...",
    emptyMessage = "No option found."
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (currentValue: string | number) => {
        const [_, id] = String(currentValue).split('->>')
        setValue(id)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(`w-full justify-between`, className)}
                >
                    {value
                        ? options.find((option) => String(option.value) === String(value))?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-full p-0`}>
                <Command>
                    <CommandInput placeholder={inputPlaceholder} />
                    <CommandList>
                        <>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={`${option.label}->>${option.value}`}
                                        onSelect={handleSelect}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
