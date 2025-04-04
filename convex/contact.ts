import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { contactSchema } from "./schemas/contact";

import { makeSchemaValuesOptional } from "./utils";

export const createContact = mutation({
  args: contactSchema,
  handler: async (ctx, args) => {
    const contactId = await ctx.db.insert("contact", args);

    return { success: true, data: contactId };
  },
});

export const updateContact = mutation({
  args: {
    contactId: v.id("contact"),
    updates: v.object(makeSchemaValuesOptional(contactSchema)),
  },
  handler: async (ctx, args) => {
    const { contactId, updates } = args;

    await ctx.db.patch(contactId, updates);
    return { success: true };
  },
});

export const deleteContact = mutation({
  args: {
    contactId: v.id("contact"),
  },
  handler: async (ctx, args) => {
    const { contactId } = args;

    await ctx.db.delete(contactId);
    return { success: true };
  },
});

export const fetchAllContacts = query({
  args: {},
  handler: async (ctx) => {
    const contacts = await ctx.db.query("contact").collect();

    return await Promise.all(
      contacts.map(async (contact) => {
        const imageUrl = contact.image
          ? await ctx.storage.getUrl(contact.image)
          : null;

        return {
          ...contact,
          image: imageUrl,
        };
      })
    );
  },
});

export const fetchContact = query({
  args: {
    contactId: v.id("contact"),
  },
  handler: async (ctx, { contactId }) => {
    const contact = await ctx.db.get(contactId);

    const imageUrl = contact?.image ? await ctx.storage.getUrl(contact.image) : null;

    return {
      data: {
        ...contact,
        image: imageUrl,
      },
    };
  },
});
