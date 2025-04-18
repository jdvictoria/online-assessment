"use client"

import React, { useState } from "react"
import Image from "next/image"

import { useContacts } from "@/contexts/contacts-context"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { DeleteContactDialog } from "@/components/delete-contact-dialog"
import { AddEditContactModal } from "@/components/add-edit-contact-modal"

import { Mail, Phone, Calendar, Edit, Trash2, Briefcase, Cake, X, UserRound } from "lucide-react"

import { formatDate } from "@/lib/utils"

interface ContactDetailModalProps {
  isOpen: boolean
  onCloseAction: () => void
}

/**
 * ContactDetailModal component.
 * This component displays the details of a selected contact in a dialog modal.
 * It provides functionality for editing, deleting, and viewing the contact's information like email, phone number, and birthday.
 *
 * @param {boolean} isOpen - Whether the modal is open or closed.
 * @param {function} onCloseAction - Function to close the modal.
 *
 * @returns {JSX.Element} The rendered contact detail modal.
 */
export function ContactDetailModal({ isOpen, onCloseAction }: ContactDetailModalProps) {
  // Destructuring selected contact and modal control functions from contacts context
  const { selectedContact: contact, setModalMode } = useContacts()

  // Local state to manage delete confirmation dialog and edit modal visibility
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // If no contact is selected, return null to avoid rendering modal
  if (!contact) return null

  /**
   * Handle opening the edit modal when the "Edit" button is clicked.
   * Sets modal mode to "edit" and opens the edit modal.
   */
  const handleEditClick = () => {
    setModalMode("edit") // Set the modal mode to "edit"
    setIsEditModalOpen(true) // Open the "Edit Contact" modal
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onCloseAction}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl">Contact Details</DialogTitle>
            <div className="flex gap-2">
              {/* Edit button */}
              <Button variant="outline" size="icon" className="h-8 w-8 text-[#1E7FDF]" onClick={handleEditClick}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              {/* Delete button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
              {/* Close button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-black-500"
                onClick={onCloseAction}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            {/* Contact profile details */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#1E7FDF]/20 bg-slate-100">
                {contact.image ? (
                  // Display contact image if available
                  <Image
                    src={contact.image || "/placeholder.svg"}
                    alt={`${contact.firstName} ${contact.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  // Display a default avatar if no image is provided
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <UserRound size={40} />
                  </div>
                )}
              </div>

              {/* Contact name and optional occupation/company */}
              <div>
                <h2 className="text-2xl font-bold">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.occupation && <p className="text-muted-foreground">{contact.occupation}</p>}
                {contact.company && <p className="text-muted-foreground">{contact.company}</p>}
              </div>
            </div>

            {/* Contact details (email, phone, occupation, etc.) */}
            <div className="grid gap-4 p-4 bg-[#1E7FDF]/5 rounded-lg">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="bg-[#1E7FDF] p-2 rounded-full">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <a href={`mailto:${contact.email}`} className="text-[#1E7FDF] hover:underline">
                  {contact.email}
                </a>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#1E7FDF] p-2 rounded-full">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}

              {/* Occupation and Company */}
              {(contact.occupation || contact.company) && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#1E7FDF] p-2 rounded-full">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <span>
                    {contact.occupation && contact.company
                      ? `${contact.occupation} at ${contact.company}`
                      : contact.occupation || contact.company}
                  </span>
                </div>
              )}

              {/* Birthday */}
              {contact.birthday && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#1E7FDF] p-2 rounded-full">
                    <Cake className="h-4 w-4 text-white" />
                  </div>
                  <span>Birthday: {formatDate(contact.birthday)}</span>
                </div>
              )}

              {/* Last contact date */}
              <div className="flex items-center gap-3">
                <div className="bg-[#1E7FDF] p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span>Last contact: {formatDate(contact.lastContact)}</span>
              </div>
            </div>

            {/* Notes section */}
            {contact.notes && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-lg">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap p-4 bg-slate-50 rounded-lg">{contact.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete contact confirmation dialog */}
      <DeleteContactDialog
        isOpen={isDeleteDialogOpen}
        onCloseAction={() => {
          onCloseAction();
          setIsDeleteDialogOpen(false) // Close the delete dialog after deletion
        }}
        contactId={contact._id}
        contactName={`${contact.firstName} ${contact.lastName}`}
      />

      {/* Edit contact modal */}
      {isEditModalOpen && <AddEditContactModal isOpen={isEditModalOpen} onParentCloseAction={onCloseAction} onCloseAction={() => setIsEditModalOpen(false)} />}
    </>
  )
}
