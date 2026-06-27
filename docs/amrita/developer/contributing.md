# 贡献指南

感谢您对 AmritaBot 项目的兴趣！本指南将帮助您了解如何为项目做出贡献。

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [开发环境设置](#开发环境设置)
- [项目结构](#项目结构)
- [贡献流程](#贡献流程)
- [代码规范](#代码规范)
- [文档规范](#文档规范)
- [社区准则](#社区准则)

## 项目概述

AmritaBot 是一个基于 [NoneBot2](https://nonebot.dev/) 的强大聊天机器人，专为快速构建和部署 LLM 驱动的智能 QQ 机器人而设计。它以 [AmritaCore](https://core.amritabot.com) 作为 Agent 引擎，以 [AmritaSense](https://sense.amritabot.com) 作为底层工作流运行时，构建了完整的终端应用层。

### 相关仓库

| 仓库                                                                      | 说明                                                  |
| ------------------------------------------------------------------------- | ----------------------------------------------------- |
| [AmritaBot](https://github.com/AmritaBot/Amrita)                             | **应用层** — 集成 NoneBot2 + WebUI + 插件（本文档）   |
| [AmritaCore](https://github.com/AmritaBot/AmritaCore)                     | **Agent 运行时** — 策略、会话、工具、MCP、适配器      |
| [AmritaSense](https://github.com/AmritaBot/AmritaSense)                   | **工作流引擎** — 指令集 VM、事件总线、依赖注入        |
| [Amctl](https://github.com/AmritaBot/Amctl)                               | **CLI 脚手架** — 项目创建、模板管理                   |
| [ambot-inlinectl](https://github.com/AmritaBot/ambot-inlinectl)           | **运行时 CLI** — `ambot run`、`ambot nb`、`ambot orm` |
| [amctl-template-ambot](https://github.com/AmritaBot/amctl-template-ambot) | **部署模板** — `amctl create -t ambot`                |

## 技术栈

- **Python 3.10+**
- **[NoneBot2](https://nonebot.dev/)** — 机器人框架
- **[AmritaCore](https://core.amritabot.com)** — Agent 运行时（策略、会话、工具、MCP）
- **[AmritaSense](https://sense.amritabot.com)** — 工作流引擎（指令集 VM、事件总线、依赖注入）
- **FastAPI** — Web 框架（WebUI 后端）
- **Jinja2 + Tailwind CSS** — 模板引擎与 UI 框架
- **Pydantic** — 数据验证
- **SQLAlchemy** — ORM（通过 `nonebot-plugin-orm`）
- **Alembic** — 数据库迁移
- **uv** — 包管理器
- **Ruff** — 代码格式化和 linting

## 开发环境设置

### 1. 克隆项目

```bash
git clone https://github.com/LiteSuggarDEV/Amrita.git
cd Amrita
```

### 2. 安装依赖

使用 uv（推荐）:

```bash
# 安装开发依赖
uv sync --dev

# 激活虚拟环境
source .venv/bin/activate  # Linux/macOS
# 或
.venv\Scripts\activate     # Windows
```

或者使用 pip:

```bash
pip install -e ".[full]"
```

### 3. 设置配置文件

复制 `.env` 示例文件并根据需要进行修改：

```bash
cp example/.env.example .env
# 编辑 .env 文件以设置您的配置
```

### 4. 运行项目

```bash
# 直接运行源码中的 bot.py
uv run bot.py
```

## 项目结构

```plaintext
Amrita/
├── amrita/                  # 核心包
│   ├── __init__.py          # 框架入口，暴露 init() / load_plugins() / prepare_nb_cli() 等
│   ├── __main__.py          # CLI 入口（已废弃，跳转至 amctl）
│   ├── API.py               # API 透传
│   ├── bot.py               # 机器人主入口
│   ├── cache.py             # LRU / TTL / LFU 缓存实现
│   ├── config.py            # AmritaConfig 核心配置模型
│   ├── config_manager.py    # BaseDataManager 配置管理器
│   ├── load_test.py         # 负载测试工具
│   ├── on.py                # 带权限的 on_command / on_notice 封装
│   ├── models/              # Pydantic 数据模型
│   │   └── pyproject.py     # pyproject.toml 解析模型
│   ├── plugins/             # 内置插件系统
│   │   ├── chat/            # 聊天功能（含 Agent、MCP、会话、审查）
│   │   ├── manager/         # 机器人管理（清理、封禁等）
│   │   ├── menu/            # 菜单系统（命令注册与展示）
│   │   ├── perm/            # 权限控制（lp.admin / Bukkit 式节点）
│   │   └── webui/           # WebUI（FastAPI + Tailwind CSS）
│   └── utils/              # 通用工具
│       ├── admin.py         # 管理员消息推送
│       ├── bot_utils.py     # 机器人初始化
│       ├── dbmetadata.py    # 数据库元数据查询
│       ├── dependencies.py  # 可选依赖检查
│       ├── logging.py       # 日志事件模型
│       ├── plugins.py       # 插件加载
│       ├── rate.py          # 令牌桶速率限制
│       ├── send.py          # 消息发送（含转发）
│       ├── system_health.py # 系统健康监测
│       └── utils.py         # 杂项工具
├── migrations/              # Alembic 数据库迁移
├── config/                  # 插件运行时配置（TOML）
├── data/                    # 持久化数据目录
├── logs/                    # 日志目录
├── plugins/                 # 用户自定义插件目录
├── pyproject.toml           # 项目配置
├── bot.py                   # 快速入口脚本（init + load_plugins + run）
├── tailwind.config.js       # Tailwind CSS 配置
└── LICENSE
```

### 插件系统

AmritaBot 使用插件化架构，内置插件包括：

- **chat**: 核心聊天功能，集成 AmritaCore Agent 运行时，支持流式响应、多模型、Agent 模式、MCP
- **manager**: 机器人管理功能，包括自动清理、封禁解封、日志推送
- **menu**: 菜单系统，提供命令注册与展示（基于 `MatcherData`）
- **perm**: 权限控制系统，支持 `lp.admin` 等细粒度权限节点（Bukkit 式）
- **webui**: Web 可视化界面，基于 FastAPI + Jinja2 + Tailwind CSS

## 贡献流程

### 1. Fork 仓库

在 GitHub 上 Fork 本仓库。

### 2. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b bugfix/your-bug-fix
```

### 3. 开发和测试

编写代码并确保所有测试通过。

### 4. 提交代码

使用约定的提交消息格式：

```bash
git add .
git commit -m "feat: 添加新功能描述"
# 或
git commit -m "fix: 修复问题描述"
```

### 5. 推送分支

```bash
git push origin feature/your-feature-name
```

### 6. 创建 Pull Request

在 GitHub 上创建 Pull Request，描述您的更改和原因。

## 代码规范

### Python 代码规范

- 遵循 PEP 8 编码规范
- 使用 Ruff 进行代码格式化和 linting
- 使用类型提示增强代码可读性
- 函数和类需要包含完整的文档字符串
- 使用中文编写文档字符串

### 提交消息规范

使用约定式提交规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具变动

### 代码质量

- 遵循 DRY（Don't Repeat Yourself）原则
- 编写可测试的代码
- 保持函数和方法的单一职责
- 避免深层嵌套，保持代码简洁

## 文档规范

### 代码注释

- 所有公共 API 必须包含完整的参数说明、返回值说明和异常说明
- 复杂逻辑必须包含简要的实现思路说明
- 使用中文编写文档字符串
- 配置相关代码必须说明配置的作用和使用方式

### 文档更新

- 新功能必须包含相应的文档
- API 变更需要更新文档
- 使用清晰的示例说明功能用法

## 社区准则

### 行为准则

- 尊重所有贡献者和用户
- 提供建设性的反馈
- 保持讨论的技术性
- 避免任何形式的歧视或骚扰

### 问题报告

- 提供详细的环境信息和复现步骤
- 包含错误日志和配置信息（如适用）
- 搜索已存在的问题以避免重复

### 支持请求

- 优先使用 GitHub Issues 进行问题报告
- 提供完整的错误信息和配置
- 尝试提供最小复现示例

## 许可证

本项目采用 [AGPL V3](./LICENSE) 许可证。所有贡献都将遵循此许可证。

## 联系方式

- [GitHub Issues](https://github.com/LiteSuggarDEV/Amrita/issues)
- 项目文档: `https://bot.amritabot.com`

感谢您的贡献！
