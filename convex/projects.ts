import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const storeProject = mutation({
  args: {
    userId: v.string(),
    fileId: v.string(),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      userId: args.userId,
      fileName: args.fileName,
      fileDisplayName: args.fileName,
      fileId: args.fileId,
      uploadedAt: Date.now(),
      size: args.size,
      mimeType: args.mimeType,
      status: "pending",
      merchantName: undefined,
      merchantAddress: undefined,
      mercantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      transactionCurrency: undefined,
      transactionDescription: undefined,
      projectSummary: undefined,
      items: [],
    });

    return projectId;
  },
});

export const getProjectsById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (project) {
      const identify = await ctx.auth.getUserIdentity();
      if (!identify) {
        throw new Error("Unauthorized");
      }

      const userId = identify.subject;

      if (project.userId !== userId) {
        throw new Error("Unauthorized");
      }
    }
    return project;
  },
});

export const getProjectDownloadUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

export const updateProjectStatus = mutation({
  args: {
    projectId: v.id("projects"),
    status: v.union(
      v.literal("pending"),
      v.literal("uploaded"),
      v.literal("error"),
    ),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const identify = await ctx.auth.getUserIdentity();
    if (!identify) {
      throw new Error("Unauthorized");
    }

    const userId = identify.subject;

    if (project.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.projectId, {
      status: args.status,
    });
    return true;
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const identify = await ctx.auth.getUserIdentity();

    if (!identify) {
      throw new Error("Unauthorized");
    }

    const userId = identify.subject;

    if (project.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const storageId = project.fileId as Id<"_storage">;
    await ctx.storage.delete(storageId);
    await ctx.db.delete(args.projectId);
    return true;
  },
});

// Update project with extracted data for the AI Agent
export const updateProjectWithExtractedData = mutation({
  args: {
    projectId: v.id("projects"),
    fileDisplayName: v.string(),
    merchantName: v.string(),
    merchantAddress: v.string(),
    mercantContact: v.string(),
    transactionDate: v.string(),
    transactionAmount: v.number(),
    transactionCurrency: v.string(),
    projectSummary: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(args.projectId, {
      fileDisplayName: args.fileDisplayName,
      merchantName: args.merchantName,
      merchantAddress: args.merchantAddress,
      mercantContact: args.mercantContact,
      transactionDate: args.transactionDate,
      transactionAmount: args.transactionAmount,
      transactionCurrency: args.transactionCurrency,
      projectSummary: args.projectSummary,
      items: args.items,
      status: "processed",
    });

    return {
      userId: project.userId,
    };
  },
});
