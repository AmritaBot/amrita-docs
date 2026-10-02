# 前端 API

Amrita 的 WebUI 后端是 FastAPI 应用（复用 NoneBot2 的 FastAPI driver），
前端是 React SPA。本文档介绍前端模块结构、认证接口、REST 接口与 WebSocket 协议。

::: tip 相关阅读

- [页面扩展开发](./customization) —— 插件如何注册页面与接口
- [UI 组件库](./components) —— 前端组件结构

:::

## 前端模块结构

```
frontend/src/
├── App.tsx              # 顶层布局与路由出口
├── frontend.tsx         # 入口：挂载 React、安装宿主全局
├── components/
│   ├── layout/          # 布局（侧边栏、顶栏）
│   ├── shared/          # 共享页面级组件
│   └── ui/              # 基础 UI 组件（ShadCN 风格）
├── hooks/
│   ├── use-auth.tsx     # 认证上下文
│   ├── use-theme.ts     # 主题（亮/暗）
│   └── use-ws.ts        # WebSocket 订阅
├── lib/
│   ├── api.ts           # 统一 API 客户端
│   ├── menu.ts          # 菜单/路由工具
│   ├── remote.tsx       # 运行期远程模块加载
│   ├── router.tsx       # 菜单 -> React Router 路由
│   ├── types.ts         # 后端响应类型定义
│   └── utils.ts
└── pages/               # 页面组件（bot / manage / system / user）
```

## 统一响应格式

除少数历史接口外，所有接口返回：

```json
{
  "code": 200,
  "message": "ok",
  "success": true,
  "data": {}
}
```

前端通过 `lib/api.ts` 的 `request()` 统一处理：

- 同源部署，携带 httpOnly Cookie（`credentials: "include"`）
- HTTP 401 统一触发登出回调（清空登录态并跳转登录页）
- 非 2xx 或 `success: false` 时抛 `ApiError`（含 `code` / `message` / `data`）

::: warning 部分 chat 接口是旧格式

`amrita/plugins/chat/webui/page.py` 下的接口返回
`{"success": bool, "message": str, "data": {...}}`（**没有** `code` 字段），
是重构前的写法，尚未统一。

:::

## 认证接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/auth/login` | 登录，成功后下发 httpOnly Cookie |
| `POST` | `/api/auth/logout` | 登出 |
| `GET` | `/api/auth/me` | 获取当前登录用户 |
| `GET` | `/api/auth/otk` | 获取一次性 Token（OTK） |

### 认证与安全机制

- **默认密码锁定**：`WEBUI_PASSWORD` 仍为出厂默认值时，除登录外的所有请求返回
  423（`requires_password_change`）
- **登录失败锁定**：连续失败 20 次后 UI 安全锁定，拒绝所有访问，重启解除
- **Cookie 续期**：剩余有效期不足 10 分钟时自动刷新
- **中间件行为**：`/api` 前缀未登录返回 401 JSON；页面路径未登录 302 到登录页

## REST 接口

### 元信息

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/meta/menu` | 菜单/路由注册表（含 `external_url` / `module_url`） |

### 仪表盘与系统

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/dashboard` | 仪表盘汇总数据 |
| `GET` | `/api/bot/status` | Bot 连接状态 |
| `GET` | `/api/bot/plugins` | 插件列表 |
| `GET` | `/api/events` | 事件追溯（event.json） |
| `GET` | `/api/dbmeta` | 数据库元信息 |

### Dotenv 配置

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/bot/config` | 配置文件列表 |
| `GET` | `/api/bot/config/{filename}` | 读取指定文件 |
| `POST` | `/api/bot/config` | 写入配置 |

> `NO_ENV_EDITOR=true`（默认）时读写接口均拒绝，防止敏感数据泄露。

### 权限与黑名单

| 方法 | 路径 |
| --- | --- |
| `GET` / `POST` | `/api/permissions/groups` |
| `GET` / `POST` | `/api/permissions/groups/{name}` |
| `POST` | `/api/permissions/groups/{name}/delete` |
| `GET` / `POST` | `/api/permissions/users/{user_id}` |
| `GET` / `POST` | `/api/permissions/group-scopes/{group_id}` |
| `GET` | `/api/blacklists` |
| `POST` | `/api/blacklists/{type}/{id}` |
| `POST` | `/api/blacklists/actions/batch` |

### 配置编辑（confedit）

| 方法 | 路径 |
| --- | --- |
| `GET` | `/api/confedit` |
| `GET` | `/api/confedit/{owner_name}` |
| `GET` | `/api/confedit/{owner_name}/schema` |
| `POST` | `/api/confedit/{owner_name}` |

### 聊天管理

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` / `POST` | `/api/chat/models` | 模型预设列表 / 新建 |
| `POST` | `/api/chat/models/{name}` | 更新预设 |
| `POST` | `/api/chat/models/{name}/delete` | 删除预设 |
| `GET` | `/api/chat/models/{name}/inspect` | 只读：解析后的上下文预算与压缩阈值 |
| `GET` | `/api/chat/sessions/{session_id}/usage` | 只读：会话用量与计费账目 |
| `GET` / `POST` | `/api/chat/prompts` | 提示词模板 |
| `POST` | `/api/chat/prompts/{prompt_type}` | 新建模板 |
| `POST` | `/api/chat/prompts/{prompt_type}/{name}` | 更新模板 |
| `POST` | `/api/chat/prompts/{prompt_type}/{name}/delete` | 删除模板 |
| `GET` / `POST` | `/api/chat/mcp/servers` | MCP 服务器 |
| `PUT` | `/api/chat/mcp/servers/{server_script}` | 更新 MCP 服务器 |
| `POST` | `/api/chat/mcp/servers/{server_script}/delete` | 删除 MCP 服务器 |
| `POST` | `/api/chat/mcp/servers/actions/reload` | 重载 MCP |
| `GET` / `POST` | `/api/chat/skills` | 技能 |
| `POST` | `/api/chat/skills/actions/reload` | 重载技能 |
| `GET` | `/api/chat/insights` | 用量统计 |

::: tip 计费只有只读接口

Amrita 本身**不做计费**。`/api/chat/models/{name}/inspect` 会透出预设的 `rate` 快照，
`/api/chat/sessions/{session_id}/usage` 会透出 `MemoryModel.billing` 账目，
但没有写入接口。需要在 Amrita 之上做计费的插件应订阅 `CHAT_USAGE_RECORDED` 事件，
见[扩展点与事件钩子](../../developer/extension-points#chat-生命周期事件)。

:::

## WebSocket

**端点**：`/amrita/ui/ws`（需登录，Cookie 认证；同时校验 Origin）

### 客户端 -> 服务端

```json
{ "action": "subscribe", "channels": ["system", "logs"] }
{ "action": "unsubscribe", "channels": ["logs"] }
{ "action": "ping" }
```

订阅 `logs` 时可控制回放条数：

```json
{ "action": "subscribe", "channels": ["logs"], "opts": { "logs": { "limit": 100 } } }
```

### 服务端 -> 客户端

```json
{ "channel": "system", "data": { "cpu_usage": 12.3 } }
{ "channel": "meta", "data": { "subscribed": ["system"] } }
```

`meta` 频道用于回执：订阅/退订后返回当前订阅列表，`ping` 返回 `{"pong": true}`。

### 内置频道

| 频道 | 内容 | 订阅时行为 |
| --- | --- | --- |
| `system` | CPU / 内存 / 磁盘 / 网络，按 `WsConfig.system_interval` 推送 | 立即推快照 |
| `bot` | Bot 连接状态（变化时广播） | 立即推快照 |
| `logs` | 实时日志（劫持 loguru sink，仅本次启动以来） | 按 tail 语义回放最新 N 条 |

::: tip 插件自定义频道

`register_ws_channel()` 声明频道，`broadcast_ws()` 推送。未声明的频道名会被忽略。
详见[页面扩展开发](./customization#推送实时数据)。

:::
