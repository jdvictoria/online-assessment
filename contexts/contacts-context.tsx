"use client"

import React, { useEffect, createContext, useContext, useReducer, type ReactNode, useMemo } from "react"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import type { Contact } from "@/types/contact"

type SortDirection = "none" | "asc" | "desc"
type ModalMode = "add" | "edit"

type ActionType =
  | { type: "SET_CONTACTS"; payload: Contact[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SORT_DIRECTION"; payload: SortDirection }
  | { type: "SELECT_CONTACT"; payload: Contact | null }
  | { type: "SET_MODAL_MODE"; payload: ModalMode }

interface ContactsState {
  contacts: Contact[]
  searchQuery: string
  sortDirection: SortDirection
  selectedContact: Contact | null
  modalMode: ModalMode
}

interface ContactsContextType extends ContactsState {
  enrichedList: Contact[]
  dispatch: React.Dispatch<ActionType>
  updateSearchQuery: (query: string) => void
  updateSortDirection: (direction: SortDirection) => void
  selectContact: (contact: Contact | null) => void
  setModalMode: (mode: ModalMode) => void
}

const initialState: ContactsState = {
  contacts: [],
  searchQuery: "",
  sortDirection: "none",
  selectedContact: null,
  modalMode: "add",
}

function contactsReducer(state: ContactsState, action: ActionType): ContactsState {
  switch (action.type) {
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_SORT_DIRECTION":
      return { ...state, sortDirection: action.payload }
    case "SELECT_CONTACT":
      return { ...state, selectedContact: action.payload }
    case "SET_MODAL_MODE":
      return { ...state, modalMode: action.payload }
    default:
      return state
  }
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contactsReducer, initialState)

  const contacts = useQuery(api.contact.fetchAllContacts)

  useEffect(() => {
    if (contacts) {
      dispatch({ type: "SET_CONTACTS", payload: contacts })
    }
  }, [contacts])

  // Memoize enrichedList calculation
  const enrichedList = useMemo(() => {
    const filtered = state.contacts.filter((contact) =>
      [`${contact.firstName} ${contact.lastName}`, contact.email, contact.company, contact.occupation]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(state.searchQuery.toLowerCase()))
    )

    if (state.sortDirection !== "none") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.lastContact).getTime()
        const dateB = new Date(b.lastContact).getTime()
        return state.sortDirection === "asc" ? dateA - dateB : dateB - dateA
      })
    }

    return filtered
  }, [state.contacts, state.searchQuery, state.sortDirection])

  const updateSearchQuery = (query: string) =>
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })

  const updateSortDirection = (direction: SortDirection) =>
    dispatch({ type: "SET_SORT_DIRECTION", payload: direction })

  const selectContact = (contact: Contact | null) =>
    dispatch({ type: "SELECT_CONTACT", payload: contact })

  const setModalMode = (mode: ModalMode) =>
    dispatch({ type: "SET_MODAL_MODE", payload: mode })

  return (
    <ContactsContext.Provider
      value={{
        ...state,
        enrichedList,
        dispatch,
        updateSearchQuery,
        updateSortDirection,
        selectContact,
        setModalMode,
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export function useContacts() {
  const context = useContext(ContactsContext)
  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider")
  }
  return context
}
