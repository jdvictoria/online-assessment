"use client"

import type React from "react"
import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react"

import { toast } from "sonner"

import type { Contact } from "@/types/contact"
import { Id } from "@/convex/_generated/dataModel";

// Action types: Defines all possible actions that can be dispatched to the reducer.
type FormActionType =
  | { type: "SET_FIELD"; field: string; value: string } // Set a specific field's value
  | { type: "SET_IMAGE"; value: string } // Set the image URL
  | { type: "SET_IMAGE_FILE"; value: File } // Set the image file
  | { type: "VALIDATE_FORM" } // Validate the form
  | { type: "RESET_FORM" } // Reset the form to its initial state
  | { type: "INITIALIZE_FORM"; contact: Partial<Contact> } // Initialize the form with contact data
  | { type: "SET_ERRORS"; errors: Partial<Record<keyof FormState["errors"], boolean>> } // Set form errors

// Form state interface: Defines the structure of the form state.
interface FormState {
  values: {
    _id: Id<"contact"> // Unique identifier for the contact
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
    imageFile: File | null // Image file for the contact
  }
  errors: {
    firstName: boolean // Error flag for the first name field
    lastName: boolean // Error flag for the last name field
    email: boolean // Error flag for the email field
  }
  isDirty: boolean // Flag to check if the form has been modified
  isValid: boolean // Flag indicating whether the form is valid
}

// Form context interface: Defines the context API for the form, including state and actions.
interface FormContextType {
  state: FormState
  dispatch: React.Dispatch<FormActionType> // Dispatch function to trigger state changes
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void // Handles input change
  handleImageChange: (imageUrl: string) => void // Handles image URL change
  validateForm: () => boolean // Validates the form and returns whether it is valid
  resetForm: () => void // Resets the form to its initial state
  initializeForm: (contact: Partial<Contact>) => void // Initializes the form with contact data
  getFormValues: () => Omit<Contact, "id"> // Retrieves the current form values (excluding the contact ID)
}

// Initial state: Default state of the form.
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
    lastContact: new Date().toISOString().split("T")[0], // Set today's date as default for last contact
    notes: "",
    image: "",
    imageFile: null,
  },
  errors: {
    firstName: false,
    lastName: false,
    email: false,
  },
  isDirty: false,
  isValid: false,
}

// Create context: Initializes the form context for sharing state and actions.
const FormContext = createContext<FormContextType | undefined>(undefined)

// Email validation function: Validates the email format.
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Reducer function: Handles different form actions and updates the form state accordingly.
function formReducer(state: FormState, action: FormActionType): FormState {
  switch (action.type) {
    case "SET_FIELD":
      // Updates a specific field value and marks the form as dirty
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
      // Sets the image URL and marks the form as dirty
      return {
        ...state,
        values: {
          ...state.values,
          image: action.value,
        },
        isDirty: true,
      }
    case "SET_IMAGE_FILE":
      // Sets the image file and marks the form as dirty
      return {
        ...state,
        values: {
          ...state.values,
          imageFile: action.value,
        },
        isDirty: true,
      }
    case "VALIDATE_FORM":
      // Validates the form fields and returns the validation state
      const errors = {
        firstName: !state.values.firstName.trim(),
        lastName: !state.values.lastName.trim(),
        email: !validateEmail(state.values.email),
        lastContact: !state.values.lastContact.trim(),
      }
      return {
        ...state,
        errors,
        isValid: !Object.values(errors).some(Boolean), // Checks if any field has an error
      }
    case "RESET_FORM":
      // Resets the form to its initial state
      return {
        ...initialState,
        values: {
          ...initialState.values,
          lastContact: new Date().toISOString().split("T")[0], // Reset last contact to today's date
        },
      }
    case "INITIALIZE_FORM":
      // Initializes the form with provided contact data
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
          imageFile: null,
        },
        isDirty: false,
        isValid: false,
      }
    case "SET_ERRORS":
      // Sets specific errors for the form fields
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

// Provider component: Provides the form context to the children components.
export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState)

  // Memoized handlers to prevent unnecessary re-renders and improve performance
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
        }

        dispatch({ type: "SET_ERRORS", errors })

        const missingFields: string[] = []
        if (errors.firstName) missingFields.push("First Name")
        if (errors.lastName) missingFields.push("Last Name")
        if (errors.email) missingFields.push("Email")

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

  // Provide context value to children components
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

// Custom hook to access form context in child components
export function useForm() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}
