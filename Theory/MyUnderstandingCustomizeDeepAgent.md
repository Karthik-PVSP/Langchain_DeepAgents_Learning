`CreateDeepAgent` has the following configuraiton options.

1) Model
2) Tools
3) System Prompt
4) Middleware.
5) Subagents
6) Backends(Virtual filesystems).
7) Human in loop
8) Skills
9) Memory
----------
```js
const agent=createDeepAgent({
    name?:string,
    model?:BaseLanguageModel|string,
    tools?:TTools|StructuredTool[],
    systemPrompt?:string|SystemMessage
})
```
-----
# Connection resilience

Chat models automatically retry failed api requests with exponential backoff. By default model retry up to 6 times for network errors, rate limits(429), and server errors (5xx)
client error like 401(unauthorized) or 404 are not retired.

we can adjust the max retires when creating a model to tune this behavior for your environment
```js
import { ChatAnthropic } from "@langchain/anthropic";
import { createDeepAgent } from "deepagents";

const agent = createDeepAgent({
    model: new ChatAnthropic({
        model: "claude-sonnet-4-5-20250929",
        maxRetries: 10, // Increase for unreliable networks (default: 6)
        timeout: 120_000, // Increase timeout for slow connections
    }),
});
```
`Note` : for long running agent tasks on unreliable networks, consider increasing max_retries to 10-15 and pairing it with a <u>checkpointer</u>
----

## 1) Model

By default `deepagents` uses `claude-sonnet-4-5-20250929`, you can customize the model by passsing any supported model identifier string or langchain model object

## 4) Middleware.
Def: it provides a way to more tightly control what happens inside the agent. Middleware are useful for the following.

1) Tracking agent behavior with logging, analytics and debugging.
2) Transforming prompts, tool selection and output formatting.
3) Adding retires, fallbacks and early termination logic.
4) applying rate limits, gaurdrails and pii detection.

>By default, deep agents have access to the following [middleware](https://docs.langchain.com/oss/javascript/langchain/middleware/overview).

1) TodoListMiddleware: Tracks and manges todo lists for organizing agent tasks and work.
2) FileSystemMiddleware: Handles filesystem operations such as reading, writing, and navigating directories.
3) SummarizationMiddleWare: condenses message historyto stay within the context limits when conversations grow long.
4) SubagentMiddleware: Spawns and coordinates subagents for delegating tasks to specialized agents.
5) AnthropicPromptCachingMiddleware: Automatic reduction of redundant token processing when using Anthropic models.
6) PatchToolCallsMiddleware: Automatic message history fixes when tool calls are interupted or cancelled before recieving results.

`Note` : if you are using teh memory, skills, or human-in-loop the following middleware is also included.

7) MemoryMiddleware: persists and retrieves conversation context across sessions when the memory argument is provided.

8) SkillsMiddleware: enables custom skills when the `Skills` argument is provided.
9) HumanInTheLoopMiddleware: Pauses for human approval or input at specified points when the interrupt_on argument is provided.

You can provide additional middleware to extend functinality, add tools, or implement custom hooks.

----
## Backends

Deep agent tools can make use of `virtual file system` to store access and edit files 
By default deep agents use the StateBackend.

if you are using <u>Skills</u> or <u>Memory</u> you must added expected skill or memory files to the backend before creating the agent.

The file system that is shortlived and present inside the langgraph state and persist on the single thread.

Choose and configure file system backends for deep agents, you can specify routes to different backends 
