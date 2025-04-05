import { v } from "convex/values";

export const makeSchemaValuesOptional = (schema: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [key, v.optional(value)])
  );
};
