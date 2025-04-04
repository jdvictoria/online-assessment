"use client"

import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"

interface EmptyContactsProps {
  onAddClickAction: () => void
}

export function EmptyContacts({ onAddClickAction }: EmptyContactsProps) {
  return (
    <div className="text-center py-16 px-4 bg-[#1E7FDF]/5 rounded-lg border border-[#1E7FDF]/10">
      <Users className="h-16 w-16 mx-auto text-[#1E7FDF]/40 mb-4" />
      <h3 className="text-xl font-medium mb-2">No contacts yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Your contacts list is empty. Add your first contact to get started with organizing your network.
      </p>
      <Button onClick={onAddClickAction} className="bg-[#1E7FDF] hover:bg-[#1E7FDF]/90">
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Contact
      </Button>
    </div>
  )
}
