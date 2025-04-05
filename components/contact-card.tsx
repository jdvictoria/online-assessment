"use client"

import type React from "react";
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

import { formatDate } from "@/lib/utils"

import { UserRound } from "lucide-react";

import type { Contact } from "@/types/contact"

interface ContactCardProps {
  contact: Contact;  // Contact object containing contact information
  onClickAction: () => void;  // Callback function to be executed when the card is clicked
}

/**
 * ContactCard component.
 * This component displays the information of a single contact in a card format.
 * It includes the contact's image, name, occupation, company, and the date of the last contact.
 * When the card is clicked, it triggers a provided callback function (`onClickAction`).
 *
 * @param {ContactCardProps} props - The props containing contact information and the click handler.
 *
 * @returns {JSX.Element} The rendered ContactCard.
 */
export function ContactCard({ contact, onClickAction }: ContactCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-[#1E7FDF]/10 hover:border-[#1E7FDF]/30 p-0"
      onClick={onClickAction} // Trigger onClickAction when the card is clicked
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4 gap-4">
          {/* Contact profile image */}
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-[#1E7FDF]/20 bg-slate-100">
            {contact.image ? (
              // Display contact image if available
              <Image
                src={contact.image || "/placeholder.svg"}
                alt={`${contact.firstName} ${contact.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              // Display a default avatar if no image is available
              <div className="h-full w-full flex items-center justify-center text-slate-400">
                <UserRound size={25} />
              </div>
            )}
          </div>

          {/* Contact name, occupation, company, and last contact date */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">
              {contact.firstName} {contact.lastName} {/* Display contact's full name */}
            </h3>
            <div className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
              {/* Display occupation and company if available */}
              {contact.occupation && contact.company ? (
                <span>
                  {contact.occupation} <span className="mx-1 text-xs">•</span> {contact.company}
                </span>
              ) : (
                <span>{contact.occupation || contact.company}</span>
              )}
            </div>
            {/* Display last contact date formatted */}
            <p className="text-xs text-[#1E7FDF] mt-1">Last contact: {formatDate(contact.lastContact)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
