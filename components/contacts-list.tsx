"use client"

import { useState } from "react"

import { useContacts } from "@/contexts/contacts-context"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { ContactCard } from "@/components/contact-card"
import { AddEditContactModal } from "@/components/add-edit-contact-modal"
import { ContactDetailModal } from "@/components/contact-detail-modal"
import { EmptyContacts } from "@/components/empty-contacts"

import { Search, ArrowUpDown, ArrowDown, ArrowUp, Plus } from "lucide-react"

export function ContactsList() {
  const {
    enrichedList,
    searchQuery,
    sortDirection,
    selectedContact,
    updateSearchQuery,
    updateSortDirection,
    selectContact,
    setModalMode,
  } = useContacts()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const getSortIcon = () => {
    switch (sortDirection) {
      case "asc":
        return <ArrowUp className="h-4 w-4" />
      case "desc":
        return <ArrowDown className="h-4 w-4" />
      default:
        return <ArrowUpDown className="h-4 w-4" />
    }
  }

  const handleAddClick = () => {
    setModalMode("add")
    setIsAddModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                {getSortIcon()}
                <span className="hidden sm:inline">Sort by date</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateSortDirection("none")}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <span>Default</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSortDirection("asc")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                <span>Oldest first</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSortDirection("desc")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                <span>Newest first</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAddClick} className="whitespace-nowrap bg-[#1E7FDF] hover:bg-[#1E7FDF]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {enrichedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrichedList.map((contact) => (
            <ContactCard key={contact._id} contact={contact} onClickAction={() => selectContact(contact)} />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="col-span-full text-center py-10 text-muted-foreground bg-slate-50 rounded-lg">
          <Search className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-lg font-medium">No contacts found</p>
          <p className="text-sm">Try adjusting your search or add a new contact.</p>
        </div>
      ) : (
        <EmptyContacts onAddClickAction={handleAddClick} />
      )}

      <AddEditContactModal isOpen={isAddModalOpen} onCloseAction={() => setIsAddModalOpen(false)} />

      {selectedContact && <ContactDetailModal isOpen={!!selectedContact} onCloseAction={() => selectContact(null)} />}
    </div>
  )
}
