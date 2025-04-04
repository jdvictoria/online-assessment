import { Id } from "@/convex/_generated/dataModel";

export interface Contact {
  _id: Id<"contact">;
  firstName: string
  lastName: string
  email: string
  lastContact: string
  phone?: string
  company?: string
  occupation?: string
  birthday?: string
  notes?: string
  image?: string
}
