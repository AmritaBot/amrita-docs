# API 参考

本文档提供了 AmritaBot 项目的核心 API 参考信息。完整 API 请参阅各模块源码。

## 🧠 框架入口 API

这些是 `amrita/__init__.py` 暴露的顶层 API，供 `ambot-inlinectl` 等外部 CLI 调用。

### init()

- **位置**: `amrita/utils/bot_utils.py`
- **功能**: 初始化 AmritaBot 框架（日志、配置、适配器）

### load_plugins()

- **位置**: `amrita/utils/plugins.py`
- **功能**: 加载 `pyproject.toml` 中 `[tool.amrita].plugins` 定义的插件

### prepare_nb_cli()

- **功能**: 初始化框架后返回 nb-cli 原生 CLI 入口函数，供 `ambot nb` 透传

### prepare_orm()

- **功能**: 初始化框架并加载 ORM 插件后，返回 `nonebot_plugin_orm` CLI 入口函数，供 `ambot orm` 透传

---

## ⚙️ 配置 API

### AmritaConfig

- **位置**: `amrita/config.py`
- **功能**: AmritaBot 核心配置 Pydantic 模型，定义 `log_dir`、`admin_group`、`bot_name`、`rate_limit` 等字段

### get_amrita_config()

- **功能**: 获取当前 AmritaConfig 实例

### BaseDataManager

- **位置**: `nonebot_plugin_uniconf.manager`
- **功能**: 配置管理器基类（泛型 ABC），提供 TOML 配置文件的读写与 WebUI 集成。
  Amrita 各插件通过它派生出自己的配置管理器（如 Chat 插件的 `ConfigManager`）

---

## 🔌 带权限的事件注册

### on_amrita(permission=..., permission_mode=...)

- **位置**: `amrita/on.py`
- **功能**: 返回 `OnAmritaWrapper`，其 `on_command()` 与 NoneBot 原生
  `on_command` 参数一致，但会叠加权限检查
- **权限模式**（`permission_mode`）: `user`（默认，仅检查用户）| `group`（仅检查群）
  | `union`（任一持有即可）

```python
from amrita.on import on_amrita

matcher = on_amrita(permission="lp.admin", permission_mode="user").on_command("ping")
```

---

## 📨 消息发送 API

### send_to_admin(msg: str, bot: Bot | None = None)

- **位置**: `amrita/utils/admin.py`
- **功能**: 发送消息到管理员群组

### send_forward_msg(bot: Bot, event: Event, name: str, uin: str, msgs: Iterable[MessageSegment])

- **位置**: `amrita/utils/send.py`
- **功能**: 发送合并转发消息

### send_forward_msg_to_admin(bot: Bot, name: str, uin: str, msgs: list[MessageSegment])

- **位置**: `amrita/utils/admin.py`
- **功能**: 发送合并转发消息到管理员

---

## 🗄️ 数据库元数据

### ConnectionStats / TableActivity / IndexUsage / LockInfo / QueryStats / PerformanceMetrics

- **位置**: `amrita/utils/dbmetadata.py`
- **功能**: 查询数据库连接统计、表活跃度、索引使用、锁信息、查询统计等运行时元数据
- **采集入口**: `AsyncDatabasePerformanceCollector` 与 `collect_database_performance()`

---

## 📊 系统健康监测

### calculate_system_usage() -> dict

- **位置**: `amrita/utils/system_health.py`
- **功能**: 返回 CPU、内存、磁盘、网络 IO 等系统指标

---

## ⏱️ 速率限制

### TokenBucket / BucketRepoitory / get_bucket()

- **位置**: `amrita/utils/rate.py`
- **功能**: 基于令牌桶算法的请求速率限制

::: warning 类名拼写

源码里的类名是 `BucketRepoitory`（缺少第二个 `s`），文档与代码保持一致。
引用时请注意，不要写成 `BucketRepository`。

:::

---

## 🗃️ 缓存

### LRUCache / TTLCache / LFUCache

- **位置**: `amrita/cache.py`
- **功能**: 多种缓存策略实现，LRUCache 基于 OrderedDict，WeakValueLRUCache 基于 amrita_sense

---

## 🔍 依赖检查

### check_dependency_package(name: str) -> bool

- **位置**: `amrita/utils/dependencies.py`
- **功能**: 检查指定 pip 包是否已安装

---

## 📝 日志事件

### LoggingEvent

- **位置**: `amrita/utils/logging.py`
- **功能**: 结构化日志事件模型，支持级别、描述、时间戳等字段

---

## 🧩 插件开发 API

参见 [权限 API](../features/permission/API.md) | [菜单 API](../features/other-modules/menu.md) | [WebUI API](../features/webui/customization.md)

### 配置管理器示例

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

- **可订阅事件与扩展点**：[扩展点与事件钩子](./extension-points)（含 `CHAT_ENTRY` /
  `CHAT_REQUEST` / `CHAT_USAGE_RECORDED` / `SESSION_COMPACT`、agent 步骤事件、
  工具注册、WebUI 扩展）
- **AmritaCore 运行时 API**：[Core 开发文档](https://core.amritabot.com/zh)

## 🔐 权限插件 API

此处请参考权限插件的 [API 文档](../features/permission/API.md)。

## 📦 菜单 API

此处请参考菜单插件的 [API 文档](../features/other-modules/menu.md)。

## 📊 WebUI API

- **后端扩展**（`register_router` / `register_page` / `register_ws_channel`）：
  [页面扩展开发](../features/webui/customization.md)
- **REST 与 WebSocket 接口清单**：[前端 API](../features/webui/frontend-api.md)

## 🧩 插件开发 API

此处请参考文献：[NoneBot 官方文档](https://nonebot.dev/docs/tutorial/create-plugin)

### 事件处理

此处请参考 [NoneBot 官方文档](https://nonebot.dev/docs/tutorial/handler)

这些 API 提供了 AmritaBot 的核心功能接口。有关更详细的使用方法，请参考其他文档部分。
