"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

import type { Contact } from "@/types/contact"

type ActionType =
  | { type: "ADD_CONTACT"; payload: Omit<Contact, "id"> }
  | { type: "UPDATE_CONTACT"; payload: { id: string; contact: Omit<Contact, "id"> } }
  | { type: "DELETE_CONTACT"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SORT_DIRECTION"; payload: SortDirection }
  | { type: "SELECT_CONTACT"; payload: Contact | null }
  | { type: "SET_MODAL_MODE"; payload: ModalMode }

type SortDirection = "none" | "asc" | "desc"
type ModalMode = "add" | "edit"

interface ContactsState {
  contacts: Contact[]
  searchQuery: string
  sortDirection: SortDirection
  selectedContact: Contact | null
  modalMode: ModalMode
}

interface ContactsContextType extends ContactsState {
  filteredContacts: Contact[]
  dispatch: React.Dispatch<ActionType>
  addContact: (contact: Omit<Contact, "id">) => void
  updateContact: (id: string, updatedContact: Omit<Contact, "id">) => void
  deleteContact: (id: string) => void
  updateSearchQuery: (query: string) => void
  updateSortDirection: (direction: SortDirection) => void
  selectContact: (contact: Contact | null) => void
  setModalMode: (mode: ModalMode) => void
  validateEmail: (email: string) => boolean
}

// Initial state
const initialContacts: Contact[] = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Innovations",
    role: "Product Manager",
    birthday: "1985-06-15",
    lastContactDate: "2023-10-15",
    notes: "Met at the tech conference in San Francisco",
    profileImage: "",
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 987-6543",
    company: "Digital Solutions",
    role: "Software Engineer",
    birthday: "1990-03-22",
    lastContactDate: "2023-11-02",
    notes: "Potential client for the new project",
    profileImage: "",
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.j@example.com",
    phone: "+1 (555) 234-5678",
    company: "Creative Designs",
    role: "Graphic Designer",
    birthday: "1988-11-10",
    lastContactDate: "2023-11-20",
    notes: "Graphic designer with 5 years of experience",
    profileImage: "",
  },
]

const initialState: ContactsState = {
  contacts: initialContacts,
  searchQuery: "",
  sortDirection: "none",
  selectedContact: null,
  modalMode: "add",
}

// Reducer function
function contactsReducer(state: ContactsState, action: ActionType): ContactsState {
  switch (action.type) {
    case "ADD_CONTACT":
      return {
        ...state,
        contacts: [...state.contacts, { ...action.payload, id: Date.now().toString() }],
      }

    case "UPDATE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id ? { ...action.payload.contact, id: action.payload.id } : contact,
        ),
        selectedContact:
          state.selectedContact?.id === action.payload.id
            ? { ...action.payload.contact, id: action.payload.id }
            : state.selectedContact,
      }

    case "DELETE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter((contact) => contact.id !== action.payload),
        selectedContact: state.selectedContact?.id === action.payload ? null : state.selectedContact,
      }

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      }

    case "SET_SORT_DIRECTION":
      return {
        ...state,
        sortDirection: action.payload,
      }

    case "SELECT_CONTACT":
      return {
        ...state,
        selectedContact: action.payload,
      }

    case "SET_MODAL_MODE":
      return {
        ...state,
        modalMode: action.payload,
      }

    default:
      return state
  }
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contactsReducer, initialState)

  // Derived state - filtered contacts
  const filteredContacts = (() => {
    // First filter by search query
    let filtered = state.contacts.filter(
      (contact) =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        contact.role?.toLowerCase().includes(state.searchQuery.toLowerCase()),
    )

    // Then sort if needed
    if (state.sortDirection !== "none") {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.lastContactDate).getTime()
        const dateB = new Date(b.lastContactDate).getTime()
        return state.sortDirection === "asc" ? dateA - dateB : dateB - dateA
      })
    }

    return filtered
  })()

  // Action creators
  const addContact = (newContact: Omit<Contact, "id">) => {
    dispatch({ type: "ADD_CONTACT", payload: newContact })
  }

  const updateContact = (id: string, updatedContact: Omit<Contact, "id">) => {
    dispatch({ type: "UPDATE_CONTACT", payload: { id, contact: updatedContact } })
  }

  const deleteContact = (id: string) => {
    const contactToDelete = state.contacts.find((contact) => contact.id === id)
    if (!contactToDelete) return

    dispatch({ type: "DELETE_CONTACT", payload: id })
  }

  const updateSearchQuery = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })
  }

  const updateSortDirection = (direction: SortDirection) => {
    dispatch({ type: "SET_SORT_DIRECTION", payload: direction })
  }

  const selectContact = (contact: Contact | null) => {
    dispatch({ type: "SELECT_CONTACT", payload: contact })
  }

  const setModalMode = (mode: ModalMode) => {
    dispatch({ type: "SET_MODAL_MODE", payload: mode })
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <ContactsContext.Provider
      value={{
        ...state,
        filteredContacts,
        dispatch,
        addContact,
        updateContact,
        deleteContact,
        updateSearchQuery,
        updateSortDirection,
        selectContact,
        setModalMode,
        validateEmail,
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export function useContacts() {
  const context = useContext(ContactsContext)
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider")
  }
  return context
}
