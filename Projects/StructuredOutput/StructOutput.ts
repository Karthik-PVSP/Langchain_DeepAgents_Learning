import { tool, providerStrategy } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import { createDeepAgent } from "deepagents";
import { z } from "zod";
import { LoadConfig_And_Model, ModelProvider } from "../.Common/Utilities";
import { internetSearch } from "../.Common/Utilities";
const model = LoadConfig_And_Model(ModelProvider.OPENAI);

const weatherReportSchema = z.object({
    location: z.string().describe("The location for this weather report"),
    temperature: z.number().describe("Current temperature in Celsius"),
    condition: z
        .string()
        .describe("Current weather condition (e.g., sunny, cloudy, rainy)"),
    humidity: z.number().describe("Humidity percentage"),
    windSpeed: z.number().describe("Wind speed in km/h"),
    forecast: z.string().describe("Brief forecast for the next 24 hours"),
});

const agent = await createDeepAgent({
    model,
    responseFormat: providerStrategy(weatherReportSchema),
    tools: [internetSearch],
    
});

const result = await agent.invoke({
    messages: [
        {
            role: "user",
            content: "What's the weather like in San Francisco?",
        },
    ],
});

console.log(result.structuredResponse);
// {
//   location: 'San Francisco, California',
//   temperature: 18.3,
//   condition: 'Sunny',
//   humidity: 48,
//   windSpeed: 7.6,
//   forecast: 'Clear skies with temperatures remaining mild. High of 18°C (64°F) during the day, dropping to around 11°C (52°F) at night.'
// }