# 快速开始

本指南将帮助您快速安装和使用 Amrita 创建您的第一个聊天机器人。

## 📋 系统要求

- Python 3.10 或更高版本
- pip 或 uv 
- 支持的系统: Windows, macOS, Linux

## 🚀 安装方式

### 方法一：使用 pip 安装（推荐）

```bash
# 安装 Amrita CLI 工具，对于操作系统全局环境的Python，请使用PIP安装amrita-cli
pip install amrita
```

### 方法二：从源码安装

```bash
# 克隆项目
git clone https://github.com/AmritaBot/Amrita.git
cd Amrita

# 安装
pip install .
```

## 🏗️ 创建项目

安装 CLI 工具后，您可以使用以下命令创建新项目：

```bash
# 创建新项目
amrita create

# 进入项目目录
cd mybot

# 启动机器人
amrita run
```

或者在现有目录中初始化项目：

```bash
# 在当前目录初始化项目
amrita init

# 启动机器人
amrita run
```

## 📦 依赖管理

Amrita 有两种依赖安装模式：

### 基础安装

只包含 CLI 工具的基本依赖：

```bash
pip install amrita
```

### 完整安装

包含运行机器人所需的所有依赖：

```bash
pip install amrita[full]
```

使用 `amrita create` 或 `amrita init` 命令创建项目时会自动安装完整依赖。

## 🧪 验证安装

安装完成后，可以通过以下命令验证：

```bash
# 查看版本信息
amrita version

# 检查依赖
amrita check-dependencies
```

## 🎮 第一个机器人

创建项目后，您可以通过以下步骤运行您的第一个机器人：

1. 配置环境变量（在 `.env` 文件中）
2. 配置机器人适配器
3. 启动机器人：
   ```bash
   amrita run
   ```

## 📁 项目结构

使用 `amrita create` 创建的项目具有以下结构：

```
mybot/
├── .env                 # 环境变量配置
├── .env.dev             # 开发环境配置
├── .env.prod            # 生产环境配置
├── .gitignore           # Git 忽略文件
├── README            # 项目说明
├── pyproject.toml       # 项目配置文件
├── plugins/             # 插件目录
├── data/                # 数据目录
└── config/              # 配置目录
```

## 🛠️ 常用命令

| 命令                        | 描述                 |
| --------------------------- | -------------------- |
| `amrita create <name>`      | 创建新项目           |
| `amrita init`               | 初始化当前目录为项目 |
| `amrita run`                | 运行项目             |
| `amrita version`            | 查看版本信息         |
| `amrita check-dependencies` | 检查依赖             |
| `amrita proj-info`          | 显示项目信息         |
| `amrita nb`                 | 直接运行 nb-cli 命令 |

现在您已经成功安装并创建了第一个 Amrita 项目！接下来可以查看 [部署指南](deployment) 了解如何部署您的机器人。
