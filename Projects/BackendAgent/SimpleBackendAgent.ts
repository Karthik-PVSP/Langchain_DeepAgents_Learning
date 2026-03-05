// Creating the backend
//1) StateBackend.

import { createDeepAgent, FilesystemBackend, LocalShellBackend, StateBackend } from "deepagents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LoadConfig_And_Model } from "../.Common/Utilities";

/* AN ephemeral filesystem backend stored in langgraph state.
This filesystem only persists for a single thread.*/
const model: ChatGoogleGenerativeAI = LoadConfig_And_Model();
const stateBackendAgent = createDeepAgent({
    model,
    backend: (state) => new StateBackend(state)
})

const FileSystemPath = `C:\\Projects\\2026\\March\\Langchain_DeepAgents_Learning\\Projects\\BackendAgent`;
// Creating the filesystembackend
const filesystemAgent = createDeepAgent({
    model,
    backend: (state) => new FilesystemBackend({ rootDir: FileSystemPath, virtualMode: true })
})
const localshellbackendagent = createDeepAgent({
    model,
    backend: () => new LocalShellBackend({
        rootDir: FileSystemPath,
    })
})
// Create backend with explicit environment

const backend = new LocalShellBackend({
    rootDir: `.\\Projects\\BackendAgent\\tmp`,
});
// Execute shell commands (runs directly on host)
const result = await backend.execute("echo \"Hello karthik\" > myfile.txt");
console.log(result.output);
console.log(result.exitCode);
// console.log(await filesystemAgent.invoke({messages: [{role: "user", content: "How are you?"}]}));