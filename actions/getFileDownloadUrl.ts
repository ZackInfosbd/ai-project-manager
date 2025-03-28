"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";

export async function getFileDownloadUrl(fileId: string) {
  try {
    const downloadUrl = await convex.query(api.projects.getProjectDownloadUrl, {
      fileId: fileId as Id<"_storage">,
    });
    if (!downloadUrl) {
      throw new Error("Could not generate download URL");
    }

    return {
      success: true,
      downloadUrl,
    };
  } catch (error) {
    console.error("Error generating download URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "unknown error",
    };
  }
}
