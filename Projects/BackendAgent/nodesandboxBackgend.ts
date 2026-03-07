import { createDeepAgent } from "deepagents";
import { LoadConfig_And_Model, ModelProvider } from "../.Common/Utilities";
import { VfsSandbox } from "@langchain/node-vfs";
const model = LoadConfig_And_Model(ModelProvider.OPENAI);
// Create and initialize the sandbox
// const sandbox = await DenoSandbox.create({
//     memoryMb: 1024,
//     lifetime: "10m",
// });
// Create and initialize a VFS sandbox
const sandbox = await VfsSandbox.create({
    initialFiles: {
        "/src/index.js": "console.log('Hello from VFS!')",
    }, 
    mountPath: `C:\\Projects\\2026\\March\\Langchain_DeepAgents_Learning\\Projects\\BackendAgent\\Nodevfs`,
    timeout: 10 * 60 * 1000, // 10 minutes
});

try {
    const agent = createDeepAgent({
        model,
        systemPrompt: "You are a JavaScript coding assistant with sandbox access.",
        backend: sandbox,
    });

    const result = await agent.invoke({
        messages: [
            {
                role: "user",
                content:
                    "Create a simple HTTP server using node js and test it with curl and respond with curl response.",
            },
        ],
    });
    console.log(result);
} finally {
    await sandbox.stop();
}