import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  projects: defineTable({
    userId: v.string(),
    fileName: v.string(),
    fileDisplayName: v.string(),
    fileId: v.string(),
    uploadedAt: v.number(),
    size: v.number(),
    mimeType: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("uploaded"),
      v.literal("error"),
      v.literal("processed"),
    ),
    merchantName: v.optional(v.string()),
    merchantAddress: v.optional(v.string()),
    mercantContact: v.optional(v.string()),
    transactionDate: v.optional(v.string()),
    transactionAmount: v.optional(v.number()),
    transactionCurrency: v.optional(v.string()),
    transactionDescription: v.optional(v.string()),
    projectSummary: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  }),
});
