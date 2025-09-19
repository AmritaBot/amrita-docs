# 社区支持

欢迎来到 Amrita 社区！我们为您提供多种方式获取帮助和支持。

## 加入 QQ 群

Amrita 是 [LiteSuggarDEV](https://docs.suggar.top) 的附属团队，如果您在使用 Amrita 的过程中遇到问题，或者想要与其他用户交流经验，欢迎加入我们的 QQ 群：

- QQ 群：1006893368
- QQ 群链接：[点击链接加入群聊【「雾见茶屋」：](https://qm.qq.com/q/IvG8Dm7W4m)

在 QQ 群中，您可以：

- 与其他用户交流使用经验
- 获取最新的产品资讯
- 提出使用过程中遇到的问题
- 参与产品功能讨论

## 常见问题 (FAQ)

### 为什么不能启动？

最常见的原因是未正确配置 ADMIN_GROUP 参数。在生产环境中，您必须在环境变量中设置 ADMIN_GROUP，错误信息将会向这个群推送。

请检查您的配置文件（如`.env.prod`）中是否已正确填写 ADMIN_GROUP 参数：

```dotenv
ADMIN_GROUP=123456789  # 请替换为实际的管理员群组ID
```

此外，还需要检查以下配置：

- 确保已安装完整依赖：`amrita check-dependencies`
- 检查环境变量是否正确配置
- 确认端口未被占用，默认端口为 8080

### 如何进行生产环境部署？

1. 确保已安装 Amrita CLI 工具
2. 创建或初始化项目
3. 配置生产环境变量，特别是：
   - `ENVIRONMENT=prod`
   - `HOST=0.0.0.0`
   - `ADMIN_GROUP=您的管理员群组ID`
4. 运行命令启动服务：
   ```bash
   amrita run
   ```

### 如何修改默认的 WebUI 密码？

为了安全起见，您应该修改默认的 WebUI 密码。在环境配置文件中设置：

```dotenv
WEBUI_USER_NAME=your_username
WEBUI_PASSWORD=your_secure_password
```

### 为什么数据库连接失败？

请检查您的 DATABASE_URL 配置是否正确。默认使用 SQLite 数据库：

```dotenv
DATABASE_URL=aiosqlite:///db.sqlite3
```

对于生产环境，建议使用 MySQL 或 PostgreSQL 以获得更好的性能。

### 如何检查依赖是否完整？

您可以使用以下命令检查依赖：

```bash
amrita check-dependencies
```

如果发现依赖问题，请重新安装完整依赖：

```bash
pip install amrita[full]
```

### 如何反馈 bug？

如果您在使用过程中发现了 bug，请通过以下方式反馈：

1. 在 GitHub 项目页面提交 issue
2. 在 QQ 群中详细描述问题
3. 如果可能，请提供复现步骤和相关日志信息

我们会尽快响应并解决您遇到的问题。

## 贡献代码

如果您有兴趣为 Amrita 贡献代码，请：

1. Fork 项目仓库
2. 创建您的特性分支
3. 提交您的更改
4. 发起 Pull Request

感谢您对 Amrita 项目的支持！
