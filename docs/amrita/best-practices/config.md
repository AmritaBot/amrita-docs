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
max_tokens = 10000             # 单次最大生成 token
session_tokens_windows = 65536 # 会话上下文窗口（tokens），预设未声明 max_context 时的兜底值
memory_length_limit = 200      # 原始记忆轮数上限
llm_timeout = 60               # 单次请求超时（秒）
require_tools = false          # 是否强制模型必须调用工具
auto_retry = true              # 失败自动重试
max_retries = 3                # 重试次数上限
max_fallbacks = 5              # 预设降级次数上限
enable_multi_modal = true      # 全局多模态开关（还需预设 multimodal = true）

# 上下文压缩（1.0 起由 ContextCompactor 负责，取代旧的 MemoryLimiter）
enable_compaction = true          # 是否启用上下文压缩
compaction_trigger_ratio = 0.9    # 占用达到窗口的该比例时触发压缩
compaction_max_tokens = 2048      # 摘要生成的最大 token
enable_overflow_recovery = true   # 溢出时自动恢复
```

> 温度（`temperature`）、采样（`top_p`/`top_k`）等生成参数不在 `[core.llm]` 下，而是位于第 6 节的 `[default_preset.config]` 中。

::: warning 1.0 已移除的字段

以下字段在 AmritaCore 1.0 中**已不存在**，写在配置里会被 pydantic 静默忽略：

| 旧字段 | 替代方案 |
| --- | --- |
| `tokens_count_mode` | 无 —— 本地分词器整体移除，用量只来自 provider 上报 |
| `enable_memory_abstract` | `enable_compaction` |
| `memory_abstract_proportion` | `compaction_trigger_ratio` |
| `enable_tokens_limit` | 无 —— 改为按窗口 + 压缩阈值控制 |

:::

优化建议：

- **对话型应用**：temperature 0.7–1.0；**工具调用/严谨场景**：0–0.3（在 `default_preset.config` 中调整）
- 长对话建议保持 `enable_compaction = true`，把 `compaction_trigger_ratio` 调到 0.6–0.8 让压缩更早介入
- 预设中声明 `max_context` 后，`session_tokens_windows` 仅在未声明时生效

### 1.2 Agent 工具调用

```toml
[core.function_config]
use_minimal_context = false      # 是否使用最小上下文（仅 system + 最后一条消息）
agent_tool_call_limit = 10       # 单次对话最大工具调用次数
agent_middle_message = true      # 允许 Agent 向用户发送中间消息
validate_tool_arguments = true   # 调用前校验工具参数是否符合 schema
agent_step_token_budget = -1     # 单个 Step 的 token 预算，-1 表示不限制
agent_mcp_client_enable = false  # 启用 MCP 客户端
agent_mcp_server_scripts = []    # MCP 服务器地址列表
```

::: tip 注意配置段名

是 `core.function_config`，**不是** `core.function`（后者是 Chat 插件自己的行为开关段，见第 2 节）。

:::

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

流式开关**不在** Chat 插件的 `[llm]` 段，而在模型预设的 `config` 里：

```toml
[default_preset.config]
stream = true  # 强烈建议开启，改善长文本体验
```

::: warning 易错点

Chat 插件的 `[llm]` 段只有 `tools`、`block_msg`、`agent_strategy`、`agent_workflow` 四项，没有 `stream`。
把 `stream` 写在 `[llm]` 下会被静默忽略。

:::

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
agent_strategy = "react"  # react / hybrid-react(已弃用) / no-action
agent_workflow = "react"  # react / step-react（Step 驱动的 ReAct 循环）
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
group_daily_token_limit = 200000
user_daily_limit = 100
user_daily_token_limit = 100000
total_daily_limit = 1500
total_daily_token_limit = 1000000
limit_msg = ["今日额度已达上限，请明天再试。"]  # 超限提示文案
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

| 场景           | 建议                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| 高并发群聊     | `chat_pending_mode = "queue"`，`session_control_time = 30`                                                  |
| 长对话记忆     | `core.llm.enable_compaction = true`，`compaction_trigger_ratio = 0.7`（更早压缩）                           |
| Token 成本控制 | 启用 `usage_limit`，合理设置 `total_daily_token_limit`                                                      |
| 响应速度       | 开启 `stream = true`（`default_preset.config`），`use_minimal_context = false`（保留完整上下文）            |
| 安全敏感场景   | `llm.tools.report_invoke_level = "high"`，`core.cookie.enable_cookie = true`                                |
| 控制上下文长度 | 在预设中声明 `max_context`，否则回退到 `core.llm.session_tokens_windows`                                    |

优化建议：

- **SSE 传输**：适合远程服务器，配置简单
- **Stdio 传输**：适合本地进程，性能最佳
- **多服务器**：可配置多个 MCP 服务器扩展功能
- **错误处理**：确保 MCP 服务器稳定运行，避免影响主流程

## 4. 预设与模型配置

### 4.1 默认预设配置

配置基础模型参数：

```toml
[default_preset]
model = "auto"            # 模型名称（"auto" 为自动选择）
name = "default"          # 预设名称
base_url = ""             # API基础URL（为空使用默认）
api_key = ""              # API密钥
protocol = "__main__"     # 协议类型
max_context = 128000      # 上下文窗口（1.0 新增；不写则回退到 core.llm.session_tokens_windows）
max_output = 28000        # 单次响应预留 token（1.0 新增；影响 /session 占用条）

[default_preset.config]
top_k = 50                # top-k 采样
top_p = 0.8               # 核采样概率
temperature = 0.6         # 生成温度 (0-2，越高越随机)
stream = false            # 是否流式输出
multimodal = false        # 多模态支持
cot_model = false         # 思维链（CoT）模型
```

::: tip 1.0 起注意力窗口由预设声明

`max_context` / `max_output` 是 AmritaCore 1.0 新增的预设字段。未声明时：

- `max_context` 回退到 `core.llm.session_tokens_windows`
- `max_output` 回退到 Core 内置默认值（28000）

两个值同时决定 `/session info` 的占用条与压缩阈值。也可在 WebUI 的「模型预设」页直接填写。

:::

### 4.2 预设扩展

主预设调用失败时，按顺序切换到备选预设：

```toml
[preset_extension]
backup_preset_list = []          # 备份预设列表（主预设失败时依次尝试）
```

提示词模板与默认预设是**顶层字段**（不在 `[extended]` 下）：

```toml
preset = "default"                     # 默认使用的模型预设名称
group_prompt_character = "default"     # 群聊提示词模板名称
private_prompt_character = "default"   # 私聊提示词模板名称
```

::: warning 易错点

- `multi_modal_preset_list` 不存在；多模态由 `core.llm.enable_multi_modal` **与**预设的
  `config.multimodal` 两个开关共同决定，两者都为 `true` 才生效。
- `group_prompt_character` / `private_prompt_character` 是顶层字段，
  写在 `[extended]` 下会被静默忽略。

:::

## 5. 高级功能配置

### 5.1 消息处理增强

```toml
[function]
nature_chat_cut_pattern = "([。！？!?;；\\n]+)[\"\"\\'\\'\"\\s]*"  # 自然聊天切割模式
forward_threshold = 200                # 超过该长度的回复改用合并转发
forward_min_chunk = 500                # 合并转发分块的最小长度

[extended]
say_after_self_msg_be_deleted = false  # 自己的消息被撤回后是否发言
group_added_msg = "你好，我是Amria，有关使用手册见https://bot.amritabot.com"  # 入群欢迎语
send_msg_after_be_invited = false      # 被邀请后是否发送消息
```

### 5.2 敏感内容处理

```toml
[llm]
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

## 6. 数据库与状态管理

### 6.1 Cookie（提示词电子水印） 管理

```toml
[core.cookie]
enable_cookie = true     # 是否启用Cookie反注入检测
cookie = ""              # Cookie值（留空自动生成随机字符串）
```

### 6.2 数据持久化

通过数据库配置管理状态持久化（配置文件示例）：

```dotenv
# .env 文件示例
SQLALCHEMY_DATABASE_URL=sqlite+aiosqlite:///./data/db.sqlite3
# 或使用其他数据库
# SQLALCHEMY_DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/amrita
# SQLALCHEMY_DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/amrita
```

## 7. 最佳实践

### 7.1 配置管理策略

1. **环境分离**：创建不同环境的配置文件
   - `.env.dev` - 开发环境
   - `.env.prod` - 生产环境

2. **版本控制**：将基础配置纳入版本控制，敏感信息使用环境变量

3. **配置验证**：启动时验证关键配置项

### 7.2 性能调优步骤

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

### 7.3 故障排查指南

常见问题及解决方法：

| 问题             | 可能原因                               | 解决方案                          |
| ---------------- | -------------------------------------- | --------------------------------- |
| 响应超时         | `llm_timeout` 过小                     | 增加至 60-120 秒                  |
| 上下文丢失       | `session_control_time` 过短            | 增加至 60+ 分钟                   |
| Token 超限       | `core.llm.session_tokens_windows` 过小 | 调大上下文窗口（注意 token 成本） |
| 工具调用失败     | MCP 服务器未启动                       | 检查 MCP 服务器状态               |
| 自动回复过于频繁 | `probability` 过高                     | 降低至 0.01-0.05                  |

通过合理配置和持续优化这些参数，可以显著提升 AmritaBot 框架的性能、稳定性和用户体验。建议根据实际使用场景，采用小步快跑的方式逐步调优。
