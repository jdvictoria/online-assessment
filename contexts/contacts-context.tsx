"use client"

import React, { useEffect, createContext, useContext, useReducer, type ReactNode, useMemo } from "react"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import type { Contact } from "@/types/contact"

// Type for sorting direction, which can be 'none', 'asc', or 'desc'
type SortDirection = "none" | "asc" | "desc"

// Type for modal mode, which can be 'add' or 'edit'
type ModalMode = "add" | "edit"

// Action types: Defines all possible actions that can be dispatched to the reducer.
type ActionType =
  | { type: "SET_CONTACTS"; payload: Contact[] } // Set the contacts list
  | { type: "SET_SEARCH_QUERY"; payload: string } // Update the search query
  | { type: "SET_SORT_DIRECTION"; payload: SortDirection } // Set the sorting direction for contacts
  | { type: "SELECT_CONTACT"; payload: Contact | null } // Select a specific contact or deselect
  | { type: "SET_MODAL_MODE"; payload: ModalMode } // Set the current modal mode (add or edit)

// Contacts state: Defines the shape of the state managed by the reducer.
interface ContactsState {
  contacts: Contact[] // List of contacts
  searchQuery: string // Search query used to filter contacts
  sortDirection: SortDirection // Sort direction for contacts
  selectedContact: Contact | null // Currently selected contact
  modalMode: ModalMode // Current modal mode (add or edit)
}

// ContactsContextType: Defines the context value, including state and dispatch functions.
interface ContactsContextType extends ContactsState {
  enrichedList: Contact[] // Enriched list of contacts based on search and sorting
  dispatch: React.Dispatch<ActionType> // Dispatch function to update the state
  updateSearchQuery: (query: string) => void // Function to update the search query
  updateSortDirection: (direction: SortDirection) => void // Function to update the sort direction
  selectContact: (contact: Contact | null) => void // Function to select a contact
  setModalMode: (mode: ModalMode) => void // Function to set the modal mode
}

// Initial state: Default state values for the contacts management
const initialState: ContactsState = {
  contacts: [],
  searchQuery: "",
  sortDirection: "none", // No sorting by default
  selectedContact: null,
  modalMode: "add", // Default mode is 'add'
}

// Reducer function: Manages state changes based on the dispatched actions.
function contactsReducer(state: ContactsState, action: ActionType): ContactsState {
  switch (action.type) {
    case "SET_CONTACTS":
      // Set the list of contacts in the state
      return { ...state, contacts: action.payload }
    case "SET_SEARCH_QUERY":
      // Update the search query in the state
      return { ...state, searchQuery: action.payload }
    case "SET_SORT_DIRECTION":
      // Update the sort direction in the state
      return { ...state, sortDirection: action.payload }
    case "SELECT_CONTACT":
      // Select or deselect a contact
      return { ...state, selectedContact: action.payload }
    case "SET_MODAL_MODE":
      // Set the current modal mode (add or edit)
      return { ...state, modalMode: action.payload }
    default:
      return state
  }
}

// Create context: Initializes the context for managing contacts state and actions.
const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

/**
 * ContactsProvider component.
 * This component provides the contacts state and actions to its children through context.
 *
 * @param {ReactNode} children - The child components that will have access to the context.
 * @returns {JSX.Element} The ContactsContext provider wrapping the children components.
 */
export function ContactsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contactsReducer, initialState)

  // Fetch contacts using Convex's useQuery hook
  const contacts = useQuery(api.contact.fetchAllContacts)

  useEffect(() => {
    // When contacts data is available, dispatch the SET_CONTACTS action
    if (contacts) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      dispatch({ type: "SET_CONTACTS", payload: contacts })
    }
  }, [contacts])

  // Memoized enrichedList calculation
  const enrichedList = useMemo(() => {
    // Filter contacts based on the search query
    const filtered = state.contacts.filter((contact) =>
      [`${contact.firstName} ${contact.lastName}`, contact.email, contact.company, contact.occupation]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(state.searchQuery.toLowerCase()))
    )

    // Sort the filtered contacts based on the selected sort direction
    if (state.sortDirection !== "none") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.lastContact).getTime()
        const dateB = new Date(b.lastContact).getTime()
        return state.sortDirection === "asc" ? dateA - dateB : dateB - dateA
      })
    }

    return filtered
  }, [state.contacts, state.searchQuery, state.sortDirection])

  // Function to update the search query in the state
  const updateSearchQuery = (query: string) =>
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })

  // Function to update the sort direction in the state
  const updateSortDirection = (direction: SortDirection) =>
    dispatch({ type: "SET_SORT_DIRECTION", payload: direction })

  // Function to select or deselect a contact
  const selectContact = (contact: Contact | null) =>
    dispatch({ type: "SELECT_CONTACT", payload: contact })

  // Function to set the current modal mode (add or edit)
  const setModalMode = (mode: ModalMode) =>
    dispatch({ type: "SET_MODAL_MODE", payload: mode })

  return (
    <ContactsContext.Provider
      value={{
        ...state, // Spread the current state values
        enrichedList, // Include the filtered and sorted list of contacts
        dispatch, // Provide the dispatch function for actions
        updateSearchQuery, // Provide function to update the search query
        updateSortDirection, // Provide function to update the sort direction
        selectContact, // Provide function to select a contact
        setModalMode, // Provide function to set the modal mode
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

/**
 * Custom hook to access the contacts context.
 * Throws an error if used outside of the ContactsProvider.
 *
 * @returns {ContactsContextType} The context value including the state and actions.
 */
export function useContacts() {
  const context = useContext(ContactsContext)
  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider")
  }
  return context
}
