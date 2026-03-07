import { HITLRequest, HITLResponse, humanInTheLoopMiddleware, Interrupt, tool } from "langchain";
import { createAgent } from "langchain";
import { LoadConfig_And_Model, ModelProvider } from "../.Common/Utilities";
import * as z from "zod";
import { Command, MemorySaver } from "@langchain/langgraph";
const model = LoadConfig_And_Model(ModelProvider.OPENAI)
const hitlMiddleware = humanInTheLoopMiddleware({
    interruptOn: {
        // Interrupt write_file tool and allow edits or approvals
        "get_user_name": {
            allowedDecisions: ["approve", "reject"],
            description: "⚠️ Get Current Session User."
        }
        ,
        "read_file": {
            allowedDecisions: ["approve", "reject"],
            description: "⚠️ Read file contents."
        },
        "write_file": {
            allowedDecisions: ["approve", "reject"],
            description: "⚠️ Write content to a file."
        }
    }
});
const readFile = tool(
    async (input: { path: string }) => {
        const fs = await import("fs/promises");
        return await fs.readFile(input.path, "utf-8");
    },
    {
        name: "read_file",
        description: "Read contents from a file at the specified path.",
        schema: z.object({
            path: z.string().describe("The file path to read from")
        }),
    }
);

const writeFile = tool(
    async (input: { path: string; content: string }) => {
        const fs = await import("fs/promises");
        await fs.writeFile(input.path, input.content, "utf-8");
        return `File written successfully to ${input.path}`;
    },
    {
        name: "write_file",
        description: "Write content to a file at the specified path.",
        schema: z.object({
            path: z.string().describe("The file path to write to"),
            content: z.string().describe("The content to write to the file")
        }),
    }
);
const getUserName = tool(
    (_, config) => {
        return config.context.user_name
    },
    {
        name: "get_user_name",
        description: "Get the user's name.",
        schema: z.object({}),
    }
);
const agent = createAgent({
    model,
    tools: [getUserName, readFile, writeFile],
    middleware: [hitlMiddleware],
    checkpointer: new MemorySaver()
});
const config = {
    context: { user_name: "Karthik pan" },
    configurable: { thread_id: "thread-abc-123" },
};

const result = await agent.invoke(
    {
        messages: [{ role: "user", content: "can you create a json file with telugu movie memes it should contain movie name joke and actor who told the joke. and save file here (C:\\Projects\\2026\\March\\Langchain_DeepAgents_Learning\\Projects\\HILAgent) " }],

    },
    config
);
console.log(result)
if (result.__interrupt__) {
    const interruptRequest = result.__interrupt__?.[0] as Interrupt<HITLRequest>;

    // Show tool call details to user
    console.log("Actions:", interruptRequest.value.actionRequests);
    console.log("Review configs:", interruptRequest.value.reviewConfigs);

    // Resume with approval
    const resume: HITLResponse = {
        decisions: [{ type: "approve" }]
    };
    const result2 = await agent.invoke(
        new Command({ resume }),
        config
    );
    console.log("Agent response after approval:", result2);
}