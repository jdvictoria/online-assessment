import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to generate an upload URL for storing a file in the storage
export const createUrl = mutation(async (ctx) => {
  // Generates an upload URL for the storage service to upload a file (e.g., a photo)
  return { uploadUrl: await ctx.storage.generateUploadUrl() };
});

// Mutation to associate a photo (storageId) with a specific contact
export const uploadPhoto = mutation({
  // Arguments:
  // - storageId: The ID of the file in storage that is being uploaded
  // - contactId: The ID of the contact to associate the uploaded image with
  args: {
    storageId: v.id("_storage"), // The ID of the file in storage
    contactId: v.id("contact"),  // The ID of the contact to update
  },
  handler: async (ctx, { storageId, contactId }) => {
    try {
      // Update the contact record in the database to associate the uploaded image with the contact
      await ctx.db.patch(contactId, { image: storageId });

      // Return success response after the image is successfully associated
      return { success: true };
    } catch (error) {
      // If an error occurs during the database update, return a failure response with an error message
      return { success: false, message: `${error}` };
    }
  },
});
