# ⚙️ 配置项参考

## 环境变量

AmritaBot 使用的环境变量分为两类：AmritaBot 自身定义的配置项，以及 NoneBot / 插件提供的配置项。

### AmritaBot 配置（`AMRITA_` 前缀或专用名）

| 变量名                        | 类型  | 默认值    | 说明                                          |
| ----------------------------- | ----- | --------- | --------------------------------------------- |
| `AMRITA_LOG_LEVEL`            | str   | `WARNING` | 日志等级（DEBUG/INFO/WARNING/ERROR/CRITICAL） |
| `LOG_DIR`                     | str   | `logs`    | 日志目录                                      |
| `BOT_NAME`                    | str   | `Amrita`  | 机器人名称                                    |
| `RATE_LIMIT`                  | int   | `5`       | 请求速率限制（间隔秒）                        |
| `ADMIN_GROUP`                 | int   | `-1`      | 日志推送群组（QQ群号，建议配置）              |
| `PUBLIC_GROUP`                | int   | `0`       | 公开群组（Bot 对外展示的群号）                |
| `DISABLE_BUILTIN_MENU`        | bool  | `false`   | 禁用内置菜单                                  |
| `MAX_EVENT_RECORD`            | int   | `1000`    | 最多的事件记录数                              |
| `AUTO_APPROVE_FRIEND_REQUEST` | bool  | `true`    | 是否自动通过好友申请                          |
| `AUTO_APPROVE_GROUP_REQUEST`  | bool  | `true`    | 是否自动通过拉群申请                          |
| `USAGE_CHECK_TIME`            | float | `400`     | usage 统计间隔（毫秒）                        |
| `NO_AMRITA_FLAG`              | bool  | `false`   | 禁用 `/amrita` 信息输出                       |

### WebUI 配置（`WEBUI_` 前缀）

| 变量名            | 类型 | 默认值     | 说明                                                                                           |
| ----------------- | ---- | ---------- | ---------------------------------------------------------------------------------------------- |
| `WEBUI_ENABLE`    | bool | `true`     | 是否启用 WebUI                                                                                 |
| `WEBUI_USER_NAME` | str  | `admin`    | WebUI 登录用户名                                                                               |
| `WEBUI_PASSWORD`  | str  | `admin123` | WebUI 登录密码。**保持默认密码（未设置）时 WebUI 锁定（423）**，必须设置非默认密码并重启后解锁 |

### NoneBot / 适配器 / 插件提供

| 变量名                    | 类型 | 默认值                                      | 说明                        | 来源                      |
| ------------------------- | ---- | ------------------------------------------- | --------------------------- | ------------------------- |
| `ENVIRONMENT`             | str  | `dev`                                       | 运行环境                    | NoneBot                   |
| `DRIVER`                  | str  | `~fastapi`                                  | NoneBot 驱动器              | NoneBot                   |
| `PORT`                    | int  | `8080`                                      | 服务端口（也是 WebUI 端口） | NoneBot                   |
| `HOST`                    | str  | `127.0.0.1`                                 | 服务监听地址                | NoneBot                   |
| `LOCALSTORE_USE_CWD`      | bool | `true`                                      | 使用当前目录存储数据        | nonebot-plugin-localstore |
| `SQLALCHEMY_DATABASE_URL` | str  | `sqlite+aiosqlite:///<数据目录>/db.sqlite3` | 数据库连接 URL              | nonebot-plugin-orm        |
| `ONEBOT_ACCESS_TOKEN`     | str  | 无默认值                                    | OneBot V11 访问令牌         | nonebot-adapter-onebot    |

> **提示**：除上述配置外，`config/` 目录下的 TOML 文件提供了更详细的插件级配置，可在 WebUI 中直接编辑。

## 聊天模块配置

其他配置通常位于 `config/`，WebUI 的「配置管理」可以直接编辑。下面列出 1.11 到 1.19 新增或语义变化较大、容易踩坑的项。

### `[function]`

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `chat_debounce_window` | `0` | 消息防抖窗口（秒），`<=0` 关闭。窗口内同一会话、同一用户的多条消息合并为一次请求 |
| `chat_debounce_max_messages` | `20` | 单批最大条数，`<=0` 不限制 |
| `chat_debounce_max_wait` | `5.0` | 单批最长存活时长（秒），`<=0` 不限制 |
| `message_type` | `legacy` | 上下文消息格式，可选 `legacy` / `xml` |
| `chat_pending_mode` | `queue` | 同会话并发调用时的行为：`single` / `queue` / `single_with_report` / `interactive` |
| `forward_threshold` | `200` | 最终响应超过该字符数时改走合并转发，`0` 禁用 |
| `forward_min_chunk` | `500` | 合并转发的分块最小字符数 |

### `[meta]`

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `enable` | `true` | 元信息总开关 |
| `reasoning` | `true` | 显示框架整段思考块 |
| `stream_reasoning` | `false` | 收集完整段思考后一次性发送；1.19 起不再是逐 token 流式 |
| `reasoning_summary` | `false` | 发送思考前先摘要，失败回退原文 |
| `reasoning_summary_max_chars` | `120` | 摘要字数上限（40–400） |
| `reasoning_summary_input_chars` | `6000` | 喂入摘要的原文上限，超出取尾部（500–50000） |
| `reasoning_summary_max_output` | `1024` | 摘要输出预算下限（64–8192） |
| `reasoning_summary_timeout_seconds` | `20` | 摘要调用超时（1–180 秒） |
| `tool_call` | `false` | 工具调用通知；关闭时 Calling / Called 生命周期文案完全不发 |
| `skill_trigger` | `true` | 技能触发通知 |

### `[skills]`

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `enable` | `true` | 技能系统总开关 |
| `mode` | `progressive` | `progressive` 注册 `skill_open` / `skill_read`；`invoke` 为每个技能注册一个工具 |
| `all_skills` | `true` | 全部启用；为 `true` 时 `selected` 不生效 |
| `selected` | `[]` | 仅在 `all_skills = false` 时生效，空列表表示一个都不启用 |
| `echo_skill_directory` | `true` | 技能返回内容是否带本机目录前缀 |
| `allow_script_execution` | `true` | 是否注入并执行 `scripts/` 下的技能脚本 |

> 旧配置没有 `all_skills` 时，会按原有的 `selected` 语义推断；旧配置没有 `mode` 时按 `invoke` 解释，升级后行为不变。

### `[context]`

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `fake_ip_ranges` | `[]` | 放行的 fake-ip 保留段（CIDR）。Clash 等代理开启 fake-ip 后，需要登记 `198.18.0.0/15` 一类网段，否则图床域名会被 SSRF 护栏拒绝 |
| `read_context_images` | `false` | `read_context` 是否还原历史图片；关闭时只返回文本 |
| `max_images_per_request` | `8` | 单次请求最多发送给模型的图片数，超出降级为文字提示 |
| `max_allowed_size` | `2048` | 归一化后允许存入上下文的单张图片体积（KB） |

### 升级后

升级 AmritaBot 后先同步依赖，再跑数据库迁移：

```bash
uv sync
uv run ambot orm upgrade
```

`nonebot-plugin-amrita>=0.5.1` 包含 `created_at` 的 DOUBLE 迁移，不跑迁移时 MySQL 上的归档标签与重命名仍可能失效。

## 下一步

配置完成后，可以开始创建你的第一个对话机器人：

- [创建第一个对话机器人](./first-bot.md)
