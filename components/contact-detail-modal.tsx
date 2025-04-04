"use client"

import { useState } from "react"
import Image from "next/image"

import { useContacts } from "@/contexts/contacts-context"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { DeleteContactDialog } from "@/components/delete-contact-dialog"
import { AddEditContactModal } from "@/components/add-edit-contact-modal"

import { Mail, Phone, Calendar, Edit, Trash2, Briefcase, Cake } from "lucide-react"

import { formatDate } from "@/lib/utils"

interface ContactDetailModalProps {
  isOpen: boolean
  onCloseAction: () => void
}

export function ContactDetailModal({ isOpen, onCloseAction }: ContactDetailModalProps) {
  const { selectedContact: contact, setModalMode } = useContacts()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!contact) return null

  const handleEditClick = () => {
    setModalMode("edit")
    setIsEditModalOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onCloseAction}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl">Contact Details</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 text-[#1E7FDF]" onClick={handleEditClick}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#1E7FDF]/20">
                <Image
                  src={contact.profileImage || "/placeholder.svg"}
                  alt={`${contact.firstName} ${contact.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.role && <p className="text-muted-foreground">{contact.role}</p>}
                {contact.company && <p className="text-muted-foreground">{contact.company}</p>}
              </div>
            </div>

            <div className="grid gap-4 p-4 bg-[#1E7FDF]/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-[#1E7FDF] p-2 rounded-full">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <a href={`mailto:${contact.email}`} className="text-[#1E7FDF] hover:underline">
                  {contact.email}
                </a>
              </div>

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

              {(contact.role || contact.company) && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#1E7FDF] p-2 rounded-full">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <span>
                    {contact.role && contact.company
                      ? `${contact.role} at ${contact.company}`
                      : contact.role || contact.company}
                  </span>
                </div>
              )}

              {contact.birthday && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#1E7FDF] p-2 rounded-full">
                    <Cake className="h-4 w-4 text-white" />
                  </div>
                  <span>Birthday: {formatDate(contact.birthday)}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="bg-[#1E7FDF] p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span>Last contact: {formatDate(contact.lastContactDate)}</span>
              </div>
            </div>

            {contact.notes && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-lg">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap p-4 bg-slate-50 rounded-lg">{contact.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteContactDialog
        isOpen={isDeleteDialogOpen}
        onCloseAction={() => setIsDeleteDialogOpen(false)}
        contactId={contact.id}
        contactName={`${contact.firstName} ${contact.lastName}`}
      />

      {isEditModalOpen && <AddEditContactModal isOpen={isEditModalOpen} onCloseAction={() => setIsEditModalOpen(false)} />}
    </>
  )
}
