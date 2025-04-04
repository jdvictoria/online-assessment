"use client"

import type React from "react";
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

import { formatDate } from "@/lib/utils"

import { UserRound } from "lucide-react";

import type { Contact } from "@/types/contact"

interface ContactCardProps {
  contact: Contact
  onClickAction: () => void
}

export function ContactCard({ contact, onClickAction }: ContactCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-[#1E7FDF]/10 hover:border-[#1E7FDF]/30 p-0"
      onClick={onClickAction}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4 gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-[#1E7FDF]/20 bg-slate-100">
            {contact.profileImage ? (
              <Image
                src={contact.profileImage || "/placeholder.svg"}
                alt={`${contact.firstName} ${contact.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400">
                <UserRound size={25} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            <div className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
              {contact.role && contact.company ? (
                <span>
                  {contact.role} <span className="mx-1 text-xs">•</span> {contact.company}
                </span>
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
