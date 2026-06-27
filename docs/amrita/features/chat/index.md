# 聊天功能概述

Amrita 的聊天功能以 AmritaCore 作为 Agent 引擎，以 AmritaSense 作为底层工作流运行时，提供了从基础对话到高级工具调用和 MCP 集成的完整能力。

## 核心设计

- **流式交互优先**：基于 AmritaSense 的 `SuspendObjectStream` 全双工流原语，所有 LLM 响应均为异步流式输出，支持挂起/恢复
- **厂商无关适配器**：AmritaCore 的适配器系统支持 OpenAI、Anthropic 等协议，以及任意兼容 OpenAI API 的模型
- **事件驱动管线**：通过 `on_completion`、`on_precompletion`、`on_event` 钩子，可以在请求前后拦截和修改处理流程
- **声明式工具系统**：使用 `@simple_tool` / `@on_tools` 声明工具，框架自动进行参数验证和依赖注入

## 功能特性

### 基础对话

- 多轮对话上下文管理
- 对话历史记忆与自动压缩
- 个性化提示词与预设

### 高级对话

- 上下文感知对话与 Cookie 反注入安全检测
- 会话归档与恢复（Session）
- 多模态输入支持

### 工具调用 (Function Calling)

- 自动工具发现与注册
- Agent 模式（循环推理-行动-观察）
- 权限控制集成
- MCP（Model Context Protocol）客户端支持

## 使用场景

- **客服机器人**: 自动回答常见问题，转接复杂问题给人工
- **技术支持**: 系统状态查询、故障诊断、自动化修复
- **个人助理**: 日程管理、信息查询、任务执行
- **教育助手**: 知识问答、学习指导、练习批改

## 快速导航

- [基础对话使用](./basic.md)
- [高级对话功能](./advanced.md)
- [工具调用详解](./tools.md)
- [MCP 服务器集成](./mcp.md)
