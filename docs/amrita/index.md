# AmritaBot 项目文档

AmritaBot 是一个基于 [NoneBot2](https://nonebot.dev/) 的强大智能聊天机器人，专为快速构建和部署 LLM 驱动的聊天机器人而设计。它以 [AmritaCore](https://core.amritabot.com) 作为核心 Agent 引擎，以 [AmritaSense](https://sense.amritabot.com) 作为底层工作流编排引擎，构建了从底层运行时到上层应用的完整技术栈。

## 介绍

AmritaBot 提供了一套完整的聊天机器人开发和部署解决方案，具有以下核心特性：

### 🌟 核心特性

- **多模型支持**: 通过 AmritaCore 的厂商无关适配器系统，支持 OpenAI、DeepSeek、Gemini、Anthropic 等多种大语言模型
- **流式交互优先**: 基于 AmritaSense 的原生异步流式架构，所有消息输出均为异步流，支持挂起/恢复
- **多模态能力**: 支持处理图像等多媒体内容
- **灵活适配**: 原生支持 OneBot V11 协议，轻松对接 QQ 等平台
- **智能会话管理**: 内置会话控制、上下文窗口管理、记忆抽象和 Token 自动优化
- **插件化架构**: 模块化设计，易于扩展和定制
- **开箱即用**: 预设丰富的回复模板和功能配置
- **Agent 工作流**: 基于 AmritaSense 指令集架构的智能体模式，原生支持 IF/WHILE/JUMP/TRY 等控制流
- **事件驱动钩子**: AmritaCore 提供 `on_completion`、`on_event` 等钩子，可拦截和修改处理管线
- **MCP**: 内建 MCP 客户端，可集成外部工具和服务
- **声明式依赖注入**: 工具和节点通过函数签名声明依赖，框架自动进行类型匹配和并发解析
- **AmritaSense 运行时**: 基于指令集的 VM 执行模型，~300 LOC 核心，零调度开销
- **强大的 WebUI 模块**: 原生集成功能强大的 WebUI 模块，支持远程管理和配置机器人
- **内置多功能模块**: 权限管理、菜单管理、内容审查、Cookie 反注入等

### 🧩 核心组件

1. **CLI 工具链**
   - `amctl` — 项目脚手架，负责创建、管理、修复项目
   - `ambot`（ambot-inlinectl）— 运行时管理，提供 `run`、`nb`、`orm` 等命令
   - `amctl-template-ambot` — 部署模板，一键安装即可创建 AmritaBot 项目

2. **核心插件系统**
   - `chat`: 主要聊天功能插件，支持多种大语言模型
   - `perm`: 权限管理系统
   - `manager`: 机器人管理功能
   - `menu`: 菜单功能管理
   - `webui`: 功能强大的 Web 用户界面，支持远程管理和配置机器人

3. **技术栈层次**

```mermaid
graph TD
    subgraph "AmritaBot 应用层"
        NoneBot2[NoneBot2 框架]
        OneBot[OneBot V11 适配器]
        WebUI[WebUI 管理界面]
        Plugins[内置插件系统<br/>chat · perm · manager · menu · webui]
    end

    subgraph "AmritaCore Agent 运行时"
        Agent[ReActAgentStrategy 策略引擎<br/>react / step-react]
        Chat[ChatObject 会话工作流编排器<br/>AgentSession 生命周期]
        Tools[ToolsManager 工具系统]
        MCPClient[MCP 客户端]
        Adapters[厂商适配器<br/>OpenAI · Anthropic · 可扩展]
        Hooks[事件钩子系统<br/>on_precompletion · on_completion]
    end

    subgraph "AmritaSense 工作流引擎"
        VM[指令集 VM<br/>PointerVector + 调用栈]
        ControlFlow[原生控制流<br/>IF · WHILE · GOTO · CALL · TRY]
        DI[声明式依赖注入]
        EventBus[事件总线]
        Stream[SuspendObjectStream<br/>全双工异步流]
    end

    AmritaBot 应用层 --> AmritaCore Agent 运行时
    AmritaCore Agent 运行时 --> AmritaSense 工作流引擎
```

- **AmritaSense** (~300 LOC 核心) — 基于指令集的通用工作流编排引擎，提供 IF/WHILE/GOTO/CALL/TRY 等原生控制流，零调度开销的 VM 执行模型
- **AmritaCore** — 构建于 AmritaSense 之上的渐进式 Agent 框架，提供厂商无关适配器、工具系统、MCP 客户端、事件钩子、内存管理等基础设施
- **Amrita** — 面向终端用户的应用层，集成 NoneBot2、OneBot V11、WebUI，提供开箱即用的 QQ 机器人体验

- 基于 Python 3.10+
- 使用 NoneBot2 作为核心框架
- 支持 OneBot V11 协议适配器
- 使用 SQLAlchemy ORM 进行数据持久化
- 使用 FastAPI 进行 API 接口开发

开始使用 AmritaBot 之前，建议先阅读 [快速开始](./guide/quick-start.md) 部分。
