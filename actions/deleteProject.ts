"use server";

import convex from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export async function deleteProject(projectId: string) {
  try {
    await convex.mutation(api.projects.deleteProject, {
      projectId: projectId as Id<"projects">,
    });

    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting project:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Anunknown error occurred",
    };
  }
}
