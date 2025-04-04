import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export function formatDateForInput(dateString: string): string {
  // Format date as YYYY-MM-DD for input[type="date"]
  return dateString ? new Date(dateString).toISOString().split("T")[0] : ""
}
