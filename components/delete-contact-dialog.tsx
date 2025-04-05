"use client"

import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface DeleteContactDialogProps {
  isOpen: boolean
  onCloseAction: () => void
  contactId: string
  contactName: string
}

export function DeleteContactDialog({ isOpen, onCloseAction, contactId, contactName }: DeleteContactDialogProps) {
  const deleteContact = useMutation(api.contact.deleteContact)

  const handleDelete = async () => {
    try {
      onCloseAction()
      toast("Contact has been deleted successfully")
      await deleteContact({ contactId: contactId as Id<"contact"> })
    } catch (error) {
      console.error("Error deleting contact:", error)
      toast("Contact has been deleted failure")
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onCloseAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-medium">{contactName}</span>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
