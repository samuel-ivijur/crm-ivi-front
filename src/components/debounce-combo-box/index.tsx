"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner" // Assuming there's a Spinner component
import { Input } from "../ui/input"

type DebounceComboboxProps = {
    fetchOptions: (inputValue: string) => Promise<void>
    value: string
    setValue: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
    buttonWidth?: string
    id?: string
    disabled?: boolean
    className?: string
    inputPlaceholder?: string
    emptyMessage?: string
}

export function DebounceCombobox({
    fetchOptions,
    value,
    setValue,
    options,
    placeholder = "Select an option...",
    id,
    disabled,
    className,
    inputPlaceholder = "Search...",
    emptyMessage = "No option found."
}: DebounceComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const debounce = (func: (...args: any[]) => void, wait: number) => {
        let timeout: NodeJS.Timeout
        return (...args: any[]) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                func(...args)
            }, wait)
        }
    }

    const handleInputChange = debounce(async (inputValue: string) => {
        setLoading(true)
        await fetchOptions?.(inputValue)
        setLoading(false)
    }, 500)

    const handleSelect = (currentValue: string) => {
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
                        ? options?.find((option) => option.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-full p-0`}>
                <Command>
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input 
                            placeholder={inputPlaceholder} 
                            onChange={(e) => handleInputChange(e.target.value)} 
                            className="focus-visible:outline-none"
                        />
                    </div>
                    {/* <CommandInput 
                        placeholder={inputPlaceholder} 
                        onValueChange={handleInputChange} 
                    /> */}
                    <CommandList>
                        {loading ? (
                            <div className="flex justify-center items-center p-4">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>{emptyMessage}</CommandEmpty>
                                <CommandGroup>
                                    {options?.map((option) => (
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
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
