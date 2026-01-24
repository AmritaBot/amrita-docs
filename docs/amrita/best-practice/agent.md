# 充分利用 Amrita Agent 功能

Amrita 框架提供了一个强大的 Agent 模式，让大型语言模型(LLM)能够通过自主调用工具来完成复杂的多步骤任务。本文档基于框架的核心实现逻辑，详细介绍如何正确、高效地使用这一功能。

## 1. Agent 模式核心设计哲学

Agent 模式的核心是让LLM像一个自主智能体一样工作，其行为遵循一个清晰的“感知-思考-行动”循环。框架通过精心设计的工具和控制流来引导这一过程，关键在于**明确各工具的职责**和**清晰的工作阶段划分**，以防止模型产生混淆（如模型底层标记标签泄露或流程中断）。

### 1.1 核心循环与阶段

Agent的工作被明确分为两个阶段：

1. **工具调用与迭代阶段**：模型在此阶段循环使用工具。每次循环包含 **思考(Think)** -> **行动(Act，调用工具)** -> **观察(Observe，接收结果)** 的步骤。
2. **最终回答阶段**：当模型判断信息充足后，主动结束工具循环，并生成面向用户的、纯净的自然语言回答。

### 1.2 关键设计要点

- **工具是扩展的能力**：模型通过调用工具来获取信息或执行操作。
- **流程由模型主导**：由模型自主决定何时调用工具、调用哪个工具以及何时结束。
- **上下文是记忆**：所有思考、工具调用和结果都按顺序保存在对话上下文中，作为模型进行下一步决策的依据。
- **清晰的阶段切换信号**：通过特定的工具（`STOP_TOOL`）发出明确的流程阶段转换信号。

## 2. 启用与配置 Agent 模式

在配置文件中启用并精细调整Agent模式：

```toml
[llm_config.tools]
agent_mode_enable = true # 总开关：启用Agent模式
agent_tool_call_limit = 10 # 安全限制：每个会话最大工具调用次数，防止无限循环
agent_thought_mode = “reasoning” # 思考模式：控制Reasoning工具的调用逻辑
agent_middle_message = true # 是否允许模型使用`processing_message`工具向用户发送中间消息
agent_reasoning_hide = false # 是否向用户隐藏模型的思考过程（Reasoning结果）
agent_tool_call_notice = “notify” # 工具调用通知方式：`notify`(通知) 或 `silent`(静默)
```

### 2.1 关键配置项详解

- **`agent_thought_mode`**：此配置至关重要，决定了Reasoning工具的调用策略。
  - `“chat”`：不主动引导模型进行结构化思考，直接进行工具调用。
  - `“reasoning”`：在任务**开始前**，引导模型进行一次性的任务分析与规划。
  - `“reasoning-required”`：**在每一次工具调用循环开始前**，都强制要求模型进行思考。此模式最能保证复杂任务执行的逻辑性，但Token消耗较多。

## 3. 内置工具详解：Agent的“思维器官”

框架提供了三个核心内置工具来支撑Agent的思维流程，理解它们的职责是正确使用的关键。

### 3.1 REASONING_TOOL (`think_and_reason`) - “思考与规划”

```python
FunctionDefinitionSchema(
    name=“think_and_reason”,
    description=“Think about what you should do next, always call this tool to think when completing a tool call.”,
)
```

- **职责**：模型的“工作内存”。用于分解任务、分析现状、规划下一步。**其输出（`content`）是纯文本的思考过程，会被框架记录并可能放入上下文。**
- **触发时机**：由`agent_thought_mode`配置和模型自主性共同决定。
- **重要提示**：务必确保该工具返回的思考内容是**纯净的自然语言文本**，任何内部格式标记（如DSML标签）都会污染上下文并可能导致输出异常。

### 3.2 PROCESS_MESSAGE_TOOL (`processing_message`) - “进度同步”

```python
FunctionDefinitionSchema(
    name=“processing_message”,
    description=“Describe what the agent is currently doing... Use this when you need to communicate your current actions or internal reasoning to the user”,
)
```

- **职责**：模型的“语音”。用于向用户实时汇报当前工作状态或内心想法（例如：“我正在查询数据库...”），**旨在提升交互的透明度和拟人感**。
- **与REASONING的区别**：`REASONING_TOOL`是内部的、结构化的思考，用于驱动逻辑；`PROCESS_MESSAGE`是对外的、非结构化的自然语言沟通。

### 3.3 STOP_TOOL (`agent_stop`) - “流程切换器”

```python
FunctionDefinitionSchema(
    name=“agent_stop”,
    description=“Call this tool when the chat task is finished.”,
)
```

- **职责**：模型发出的**流程结束信号**。它不代表代码的硬性终止，而是模型向框架声明：“我已获得足够信息，准备（或正在）生成最终答案”。
- **关键工作流**：
    1. 模型调用`agent_stop`。
    2. 框架接收到此信号后，**通常不会再开启新的工具调用循环**。
    3. 框架将包含此信号的完整上下文提交给LLM，要求其进行**最终的回答补全(Completion)**。
- **正确理解**：它不是“停止按钮”，而是“阶段转换标识”。在最终补全阶段，模型应直接输出答案，而**严禁**再次输出工具调用格式。

## 4. Agent 工作流完整解析

以下是一次成功的复杂任务处理流程，展示了各工具如何协同工作：

```text
1. [User]: “查询北京今天的天气，并建议我是否应该带伞。”
2. [System]: (根据`agent_thought_mode`，可能触发REASONING) -> `think_and_reason({“content”: “用户需要天气和出行建议。我需要先调用天气查询工具获取北京今天的天气详情，特别是降水概率，然后根据结果给出建议。”})`
3. [Tool]: `think_and_reason` -> “思考已记录。”
4. [Model]: 决定调用天气查询工具 -> `get_weather({“city”: “北京”})`
5. [Tool]: `get_weather` -> “{“city”: “北京”， “condition”: “小雨”， “rain_prob”: “80%”}”
6. [Model]: 观察到有雨，决定调用`processing_message`告知用户 -> `processing_message({“content”: “已查到北京今天有小雨，降水概率较高，我正在为您分析是否需要带伞。”})`
7. [Tool]: `processing_message` -> “消息已发送。”
8. [Model]: 信息已充足，决定结束工具循环 -> `agent_stop({“result”: “已获取北京天气为小雨，高降水概率。”})`
9. [Tool]: `agent_stop` -> “任务完成。”
10.[Framework]: 识别到`agent_stop`，停止工具循环，将1-9步所有消息作为上下文，请求最终补全。
11.[Model]: (在最终补全阶段) -> “[Final Answer]: 北京今天有小雨，降水概率高达80%，建议您外出时一定要带伞。”
```

## 5. 最佳实践

1. **清晰的系统提示**：在`system`提示中明确告诉模型各工具的用途和工作阶段（工具调用 vs. 最终回答）。
2. **管理上下文长度**：对于超长对话，适时清空或总结早期消息，防止关键信息被淹没或因过长上下文导致模型行为异常。
3. **工具结果净化**：确保所有自定义工具返回给模型的内容是简洁、无内部格式标记的纯文本或标准JSON。
4. **合理使用思考模式**：对于简单任务，使用`chat`模式；对于复杂、多步骤任务，使用`reasoning-required`模式以保证逻辑连贯。

通过深入理解上述架构、流程与工具职责，您可以充分发挥Amrita Agent模式的潜力，构建出既能处理复杂任务又稳定可靠的智能体应用。
