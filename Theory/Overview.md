# Deep agents overview.
Build agents
that can
1) plan 
2) use subagents
3) leverage file system for complex tasks and context management & long term memory
use cases
1) we can use the deep agents for complex tasks such as the multi step tasks.

Deep agents = agent harnesses
same tool calling loop with builtin [tool calling and capabilities]


Deep agents is standalone library built on top of the langchain'c core building blocks for agents and langgraph tooling for running agents in production.


The deep agents library contains
1) Deep agents SDK: A package for building agents that can handle any task.
2) Deep agents CLI: A terminal coding built on top of the deep agents package.
----

# Learn: When to use the Deep Agents
1) Handle complex,multi step tasks that require planning and decomposition.

2) manage large amount of context through file system tools.

3) swap file system backends to use.

   1) In-memory state
   2) local disk
   3) durable stores
   4) sandboxes or your own custom backend.
4) Delegate work to specialized subagents for context isolation.
5) Persistent Memory across conversations and threads.

Note: for building simpler agents, consider using langchain's **createAgent** or building a custom **langgraph** workflow.

Use the **DeepAgents CLI** when you want to use an interactive deep agent on the command line for coding or other tasks.
1) **Customize** agents with skills and memory.
2) **Teach**: agents as you use them about your preferences, common patterns, and custom project knowledge.
3) **Execute code**: on your machine or in sandboxes.
------------------
# Core Capabilities
## 1) Planning and task decomposition
   Deep agents include build in **write-Todos** that enables agents to breakdown complex tasks into discrete steps,track progress and adapt plans as new information emerges.
## 2) context management
   File system tools(ls,read_file,write_file,edit_file) allow agents to offload large context into in-memory or filesystem storage,preventing context window overflow and enabling work with variable length tool results.
## 3) Pluggable filesystem backends.
   The virtual filesystem is powered by **[pluggable backends]** that we can swap to fit our usecases.
   
   choose from

   1) In-Memory state
   2) Local Disk.
   3) Langgraph Store for cross thread persistance.
   4) Sandboxes for isolated code execution (modal,daytona,deno) 

   or combine multiple backends with composite routing.
   You can also implement your own custom backend.
## 4) Subagent Spawning
   A built-in **Task** tool enables  agens to spawn specialized subagents for context isolation. This keeps the main agent context clean. while still going deep on specific subtasks.
## 5) Long-term Memory
   Extend agents with persistent memory across thread using Langgraph's (Memory store). Agents can save and retrive from the previous conversations.
   