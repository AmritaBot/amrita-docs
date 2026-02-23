# Agent & Tools

## 前言

Amrita 内置了 Tools 能力与 Agent 能力，本章主要介绍Tools相关的配置，关于Agent的使用，请参考[Agent 最佳实践](../../best-practices/agent.md)

## 配置

导航到 `chat` 插件的配置页面，展开`llm`配置组，如图，以下配置项与Tools调用有关：

![0](/chat-conf-tool-0.png)

![1](/chat-conf-tool-1.png)

![3](/chat-conf-tool-3.png)

配置项额外说明：

- **tools.enable_tools**: 已不再使用，而是由`tools.tool_calling_mode`决定。
- **tools.use_minimal_context**: 默认为`true`，但缺少上下文的情况可能会降低LLM对于复杂问题的处理能力与连贯性，如果您需要高质量的响应，请将此选项设置为`false`。
- **tools.agent_tool_call_limit**: 默认为`1`，表示一次对话中，允许调用的Tools能力数量，如果超过此限制，则强行停止对话。
- **tools.agent_thought_mode**: 此处请参考Agent最佳实践的相关说明。
- **tools.agent_reasoning_hide**: 决定是否**隐藏**最底层的`think_and_reason`输出，而不是直接输出给用户，默认为`true`。
- **tools.tool_calling_mode**: 决定Amrita调用工具的新闻，`rag`为只调用一次工具，`agent`为循环调用工具，默认为`agent`，`none`则不调用工具。

## MCP(Model Context Protocol)

请参考[MCP集成](./mcp.md)一章。