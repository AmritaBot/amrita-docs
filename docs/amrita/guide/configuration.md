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

| 变量名            | 类型 | 默认值     | 说明             |
| ----------------- | ---- | ---------- | ---------------- |
| `WEBUI_ENABLE`    | bool | `true`     | 是否启用 WebUI   |
| `WEBUI_USER_NAME` | str  | `admin`    | WebUI 登录用户名 |
| `WEBUI_PASSWORD`  | str  | `admin123` | WebUI 登录密码   |

### NoneBot / 适配器 / 插件提供

| 变量名                | 类型 | 默认值                           | 说明                        | 来源                      |
| --------------------- | ---- | -------------------------------- | --------------------------- | ------------------------- |
| `ENVIRONMENT`         | str  | `dev`                            | 运行环境                    | NoneBot                   |
| `DRIVER`              | str  | `~fastapi`                       | NoneBot 驱动器              | NoneBot                   |
| `PORT`                | int  | `8080`                           | 服务端口（也是 WebUI 端口） | NoneBot                   |
| `HOST`                | str  | `127.0.0.1`                      | 服务监听地址                | NoneBot                   |
| `LOCALSTORE_USE_CWD`  | bool | `true`                           | 使用当前目录存储数据        | nonebot-plugin-localstore |
| `DATABASE_URL`        | str  | `sqlite+aiosqlite:///db.sqlite3` | 数据库连接 URL              | nonebot-plugin-orm        |
| `ONEBOT_ACCESS_TOKEN` | str  | 无默认值                         | OneBot V11 访问令牌         | nonebot-adapter-onebot    |

> **提示**：除上述配置外，`config/` 目录下的 TOML 文件提供了更详细的插件级配置，可在 WebUI 中直接编辑。

## 其他配置

通常位于`config/`，在WebUI中有直接的配置选项，此处不多赘述。

## 下一步

配置完成后，可以开始创建你的第一个对话机器人：

- [创建第一个对话机器人](./first-bot.md)
