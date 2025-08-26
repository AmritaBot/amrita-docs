# API 参考

本文档提供了 Amrita 项目的核心 API 参考信息。

## 📦 CLI 命令

### 主命令

#### `amrita create`

创建新项目

```bash
amrita create PROJECT_NAME
```

#### `amrita init`

初始化当前目录为 Amrita 项目

```bash
amrita init
```

#### `amrita run`

运行项目

```bash
amrita run [OPTIONS]
```

选项：

- `-r, --run` - 直接在当前环境中运行

#### `amrita version`

显示版本信息

```bash
amrita version
```

#### `amrita check-dependencies`

检查依赖

```bash
amrita check-dependencies [OPTIONS]
```

选项：

- `-s, --self` - 直接在当前环境中检查

#### `amrita entry`

在当前目录生成 bot.py 入口文件

```bash
amrita entry
```

#### `amrita proj-info`

显示项目信息

```bash
amrita proj-info
```

#### `amrita nb`

直接运行 nb-cli 命令

```bash
amrita nb [NB_ARGS]...
```

#### `amrita test`

运行 Amrita 项目的加载测试

```bash
amrita test
```

## 🧠 核心模块 API

### amrita.config

#### `get_amrita_config()`

获取 Amrita 配置

```python
from amrita.config import get_amrita_config

config = get_amrita_config()
```

返回:

- `AmritaConfig` - Amrita 配置对象

### amrita.utils

#### `amrita.utils.bot_utils.init()`

初始化 Amrita 机器人

```python
from amritaimport init

init()
```

#### `amrita.utils.plugins.load_plugins()`

加载插件

```python
from amrita import load_plugins

load_plugins()
```

### `amrita.<module>.run()`

运行 Amrita 项目

```python
from amrita import run
run()
```

## 🤖 Chat 插件 API

此处请参考聊天插件的 [API 文档](../plugins/suggarchat/advanced)。

## 🔐 权限插件 API

此处请参考权限插件的 [API 文档](../plugins/liteperm/)。

## 📊 WebUI API

此处请参考 WebUI 的 SwaggerUI.

## 🧩 插件开发 API

此处请参考文献：[NoneBot 官方文档](https://nonebot.dev/docs/tutorial/create-plugin)

### 事件处理

此处请参考 [NoneBot 官方文档](hhttps://nonebot.dev/docs/tutorial/handler)


这些 API 提供了 Amrita 的核心功能接口。有关更详细的使用方法，请参考其他文档部分。
