# 充分利用 AmritaBot Agent 功能

AmritaBot 的 Agent 模式基于 **AmritaCore 的 Agent 运行时** 与 **AmritaSense 的指令集执行模型**。AmritaSense 将控制流（IF/WHILE/TRY 等）编译为线性指令序列，由轻量 VM 逐条执行；AmritaCore 在此基础上提供了策略（`AgentStrategy`）、工具管理（`ToolsManager`）、MCP 客户端和事件钩子。

这种架构意味着：Agent 的每一次思考-行动循环都不是用轮询或图遍历实现的，而是由 AmritaSense 的程序计数器（`PointerVector`）自然驱动 —— 零调度开销，原生支持挂起/恢复。

## 1. Agent 模式核心设计哲学

Agent 模式的核心是让 LLM 像一个自主智能体一样工作。AmritaCore 通过 `AgentStrategy`（抽象基类）和内置的 **ReAct Agent 策略**来控制执行流程。

### 1.1 策略类别

AmritaCore 根据 `tool_calling_mode` 选择策略执行方式，而 `agent_workflow` 决定**推理工作流**（普通 ReAct 循环 vs Step 驱动的 ReAct 循环）：

| 模式    | 策略类别           | 行为                                     |
| ------- | ------------------ | ---------------------------------------- |
| `agent` | `single_execute()` | 迭代式工具调用，框架管理循环、计数和终止 |
| `rag`   | `run()`            | 最小化上下文，单次检索后生成回复         |
| `none`  | `run()`            | 不调用工具，直接进行普通对话             |

| 工作流（`agent_workflow`） | 说明                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `react`（默认）            | 普通 ReAct 循环：一轮工具调用内完成推理与执行（工作流以 `WHILE` 包装策略循环）              |
| `step-react`               | Step 驱动的 ReAct 循环：LLM 先分解计划，框架逐 Step 执行（`NATIVE_DO(STEP_BODY)` 原生循环） |

### 1.2 关键设计要点

- **`_suggested_stop` 标志位**：控制 `tool_choice` 参数。`False`（默认）时 `tool_choice="required"` 强制调用工具；当 `STOP_TOOL` 被调用后设为 `True`，切换到 `tool_choice="auto"`，允许模型自由选择是否继续调用工具。
- **工具集注入**：`STOP_TOOL` 仅在 `tool_calling_mode="agent"` 时注入工具列表，其他模式下不存在。
- **并发工具调用**：`_run_tool_calls_concurrently()` 通过 `asyncio.gather` 并行执行多个工具调用，一次失败不取消其他。
- **循环检测**：`reasoning_pc` 计数器跟踪重复推理次数，超过 `loop_reasoning_trigger` 阈值时注入纠正提示。

## 2. 启用与配置 Agent 模式

AmritaBot 的 Agent 模式无需显式开关——只要在 `config/chat/config.toml` 中正确配置 AmritaCore 层即可生效。配置分布在 `core.function_config` 和 `llm.tools` 两个位置：

```toml
# ── AmritaCore 层（core.function_config）──
[core.function_config]
agent_tool_call_limit = 10       # 每个会话最大工具调用次数
agent_middle_message = true      # 允许 Agent 向用户发送进度消息
agent_mcp_client_enable = false  # 是否启用 MCP 客户端
agent_mcp_server_scripts = []    # MCP 服务器脚本/地址列表
use_minimal_context = false      # 是否使用最小化上下文

# ── Chat 插件层（llm.tools）──
[llm.tools]
enable_report = true             # 启用内容审查（Agent 调用审查工具时生效）
report_invoke_level = "medium"   # 审查严格程度: low / medium / high

# ── Agent 策略选择 ──
[llm]
agent_strategy = "react"         # react / hybrid-react(已弃用) / no-action
agent_workflow = "react"         # react / step-react
```

在 WebUI 中，进入 `chat` 插件配置页面，展开 `core.function_config` 和 `llm.tools` 配置块即可编辑。

### 2.1 策略选择与高级选项

通过 `[llm]` 下的 `agent_strategy` 选择 Agent 执行策略，通过 `agent_workflow` 选择推理工作流：

- **`react`**（默认）：标准 ReAct 策略，模型在思考-行动-观察循环中自主决策
- **`hybrid-react`**：混合 ReAct 策略，**已弃用**（计划于 v0.14.0 移除）。它无法忠实建模 `reasoning_content`（将推理追加为普通助手文本，绕过思考过滤），建议改用 `agent_workflow = "step-react"` 获得结构化推理
- **`no-action`**：跳过 Agent 运行，直接进行普通对话

**推理工作流（`agent_workflow`）**：

- **`react`**（默认）：普通 ReAct 循环，在一轮工具调用内完成推理与执行
- **`step-react`**：Step 驱动的 ReAct 循环。LLM 先**分解计划**（可选择是否分解为子步骤 DAG），框架通过原生 `NATIVE_DO` 循环**逐 Step 执行**，支持：
  - `update_step`：运行中修订计划
  - **停滞检测**：同一工具调用签名反复出现时注入纠正提示或放弃
  - **Step 间压缩**：按 `agent_step_token_budget` 在 Step 之间做 Token 驱动的上下文压缩
  - 需要模型支持**结构化输出**（用于分解决策与 Step 摘要）

> AmritaCore 还提供了 `ReactConfig` 配置块（`core.builtin.react_config`），支持以下高级选项：
>
> - `structured_reasoning` — 启用 `[Step N/M] [phase]` 分步推理
> - `reasoning_depth` — 推理最大步数（默认 3）
> - `enable_reflection` — 启用 `verify_reasoning` 反思工具
> - `reflection_depth` — 反思最大轮次
> - `tool_prediction` — 推理时让模型预测所需工具（需 `structured_reasoning=true` 才生效）

## 3. 内置工具详解：Agent 的"思维器官"

AmritaCore 提供了**四个**内置工具来支撑 Agent 的思维流程。`REASONING_TOOL`、`PROCESS_MESSAGE`、`STOP_TOOL` 在任何 Agent 模式下可用，`REFLECTION_TOOL` 需要额外启用 `core.builtin.react_config.enable_reflection`。

### 3.1 REASONING_TOOL (`think_and_reason`) — "思考与规划"

```python
FunctionDefinitionSchema(
    name="think_and_reason",
    description="Think about what you should do next, always call this tool to think when completing a tool call.",
    parameters={
        "last_step": "上一步做了什么（首次可为空）",
        "summary": "正在思考什么（必填）",
    }
)
```

- **调用时机**：**每轮工具调用循环开始时被强制调用**（框架设置 `tool_choice=REASONING_TOOL`），不是模型自行决定
- **职责**：模型输出 `last_step`（上一步回顾）和 `summary`（当前思考方向）。框架将 summary 渲染为系统消息注入上下文，驱动下一轮工具调用决策
- **结构化推理（可选）**：启用 `structured_reasoning` 后，推理模板引导模型输出 `[Step N/M] [phase]` 格式（analyze/plan/execute/verify），并支持 `[TOOL_PREDICTION]` 预测所需工具

### 3.2 PROCESS_MESSAGE (`processing_message`) — "进度同步"

```python
FunctionDefinitionSchema(
    name="processing_message",
    description="向用户描述 Agent 当前正在做什么、表达内部想法。用于沟通当前行为，而非通用回复。",
    parameters={"content": "消息内容，以系统指令的语气描述"}
)
```

- **职责**：向用户实时汇报工作状态。不同于 `REASONING_TOOL` 的内部思考，这是对外的自然语言沟通，提升交互透明度
- **启用条件**：需设置 `agent_middle_message = true`

### 3.3 STOP_TOOL (`agent_stop`) — "流程切换器"

```python
FunctionDefinitionSchema(
    name="agent_stop",
    description="表示已收集足够信息，准备形成最终答案。调用后不得再调用任何其他工具。",
    parameters={"result": "简要说明在本次任务中做了什么（可选）"}
)
```

- **关键行为**：
  1. 模型调用 `agent_stop`
  2. 框架设置 `_suggested_stop = True`，将 `tool_choice` 从 `"required"` 切换到 `"auto"` — 后续由模型**自由决定**是否调用工具，而非强制停止
  3. 如果启用了 Reflection，框架在此处运行反思验证流程
  4. 框架追加 `<BEGIN_OF_INSTRUCTIONS>...Now generate the final response. You must NOT call any tools again.` 指令，引导模型进入回答阶段

### 3.4 REFLECTION_TOOL (`verify_reasoning`) — "推理验证"

```python
FunctionDefinitionSchema(
    name="verify_reasoning",
    description="在输出最终答案前验证推理链的逻辑正确性、内部一致性和完整性。",
    parameters={
        "check_type": "self_check / contradiction_check / completeness_check",
        "result": "pass / warning / fail",
        "detail": "检查发现说明"
    }
)
```

- **启用条件**：`react_config.enable_reflection = true`，最多循环 `reflection_depth` 次
- **工作流**：`STOP_TOOL` 触发后，框架逐一检查逻辑正确性、内部一致性和需求覆盖完整性。若有 `fail`，注入 `<BEGIN_OF_REFLECTION_CORRECTION>` 提示模型重新推理

## 4. Agent 工作流完整解析

### 4.1 普通 ReAct 循环（`agent_workflow = "react"`）

以下基于 `BaseReActAgentStrategy.single_execute()` 的实际状态机，工作流以 `WHILE` 包装策略循环（`REACT_BLOCK = STRATEGY_INIT >> AGENT_ENTRY >> WHILE(SINGLE_STRATEGY_CALL).ACTION(REACT_COUNTER) >> AGENT_POST_PROCESS`）：

```text
循环开始 (call_count=1, tool_choice="required")
│
├─ 1. _generate_reasoning_msg()
│      └─ 渲染 REASONING_TEMPLATE（注入 last_step + origin_msg）
│      └─ tools_caller(tool_choice=REASONING_TOOL) → 强制调用 think_and_reason
│      └─ _generate_reasoning_content() → 流式输出 AgentReasoningMetadata
│
├─ 2. tools_caller(tool_choice="required" 或 "auto")
│      └─ 模型返回 tool_calls[] （可能包含多个工具调用）
│
├─ 3. _run_tool_calls_concurrently() — asyncio.gather 并发执行
│      ├─ think_and_reason → 重新生成推理内容
│      ├─ agent_stop:
│      │   ├─ _suggested_stop = True （tool_choice → "auto"）
│      │   ├─ (可选) _run_reflection()
│      │   └─ 追加 <BEGIN_OF_INSTRUCTIONS>
│      ├─ processing_message → 流式发送中间消息
│      └─ 其他业务工具 → call_tool()
│
├─ 4. call_count >= agent_tool_call_limit → on_limited() 终止
│
└─ 5. reasoning_pc > loop_reasoning_trigger → 注入循环纠正提示

循环结束 → tool_choice="auto" → 模型自主决定是否继续 → 最终补全 → 流式输出给用户
```

**关键认知**：

- `think_and_reason` 是**每轮起点**，不是模型自行决定——框架通过 `tool_choice=REASONING_TOOL` 强制触发
- `agent_stop` 的语义是**切换模式**而非硬停止——它将 `tool_choice` 从 required 切换为 auto
- 循环由 `call_count`（上限）和 `reasoning_pc`（重复检测）双重保护
- 工具调用是**并发的**——模型可以一次性发起多个工具调用，框架用 `asyncio.gather` 并行执行

### 4.2 Step 驱动循环（`agent_workflow = "step-react"`）

与普通 ReAct 循环不同，step-react 使用**原生循环**（`STEP_REACT_BLOCK = STRATEGY_INIT >> AGENT_ENTRY >> NATIVE_DO(STEP_BODY).WHILE(task_cond) >> AGENT_POST_PROCESS`），由 `NATIVE_DO` 指令承载循环体（`STEP_BODY = NODE_INTRO >> NATIVE_WHILE(iter_cond).ACTION(STEP_EXEC) >> NODE_LEAVE`），`task_cond` 判断计划是否完成：

```text
STRATEGY_INIT → AGENT_ENTRY（实例化 StepReActAgentStrategy）
│
├─ 分解阶段（结构化输出）
│      └─ 模型输出任务计划（可含子步骤 DAG）
│      └─ 计划注入上下文（快照用于变更检测）
│
└─ NATIVE_DO(STEP_BODY) 原生循环 — WHILE(task_cond)
       │
       ├─ NODE_INTRO（Step 开始标记）
       │      └─ 暴露 update_step 内置工具（幂等，仅注入一次）
       │
       ├─ NATIVE_WHILE(iter_cond) — Step 内迭代
       │      ├─ 单次 single_execute（同 4.1 的思考-行动循环）
       │      ├─ _record_tool_call：记录工具调用签名（停滞检测）
       │      └─ iter_cond：Step 预算 / 停滞 / 完成判断
       │
       ├─ NODE_LEAVE（Step 结束标记）
       │      └─ Step 间 Token 预算检查（agent_step_token_budget）
       │      └─ 压缩触发点（TokenBudget.exhausted → 停止迭代）
       │
       └─ task_cond 计划完成 → 退出循环 → AGENT_POST_PROCESS
```

**step-react 特有机制**：

- **计划分解与修订**：分解阶段模型输出计划（可含 DAG 子步骤）；运行中可通过 `update_step` 内置工具修订（`replan` 更新整个 DAG、`add_step` 追加、删除指定步骤），计划快照用于变更检测
- **停滞检测**（`_detect_step_stall`）：记录当前 Step 内每次工具调用签名，同一签名反复出现判定为停滞，注入纠正提示或放弃
- **Step 间压缩**：`agent_step_token_budget`（config.py，默认 -1 禁用）限制每个 Step 的提示词 Token 预算，Step 累积达到预算时迭代循环停止（`TokenBudget.exhausted`）
- **结构化输出要求**：分解决策与 Step 摘要依赖模型结构化输出能力（`_structured_reasoning_template`）

## 5. 最佳实践

1. **理解 `agent_stop` 的语义**：它不是"停止"，而是"我可以开始回答了吗"的信号。在此之后模型仍可能调用工具（如果 Reflection 发现错误）。
2. **合理设置 `agent_tool_call_limit`**：简单任务设 3-5，复杂多步任务设 10-15，避免过小导致未完成任务就被截断。
3. **启用 Reflection 提升可靠性**：对于关键业务场景，建议 `enable_reflection = true`，让模型在回答前自我检查。
4. **利用结构化推理**：对复杂推理任务，启用 `structured_reasoning` 让模型显式分步规划，可观察 `AgentStructuredReasoningChunkMetadata` 流式元数据。
5. **工具结果净化**：自定义工具返回给模型的内容应简洁、无内部格式标记——这会直接影响后续推理质量。
6. **监控 `reasoning_pc`**：如果频繁触发 `loop_reasoning_trigger`，检查提示词设计是否导致模型陷入循环。

通过深入理解上述架构、流程与工具职责，您可以充分发挥 AmritaBot Agent 模式的潜力，构建出既能处理复杂任务又稳定可靠的智能体应用。
