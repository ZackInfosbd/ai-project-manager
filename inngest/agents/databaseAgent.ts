import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { client } from "@/lib/schematic";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { z } from "zod";

const saveToDatabaseTool = createTool({
  name: "save-to-database",
  description: "Saves te given data to te convex database.",
  parameters: z.object({
    fileDisplayName: z
      .string()
      .describe(
        "The readable display name of the project to show in the UI.if the file name is not human readable, use this to give a more readable name",
      ),
    projectId: z.string().describe("The ID of the project to update"),
    merchantName: z.string(),
    merchantAddress: z.string(),
    mercantContact: z.string(),
    transactionDate: z.string(),
    transactionAmount: z
      .number()
      .describe(
        "The total amount of the transaction, summing all the items on the project",
      ),
    projectSummary: z
      .string()
      .describe(
        "A summary of the project, including the merchant name, address, contact, transaction date, transaction amount, and currency. Include some key details about the project. Mention both invoice number and project number if both are present. Include some key details about the items on the project, this is a special featured summary so it should include some key details about the items on the project with sme context",
      ),
    transactionCurrency: z.string(),
    items: z.array(
      z
        .object({
          name: z.string(),
          quantity: z.number(),
          unitPrice: z.number(),
          totalPrice: z.number(),
        })
        .describe(
          "An array of items on the project. Include the name, quantity, unit price, and total price of each item",
        ),
    ),
  }),
  handler: async (params, context) => {
    const {
      fileDisplayName,
      projectId,
      merchantName,
      merchantAddress,
      mercantContact,
      transactionDate,
      transactionAmount,
      transactionCurrency,
      projectSummary,
      items,
    } = params;

    const result = await context.step?.run("save-to-database", async () => {
      try {
        const { userId } = await convex.mutation(
          api.projects.updateProjectWithExtractedData,
          {
            projectId: projectId as Id<"projects">,
            fileDisplayName,
            merchantName,
            merchantAddress,
            mercantContact,
            transactionDate,
            transactionAmount,
            transactionCurrency,
            projectSummary,
            items,
          },
        );

        await client.track({
          event: "scanning",
          company: {
            id: userId,
          },
          user: {
            id: userId,
          },
        });
      } catch (error) {
        return {
          addedToDb: "Failed",
          error: error instanceof Error ? error.message : "unknown",
        };
      }
    });

    if (result?.addedToDb === "Success") {
      // Only set KV values if the operation was successful
      context.network?.state.kv.set("save-to-databse", true);
      context.network?.state.kv.set("project", projectId);
    }

    return result;
  },
});

export const databaseAgent = createAgent({
  name: "Database Agent",
  description:
    "Responsible for taking key information regarding projects and saving it to the convex database ",
  system:
    "You are a elpful assistant tat takes key informattion regarding projects and saves it to the convex database.",
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 1000,
    },
  }),
  tools: [saveToDatabaseTool],
});
