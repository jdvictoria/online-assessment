import { defineSchema, defineTable } from "convex/server";

import { contactSchema } from "./schemas/contact";

export default defineSchema({
  contact: defineTable(contactSchema)
});
