# AmritaBot 框架配置建议

AmritaBot 的聊天功能配置文件位于 `config/chat/config.toml`，基于 Pydantic 模型分层组织。本文档介绍关键配置项的用途与优化建议。

## 配置结构概览

```toml
[core]                  # AmritaCore 原生配置
[core.llm]              #   LLM 参数（temperature/max_tokens 等）
[core.cookie]           #   Cookie 反注入检测
[core.function_config]  #   Agent 工具调用 / MCP

[llm]                   # Chat 插件 LLM 配置
[llm.tools]             #   内容审查 / 工具调用策略
[session]               # 会话生命周期
[autoreply]             # 概率性自动回复
[function]              # 聊天行为开关
[usage_limit]           # 用量限制
```

> 在 WebUI 中，以上配置块均以可折叠表单形式呈现，无需手动编辑 TOML。

## 1. AmritaCore 层配置

### 1.1 LLM 参数

```toml
[core.llm]
temperature = 0.7       # 生成温度 (0-2，越高越随机)
max_tokens = 4096       # 单次最大生成 token
top_p = 1.0             # 核采样概率

[core.llm.memory]
memory_length_limit = 20     # 原始记忆轮数上限
enable_memory_abstract = false  # 是否启用上下文摘要
memory_abstract_proportion = 0.5  # 摘要截取比例
```

优化建议：

- **对话型应用**：temperature 0.7–1.0；**工具调用/严谨场景**：0–0.3
- 长对话建议启用 `enable_memory_abstract`，比例 0.3–0.6

### 1.2 Agent 工具调用

```toml
[core.function_config]
use_minimal_context = false      # 是否使用最小上下文（仅 system + 最后一条消息）
agent_tool_call_limit = 10       # 单次对话最大工具调用次数
agent_middle_message = true      # 允许 Agent 向用户发送中间消息
agent_mcp_client_enable = false  # 启用 MCP 客户端
agent_mcp_server_scripts = []    # MCP 服务器地址列表
```

### 1.3 Cookie 反注入

```toml
[core.cookie]
enable_cookie = true
cookie = ""  # 留空自动生成随机字符串
```

在 Prompt 中使用 `{cookie}` 占位符即可启用检测。

---

## 2. Chat 插件独有配置

### 2.1 聊天行为

```toml
[function]
enable_group_chat = true
enable_private_chat = true
nature_chat_style = true         # 自动分句（更拟人）
nature_chat_cut_pattern = '([。！？!?;；\n]+)[""\'\'"\s]*'
synthesize_forward_message = true  # 解析合并转发
poke_reply = true                   # 响应戳一戳
chat_pending_mode = "queue"         # 并发等待策略：single / queue / single_with_report
message_type = "legacy"             # legacy / xml
```

### 2.2 流式响应

```toml
[llm]
stream = true  # 强烈建议开启，改善长文本体验
```

### 2.3 内容审查

```toml
[llm.tools]
enable_report = true
report_invoke_level = "medium"       # low / medium / high
report_exclude_system_prompt = false
report_exclude_context = false
report_then_block = true             # 触发后熔断会话
```

### 2.4 Agent 策略

```toml
[llm]
agent_strategy = "react"  # react / hybrid-react / no-action
```

### 2.5 会话管理

```toml
[session]
session_control = true
session_control_time = 60         # 会话超时（分钟）
session_control_history = 10      # 最大历史记录条数
session_allow_continue = true     # 超时后是否允许继续
```

### 2.6 用量限制

```toml
[usage_limit]
enable_usage_limit = false
group_daily_limit = 100
user_daily_limit = 100
group_daily_token_limit = 200000
user_daily_token_limit = 100000
total_daily_limit = 1500
total_daily_token_limit = 1000000
global_insights_expire_days = 7
```

`lp.admin` 权限用户不受限制。

### 2.7 自动回复

```toml
[autoreply]
enable = false
global_enable = false
probability = 0.01              # 1%
keywords = ["at"]               # 触发关键词
keywords_mode = "starts_with"   # starts_with / contains
```

---

## 3. 性能优化要点

| 场景           | 建议                                                                  |
| -------------- | --------------------------------------------------------------------- |
| 高并发群聊     | `chat_pending_mode = "queue"`，`session_control_time = 30`            |
| 长对话记忆     | `enable_memory_abstract = true`，`memory_abstract_proportion = 0.4`   |
| Token 成本控制 | 启用 `usage_limit`，合理设置 `total_daily_token_limit`                |
| 响应速度       | 开启 `stream = true`，`use_minimal_context = false`（保留完整上下文） |
| 安全敏感场景   | `report_invoke_level = "high"`，`cookie.enable_cookie = true`         |

优化建议：

- **SSE 传输**：适合远程服务器，配置简单
- **Stdio 传输**：适合本地进程，性能最佳
- **多服务器**：可配置多个 MCP 服务器扩展功能
- **错误处理**：确保 MCP 服务器稳定运行，避免影响主流程

## 6. 预设与模型配置

### 6.1 默认预设配置

配置基础模型参数：

```toml
[default_preset]
model = ""                # 模型名称（如 gpt-4）
name = "default"          # 预设名称
base_url = ""             # API基础URL（为空使用默认）
api_key = ""              # API密钥
protocol = "__main__"     # 协议类型
thought_chain_model = false  # 思维链模式
multimodal = false        # 多模态支持
```

### 6.2 预设扩展

支持多预设切换和备份：

```toml
[preset_extension]
backup_preset_list = []          # 备份预设列表
multi_modal_preset_list = []     # 多模态预设列表

[extended]
group_prompt_character = "default"     # 群聊提示词角色
private_prompt_character = "default"   # 私聊提示词角色
```

## 7. 高级功能配置

### 7.1 消息处理增强

```toml
[function]
nature_chat_cut_pattern = "([。！？!?;；\\n]+)[\"\"\\'\\'\"\\s]*"  # 自然聊天切割模式

[extended]
say_after_self_msg_be_deleted = false  # 消息被删除后发言
group_added_msg = "你好，我是Suggar，欢迎使用SuggarAI聊天机器人..."  # 入群欢迎语
send_msg_after_be_invited = false      # 被邀请后发送消息
```

### 7.2 敏感内容处理

```toml
[llm_config]
block_msg = [              # 拦截消息列表
    "嗨～你好，我们换个话题吧～"
]

[extended]
after_deleted_say_what = [  # 消息被删除后的回复选项
    "抱歉啦，不小心说错啦～",
    "嘿，发生什么事啦？我",
    # ... 更多选项
]
```

## 8. 数据库与状态管理

### 8.1 Cookie（提示词电子水印） 管理

```toml
[cookies]
cookie = ""              # Cookie值
enable_cookie = false    # 是否启用Cookie
```

### 8.2 数据持久化

通过数据库配置管理状态持久化（配置文件示例）：

```dotenv
# .env 文件示例
DATABASE_URL=sqlite+aiosqlite:///./data/db.sqlite3
# 或使用其他数据库
# DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/amrita
# DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/amrita
```

## 9. 最佳实践

### 9.1 配置管理策略

1. **环境分离**：创建不同环境的配置文件
   - `.env.dev` - 开发环境
   - `.env.prod` - 生产环境

2. **版本控制**：将基础配置纳入版本控制，敏感信息使用环境变量

3. **配置验证**：启动时验证关键配置项

### 9.2 性能调优步骤

1. **基准测试**：记录默认配置下的性能指标
2. **渐进调整**：每次只调整 1-2 个参数，观察效果
3. **监控指标**：关注以下关键指标：
   - 平均响应时间
   - Token 使用率
   - 会话保持时间
   - 错误率

4. **生产就绪检查清单**：
   - [ ] 启用量限制防止滥用
   - [ ] 配置合理的超时和重试
   - [ ] 设置会话清理策略
   - [ ] 启用自动回复的概率控制
   - [ ] 配置 MCP 服务器扩展功能
   - [ ] 设置敏感词拦截

### 9.3 故障排查指南

常见问题及解决方法：

| 问题             | 可能原因                    | 解决方案            |
| ---------------- | --------------------------- | ------------------- |
| 响应超时         | `llm_timeout` 过小          | 增加至 60-120 秒    |
| 上下文丢失       | `session_control_time` 过短 | 增加至 60+ 分钟     |
| Token 超限       | `session_max_tokens` 不足   | 根据模型能力调整    |
| 工具调用失败     | MCP 服务器未启动            | 检查 MCP 服务器状态 |
| 自动回复过于频繁 | `probability` 过高          | 降低至 0.01-0.05    |

通过合理配置和持续优化这些参数，可以显著提升 AmritaBot 框架的性能、稳定性和用户体验。建议根据实际使用场景，采用小步快跑的方式逐步调优。
