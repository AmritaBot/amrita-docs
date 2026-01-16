# ⚙️ 配置项参考

## 环境变量

### `.env` 配置参考

| 变量名                   | 类型      | 默认值                         | 说明                      |
| ------------------------ | --------- | ------------------------------ | ------------------------- |
| ENVIRONMENT              | str       | dev                            | 运行环境                  |
| DRIVER                   | str       | ~fastapi                       | NoneBot 驱动器            |
| PORT                     | int       | 8080                           | 服务端口(也是 WebUI 端口) |
| HOST                     | str       | 127.0.0.1                      | 服务主机                  |
| LOCALSTORE_USE_CWD       | bool      | true                           | 是否使用当前目录存储数据  |
| DATABASE_URL             | str       | sqlite+aiosqlite:///db.sqlite3 | 数据库连接 URL            |
| LOG_DIR                  | str       | logs                           | 日志目录                  |
| BOT_NAME                 | str       | Amrita                         | 机器人名称                |
| RATE_LIMIT               | int       | 5                              | 请求速率限制              |
| WEBUI_ENABLE             | bool      | true                           | 是否启用 WebUI            |
| WEBUI_USER_NAME          | str       | admin                          | WebUI 用户名              |
| WEBUI_PASSWORD           | str       | admin123                       | WebUI 密码                |
| **ADMIN_GROUP**          | int       | 无默认值                       | 日志推送群组（建议配置）  |
| DISABLE_BUILTIN_MENU     | bool      | false                          | 禁用内置菜单              |
| PUBLIC_GROUP             | int       | 无默认值                       | 公开群组                  |
| DISABLED_BUILTIN_PLUGINS | List[str] | []                             | 禁用内置插件              |
| AMRITA_LOG_LEVEL         | str       | WARNING                        | 日志等级                  |
| MAX_EVENT_RECORD         | int       | 100                            | 最多的事件记录            |
| **ONEBOT_ACCESS_TOKEN**  | str       | 无默认值                       | OneBot V11 访问令牌       |

### 直接配置的环境变量

| 变量名                    | 类型 | 默认值           | 说明                  |
| ------------------------- | ---- | ---------------- | --------------------- |
| AMRITA_IGONRE_VENV        | bool | -                | 使得 CLI 忽略虚拟环境 |
| AMRITA_IGNORE_AGENT_TOOLS | -    | 忽略无效工具警告 |

## 其他配置

通常位于`config/`，文档其他地方有过介绍，此处不过多赘述。
