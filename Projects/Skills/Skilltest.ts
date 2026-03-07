import { createDeepAgent, type FileData } from "deepagents";
import { MemorySaver } from "@langchain/langgraph";
import { LoadConfig_And_Model, ModelProvider } from "../.Common/Utilities";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const checkpointer = new MemorySaver();

function createFileData(content: string): FileData {
  const now = new Date().toISOString();
  return {
    content: content.split("\n"),
    created_at: now,
    modified_at: now,
  };
}

const skillsFiles: Record<string, FileData> = {};

const skillUrl =
  "https://raw.githubusercontent.com/langchain-ai/deepagentsjs/refs/heads/main/examples/skills/langgraph-docs/SKILL.md";
const response = await fetch(skillUrl);
const skillContent = await response.text();

skillsFiles["/skills/langgraph-docs/SKILL.md"] = createFileData(skillContent);
const model=LoadConfig_And_Model(ModelProvider.OPENAI);

const fetch_url = tool(
    async ({ url }: { url: string }) => {
        try {
            const response = await fetch(url);
            if (!response.ok) return `Error: HTTP ${response.status}`;
            return await response.text();
        } catch (error: any) {
            // Check for the specific SSL error
            if (error.cause?.code === 'CERT_HAS_EXPIRED') {
                return `Failed to fetch ${url}: The website's security certificate has expired.`;
            }
            return `Failed to fetch: ${error.message}`;
        }
    },
    {
        name: "fetch_url",
        description: "Fetch content from a URL",
        schema: z.object({
            url: z.string().url(),
        }),
    }
);




const agent = await createDeepAgent({
  model,
  checkpointer,
  // IMPORTANT: deepagents skill source paths are virtual (POSIX) paths relative to the backend root.
  skills: ["/skills/"],
  tools: [fetch_url],
});

const config = {
  configurable: {
    thread_id: `thread-${Date.now()}`,
  },
};

const result = await agent.invoke(
  {
    messages: [
      {
        role: "user",
        content: "what is langraph? Use the langgraph-docs skill if available.",
      },
    ],
    files: skillsFiles,
  },
  config,
);
console.log(result);