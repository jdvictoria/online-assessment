"use client"

import * as React from "react"
import { format, parseISO, isValid } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

type CalendarInputProps = {
  id?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function CalendarInput({
  id,
  name,
  value,
  onChange,
}: CalendarInputProps) {
  const date = value ? parseISO(value) : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (!onChange || !date || !isValid(date)) return

    const localDateString = date.toLocaleDateString("en-CA")

    const event = {
      target: {
        name: name || "",
        value: localDateString,
      },
    } as React.ChangeEvent<HTMLInputElement>

    onChange(event)
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50">
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(parseISO(value), "PPP") : "Select date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input to keep form controlled */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value || ""}
        onChange={onChange}
      />
    </>
  )
}
