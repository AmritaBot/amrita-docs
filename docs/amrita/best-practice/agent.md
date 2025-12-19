# 充分利用 Amrita Agent 功能

Amrita 框架提供了一个强大的 Agent 模式，可以让大型语言模型(LLM)像人类一样通过思考-行动-观察的循环来解决问题。本文档将详细介绍如何充分利用这一功能。

## 1. Agent 模式概述

Agent 模式是 Amrita 框架中的一个高级功能，它允许 LLM 通过工具调用来执行复杂任务。该模式基于经典的"思考-行动-观察"(Thought-Action-Observation)循环，使模型能够自主决策并完成多步骤任务。

### 1.1 核心组件

Agent 模式包含以下核心组件：

1. **REASONING_TOOL** - 思考工具，用于生成任务摘要和原因
2. **STOP_TOOL** - 结束工具，用于标记任务完成
3. **用户自定义工具** - 开发者注册的特定功能工具

### 1.2 工作流程

Agent 模式的工作流程如下：

1. 用户输入任务
2. 模型分析任务并决定是否需要执行
3. 如果需要执行，模型调用相应工具
4. 工具执行结果作为观察结果返回给模型
5. 模型基于观察结果决定下一步行动
6. 重复步骤 3-5 直到任务完成
7. 模型调用 STOP_TOOL 结束任务

## 2. 启用 Agent 模式

要启用 Agent 模式，需要在配置文件中进行以下设置：

```toml
[llm_config.tools]
agent_mode_enable = true # 启用Agent模式
agent_tool_call_limit = 10 # 智能体模式下，每个会话最多调用的Tools次数
agent_thought_mode = "chat"  # 智能体模式下的思考模式，分为chat/reasoning。chat:聊天模式（直接运行Function Calling）；reasoning:先分析任务再进行处理；reasoning-optional 可选的reasoning；reasoning-required 每轮工具调用一定进行reasoning。
...
```

### 2.1 配置项说明

- `agent_mode_enable`: 启用 Agent 模式
- `agent_thought_mode`:
  - `"reasoning"`: 启用思考模式，模型会在执行任务前先进行思考
  - `"chat"`: 直接执行任务模式
- `agent_tool_call_limit`: 限制 Agent 模式下工具调用次数，防止无限循环

## 3. 内置工具详解

### 3.1 REASONING_TOOL（思考工具）

```python
REASONING_TOOL = ToolFunctionSchema(
    type="function",
    function=FunctionDefinitionSchema(
        name="reasoning",
        description="思考你下一步应该如何做",
        parameters=FunctionParametersSchema(
            type="object",
            properties={
                "reasoning": FunctionPropertySchema(
                    description="你下一步应该如何做",
                    type="string",
                ),
            },
            required=["reasoning"],
        ),
    ),
    strict=True,
)
```

该工具用于让模型在执行任务前进行思考，生成任务摘要和执行原因。

### 3.2 STOP_TOOL（结束工具）

```python
STOP_TOOL = ToolFunctionSchema(
    type="function",
    function=FunctionDefinitionSchema(
        name="completion",
        description="当前用户所有任务处理完成时结束处理",
        parameters=FunctionParametersSchema(type="object", properties={}, required=[]),
    ),
)
```

该工具用于标记任务完成，结束 Agent 工作流。

## 4. 工具注册与管理

Amrita 使用`ToolsManager`来管理所有工具：

### 4.1 注册自定义工具

可以通过装饰器方式注册工具：

```python
@on_tools(
    data=FunctionDefinitionSchema(
        name="my_tool",
        description="我的自定义工具",
        parameters=FunctionParametersSchema(
            type="object",
            properties={
                "param1": FunctionPropertySchema(
                    type="string",
                    description="参数1"
                )
            },
            required=["param1"]
        )
    )
)
async def my_tool_function(arguments: dict[str, Any]) -> str:
    # 工具实现
    return "执行结果"
```

### 4.2 MCP 客户端集成

Amrita 支持 MCP（Model Control Protocol）客户端，可以动态加载外部工具：

```toml
# 在配置中启用MCP客户端
[llm_config.tools]
...
agent_mcp_client_enable = true
agent_mcp_server_scripts = ["/path/to/mcp_server.py"]
```

## 5. Agent 工作流实现细节

### 5.1 工具调用循环

Agent 模式的核心是工具调用循环，其实现如下：

1. 检查是否达到调用次数限制
2. 调用 LLM 获取工具调用指令
3. 执行工具调用
4. 将结果作为观察返回给模型
5. 递归继续执行直到调用 STOP_TOOL

### 5.2 观察结果反馈

每次工具调用后，系统会将结果格式化并反馈给模型：

`````text
观察结果:
```text
tool_name1: result1
tool_name2: result2
```

请基于以上工具执行结果继续完成任务，如果任务已完成请使用工具 'completion' 结束。

`````

## 6. 最佳实践

### 6.1 提示词工程

详见请参考[提示词工程](./prompt.md)

### 6.2 性能优化

1. 合理设置`agent_tool_call_limit`防止无限循环
2. 对于复杂任务，考虑分解为多个简单子任务
3. 使用缓存机制避免重复计算

## 7. 故障排除

### 7.1 常见问题

1. **工具调用次数过多**: 检查是否正确使用 STOP_TOOL
2. **工具未找到**: 确认工具已正确注册
3. **循环调用**: 检查工具实现是否会导致无限递归

### 7.2 调试技巧

1. 启用详细日志查看工具调用过程
2. 使用测试用例验证工具功能
3. 监控工具调用次数和执行时间

通过合理使用 Amrita 的 Agent 功能，可以让 LLM 更智能地处理复杂任务，提供更接近人类解决问题的方式。
