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

import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

// Props interface for DeleteContactDialog component
interface DeleteContactDialogProps {
  // Flag to control if the dialog is open or closed
  isOpen: boolean
  // Function to close the dialog
  onCloseAction: () => void
  // The ID of the contact to be deleted
  contactId: string
  // The name of the contact to display in the dialog
  contactName: string
}

/**
 * DeleteContactDialog component.
 * This component renders a confirmation dialog for deleting a contact.
 * It asks the user to confirm the deletion action, and if confirmed,
 * it triggers a mutation to delete the contact.
 *
 * @param {DeleteContactDialogProps} props - The component's props, including the state to control the dialog's visibility,
 *                                            the contact ID to delete, and the contact name to show in the confirmation message.
 * @returns {JSX.Element} The rendered delete confirmation dialog.
 */
export function DeleteContactDialog({
  isOpen,
  onCloseAction,
  contactId,
  contactName,
}: DeleteContactDialogProps) {
  // Mutation hook to delete a contact using Convex API
  const deleteContact = useMutation(api.contact.deleteContact)

  /**
   * Handle the delete action.
   * This function will attempt to delete the contact, and show a success or error message accordingly.
   */
  const handleDelete = async () => {
    try {
      // Close the dialog after the delete action
      onCloseAction()
      // Display success toast
      toast("Contact has been deleted successfully")
      // Perform the delete mutation with the provided contactId
      await deleteContact({ contactId: contactId as Id<"contact"> })
    } catch (error) {
      // Handle any error during deletion
      console.error("Error deleting contact:", error)
      // Display failure toast in case of error
      toast("Contact deletion failed")
    }
  }

  return (
    // Alert dialog component from UI library
    <AlertDialog open={isOpen} onOpenChange={onCloseAction}>
      <AlertDialogContent>
        {/* Header section of the dialog */}
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-medium">{contactName}</span>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Footer section with action buttons */}
        <AlertDialogFooter>
          {/* Cancel button to close the dialog without performing any action */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Delete button which triggers the deletion process */}
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
