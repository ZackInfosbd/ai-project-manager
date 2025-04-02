import {
  createNetwork,
  anthropic,
  getDefaultRoutingAgent,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import { inngest } from "./client";
import Events from "./constants";
import { databaseAgent } from "./agents/databaseAgent";
import { documentScanningAgent } from "./agents/documentScanningAgent";

const agentNetwork = createNetwork({
  name: "Agent Team",
  agents: [databaseAgent, documentScanningAgent],
  defaultModel: anthropic({
    model: "claude-3-5-sonnet-latest",
    defaultParameters: {
      max_tokens: 1000,
    },
  }),

  
  defaultRouter: ({ network }) => {
    const savedToDatabase = network.state.kv.get("saved-to-database");

    if (savedToDatabase !== undefined) {
      //   Terminate the agent process if te data as been saved to the database

      return undefined;
    }

    return getDefaultRoutingAgent();
  },
});

export const server = createServer({
  agents: [databaseAgent, documentScanningAgent],
  networks: [agentNetwork],
});

export const extractAndSavePDF = inngest.createFunction({
    
    event: Events.Extract_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
    id: "Extract PDF and Save in Database",
    async({ event }) => {
    const result = await agentNetwork.run(

        `Extract te key data from this pdf: ${event?.data.url}. Once the data is extracted, save it to te database using the projectId ${event?.data.projectId}.Once the project is successufully saved to the database you can terminate te agent process. Start wit superVisor agent.`
    )
    return result.state.kv.get("project") 
     }
});
