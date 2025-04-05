"use client"

import type React from "react"
import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react"

import { toast } from "sonner"

import type { Contact } from "@/types/contact"
import { Id } from "@/convex/_generated/dataModel";

// Action types
type FormActionType =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_IMAGE"; value: string }
  | { type: "VALIDATE_FORM" }
  | { type: "RESET_FORM" }
  | { type: "INITIALIZE_FORM"; contact: Partial<Contact> }
  | { type: "SET_ERRORS"; errors: Partial<Record<keyof FormState["errors"], boolean>> }

// Form state interface
interface FormState {
  values: {
    _id: Id<"contact">
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    occupation: string
    birthday: string
    lastContact: string
    notes: string
    image: string
  }
  errors: {
    firstName: boolean
    lastName: boolean
    email: boolean
  }
  isDirty: boolean
  isValid: boolean
}

// Form context interface
interface FormContextType {
  state: FormState
  dispatch: React.Dispatch<FormActionType>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleImageChange: (imageUrl: string) => void
  validateForm: () => boolean
  resetForm: () => void
  initializeForm: (contact: Partial<Contact>) => void
  getFormValues: () => Omit<Contact, "id">
}

// Initial state
const initialState: FormState = {
  values: {
    _id: "" as Id<"contact">,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    occupation: "",
    birthday: "",
    lastContact: new Date().toISOString().split("T")[0],
    notes: "",
    image: "/placeholder.svg?height=100&width=100",
  },
  errors: {
    firstName: false,
    lastName: false,
    email: false,
  },
  isDirty: false,
  isValid: false,
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined)

// Email validation function
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Reducer function
function formReducer(state: FormState, action: FormActionType): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
        errors: {
          ...state.errors,
          ...(action.field in state.errors ? { [action.field]: false } : {}),
        },
        isDirty: true,
      }
    case "SET_IMAGE":
      return {
        ...state,
        values: {
          ...state.values,
          image: action.value,
        },
        isDirty: true,
      }
    case "VALIDATE_FORM":
      const errors = {
        firstName: !state.values.firstName.trim(),
        lastName: !state.values.lastName.trim(),
        email: !validateEmail(state.values.email),
        lastContact: !state.values.lastContact.trim(),
      }
      return {
        ...state,
        errors,
        isValid: !Object.values(errors).some(Boolean),
      }
    case "RESET_FORM":
      return {
        ...initialState,
        values: {
          ...initialState.values,
          lastContact: new Date().toISOString().split("T")[0],
        },
      }
    case "INITIALIZE_FORM":
      return {
        ...state,
        values: {
          _id: action.contact._id || "" as Id<"contact">,
          firstName: action.contact.firstName || "",
          lastName: action.contact.lastName || "",
          email: action.contact.email || "",
          phone: action.contact.phone || "",
          company: action.contact.company || "",
          occupation: action.contact.occupation || "",
          birthday: action.contact.birthday || "",
          lastContact: action.contact.lastContact || new Date().toISOString().split("T")[0],
          notes: action.contact.notes || "",
          image: action.contact.image || "",
        },
        isDirty: false,
        isValid: false,
      }
    case "SET_ERRORS":
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.errors,
        },
      }
    default:
      return state
  }
}

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState)

  // Memoized handlers to prevent unnecessary re-renders
  const handlers = useMemo(
    () => ({
      handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        dispatch({ type: "SET_FIELD", field: name, value })
      },

      handleImageChange: (imageUrl: string) => {
        dispatch({ type: "SET_IMAGE", value: imageUrl })
      },

      validateForm: () => {
        const errors = {
          firstName: !state.values.firstName.trim(),
          lastName: !state.values.lastName.trim(),
          email: !validateEmail(state.values.email),
          lastContact: !state.values.lastContact.trim(),
        }

        dispatch({ type: "SET_ERRORS", errors })

        const missingFields: string[] = []
        if (errors.firstName) missingFields.push("First Name")
        if (errors.lastName) missingFields.push("Last Name")
        if (errors.email) missingFields.push("Email")
        if (errors.lastContact) missingFields.push("Last Contact")

        if (missingFields.length > 0) {
          toast(`${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required`)
          return false
        }

        return true
      },

      resetForm: () => {
        dispatch({ type: "RESET_FORM" })
      },

      initializeForm: (contact: Partial<Contact>) => {
        dispatch({ type: "INITIALIZE_FORM", contact })
      },

      getFormValues: (): Omit<Contact, "id"> => {
        const { _id, firstName, lastName, email, phone, company, occupation, birthday, lastContact, notes, image } = state.values

        return {
          _id,
          firstName,
          lastName,
          email,
          phone,
          company,
          occupation,
          birthday,
          lastContact,
          notes,
          image,
        }
      },
    }),
    [state.errors, toast],
  )

  // Provide context value
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      ...handlers,
    }),
    [state, handlers],
  )

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
}

export function useForm() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}
