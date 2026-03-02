import { createDeepAgent } from "deepagents";
import { tool } from "langchain";
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
const GoogleGemini2_Model = new ChatGoogleGenerativeAI({
  model: process.env.MODEL_NAME || "",
  apiKey: process.env.MODEL_API_KEY || "",
  temperature:0,
  maxRetries:2
});



import { internetSearch } from "./Utilities";



// System prompt to steer the agent to be an expert researcher
const researchInstructions = `You are an expert researcher. Your job is to conduct thorough research and then write a polished report.`;
// ` You have access to an internet search tool as your primary means of gathering information.

// ## \`internet_search\`

//  Use this to run an internet search for a given query. You can specify the max number of results to return, the topic, and whether raw content should be included.
// `

const agent = createDeepAgent({
  model:GoogleGemini2_Model,
  tools: [internetSearch],
  systemPrompt: researchInstructions,
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "What is langgraph?" }],
});

// Print the agent's response
console.log(result.messages[result.messages.length - 1].content);
console.log("Agent todos",result.todos)