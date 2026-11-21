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
reasoning = true    # 显示整段思考块
tool_call = false   # 不显示工具调用提示
```

升级时旧字段会被自动翻译成新字段，无需手动迁移。

:::

### 工具调用期间会看到什么

1.19.1 起，工具调用不再把框架生命周期文案当成模型正文：

- `function_call` 的 Calling / Called 文案不会以 💬 消息发出，默认配置下整段工具调用过程是安静的；
- 打开 `meta.tool_call` 后，只在工具执行完成时发一条「调用了工具：xxx」，失败时发「ERR: xxx 执行失败」；
- 工具执行失败始终写日志，不受通知开关影响。

模型在调用工具前可能先输出一段正文。这段正文会先缓冲，等下一个事件到达再定性：

| 后继事件 | 这段正文的归宿 |
| --- | --- |
| 工具调用（Calling） | 作为一条中间消息 `💬 ...` 发出 |
| 图片 | 先作为最终正文发出，再发图片 |
| 本轮结束 | 交给 `send_final` 一次性作为最终回答发出 |

也就是说，消息粒度是「一条中间消息 / 一条最终回答」，不是按 token 或按 chunk 切。这样既不会把半句话提前发出去，也不会在工具调用前把最终答案漏发。

### 多模态工具结果

1.15 起，工具返回的图片等媒体在写入上下文前会折叠成占位符，避免每轮把 base64 重新塞进上下文。需要在插件侧接管这些媒体时，订阅 `agent.tool_return` 钩子；工具产生的媒体会归属到发起调用的会话。

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

如果工具返回图片、音频等媒体，建议同时处理 `agent.tool_return`：默认行为只保证上下文可继续使用（媒体折叠为占位符），并不负责把媒体长期保存。需要留存或转发时，在钩子里自行读取并落盘。
