# Web界面

AmritaBot WebUI是Amrita原生的轻量级UI，用于信息显示与管理Bot本体，提供直观的操作体验。

## 访问

WebUI 与 Bot 共用同一服务端口，端口由环境变量 `PORT` 控制（NoneBot 默认 `8080`，Amrita 示例 `.env` 使用 `11451`）。例如使用默认端口时，WebUI 地址为：`http://localhost:8080`

## 安全警告

AmritaBot WebUI并没有过多的安全防护，请**不要**直接把AmritaBot WebUI暴露给公网，这可能会导致您的Bot被攻击。同时，也请您设置一个安全的账号与密码，来避免安全问题。

## 快速导航

> 🚧 WebUI 已重构为前端 SPA（React + Vite + Tailwind），以下开发文档为 TODO 占位页，待按新架构重写。

- [页面开发](./customization.md)（TODO）
- [前端API](./frontend-api.md)（TODO）
- [UI组件库](./components.md)（TODO）
