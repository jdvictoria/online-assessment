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

/**
 * ContactsList component.
 * This component renders a list of contacts with search, sort, and add functionalities.
 * It also handles opening modals for adding/editing and viewing contact details.
 *
 * @returns {JSX.Element} The rendered contacts list with UI elements for sorting, searching, and adding contacts.
 */
export function ContactsList() {
  // Destructuring necessary state and methods from the contacts context
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

  // State to manage the visibility of the "Add Contact" modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  /**
   * Function to determine the appropriate sort icon based on the current sort direction.
   *
   * @returns {JSX.Element} The icon to represent the current sort state.
   */
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

  /**
   * Function to handle opening the "Add Contact" modal and setting the mode to "add".
   */
  const handleAddClick = () => {
    setModalMode("add") // Set modal mode to "add" for creating a new contact
    setIsAddModalOpen(true) // Open the modal
  }

  return (
    <div className="space-y-6">
      {/* Header section with search and sort options */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          {/* Search input */}
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)} // Update search query in context
          />
        </div>
        {/* Sorting and adding buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Dropdown menu for sorting options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                {getSortIcon()} {/* Display sort icon based on current state */}
                <span className="hidden sm:inline">Sort by date</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Sort options */}
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

          {/* Button to trigger the Add Contact modal */}
          <Button onClick={handleAddClick} className="whitespace-nowrap bg-[#1E7FDF] hover:bg-[#1E7FDF]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Render contacts or empty state */}
      {enrichedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrichedList.map((contact) => (
            // ContactCard for each contact in the enriched list
            <ContactCard key={contact._id} contact={contact} onClickAction={() => selectContact(contact)} />
          ))}
        </div>
      ) : searchQuery ? (
        // Show message if no contacts are found after searching
        <div className="col-span-full text-center py-10 text-muted-foreground bg-slate-50 rounded-lg">
          <Search className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-lg font-medium">No contacts found</p>
          <p className="text-sm">Try adjusting your search or add a new contact.</p>
        </div>
      ) : (
        // Show empty state message if there are no contacts and no search query
        <EmptyContacts onAddClickAction={handleAddClick} />
      )}

      {/* Modals for adding/editing a contact and viewing contact details */}
      <AddEditContactModal isOpen={isAddModalOpen} onParentCloseAction={undefined} onCloseAction={() => setIsAddModalOpen(false)} />
      {selectedContact && <ContactDetailModal isOpen={!!selectedContact} onCloseAction={() => selectContact(null)} />}
    </div>
  )
}
