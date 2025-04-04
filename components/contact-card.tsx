"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

import { formatDate } from "@/lib/utils"

import type { Contact } from "@/types/contact"

interface ContactCardProps {
  contact: Contact
  onClickAction: () => void
}

export function ContactCard({ contact, onClickAction }: ContactCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-[#1E7FDF]/10 hover:border-[#1E7FDF]/30"
      onClick={onClickAction}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4 gap-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#1E7FDF]/20">
            <Image
              src={contact.profileImage || "/placeholder.svg"}
              alt={`${contact.firstName} ${contact.lastName}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground truncate">
              {contact.role && contact.company ? (
                <>
                  <span>{contact.role}</span>
                  <span className="text-xs mx-1">•</span>
                  <span>{contact.company}</span>
                </>
              ) : (
                <span>{contact.role || contact.company}</span>
              )}
            </div>
            <p className="text-xs text-[#1E7FDF] mt-1">Last contact: {formatDate(contact.lastContactDate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
