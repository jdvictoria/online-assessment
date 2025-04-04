"use client"

import type React from "react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

import { useContacts } from "@/contexts/contacts-context"

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


interface AddEditContactModalProps {
  isOpen: boolean
  onCloseAction: () => void
}

export function AddEditContactModal({ isOpen, onCloseAction }: AddEditContactModalProps) {
  const { validateEmail, selectedContact, modalMode } = useContacts()

  const isEditMode = modalMode === "edit"

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    birthday: "",
    notes: "",
    image: "/placeholder.svg?height=100&width=100",
    lastContact: new Date().toISOString().split("T")[0],
  })

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
  })

  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Populate form data when editing an existing contact
  useEffect(() => {
    if (isEditMode && selectedContact) {
      setFormData({
        firstName: selectedContact.firstName,
        lastName: selectedContact.lastName,
        email: selectedContact.email,
        phone: selectedContact.phone || "",
        company: selectedContact.company || "",
        role: selectedContact.occupation || "",
        birthday: selectedContact.birthday || "",
        notes: selectedContact.notes || "",
        image: selectedContact.image || "",
        lastContact: selectedContact.lastContact,
      })
      setImagePreview(selectedContact.image || "")
    } else {
      // Reset form for adding a new contact
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        birthday: "",
        notes: "",
        image: "/placeholder.svg?height=100&width=100",
        lastContact: new Date().toISOString().split("T")[0],
      })
      setImagePreview("")
    }
  }, [isEditMode, selectedContact, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !validateEmail(formData.email),
    }

    setErrors(newErrors)

    if (newErrors.firstName) {
      return false
    }

    if (newErrors.lastName) {
      return false
    }

    if (newErrors.email) {
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (isEditMode && selectedContact) {
      // updateContact(selectedContact.id, formData)
    } else {
      // addContact(formData)
    }

    onCloseAction()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl text-[#1E7FDF]">
            {isEditMode ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
          <div className="flex gap-2">
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

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#1E7FDF]/20 bg-slate-100">
                  {imagePreview ? (
                    <Image
                      src={imagePreview || "/placeholder.svg"}
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
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-[#1E7FDF] text-white p-1.5 rounded-full shadow-md hover:bg-[#1E7FDF]/90 transition-colors"
                >
                  <Upload size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#1E7FDF]" />
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#1E7FDF]" />
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#1E7FDF]" />
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500">Please enter a valid email address</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#1E7FDF]" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50"
                />
              </div>
            </div>

            {/* Role and Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#1E7FDF]" />
                  Role
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
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
                  value={formData.company}
                  onChange={handleChange}
                  className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50"
                />
              </div>
            </div>

            {/* Birthday and Last Contact Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthday" className="flex items-center gap-2">
                  <Cake className="h-4 w-4 text-[#1E7FDF]" />
                  Birthday
                </Label>
                <CalendarInput
                  id="lastContact"
                  name="lastContact"
                  value={formData.birthday}
                  onChange={handleChange}
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
                  value={formData.lastContact}
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
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="border-[#1E7FDF]/20 focus-visible:ring-[#1E7FDF]/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCloseAction}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1E7FDF] hover:bg-[#1E7FDF]/90">
              {isEditMode ? "Save Changes" : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
