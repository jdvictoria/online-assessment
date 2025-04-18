"use client"

import type React from "react"
import Image from "next/image"
import { useRef, useEffect } from "react"

import { useContacts } from "@/contexts/contacts-context"
import { FormProvider, useForm } from "@/contexts/form-context";

import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { CalendarInput } from "@/components/calendar-input";

import {
  Camera,
  Upload,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Briefcase,
  Cake,
  X
} from "lucide-react"

import { Contact } from "@/types/contact";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface AddEditContactModalProps {
  isOpen: boolean;  // Controls whether the modal is open or closed
  onParentCloseAction?: () => void;  // Optional action to be called after closing modal
  onCloseAction: () => void;  // Action to close the modal
}

/**
 * The modal component that allows users to add or edit contacts.
 * It displays a form with input fields for contact details like name, email, phone, etc.
 *
 * @param {AddEditContactModalProps} props - Contains modal state, close actions, and mode.
 *
 * @returns {JSX.Element} The rendered modal.
 */
export function AddEditContactModal({ isOpen, onParentCloseAction, onCloseAction }: AddEditContactModalProps) {
  const { selectedContact, modalMode } = useContacts()

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <FormProvider>
          {/* Form for adding or editing a contact */}
          <AddEditContactForm
            onClose={onCloseAction}
            onParentCloseAction={onParentCloseAction}
            isEditMode={modalMode === "edit"}
            selectedContact={selectedContact}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

interface AddEditContactFormProps {
  onClose: () => void;  // Action to close the modal
  onParentCloseAction?: () => void;  // Optional action for parent component after closing modal
  isEditMode: boolean;  // Whether the form is in edit mode (editing an existing contact)
  selectedContact: Contact | null;  // The selected contact to edit, if any
}

/**
 * Form for adding or editing a contact's details. Handles form initialization, validation, and submission.
 *
 * @param {AddEditContactFormProps} props - The form props containing the contact details, edit mode, and actions.
 *
 * @returns {JSX.Element} The rendered form inside the modal.
 */
function AddEditContactForm({
                              onClose,
                              onParentCloseAction,
                              isEditMode,
                              selectedContact
                            }: AddEditContactFormProps) {
  const { state, dispatch, handleChange, handleImageChange, validateForm, resetForm, initializeForm, getFormValues } = useForm()

  const createContact = useMutation(api.contact.createContact);
  const updateContact = useMutation(api.contact.updateContact);

  const createUrl = useMutation(api.media.createUrl);
  const uploadPhoto = useMutation(api.media.uploadPhoto);

  const didInit = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize the form when editing an existing contact
  useEffect(() => {
    if (!didInit.current) {
      if (isEditMode && selectedContact) {
        initializeForm(selectedContact)  // Populate form fields with selected contact data
      } else {
        resetForm()  // Reset form if creating a new contact
      }
      didInit.current = true
    }
  }, [isEditMode, selectedContact, initializeForm, resetForm])

  /**
   * Handles the image upload from the user.
   * Ensures the image is under 5MB and sets the image preview URL.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event triggered by selecting a file
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {  // Ensure file is less than 5MB
      toast("Image size exceeds 5MB")
      return;
    }

    const previewUrl = URL.createObjectURL(file)
    handleImageChange(previewUrl)
    dispatch({ type: "SET_IMAGE_FILE", value: file })
  }

  /**
   * Uploads the selected image to the server if the contact is saved or updated.
   *
   * @param {Id<"contact">} contactId - The ID of the contact for which the image is being uploaded
   */
  async function handleSendImage(contactId: Id<"contact">) {
    if (!state.values.imageFile) return;

    const { uploadUrl } = await createUrl();  // Get the URL to upload the image
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": state.values.imageFile.type,
      },
      body: state.values.imageFile,
    });

    const { storageId } = await result.json();
    await uploadPhoto({ storageId, contactId });  // Upload photo to the server
  }

  /**
   * Handles the form submission, either adding a new contact or updating an existing contact.
   *
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!validateForm()) {  // Validate the form before submitting
        return
      }

      const formValues = getFormValues()
      const { _id, ...payload } = formValues

      if (isEditMode && selectedContact) {
        // Update the existing contact
        await updateContact({
          contactId: _id,
          updates: payload
        })

        if (state.values.imageFile) {
          await handleSendImage(_id);  // Upload the image if present
        }
        toast("Contact has been updated successfully")
      } else {
        // Create a new contact
        const contactId = await createContact(payload);

        if (state.values.imageFile) {
          await handleSendImage(contactId);  // Upload the image if present
        }
        toast("Contact has been added successfully")
      }

      onClose()
      if (onParentCloseAction) {
        onParentCloseAction()  // Call optional parent close action
      }
    } catch (error) {
      toast.error(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <>
      <DialogHeader className="flex flex-row items-center justify-between">
        <DialogTitle className="text-2xl text-[#1E7FDF]">
          {isEditMode ? "Edit Contact" : "Add New Contact"}
        </DialogTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-black-500"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#1E7FDF]/20 bg-slate-100">
                {state.values.image ? (
                  <Image
                    src={state.values.image || "/placeholder.svg"}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <Camera size={40} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#1E7FDF] text-white p-1.5 rounded-full shadow-md hover:bg-[#1E7FDF]/90 transition-colors"
              >
                <Upload size={15} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#1E7FDF]" />
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={state.values.firstName}
                onChange={handleChange}
                className={`border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50 ${
                  state.errors.firstName ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#1E7FDF]" />
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={state.values.lastName}
                onChange={handleChange}
                className={`border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50 ${
                  state.errors.lastName ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1E7FDF]" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={state.values.email}
                onChange={handleChange}
                className={`border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50 ${
                  state.errors.email ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastContact" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#1E7FDF]" />
                Last Contact Date
              </Label>
              <CalendarInput
                id="lastContact"
                name="lastContact"
                value={state.values.lastContact}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Role and Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="occupation" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#1E7FDF]" />
                Role
              </Label>
              <Input
                id="occupation"
                name="occupation"
                value={state.values.occupation}
                onChange={handleChange}
                className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-4 w-4 text-[#1E7FDF]" />
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={state.values.company}
                onChange={handleChange}
                className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50"
              />
            </div>
          </div>

          {/* Birthday and Last Contact Date with Calendar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#1E7FDF]" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={state.values.phone}
                onChange={handleChange}
                className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthday" className="flex items-center gap-2">
                <Cake className="h-4 w-4 text-[#1E7FDF]" />
                Birthday
              </Label>
              <CalendarInput
                id="birthday"
                name="birthday"
                value={state.values.birthday}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#1E7FDF]" />
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={state.values.notes}
              onChange={handleChange}
              rows={3}
              className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!state.isDirty} className="bg-[#1E7FDF] hover:bg-[#1E7FDF]/90">
            {isEditMode ? "Save Changes" : "Add Contact"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
