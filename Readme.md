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


Deep agents is standalone library built on top of the langchain'c core building blocks for agents and 
and langgraph tooling for running agents in production.


The deep agents library contains
1) Deep agents sdk: A package for building agents that can handle any task.
2) Deep agents CLI: A terminal coding built on top of the deep agents package.

-------------
Projects/Project01
   1) CreateDeepAgents.js : this is the starting example on how to use the deep agent.
   
    1) Reading a env varibles from .env files
    2) creating a Google client -> model instance
    3) adding tools 
    4) creating an deep agent
    5) calling the deep agent with some input user parameters.
--------
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

Use the **DeepAgents CLI** when you want to use an interactive deep agent on the command line for coing or other tasks.
1) **Customize** agents with skills and memory.
2) **Teach**: agents as you use them about your preferences, common patterns, and custom project knowledge.
3) **Execute code**: on your machine or in sandboxes.
------------------
# Core Capabilities
## 1) Planning and task decomposition
   Deep agents include build in **write-Todos** that enables agents to breakdown complex tasks into discrete steps,track progress and adapt plans as new information emerges.
## 2) context management
   File system tools(ls,read_file,write_file,edit_file) allow agents to offload large context into in-memory or filesystem storage,preventing context window overflow and enabling work with variable length tool results.