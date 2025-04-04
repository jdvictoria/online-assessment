"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { CalendarIcon } from "lucide-react"

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
  const parsedDate = value ? parseISO(value) : undefined
  const [date, setDate] = React.useState<Date | undefined>(parsedDate)

  React.useEffect(() => {
    if (value && !date) {
      setDate(parseISO(value))
    }
  }, [value])

  const handleSelect = (selectedDate?: Date) => {
    setDate(selectedDate)

    if (onChange && selectedDate) {
      const isoDate = selectedDate.toISOString().split("T")[0] // YYYY-MM-DD
      const syntheticEvent = {
        target: {
          name,
          value: isoDate,
        },
      } as React.ChangeEvent<HTMLInputElement>

      onChange(syntheticEvent)
    }
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50">
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input to maintain controlled behavior */}
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
