"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getFileDownloadUrl(storageId: string) {
  try {
    const downloadUrl = await convex.query(api.projects.getProjectDownloadUrl, {
      fileId: storageId as Id<"_storage">,
    });

    return {
      success: true,
      downloadUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get download URL: ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
}
