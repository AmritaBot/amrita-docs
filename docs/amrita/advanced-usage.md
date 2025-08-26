# 进阶功能

本文档介绍 Amrita 的进阶使用方法，包括插件开发、配置定制和功能扩展。

## 🔧 插件系统

Amrita 基于 NoneBot2 的插件系统，允许用户扩展机器人功能。

### 内置插件

Amrita 提供了以下内置插件：

1. **chat** - 核心聊天功能插件
2. **perm** - 权限管理系统
3. **manager** - 机器人管理功能
4. **menu** - 菜单功能管理
5. **webui** - Web 用户界面

### 禁用内置插件

可以通过配置禁用不需要的内置插件：

```dotenv
# 在 .env 文件中配置
DISABLED_BUILTIN_PLUGINS=["webui"]
```

### 创建自定义插件

使用 CLI 工具创建插件：

```bash
# 使用 nb-cli 创建插件
amrita nb plugin create my_plugin
```

或者手动创建插件目录结构：

```
plugins/
└── my_plugin/
    ├── __init__.py
    ├── config.py
    └── main.py
```

插件示例：

```python
# plugins/my_plugin/__init__.py
from nonebot.plugin import PluginMetadata

from .config import Config

__plugin_meta__ = PluginMetadata(
    name="我的插件",
    description="这是一个示例插件",
    usage="发送 hello 触发",
    config=Config,
)

# plugins/my_plugin/config.py
from pydantic import BaseModel

class Config(BaseModel):
    my_plugin_enabled: bool = True
    my_plugin_api_key: str = ""

# plugins/my_plugin/main.py
from nonebot import on_command
from nonebot.adapters.onebot.v11 import MessageEvent

hello = on_command("hello")

@hello.handle()
async def handle_hello(event: MessageEvent):
    await hello.finish("Hello from my plugin!")
```

## ⚙️ 配置系统

### 项目配置

项目配置在 `pyproject.toml` 文件中定义：

```toml
[project]
name = "mybot"
version = "0.1.0"
description = "我的 Amrita 机器人"
requires-python = ">=3.10, <4.0"
dependencies = [
    "amrita[full]>=0.2.0",
]
```

### 环境变量配置

Amrita 支持多种环境配置文件：

- `.env` - 默认环境配置
- `.env.dev` - 开发环境配置
- `.env.prod` - 生产环境配置

### Amrita 专用配置

以下配置项是 Amrita 特有的：

```dotenv
# 日志目录
LOG_DIR=logs

# 管理员群组ID（必配）
ADMIN_GROUP=123456789

# 禁用的内置插件
DISABLED_BUILTIN_PLUGINS=[]

# 记录到文件的日志等级
AMRITA_LOG_LEVEL=WARNING

# 公开群组（可选）
PUBLIC_GROUP=987654321

# 机器人名称
BOT_NAME=MyBot

# 请求速率限制（秒）
RATE_LIMIT=5

# 禁用内置菜单
DISABLE_BUILTIN_MENU=false
```

## 🤖 聊天插件配置

### LLM 模型配置

chat 插件支持多种大语言模型，关于 LLM 功能配置请参考[文档](./plugins/suggarchat)

### 会话配置

```dotenv
# 最大会话历史长度
SESSION_MAX_LENGTH=10

# 默认模型
DEFAULT_MODEL=gpt-3.5-turbo

# 系统提示词
SYSTEM_PROMPT="你是一个 helpful 的助手"
```

## 🔐 权限系统

### 权限组管理

perm 插件提供基于权限节点的权限管理：

```bash
# 创建权限组
/amrita perm group create <group_name>

# 为权限组添加权限节点
/amrita perm group add-node <group_name> <node_name>

# 为用户分配权限组
/amrita perm user assign-group <user_id> <group_name>
```

### 权限节点

权限节点采用分层结构：

```
amrita
├── chat
│   ├── send
│   └── history
├── perm
│   ├── group
│   └── user
└── manager
    ├── ban
    └── status
```

## 🌐 适配器配置

### OneBot V11 适配器

默认配置支持 OneBot V11 协议：

```dotenv
# 正向 WebSocket 连接
ONEBOT_V11_WS_URL=ws://127.0.0.1:6700/

# 反向 WebSocket 连接
ONEBOT_V11_RWS_HOST=0.0.0.0
ONEBOT_V11_RWS_PORT=8081
```

### 多适配器支持

可以通过配置启用多个适配器：

```toml
[tool.nonebot]
adapters = [
    { name = "OneBot V11", module_name = "nonebot.adapters.onebot.v11" },
    { name = "Telegram", module_name = "nonebot.adapters.telegram" },
]
```

## 🌍 国际化支持

Amrita 支持多语言界面：

```dotenv
# 设置语言
LANGUAGE=zh_CN
```

支持的语言：

- `zh_CN` - 简体中文
- `en_US` - 英语

## 📊 WebUI 配置

### 启用/禁用 WebUI

```dotenv
# 启用 WebUI
WEBUI_ENABLE=true

# WebUI 访问地址
WEBUI_HOST=0.0.0.0
WEBUI_PORT=8082
```

### 用户认证

```dotenv
# WebUI 用户名和密码
WEBUI_USER_NAME=admin
WEBUI_PASSWORD=your_secure_password

# 密码加密盐值
WEBUI_PASSWORD_SALT=your_salt_value
```

## 🧠 数据库配置

### SQLite（默认）

```dotenv
DATABASE_URL=sqlite+aiosqlite:///./data/db.sqlite3
```

### PostgreSQL

```dotenv
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/amrita
```

### MySQL

```dotenv
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/amrita
```

## 📈 性能调优

### 连接池配置

```dotenv
# 数据库连接池大小
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=0

# HTTP 连接池
HTTP_POOL_CONNECTIONS=100
HTTP_POOL_MAXSIZE=1000
```

### 缓存配置

```dotenv
# Redis 缓存
REDIS_URL=redis://localhost:6379/0

# 内存缓存大小
CACHE_SIZE=1000
```

## 🛡️ 安全配置

### 请求限制

```dotenv
# 全局限速
RATE_LIMIT=5

# IP 限速
IP_RATE_LIMIT=100

# 用户限速
USER_RATE_LIMIT=50
```

### 内容过滤

```dotenv
# 敏感词过滤
SENSITIVE_WORDS=["badword1", "badword2"]

# 消息长度限制
MAX_MESSAGE_LENGTH=1000
```

现在您已经了解了 Amrita 的进阶功能。接下来可以查看 [高级功能](advanced-features.md) 了解更多扩展开发内容。
