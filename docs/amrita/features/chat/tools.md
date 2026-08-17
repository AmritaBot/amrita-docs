# Agent & Tools

## 前言

AmritaBot 内置了 Tools 能力与 Agent 能力，本章主要介绍Tools相关的配置，关于Agent的使用，请参考[Agent 最佳实践](../../best-practices/agent.md)

## 配置

导航到 `chat` 插件的配置页面，展开 `core` 配置组（`core.builtin` 与 `core.function_config`），以下配置项与 Tools/Agent 调用有关：

<!-- TODO: 工具调用(Function Calling)配置页面截图，显示工具启用、参数及权限配置 -->

配置项额外说明：

- **core.builtin.tool_calling_mode**: 决定 Amrita 调用工具的方式，`agent` 为循环调用工具（默认），`rag` 为只调用一次工具，`none` 则不调用工具。
- **core.function_config.use_minimal_context**: 默认为 `false`。若开启，仅保留 system 与最后一条消息，可能降低 LLM 对复杂问题的处理能力与连贯性，需要高质量响应时请保持关闭。
- **core.function_config.agent_tool_call_limit**: 默认为 `10`，表示一次对话中允许调用的工具次数，超过此限制则强行停止对话。
- **core.builtin.agent_thought_mode**: 控制 Agent 的思考展示方式（`chat` / 其他模式），详见 Agent 最佳实践。
- **core.builtin.agent_reasoning_hide**: 决定是否**隐藏**最底层的 `think_and_reason` 输出（不直接展示给用户），默认为 `false`。
- **core.builtin.agent_tool_call_notice**: 控制工具调用的提示展示方式，默认为 `hide`。

## MCP(Model Context Protocol)

请参考[MCP集成](./mcp.md)一章。
