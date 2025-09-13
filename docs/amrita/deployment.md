# 部署指南

本文档将指导您如何部署 Amrita 机器人到生产环境。

## 🎯 部署前准备

在部署之前，请确保您已完成以下准备工作：

1. 已安装 Amrita CLI 工具
2. 已创建 Amrita 项目
3. 已配置好所需的环境变量
4. 已选择合适的部署平台

## ☁️ 部署选项

### 本地部署

对于本地部署，只需在项目目录中运行：

```bash
amrita run
```

这将在本地启动机器人服务，默认监听 `127.0.0.1:8080`。

### 服务器部署

在服务器上部署时，您需要修改环境变量以适应生产环境：

1. 编辑 `.env.prod` 文件：

   ```dotenv
   ENVIRONMENT=prod
   HOST=0.0.0.0
   PORT=8080
   ADMIN_GROUP=123456789 # 必填，错误信息将会向这个群推送。
   ```

2. 运行生产环境：
   ```bash
   amrita run
   ```

### 一键部署脚本/容器化部署

请参考[仓库](https://github.com/AmritaBot/AmritaScript)

## ⚙️ 环境配置

### 环境变量说明

Amrita 使用以下环境变量进行配置：

| 变量名             | 默认值                  | 说明                       |
| ------------------ | ----------------------- | -------------------------- |
| ENVIRONMENT        | dev                     | 运行环境 (dev/prod)        |
| DRIVER             | ~fastapi                | NoneBot 驱动器（无需更改） |
| PORT               | 8080                    | NoneBot 端口               |
| HOST               | 127.0.0.1               | NoneBot 监听主机           |
| LOCALSTORE_USE_CWD | true                    | 是否使用当前目录存储数据   |
| DATABASE_URL       | aiosqlite:///db.sqlite3 | 数据库连接 URL             |
| LOG_DIR            | logs                    | 日志目录                   |
| BOT_NAME           | Amrita                  | 机器人名称                 |
| RATE_LIMIT         | 5                       | 请求速率限制               |
| ADMIN_GROUP        | 123456789               | 管理员群组                 |
| WEBUI_ENABLE       | true                    | 是否启用 WebUI             |
| WEBUI_USER_NAME    | admin                   | WebUI 用户名               |
| WEBUI_PASSWORD     | admin123                | WebUI 密码                 |

### 生产环境配置示例

在 `.env.prod` 中配置生产环境：

```dotenv
ENVIRONMENT=prod
PORT=8080
HOST=0.0.0.0
LOCALSTORE_USE_CWD=true
DATABASE_URL=sqlite+aiosqlite:///./data/db.sqlite3
LOG_DIR=./logs
BOT_NAME=MyBot
RATE_LIMIT=10
WEBUI_ENABLE=true
WEBUI_USER_NAME=admin
WEBUI_PASSWORD=your_secure_password
```

## 🔒 安全配置

### 密码安全

- 修改默认的 WebUI 密码：

  ```dotenv
  WEBUI_PASSWORD=your_strong_password
  ```

- 设置管理员群组：
  ```dotenv
  ADMIN_GROUP=123456789
  ```

### 网络安全

1. 限制访问来源
2. 使用 HTTPS 代理到 Amrita WebUI
3. 定期更新依赖

## 🧪 故障排除

### 常见问题

1. **依赖问题**：

   ```bash
   amrita check-dependencies
   ```

2. **端口占用**：
   修改 `.env` 文件中的 PORT 变量

3. **数据库连接失败**：
   检查 DATABASE_URL 配置是否正确

4. **权限问题**：
   确保机器人有足够的权限访问所需资源

### 日志分析

查看错误日志以诊断问题

## 📈 性能优化

### 资源限制

在生产环境中，建议设置适当的资源限制：

```bash
# 限制内存使用
ulimit -m 1048576  # 1GB
```

### 数据库优化

对于 SQLite 数据库，性能存在较大瓶颈，我们建议您使用 MySQL 或 PostgreSQL 来提高性能。

现在您已经了解了如何部署 Amrita 机器人。接下来可以查看 [功能用法](./advanced-usage) 了解更多高级用法。
