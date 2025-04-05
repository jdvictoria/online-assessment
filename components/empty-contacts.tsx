"use client"

import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"

// Props interface for the EmptyContacts component
interface EmptyContactsProps {
  // Function to handle the "Add Contact" button click event
  onAddClickAction: () => void
}

/**
 * EmptyContacts component.
 * This component is displayed when there are no contacts in the list. It provides
 * a button to add the first contact to the list.
 *
 * @param {EmptyContactsProps} props - The component's props, including the action handler for adding a contact.
 * @returns {JSX.Element} The rendered component.
 */
export function EmptyContacts({ onAddClickAction }: EmptyContactsProps) {
  return (
    <div className="text-center py-16 px-4 bg-[#1E7FDF]/5 rounded-lg border border-[#1E7FDF]/10">
      {/* Display the Users icon */}
      <Users className="h-16 w-16 mx-auto text-[#1E7FDF]/40 mb-4" />

      {/* Heading for the empty state */}
      <h3 className="text-xl font-medium mb-2">No contacts yet</h3>

      {/* Description of the empty state */}
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Your contacts list is empty. Add your first contact to get started with organizing your network.
      </p>

      {/* Button to trigger the action for adding a new contact */}
      <Button onClick={onAddClickAction} className="bg-[#1E7FDF] hover:bg-[#1E7FDF]/90">
        {/* Plus icon for the button */}
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Contact
      </Button>
    </div>
  )
}
