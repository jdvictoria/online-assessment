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
  id?: string;  // Optional ID for the input element
  name?: string;  // Optional name for the input element
  value?: string;  // The selected date in ISO string format
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;  // The change handler for the input value
}

/**
 * CalendarInput component.
 * A custom input field for selecting a date from a calendar popover.
 * It displays the selected date in a button and updates the value when a new date is selected.
 *
 * @param {CalendarInputProps} props - The component props containing ID, name, value, and onChange handler.
 *
 * @returns {JSX.Element} The rendered CalendarInput component with a popover calendar.
 */
export function CalendarInput({
                                id,
                                name,
                                value,
                                onChange,
                              }: CalendarInputProps) {
  // Parse the value to a Date object if it exists
  const date = value ? parseISO(value) : undefined

  /**
   * Handle date selection from the calendar.
   * Updates the input field value with the selected date in ISO format.
   *
   * @param {Date | undefined} date - The selected date or undefined if no date is selected.
   */
  const handleDateSelect = (date: Date | undefined) => {
    if (!onChange || !date || !isValid(date)) return // Return early if no change handler or invalid date

    // Convert the date to a locale-based string format (en-CA format)
    const localDateString = date.toLocaleDateString("en-CA")

    // Create a change event with the selected date value
    const event = {
      target: {
        name: name || "",  // Use provided name prop or an empty string
        value: localDateString,  // Set the value as the formatted date string
      },
    } as React.ChangeEvent<HTMLInputElement>

    // Trigger the onChange handler with the custom event
    onChange(event)
  }

  return (
    <>
      {/* Popover component to show the calendar when triggered */}
      <Popover>
        {/* Button to display the selected date or a placeholder text */}
        <PopoverTrigger asChild className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50">
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground"  // Show muted color if no value is selected
            )}
          >
            {value ? format(parseISO(value), "PPP") : "Select date"}  {/* Display formatted date or placeholder */}
          </Button>
        </PopoverTrigger>

        {/* Popover content containing the calendar */}
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"  // Single date selection mode
            selected={date}  // Set the currently selected date
            onSelect={handleDateSelect}  // Handle date selection
            initialFocus  // Focus the calendar initially
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input to maintain form control */}
      <input
        type="hidden"  // Hidden input used for form submission
        id={id}  // Optional ID for the input element
        name={name}  // Optional name for the input element
        value={value || ""}  // Set the value to the selected date or an empty string
        onChange={onChange}  // Pass the onChange handler to handle form updates
      />
    </>
  )
}
