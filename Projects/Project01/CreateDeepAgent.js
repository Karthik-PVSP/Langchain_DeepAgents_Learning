import * as z from "zod";
import { createDeepAgent } from "deepagents";
import { tool } from "langchain";
// import { ChatOpenAI } from "@langchain/openai"; // Import the OpenAI wrapper
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { config } from "@dotenvx/dotenvx";
// Loading the .env variables using dotenvx
//usage [https://dotenvx.com/docs/advanced]
config({
  path:[".env.development.local"],
  envKeysFile:".env.keys",
  strict:true
});


// 1. Define your local model configuration
const localModel = new ChatGoogleGenerativeAI({
  model: process.env.MODEL_NAME,
  apiKey: process.env.MODEL_API_KEY,
  temperature:0,
  maxRetries:2
});
// const localModel = new ChatOpenAI({
//   // Point to LM Studio's local server
//   configuration: {
//     baseURL: process.env.MODEL_API_URL,
//   },
//   // The actual model name in LM Studio (usually doesn't matter, but it's good practice)
//   modelName: process.env.MODEL_NAME, 
//   apiKey: process.env.MODEL_API_KEY, // LM Studio doesn't require a real key, but LangChain needs a string
//   temperature: 0,
// });

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

// 2. Pass the local model to the agent
const agent = createDeepAgent({
  model: localModel, // Inject the local LM Studio model here
  tools: [getWeather],
  system: "You are a helpful assistant",
});

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
  })
);