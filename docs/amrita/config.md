# ⚙️ 配置项参考

## 环境变量

### `.env`参考

| 变量名             | 默认值                  | 说明                     |
| ------------------ | ----------------------- | ------------------------ |
| ENVIRONMENT        | dev                     | 运行环境                 |
| DRIVER             | ~fastapi                | NoneBot 驱动             |
| PORT               | 8080                    | 服务端口                 |
| HOST               | 127.0.0.1               | 服务主机                 |
| LOCALSTORE_USE_CWD | true                    | 是否使用当前目录存储数据 |
| DATABASE_URL       | aiosqlite:///db.sqlite3 | 数据库连接 URL           |
| LOG_DIR            | logs                    | 日志目录                 |
| BOT_NAME           | Amrita                  | 机器人名称               |
| RATE_LIMIT         | 5                       | 请求速率限制             |
| WEBUI_ENABLE       | true                    | 是否启用 WebUI           |
| WEBUI_USER_NAME    | admin                   | WebUI 用户名             |
| WEBUI_PASSWORD     | admin123                | WebUI 密码               |
| ADMIN_GROUP        | 无默认值                | 管理员群组         |

### Amrita 配置

| 配置项                   | 类型      | 默认值    | 说明           |
| ------------------------ | --------- | --------- | -------------- |
| log_dir                  | str       | "logs"    | 日志目录       |
| admin_group              | int       | 无默认值  | 管理员群组     |
| disabled_builtin_plugins | List[str] | []        | 禁用的内置插件 |
| amrita_log_level         | str       | "WARNING" | 日志等级       |
| public_group             | int       | 0         | 公开群组       |
| bot_name                 | str       | "Amrita"  | 机器人名称     |
| rate_limit               | int       | 5         | 请求速率限制   |
| disable_builtin_menu     | bool      | False     | 禁用内置菜单   |

## 其他配置

通常位于`config/`，文档其他地方有过介绍，此处不过多赘述。
