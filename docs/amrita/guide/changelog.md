# 版本变更

这里汇总 1.11 到 1.19.1 的用户可见变化。完整的提交列表与发行说明见 GitHub Releases。

## 1.19.1

修复版，建议所有 1.19.0 用户升级。

- WebUI：Tailwind 补扫 `frontend/packages/ui` 子模块，恢复卡片、边框、圆角与 Select 样式；日志页窄屏不再按字符折行，追踪开关不再竖排。
- 工具调用：Calling / Called 生命周期文案不再冒充 💬 正文，默认 `meta.tool_call = false` 下完全静默；模型正文先缓冲，再按「中间消息 / 最终回答」发送。
- 会话：`use` / `del` / `rename` 移除列表序号寻址，统一按 ID；ID 只在当前用户归档内解析，删除补 `user_id` 谓词。
- `/set_enable false` 后 poke 不再绕过禁用状态。
- 纯 xml/json 卡片消息不再进入聊天链路，也不落静默上下文。
- 依赖 `nonebot-plugin-amrita >= 0.5.1`，包含 `created_at` 的 DOUBLE 迁移。

## 1.19.0

- **前端构建迁到 Vite 6 + Rollup**，删掉旧 Bun 打包对 `index.html` 的事后改写补丁；`dev` 带 `/api` 与 `/amrita` 代理。
- **思考块整段发送**：`meta.stream_reasoning` 语义从逐 token 改为「收集完整段后一次性发送」；新增 `meta.reasoning_summary` 与四个摘要参数；过长思考走合并转发。
- **会话按 ID 操作**：`/session use` / `del` 支持 `#ID`，为 1.19.1 完全移除序号寻址做准备；`/session rename` 不再受运行中会话锁拦截。
- **技能配置显式 `all_skills`**：空 `selected` 不再兼作「全部启用」；WebUI 的「全部启用」与单勾选联动，服务端读-改-写加锁。
- **模型协议下拉**：新增 `GET /api/chat/models/adapters`，预设编辑时从已注册适配器中选择协议。
- 插件构建套件改由 npm 上的 `@amrita-constant/webui-plugin-kit` 提供，仓库内 `plugin-kit/` 删除。

## 1.18.0

- **插件 UI 产物按名字挂载**：`register_page` / `on_page` 新增 `module_dir`；`mount_plugin_assets` 把插件包内产物挂到 `/plugin-assets/<name>/`，URL 自动附加纳秒 mtime 版本参数。
- 产物缺失时后端不下发 `module_url`，前端显示「插件产物不可用」与原因，而不是 404。
- **宿主运行时契约 3**：新增 `ReactQuery`、`LucideReact`、`UI`、`notifyUnauthorized` 与 `HOST_CONTRACT_VERSION`。
- **UI 组件包**：基础组件与通用件迁到子模块 `frontend/packages/ui`，以 `@amrita-constant/ambot-ui` 供宿主与插件共用。
- 认证中间件放行范围收敛到 `/static` 与 `/plugin-assets` 命名空间。
- 菜单接口补齐 `module_dir` / `module_available` / `module_reason`。

## 1.17.0

- 修复 Clash fake-ip 模式下图片域名被 SSRF 护栏误拒；新增 `context.fake_ip_ranges` 放行保留段。
- 修复日用量重复插入。
- 会话 ID 载荷段不再强制为数字，允许字符串会话 ID。
- `amrita-sense` 升至 1.1.3。

## 1.16.0

- 静默上下文记录支持图片；新增 `base_url` 安全校验。
- MCP 改为逐个加载与故障隔离：单服务 30 秒超时，失败工具清理，重载返回部分结果；服务以运行时 ID 寻址，增删改支持失败回滚。
- WebUI MCP 列表改由运行时状态生成，显示 ID、状态、工具数与失败原因。

## 1.15.0

- **渐进式技能工具**：`skill_open` / `skill_read` 取代「每个技能一个工具」，按需加载正文与支持文件；要求 `faskill >= 0.4.0`。
- 适配 AmritaCore 1.4：多模态工具结果入库前折叠为占位符；新增 `agent.tool_return` 钩子接收工具图片；工具媒体归属发起会话。
- 归档标签生成对解析后的预算应用输出下限。

## 1.14.0

- 归档会话由后台任务生成短标签，`/session list` 不再大面积显示「（无描述）」；失败或 30 秒超时留空。
- 新增 `/session rename <ID> <新名称>`，手动改名覆盖自动标签。
- 1.14.1 修复归档、清空、删除时外层事务未提交的问题。

## 1.13.0

- 技能新增 `echo_skill_directory` 与 `allow_script_execution`：可关闭本机目录回显、禁止注入脚本工具。
- 加固出站 TLS 校验，规范图片摄取流程。
- 修复 WebUI 配置保存把字符串字段当字面量解析的问题。
- 1.13.1 升级 AmritaCore 1.3.0。

## 1.12.0

- **消息防抖**：`function.chat_debounce_window` 等三项配置，窗口内同一会话同一用户的多条消息合并为一次请求。
- **提示词模板切换提权**：`/prompt template ... <名称>` 改为要求超级管理员，修复私聊与群管理员可改全局模板的越权。
- 1.12.1 修复目录插件状态与工具预算提示；1.12.2 修复配置字符串解析。

## 1.11.0

- **WebUI 插件管理**：新增已安装插件六态视图、插件商店、安装/卸载/启用/禁用与异步任务进度。
- 商店聚合 NoneBot registry 与 Amrita 官方清单；官方清单只存身份，版本与依赖运行时从 PyPI 解析。
- 安装完成后通常需要重启 Bot 才会加载新插件。
