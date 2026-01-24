# Amrita 框架配置建议

Amrita 框架提供了丰富的配置选项来优化性能和资源使用。本文档将详细介绍这些配置项及其调整方法，帮助您根据实际需求优化系统性能。

## 1. 核心功能配置

### 1.1 基础启用配置

确保框架核心功能正确启用：

```toml
enable = true                      # 总开关，必须为true才能正常工作
parse_segments = true              # 是否解析消息分段
matcher_function = true            # 是否启用函数匹配
preset = "DS-V3"                   # 预设配置名称
```

### 1.2 聊天功能配置

配置聊天相关的核心行为：

```toml
[function]
enable_group_chat = true           # 启用群聊
enable_private_chat = true         # 启用私聊
allow_custom_prompt = true         # 允许自定义提示词
use_user_nickname = false          # 是否使用用户昵称
chat_object_keep_count = 10        # 聊天对象保持数量
chat_pending_mode = "queue"        # 聊天等待模式：queue/parallel
nature_chat_style = true           # 启用自然聊天风格
synthesize_forward_message = true  # 合成转发消息
poke_reply = true                  # 戳一戳回复
```

## 2. LLM 调用性能优化

### 2.1 超时与重试设置

LLM 调用超时设置是影响用户体验和系统稳定性的关键配置：

```toml
[llm_config]
llm_timeout = 60      # LLM请求超时时间（秒）
auto_retry = true     # 是否启用自动重试
max_retries = 3       # 最大重试次数
```

优化建议：

- **快速响应场景**：设置为 30-45 秒
- **复杂任务场景**：设置为 90-120 秒
- **生产环境**：建议启用自动重试，重试次数 2-3 次
- 监控 `amrita.log` 中的请求耗时，根据实际数据调整

### 2.2 流式响应

流式响应可以改善长文本生成体验并防止部分模型提供商的请求失败：

```toml
[llm_config]
stream = true  # 是否启用流式响应
```

优化建议：

- **对话型应用**：强烈建议启用（`stream = true`）
- **需要完整处理后响应的场景**：可禁用流式响应
- 启用流式响应时，确保前端/客户端支持流式展示

### 2.3 记忆抽象处理

通过记忆抽象减少上下文长度，优化长期对话：

```toml
[llm_config]
enable_memory_abstract = true      # 启用记忆抽象
memory_abstract_proportion = 0.5   # 记忆抽象比例
memory_lenth_limit = 5             # 原始记忆长度限制
```

优化建议：

- **长期对话场景**：启用记忆抽象，比例设为 0.3-0.6
- **短对话场景**：可禁用记忆抽象，直接使用完整上下文
- 监控会话 token 使用量，调整抽象比例

## 3. Token 管理与限制

### 3.1 Token 数量限制

控制单次请求和会话的 Token 使用量：

```toml
[llm_config]
max_tokens = 100               # 单次请求最大生成token数
enable_tokens_limit = true     # 是否启用token限制
tokens_count_mode = "bpe"      # token计算模式: "bpe"/"word"/"char"

[session]
session_max_tokens = 5000      # 会话最大token数（上下文+生成）
```

优化建议：

- **根据模型调整**：GPT-4 可设 4000-8000，较小模型设 2000-4000
- **计费控制**：`tokens_count_mode` 建议使用 "bpe"（最准确）
- **资源平衡**：`session_max_tokens` 过高会导致响应变慢，过低影响对话连贯性

### 3.2 用量限制

通过每日使用限制公平分配资源并控制成本：

```toml
[usage_limit]
enable_usage_limit = false           # 是否启用用量限制
group_daily_limit = 100              # 群每日次数限制(-1为不限制)
user_daily_limit = 100               # 用户每日次数限制(-1为不限制)
group_daily_token_limit = 200000     # 群每日token限制(-1为不限制)
user_daily_token_limit = 100000      # 用户每日token限制(-1为不限制)
total_daily_limit = 1500             # 总使用次数限制(-1为不限制)
total_daily_token_limit = 1000000    # 总使用token限制(-1为不限制)
global_insights_expire_days = 7      # 全局洞察数据过期天数
```

优化建议：

- **小型部署**：启用限制，防止资源滥用
- **公开服务**：建议设置合理的用户/群组限制
- **成本控制**：根据 API 成本设置 token 限制
- **管理员豁免**：可通过代码扩展为管理员用户免除限制

## 4. 会话管理优化

### 4.1 会话生命周期控制

管理会话的创建、维护和清理：

```toml
[session]
session_control = true           # 启用会话控制
session_control_time = 60        # 会话生命周期（分钟）
session_control_history = 10     # 会话历史记录数
session_max_tokens = 5000        # 会话最大token数
```

优化建议：

- **活跃对话**：设 60-120 分钟，保持上下文连贯
- **低频使用**：设 30-45 分钟，节省资源
- **历史记录**：根据内存情况调整，10-20 条较为合适

### 4.2 自动回复配置

配置智能自动回复行为：

```toml
[autoreply]
enable = false                   # 启用自动回复
global_enable = false            # 全局启用自动回复
probability = 0.01               # 自动回复概率
keywords = ["at"]                # 触发关键词
keywords_mode = "starts_with"    # 关键词匹配模式
```

优化建议：

- **精准控制**：`probability` 建议设为 0.01-0.05，避免过度干扰
- **关键词策略**：可添加 ["?", "？", "帮助"] 等常见触发词
- **匹配模式**："starts_with"（开头匹配）或 "contains"（包含匹配）

## 5. Agent 与工具配置

### 5.1 工具调用配置

配置 Agent 的工具使用能力：

```toml
[llm_config.tools]
enable_tools = true              # 启用工具调用
use_minimal_context = true       # 使用最小化上下文
agent_mode_enable = true         # 启用Agent模式
agent_tool_call_limit = 10       # 工具调用次数限制
agent_tool_call_notice = "notify" # 工具调用通知方式
```

### 5.2 MCP 服务器集成

通过 MCP 协议集成外部服务（如 Dify）：

```toml
[llm_config.tools]
agent_mcp_client_enable = true   # 启用MCP客户端
# MCP服务器脚本配置（支持多个）
agent_mcp_server_scripts = [
    "http://192.168.1.25/e/305f1x4iiqyhpbws/sse",  # SSE传输示例
    # "stdio:///path/to/mcp-server.js",           # Stdio传输示例
    # "ws://localhost:8080/mcp",                  # WebSocket传输示例
]
```

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

通过合理配置和持续优化这些参数，可以显著提升 Amrita 框架的性能、稳定性和用户体验。建议根据实际使用场景，采用小步快跑的方式逐步调优。
