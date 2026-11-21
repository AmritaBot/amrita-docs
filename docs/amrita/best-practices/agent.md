# Agent 设计与运行实践

Agent 模式不是「把工具都打开，让模型自己想办法」。它是一套有预算、有停止条件、有展示策略的运行机制。配得好，模型能稳定完成多步任务；配得差，会出现空转、重复调用、上下文爆掉或用户被中间消息刷屏。

本文从使用者的角度讲怎么选模式、设预算、控制展示和排查问题。底层状态机与工具职责见[系统架构](../advanced/architecture.md)。

## 1. 先选运行模式

`core.builtin.tool_calling_mode` 决定 Agent 是否调用工具：

| 模式 | 行为 | 适用场景 |
| --- | --- | --- |
| `agent`（默认） | 迭代式工具调用，框架管理循环、预算与终止 | 需要查资料、调接口、多步操作 |
| `rag` | 只调用一次工具，拿到结果后生成回复 | 单次检索、单次查询 |
| `none` | 不调用工具，直接对话 | 纯聊天、角色扮演、低延迟场景 |

`llm.agent_workflow` 决定推理工作流：

| 工作流 | 行为 | 适用场景 |
| --- | --- | --- |
| `react`（默认） | 普通 ReAct 循环，一轮工具调用内完成推理与执行 | 大多数场景 |
| `step-react` | 先分解计划，再逐 Step 执行，支持计划修订、停滞检测、Step 间压缩 | 长任务、步骤多、需要中途纠偏 |

选择建议：

- 先保持 `agent + react`，把工具描述和提示词写清楚。多数问题不是工作流不够强，而是工具描述太模糊。
- 任务经常超过 5 个步骤、需要「先做 A 再做 B，B 失败改做 C」时，再考虑 `step-react`。
- `step-react` 依赖模型的结构化输出能力。模型不支持结构化输出时，分解决策会不稳定，不如留在 `react`。
- 纯聊天场景直接用 `none`，省掉工具选择与循环开销。

## 2. 设好预算与停止条件

```toml
[core.function_config]
agent_tool_call_limit = 10        # 一次运行最多几轮工具调用
agent_tool_parallel_limit = 0     # 单轮内并发工具数，0=不限制，1=串行
agent_tool_refusal_rounds = 2     # 预算用尽后允许模型收尾的轮数
validate_tool_arguments = true    # 调用前校验参数
agent_step_token_budget = -1      # 单个 Step 的 token 预算，-1=不限制
agent_middle_message = true       # 允许处理进度消息
```

几个容易误解的点：

- `agent_tool_call_limit` 数的是**轮次**，不是工具个数。一轮里模型请求三个工具，只花一个单位。
- 预算用尽不会硬切断，框架会进入收尾阶段，让模型基于已有信息回答；`agent_tool_refusal_rounds` 限制收尾阶段还能请求几轮工具。
- `agent_tool_parallel_limit` 只限制**同一轮内**的并发。声明为不安全的工具和流程控制工具始终单独执行。
- `validate_tool_arguments` 建议保持开启。参数不合法时模型会收到 `ERR:` 结果并有机会纠正，比直接抛异常好排查。

经验值：

| 场景 | 建议 |
| --- | --- |
| 单次查询 | `rag`，或 `agent` + 3–5 轮 |
| 常规多步任务 | `agent` + 8–12 轮 |
| 长任务 / 研究型 | `agent` + 15–20 轮，配合 `step-react` |
| 高并发群聊 | 降低轮次，限制并发，避免单个请求占满资源 |

轮次不是越大越好。给太多预算，模型可能在无关工具之间来回试；给太少，任务做一半就收尾。先按任务类型设一个中间值，观察日志里的实际调用轮次再调。

## 3. 控制思考与中间消息的展示

Agent 的中间过程有三类：思考块、工具通知、进度消息。它们都该按场景开关，而不是全部打开。

```toml
[meta]
enable = true
reasoning = true           # 框架整段思考块
stream_reasoning = false   # 收集完整段后一次性发送
reasoning_summary = false  # 发送前先摘要
tool_call = false          # 工具调用通知
skill_trigger = true       # 技能触发通知
```

建议：

- **群聊**：`stream_reasoning = false`、`tool_call = false`，只保留最终回答与必要的进度消息。群里没人想看 Calling/Called。
- **个人助理**：可以开 `stream_reasoning = true`，让自己看到模型的思考方向；长思考建议同时开 `reasoning_summary`，把几万字的思考压成一两百字。
- **调试**：临时开 `tool_call = true`，确认模型到底调了哪个工具；生产环境关掉。
- `reasoning_summary` 会多一次模型调用，失败或超时回退原文。模型慢时把 `reasoning_summary_timeout_seconds` 放宽。

1.19 起 `stream_reasoning` 是「整段发送」，不是逐 token 流式。模型正文会先缓冲，出现工具调用时作为一条 `💬` 中间消息发出，本轮结束再由最终回答统一发送，不会把半句话提前发出去。

## 4. 工具要为模型而设计

工具是 Agent 的手脚。工具设计得差，提示词再漂亮也救不回来。

### 4.1 描述写「何时用」，不只写「做什么」

```python
# 不推荐
"description": "查询天气"

# 推荐
"description": "查询指定城市未来 1-3 天的天气。用户询问气温、降雨、穿衣建议时使用；历史天气请改用 weather_history。"
```

描述里至少包含：能力边界、触发场景、不适用场景、返回内容。模型靠这些判断要不要调用。

### 4.2 参数 schema 要严格

- 必填项明确标 `required`；
- 枚举值用 `enum`，不要让模型自由发挥；
- 时间、城市、ID 这类参数写清格式和示例；
- 不要用一个大而全的 `data: object` 接所有参数，模型很难填对。

### 4.3 返回值要短、稳定、可解析

- 只返回模型需要的信息，不要把整个 HTTP 响应体塞回去；
- 用固定字段名，别让同一工具这次返回 `data`、下次返回 `result`；
- 错误也用结构化结果返回，例如 `{"ok": false, "error": "城市不存在"}`，而不是抛一串 traceback；
- 大结果分页或截断，并告诉模型「还有更多，用 offset 继续」。

### 4.4 危险操作要单独授权

删除、写入、执行命令、发消息这类工具，不要和查询工具混在一个权限级别。用 Amrita 的权限系统限制调用者，或在工具内部校验 `user_id` / 群权限。工具本身也要幂等或可回滚。

## 5. 技能与工具的分工

技能适合「一段可复用的工作流说明 + 支持文件 + 可选脚本」，工具适合「一个明确的原子能力」。

- 需要模型按步骤做事、读参考资料、执行脚本：写成 Skill；
- 只需要一次 API 调用或一次数据查询：写成 Tool；
- 只是改变说话风格或角色设定：写在提示词里，不要包装成技能。

默认 `skills.mode = "progressive"` 时，所有技能只暴露 `skill_open` / `skill_read` 两个工具。模型先按 description 选中技能，再打开正文，最后按需读支持文件。这样技能数量增长不会把工具池撑爆。

编写方法见[编写有效的 Skills](./skills.md)，运行与配置见[Skills 接入](../features/chat/skills.md)。

## 6. `step-react` 的使用边界

`step-react` 不是「更高级的 react」，它解决的是特定问题：

- 任务需要显式计划，且计划可能在中途修订；
- 单步执行时间长，需要在 Step 之间压缩上下文；
- 需要在某个 Step 卡住时检测停滞并换策略。

代价是更多模型调用、更长的提示词、对结构化输出的依赖。简单任务用它，通常只是增加延迟和成本。

如果决定用：

```toml
[llm]
agent_workflow = "step-react"

[core.function_config]
agent_step_token_budget = 16000   # 按模型窗口设置，-1 为不限制
```

同时确认模型能稳定输出结构化结果。分解决策失败时，先换模型或回到 `react`，不要靠反复改提示词硬撑。

## 7. MCP 的稳定性

MCP 服务是外部进程或远端连接，不能假设它一定可用。1.16 起 Amrita 会逐个加载服务，单个服务失败不会拖垮整个聊天插件，但使用时仍要注意：

- 给每个服务设置合理的启动超时，别让一个慢服务拖住整轮对话；
- 工具描述里写清服务提供的能力，避免模型把 MCP 工具当成本地工具乱调；
- MCP 工具返回大结果时，在服务端就截断，不要指望模型自己忽略；
- 服务重载后工具列表可能变化，长任务中途重载要确认工具还在。

## 8. 排查清单

| 现象 | 先看什么 |
| --- | --- |
| 模型完全不调工具 | `tool_calling_mode` 是否为 `none`；工具描述是否写清触发场景；提示词是否在说「不要调用工具」 |
| 一直重复调用同一个工具 | 工具返回是否没有提供新信息；`loop_reasoning_trigger` 是否过高；提示词是否要求「必须查到为止」 |
| 任务做一半就回答 | `agent_tool_call_limit` 是否太小；工具是否返回了模糊错误；模型是否误判任务已完成 |
| 中间消息刷屏 | 关闭 `meta.tool_call`；检查 `processing_message` 的使用频率；群聊关闭 `stream_reasoning` |
| 上下文爆掉 | 开 `context_strategy = "compact"`；降低 `agent_tool_call_limit`；工具结果截断；考虑 `step-react` 的 Step 间压缩 |
| 延迟很高 | 减少串行工具；检查 `agent_tool_parallel_limit`；关闭不必要的思考展示；MCP 服务是否慢 |
| 成本失控 | 降轮次、缩短工具返回、关闭 `reasoning_summary` 之外的额外调用；检查是否有技能在后台反复触发 |

## 9. 一份可用的起点配置

```toml
[core.builtin]
tool_calling_mode = "agent"
agent_thought_mode = "chat"

[core.function_config]
agent_tool_call_limit = 10
agent_tool_parallel_limit = 0
agent_tool_refusal_rounds = 2
validate_tool_arguments = true
agent_middle_message = true
use_minimal_context = false

[llm]
agent_strategy = "react"
agent_workflow = "react"

[meta]
reasoning = true
stream_reasoning = false
reasoning_summary = false
tool_call = false
```

先让 Agent 稳定完成一类任务，再逐步加工具、加技能、换工作流。每加一层，都观察调用轮次、延迟和失败率。Agent 的效果是调出来的，不是一次配置出来的。
