# Agent & Tools

## 前言

AmritaBot 内置了 Tools 能力与 Agent 能力，本章主要介绍Tools相关的配置，关于Agent的使用，请参考[Agent 最佳实践](../../best-practices/agent.md)

## 配置

导航到 `chat` 插件的配置页面，展开 `core` 配置组（`core.builtin` 与 `core.function_config`），以下配置项与 Tools/Agent 调用有关：

<!-- TODO: 工具调用(Function Calling)配置页面截图，显示工具启用、参数及权限配置 -->

配置项额外说明：

- **core.builtin.tool_calling_mode**: 决定 Amrita 调用工具的方式，可选 `agent`（默认，循环调用工具直到完成）、`rag`（只调用一次工具）、`none`（不调用工具）。
- **core.function_config.use_minimal_context**: 默认为 `false`。若开启，仅保留 system 与最后一条消息，可能降低 LLM 对复杂问题的处理能力与连贯性，需要高质量响应时请保持关闭。
- **core.function_config.agent_tool_call_limit**: 默认为 `10`，表示一次对话中允许调用的工具次数，超过此限制则强行停止对话。
- **core.function_config.validate_tool_arguments**: 默认为 `true`。调用前校验模型给出的参数是否符合工具 schema，建议保持开启。
- **core.function_config.agent_step_token_budget**: 单个 Step 的 token 预算，`-1`（默认）表示不限制。
- **core.builtin.agent_thought_mode**: 控制 Agent 的思考展示方式，可选 `chat`（默认）、`reasoning`、`reasoning-required`、`reasoning-optional`，详见 [Agent 最佳实践](../../best-practices/agent.md)。

### 思考与工具提示的显示开关

::: warning 1.0 起配置位置变了

`core.builtin.agent_reasoning_hide` 与 `core.builtin.agent_tool_call_notice` 在 AmritaCore 1.0 中**已移除**，
改为 Chat 插件自己的 `[meta]` 段（含义也反转成了"是否显示"）：

| 旧配置 | 新配置 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `core.builtin.agent_reasoning_hide = false` | `meta.reasoning = true` | `true` | 是否显示模型的思考过程 |
| `core.builtin.agent_tool_call_notice = "hide"` | `meta.tool_call = false` | `false` | 是否显示工具调用提示 |

```toml
[meta]
reasoning = true    # 显示思考过程
tool_call = false   # 不显示工具调用提示
```

升级时旧字段会被自动翻译成新字段，无需手动迁移。

:::

## MCP(Model Context Protocol)

请参考[MCP集成](./mcp.md)一章。

## 扩展：拦截工具调用

插件可以在工具执行前后介入，例如改写参数、改写返回值、或直接取消调用。
相关事件为 `agent.tool_call` 与 `agent.tool_return`，用法见
[扩展点与事件钩子](../../developer/extension-points.md#agent-步骤事件)：

```python
from amrita.plugins.chat.events import StepToolCallEvent, on_tool_call


@on_tool_call()
async def guard(event: StepToolCallEvent) -> None:
    if event.tool_name == "shell_exec":
        event.cancel = True
```

自定义工具（供 LLM 调用）的注册方式见同一页的「工具注册」一节。
