# 常见问题 (FAQ)

## 为什么不能启动？

::: tip

从`0.3.5`开始, `ADMIN_GROUP` 变量不再强制要求填写，未填写时推送消息将以Warning方式提示在控制台。

:::

需要检查以下配置：

- 确保已安装完整依赖：`amrita check-dependencies`
- 检查环境变量是否正确配置
- 确认端口未被占用，默认端口为 8080

## 如何进行生产环境部署？

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

## 如何修改默认的 WebUI 密码？

为了安全起见，您应该修改默认的 WebUI 密码。在环境配置文件中设置：

```dotenv
WEBUI_USER_NAME=your_username
WEBUI_PASSWORD=your_secure_password
```

## 为什么数据库连接失败？

请检查您的 DATABASE_URL 配置是否正确。默认使用 SQLite 数据库：

```dotenv
DATABASE_URL=aiosqlite:///db.sqlite3
```

对于生产环境，建议使用 MySQL 或 PostgreSQL 以获得更好的性能。

## 如何检查依赖是否完整？

您可以使用以下命令检查依赖：

```bash
amrita check-dependencies
```

如果发现依赖问题，请重新安装完整依赖：

```bash
uv add amrita[full] --reinstall
# 或 `pip install amrita[full] --force-reinstall`
```

如果无法解决，可以考虑重建整个虚拟环境

```bash
rm -rf .venv/ # 移除.venv
uv venv # 重建虚拟环境
uv sync # 同步依赖
```

如果仍然无法解决/疑难杂症可以考虑直接 [加入社区](./community/support.md) 来解决问题。

## 如何反馈 bug？

如果您在使用过程中发现了 bug，请通过以下方式反馈：

1. 在 GitHub 项目页面提交 issue
2. 在 QQ 群 / Discord 社区 中详细描述问题
3. 如果可能，请提供复现步骤和相关日志信息

**我们会尽快响应并解决您遇到的问题。**

---
如果以上 FAQ 未能解决您的问题，请[提交 Issue](https://github.com/AmritaBot/Amrita/issues) 或联系社区支持。