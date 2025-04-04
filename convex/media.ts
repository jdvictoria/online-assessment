import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUrl = mutation(async (ctx) => {
  return { uploadUrl: await ctx.storage.generateUploadUrl() };
});

export const uploadPhoto = mutation({
  args: {
    storageId: v.id("_storage"),
    contactId: v.id("contact"),
  },
  handler: async (ctx, { storageId, contactId }) => {
    try {
      await ctx.db.patch(contactId, { image: storageId.toString() });
      return { success: true };
    } catch (error) {
      return { success: false, message: `${error}` };
    }
  },
});
