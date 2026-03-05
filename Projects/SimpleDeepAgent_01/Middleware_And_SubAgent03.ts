import * as z from "zod";
import { createDeepAgent,SubAgent } from "deepagents";
import { tool, createMiddleware } from "langchain";
// import { ChatOpenAI } from "@langchain/openai"; // Import the OpenAI wrapper
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { config } from "@dotenvx/dotenvx";
import { internetSearch } from "../.Common/Utilities";
// Loading the .env variables using dotenvx
//usage [https://dotenvx.com/docs/advanced]
config({
  path: [".env.development.local"],
  envKeysFile: ".env.keys",
  strict: true
});


// 1. Define your local model configuration
const localModel = new ChatGoogleGenerativeAI({
  model: process.env.MODEL_NAME || "gemini-pro",
  apiKey: process.env.MODEL_API_KEY || "",
  temperature: 0,
  maxRetries: 2
});


const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string(),
    }),
  },
);

// Now we are going to introduce a middlware that logs the tool calls.
let callCount = 0;

const logToolCallsMiddleware = createMiddleware({
  name: "LogToolCallsMiddleware",
  wrapToolCall: async (request, handler) => {
    // Intercept and log every tool call - demonstrates cross-cutting concern
    callCount += 1;
    const toolName = request.toolCall.name;

    console.log(`[Middleware] Tool call #${callCount}: ${toolName}`);
    console.log(
      `[Middleware] Arguments: ${JSON.stringify(request.toolCall.args)}`
    );

    // Execute the tool call
    const result = await handler(request);

    // Log the result
    console.log(`[Middleware] Tool call #${callCount} completed`);

    return result;
  },
});

//Creating a subagent

const research_subagent: SubAgent = {
  "name": "research-agent",
  "description": "Used to research more in depth questions",
  "systemPrompt": "You are a great researcher",
  "tools": [internetSearch],
  // "model": "openai:gpt-4.1",
}

const subagents = [research_subagent]


// 2. Pass the local model to the agent
const agent = createDeepAgent({
  model: localModel, // Inject the local LM Studio model here
  tools: [getWeather],
  middleware: [logToolCallsMiddleware as any], // Add the middleware to the agent
  systemPrompt: "You are a helpful assistant",
  subagents
});

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "What's the weather in China,Bejing? and also what are the famous locations in Hyderabad, India" }],
  })
);