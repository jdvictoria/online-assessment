import { v } from "convex/values";

export const contactSchema = {
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  lastContact: v.string(),
  phone: v.optional(v.string()),
  occupation: v.optional(v.string()),
  company: v.optional(v.string()),
  birthday: v.optional(v.string()),
  notes: v.optional(v.string()),
  image: v.optional(v.string()),
}
