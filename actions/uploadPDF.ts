"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getFileDownloadUrl } from "./getFileDownloadUrl";
import { inngest } from "@/inngest/client";
import Events from "@/inngest/constants";

const uploadPDFSchema = z.object({
  file: z.instanceof(File),
  fileName: z.string(),
});

export async function uploadPDF(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (
      !file.type.includes(".pdf") &&
      !file.name.toLocaleLowerCase().endsWith(".pdf")
    ) {
      return { success: false, error: "Invalid file type" };
    }

    const uploadUrl = await convex.mutation(api.projects.generateUploadUrl);

    const arrayBuffer = await file.arrayBuffer();

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
      //   return { success: false, error: "Failed to upload file" };
    }

    const { storageId } = await uploadResponse.json();

    const projectId = await convex.mutation(api.projects.storeProject, {
      userId: user.id,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    const fileUrl = await getFileDownloadUrl(storageId);

    if (!fileUrl.success) {
      throw new Error(fileUrl.error);
    }

    // trigger Inngest AI Agent
    await inngest.send({
      name: Events.Extract_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: {
        url: fileUrl.downloadUrl,
        projectId,
      },
    });

    return {
      success: true,
      projectId,
      fileUrl: fileUrl.downloadUrl,
      fileName: file.name,
    };
  } catch (error) {
    console.log("server action upload error:", error);

    return {
      success: false,
      error: `Upload failed ${error instanceof Error ? error.message : "unknown Internal server error"}`,
    };
  }
}
