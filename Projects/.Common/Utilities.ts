import { config } from "@dotenvx/dotenvx";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "langchain";
import { z } from "zod";

export const internetSearch = tool(
  async ({
    query,
    maxResults = 5,
    topic = "general",
    includeRawContent = false,
  }: {
    query: string;
    maxResults?: number;
    topic?: "general" | "news" | "finance";
    includeRawContent?: boolean;
  }) => {
    const tavilySearch = new TavilySearch({
      maxResults,
      tavilyApiKey: process.env.TAVILY_API_KEY,
      includeRawContent,
      topic,
    });
    return await tavilySearch._call({ query });
  },
  {
    name: "internet_search",
    description: "Run a web search",
    schema: z.object({
      query: z.string().describe("The search query"),
      maxResults: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of results to return"),
      topic: z
        .enum(["general", "news", "finance"])
        .optional()
        .default("general")
        .describe("Search topic category"),
      includeRawContent: z
        .boolean()
        .optional()
        .default(false)
        .describe("Whether to include raw content"),
    }),
  },
);

export const LoadConfig_And_Model = () => {
  config({
    path: [".env.development.local"],
    envKeysFile: ".env.keys",
    strict: true
  });
  return new ChatGoogleGenerativeAI({
    model: process.env.MODEL_NAME || "gemini-pro",
    apiKey: process.env.MODEL_API_KEY || "",
    temperature: 0,
    maxRetries: 2
  });


}