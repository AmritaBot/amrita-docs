# Web界面

AmritaBot WebUI是Amrita原生的轻量级UI，用于信息显示与管理Bot本体，提供直观的操作体验。

## 访问

WebUI 与 Bot 共用同一服务端口，端口由环境变量 `PORT` 控制（NoneBot 默认 `8080`，Amrita 示例 `.env` 使用 `11451`）。例如使用默认端口时，WebUI 地址为：`http://localhost:8080`

## 账号与密码

WebUI 使用独立的账号密码登录，通过环境变量配置：

```dotenv
WEBUI_USER_NAME=admin        # 登录用户名（默认 admin）
WEBUI_PASSWORD=your_password # 登录密码
```

> **重要**：默认密码为 `admin123`。**只要密码仍为默认值（即未在 `.env` 中设置 `WEBUI_PASSWORD`），WebUI 即处于锁定状态**：所有页面与 API 请求都会被拒绝并返回 423（`requires_password_change`），提示您先在 `.env` 中设置 `WEBUI_PASSWORD` 后重启 Amrita。**设置一个非默认密码并重启后，WebUI 才会解除锁定。**

## 安全机制

WebUI 内置了以下安全防护：

- **默认密码锁定**：未修改默认密码（`admin123`）时 WebUI 整体锁定，杜绝开箱即用的弱口令暴露
- **登录失败锁定**：连续登录失败 **20 次**后触发安全锁定，拒绝所有登录请求（重启 Amrita 后解除）
- **登录限速**：同一 IP 每秒最多尝试 10 次登录
- **会话过期**：登录 Token 有效期 30 分钟，过期需重新登录；快过期时已登录会话会自动续期
- **密码加密存储**：密码以 bcrypt 哈希保存，不存明文
- **HttpOnly Cookie**：认证信息存放于 HttpOnly Cookie（`SameSite=Lax`），前端脚本无法读取

尽管如此，仍请**不要**直接把 AmritaBot WebUI 暴露给公网，这可能会导致您的 Bot 被攻击。

## 功能页面

- **仪表盘**：系统概览
- **机器人管理**：插件管理、Dotenv 编辑（默认禁用，见 `no_env_editor`）
- **用户管理**：权限管理（权限组与用户/群组权限）、黑名单管理
- **系统信息**：运行状态查看

## 快速导航

> 🚧 WebUI 已重构为前端 SPA（React + Vite + Tailwind），以下开发文档为 TODO 占位页，待按新架构重写。

- [页面开发](./customization.md)（TODO）
- [前端API](./frontend-api.md)（TODO）
- [UI组件库](./components.md)（TODO）
