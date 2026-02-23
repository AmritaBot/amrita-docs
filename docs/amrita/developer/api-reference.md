# API 参考

本文档提供了 Amrita 项目的核心 API 参考信息。

## 🧠 核心模块 API

### 1. 配置管理 API

参考 [Uniconf](https://github.com/LiteSuggarDEV/nonebot_plugin_uniconf)

### 2. 机器人初始化 API

#### init()

- **功能**: 初始化 Amrita 框架，设置日志、适配器等
- **位置**: `amrita/utils/bot_utils.py`
- **用法**: 启动机器人前调用此函数

### 3. 插件管理 API

#### load_plugins()

- **功能**: 加载内置插件和用户定义的插件
- **位置**: `amrita/utils/plugins.py`
- **用法**: 自动加载 pyproject.toml 中定义的插件

### 4. 消息发送 API

#### send_to_admin(msg: str, bot: Bot | None = None)

- **功能**: 发送消息到管理员
- **位置**: `amrita/utils/admin.py`
- **参数**:
  - `msg`: 消息内容
  - `bot`: Bot 实例（可选）

#### send_forward_msg_to_admin(bot: Bot, name: str, uin: str, msgs: list[MessageSegment])

- **功能**: 发送合并转发消息到管理员
- **参数**:
  - `bot`: Bot 实例
  - `name`: 发送者名称
  - `uin`: 发送者 UID
  - `msgs`: 消息列表

#### send_forward_msg(bot: Bot, event: Event, name: str, uin: str, msgs: typing.Iterable[MessageSegment])

- **功能**: 发送合并转发消息
- **位置**: `amrita/utils/send.py`
- **参数**:
  - `bot`: Bot 实例
  - `event`: 事件对象
  - `name`: 发送者名称
  - `uin`: 发送者 UID
  - `msgs`: 消息列表

### 5. 速率限制 API

#### TokenBucket

- **功能**: 令牌桶算法实现速率限制
- **位置**: `amrita/utils/rate.py`
- **方法**:
  - `consume()`: 尝试消耗一个令牌，返回是否成功

#### BucketRepoitory

- **功能**: 令牌桶仓库，管理多个命名空间的令牌桶
- **方法**:
  - `get_bucket(key)`: 获取指定键的令牌桶

#### get_bucket(namespace: str, rate: int, key: Any) -> TokenBucket

- **功能**: 获取指定命名空间、速率和键的令牌桶

### 6. 系统健康监测 API

#### calculate_system_usage() -> dict

- **功能**: 计算系统使用情况，包括 CPU、内存、磁盘等信息
- **返回**: 包含系统使用情况的字典

#### calculate_system_health() -> dict

- **功能**: 计算系统健康值
- **返回**: 包含总体健康值和详细指标的字典

### 7. 版本信息 API

#### get_amrita_version()

- **功能**: 获取 Amrita 框架版本
- **位置**: `amrita/utils/utils.py`
- **返回**: 框架版本字符串

## API 使用示例

### 配置管理示例

```python
from amrita.config_manager import BaseDataManager
from pydantic import BaseModel

class MyConfig(BaseModel):
    api_key: str = "default_key"

class MyDataManager(BaseDataManager[MyConfig]):
    config: MyConfig

    async def __apost_init__(self):
        # 异步初始化后置处理
        pass
...
# 使用配置管理器
dm = MyDataManager()
config = await dm.safe_get_config()
print(config.api_key)
```

### 消息发送示例

```python
from amrita.utils.admin import send_to_admin

# 发送消息到管理员
await send_to_admin("系统启动成功")
```

### 速率限制示例

```python
from amrita.utils.rate import get_bucket

# 获取一个令牌桶并尝试消耗令牌
bucket = get_bucket("login", 10, "user123")
if bucket.consume():
    # 允许操作
    pass
else:
    # 拒绝操作
    pass
```

### 系统健康监测示例

```python
from amrita.utils.system_health import calculate_system_health

# 获取系统健康状况
health_info = calculate_system_health()
print(f"总体健康值: {health_info['overall_health']}")
print(f"健康等级: {health_info['health_level']}")
```

## 🤖 Chat 插件 API

此处请参考聊天插件的 AmritaCore 的文档：[Docs](https://amrita-core.suggar.top/zh)

## 🔐 权限插件 API

此处请参考权限插件的 [API 文档](../features/permission/API.md)。

## 📦 菜单 API

此处请参考菜单插件的 [API 文档](../features/other-modules/menu.md)。

## 📊 WebUI API

此处请参考 [WebUI 文档](../features/webui/customization.md)

## 🧩 插件开发 API

此处请参考文献：[NoneBot 官方文档](https://nonebot.dev/docs/tutorial/create-plugin)

### 事件处理

此处请参考 [NoneBot 官方文档](hhttps://nonebot.dev/docs/tutorial/handler)

这些 API 提供了 Amrita 的核心功能接口。有关更详细的使用方法，请参考其他文档部分。
