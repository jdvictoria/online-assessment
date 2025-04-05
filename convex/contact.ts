import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { contactSchema } from "./schemas/contact";

import { makeSchemaValuesOptional } from "./utils";

// Mutation for creating a new contact
export const createContact = mutation({
  // Arguments for this mutation will be validated against the contactSchema
  args: contactSchema,
  handler: async (ctx, args) => {
    // Inserts a new contact record into the database
    return await ctx.db.insert("contact", args);
  },
});

// Mutation for updating an existing contact
export const updateContact = mutation({
  // Arguments:
  // - contactId: The ID of the contact to update
  // - updates: An object containing the updated contact fields, validated as optional by makeSchemaValuesOptional
  args: {
    contactId: v.id("contact"), // The contact's unique ID
    updates: v.object(makeSchemaValuesOptional(contactSchema)), // Updates to apply to the contact
  },
  handler: async (ctx, args) => {
    const { contactId, updates } = args;

    // Remove the image field from updates, as images are handled separately
    delete updates.image;

    // Apply the updates to the existing contact record
    await ctx.db.patch(contactId, updates);

    // Return a success response
    return { success: true };
  },
});

// Mutation for deleting a contact
export const deleteContact = mutation({
  // Arguments: contactId to identify the contact to delete
  args: {
    contactId: v.id("contact"),
  },
  handler: async (ctx, args) => {
    const { contactId } = args;

    // Delete the contact from the database
    await ctx.db.delete(contactId);

    // Return a success response
    return { success: true };
  },
});

// Query for fetching all contacts from the database
export const fetchAllContacts = query({
  // No arguments needed for this query
  args: {},
  handler: async (ctx) => {
    // Retrieve all contacts from the database
    const contacts = await ctx.db.query("contact").collect();

    // Add image URLs to contacts (if available)
    return await Promise.all(
      contacts.map(async (contact) => {
        const imageUrl = contact.image
          ? await ctx.storage.getUrl(contact.image) // Get the image URL from storage if the contact has an image
          : null;

        return {
          ...contact,
          image: imageUrl, // Include the image URL in the returned contact object
        };
      })
    );
  },
});

// Query for fetching a specific contact by ID
export const fetchContact = query({
  // Arguments: contactId to identify which contact to fetch
  args: {
    contactId: v.id("contact"),
  },
  handler: async (ctx, { contactId }) => {
    // Retrieve the contact by its ID
    const contact = await ctx.db.get(contactId);

    // If the contact has an image, get the image URL from storage
    const imageUrl = contact?.image ? await ctx.storage.getUrl(contact.image) : null;

    // Return the contact data along with the image URL (if available)
    return {
      data: {
        ...contact,
        image: imageUrl,
      },
    };
  },
});
