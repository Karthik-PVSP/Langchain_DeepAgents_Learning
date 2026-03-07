import { config } from "@dotenvx/dotenvx";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
//Models
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
//
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
// ... other imports

// 1. Define a mapping of provider keys to their classes
// 1. The Single Source of Truth
export enum ModelProvider {
  GOOGLE = "google",
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
}

// 2. The Model Registry (Internal to the factory file)
type ModelConstructor<T extends BaseChatModel = BaseChatModel> = new (opts: any) => T;

const Registry: Record<ModelProvider, ModelConstructor> = {
  [ModelProvider.GOOGLE]: ChatGoogleGenerativeAI as ModelConstructor,
  [ModelProvider.OPENAI]: ChatOpenAI as ModelConstructor,
  [ModelProvider.ANTHROPIC]: ChatAnthropic as ModelConstructor,
};


// 2. Updated Factory Function
export const LoadConfig_And_Model = (provider: ModelProvider): BaseChatModel => {
  // Load environment variables
  config({
    path: [".env.development.local"],
    envKeysFile: ".env.keys",
    strict: true
  });

  const ModelClass = Registry[provider];

  return new ModelClass({
    modelName: process.env.MODEL_NAME,
    apiKey: process.env.MODEL_API_KEY,
    temperature: 1,
  });
};

// // 3. Usage: Now you can swap providers via a string/config
// const provider = (process.env.PROVIDER as ProviderKey) || "google";
// const model = DynamicModelFactory(provider);
// export const LoadConfig_And_Model = <M extends BaseChatModel>(ModelProvider:M): M => {
//   config({
//     path: [".env.development.local"],
//     envKeysFile: ".env.keys",
//     strict: true
//   });
//   const model = new ModelProvider({
//     model: process.env.MODEL_NAME || "",
//     apiKey: process.env.MODEL_API_KEY || "",
//     temperature: 0,
//     maxRetries: 2
//   });
//   return model as unknown as M;

// }