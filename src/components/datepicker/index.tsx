"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ptBR } from "date-fns/locale"

type DatePickerProps = {
    id?: string
    value: Date | null
    setValue: (value: Date | null) => void
    placeholder?: string
    disabled?: boolean
    className?: string
}
export function DatePicker({ id, value, setValue, placeholder, disabled, className }: DatePickerProps) {

    return (
        <Popover>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    id={id}
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : <span>{placeholder || 'Selecione uma data'}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value || undefined} // Convert null to undefined
                    onSelect={(day: Date | undefined) => setValue(day || null)}
                    initialFocus
                    disabled={disabled}
                    weekStartsOn={1}
                />
            </PopoverContent>
        </Popover>
    )
}
