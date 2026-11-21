# 配置与调优实践

AmritaBot 的聊天配置在 `config/chat/config.toml`，由 Pydantic 模型分层组织，WebUI 的「配置管理」会按同样的结构渲染表单。本文不逐项罗列所有字段，而是讲清楚哪些配置真正影响体验、常见配错点，以及几套可以直接抄的起点配置。

## 1. 配置分层

```toml
[core]                    # AmritaCore 原生配置
[core.llm]                # 上下文窗口、压缩策略、超时
[core.builtin]            # Agent 模式、思考模式、反思
[core.function_config]    # 工具预算、参数校验、MCP
[core.cookie]             # Cookie 反注入

[llm]                     # Chat 插件的 Agent 策略
[llm.tools]               # 内容审查

[meta]                    # 思考块、工具通知、技能通知
[skills]                  # 技能启停、注册模式、脚本策略
[session]                 # 会话生命周期
[function]                # 聊天行为、防抖、并发、转发
[context]                 # 静默上下文与图片
[usage_limit]             # 用量限制
[autoreply]               # 概率自动回复

preset = "default"                    # 顶层：默认模型预设
group_prompt_character = "default"    # 顶层：群聊提示词
private_prompt_character = "default"  # 顶层：私聊提示词
```

两个最常混的段：

- `[core.function_config]` 是 AmritaCore 的工具调用配置；
- `[function]` 是 Chat 插件自己的聊天行为配置。

它们不是同一个东西。把 `agent_tool_call_limit` 写进 `[function]` 会被忽略。

## 2. 上下文与压缩

```toml
[core.llm]
max_tokens = 10000
session_tokens_windows = 65536
memory_length_limit = 200
llm_timeout = 60
max_retries = 3
max_fallbacks = 5

context_strategy = "compact"      # compact / slide / none
compaction_trigger_ratio = 0.9
slide_target_ratio = 0.7
compaction_max_tokens = 2048
enable_overflow_recovery = true
```

- `compact`：把旧消息折叠成摘要，保留长期连贯性，适合大多数对话。
- `slide`：直接丢弃最旧消息，省掉摘要调用，适合「早期内容不重要」的短会话。
- `none`：不处理，超出窗口后依赖 provider 报错或溢出恢复。不建议长期使用。

预设里声明 `max_context` 后，`session_tokens_windows` 只作为兜底。`max_output` 影响 `/session info` 的预留空间与压缩阈值，换模型时两个值要一起看。

建议：

- 长对话把 `compaction_trigger_ratio` 调到 0.7–0.8，让压缩更早介入，避免接近窗口上限时才摘要；
- 用 `slide` 时把 `slide_target_ratio` 保持在触发比例以下，否则会反复裁剪；
- 工具返回大结果的场景，先截断工具结果，再考虑调大窗口。窗口越大，每轮成本越高。

## 3. Agent 预算

```toml
[core.builtin]
tool_calling_mode = "agent"     # agent / rag / none
agent_thought_mode = "chat"     # chat / reasoning / reasoning-required / reasoning-optional

[core.function_config]
agent_tool_call_limit = 10
agent_tool_parallel_limit = 0
agent_tool_refusal_rounds = 2
validate_tool_arguments = true
agent_step_token_budget = -1
agent_middle_message = true
use_minimal_context = false
```

- `agent_tool_call_limit` 数的是「模型请求工具的轮次」，不是工具个数。
- `agent_tool_parallel_limit = 0` 表示同一轮内所有安全工具都可以并发；设 `1` 强制串行，适合有共享状态或限流的工具。
- `use_minimal_context = true` 只保留 system 与最后一条消息，能省 token，但会破坏多步任务的连贯性。只在简单问答或成本极敏感时开。
- `agent_step_token_budget` 只对 `step-react` 有意义。

详细取舍见[Agent 设计与运行实践](./agent.md)。

## 4. 思考与通知

```toml
[meta]
enable = true
reasoning = true
stream_reasoning = false
reasoning_summary = false
reasoning_summary_max_chars = 120
reasoning_summary_input_chars = 6000
reasoning_summary_max_output = 1024
reasoning_summary_timeout_seconds = 20
tool_call = false
skill_trigger = true
```

| 场景 | 建议 |
| --- | --- |
| 群聊 | `stream_reasoning = false`，`tool_call = false`，`skill_trigger` 可保留或关闭 |
| 个人助理 | `stream_reasoning = true`，长思考再开 `reasoning_summary` |
| 调试 | 临时 `tool_call = true`，确认工具选择 |
| 低成本 | 全部思考展示关闭，减少一次摘要调用 |

`stream_reasoning` 在 1.19 起是「整段发送」，不是逐 token。`reasoning_summary` 会额外调用一次模型，失败回退原文；模型慢时放宽 `reasoning_summary_timeout_seconds`。

## 5. 聊天行为与防抖

```toml
[function]
enable_group_chat = true
enable_private_chat = true
chat_pending_mode = "queue"
message_type = "legacy"
nature_chat_style = true
synthesize_forward_message = true
poke_reply = true

chat_debounce_window = 0.0
chat_debounce_max_messages = 20
chat_debounce_max_wait = 5.0

forward_threshold = 200
forward_min_chunk = 500
```

- `chat_pending_mode`：同一会话上一条没处理完时的行为。`queue` 排队最稳；`single` 直接忽略新消息；`single_with_report` 会提示用户等待；`interactive` 把消息推给正在运行的 ChatObject，适合需要中途补充信息的场景。
- `chat_debounce_window`：窗口内同一会话、同一用户的多条消息合并为一次请求。用户习惯一句话拆几条发时开 1–2 秒；私聊或指令场景保持 0。
- `message_type`：`legacy` 紧凑、省 token；`xml` 结构清晰，适合多人群聊与引用消息，但更费 token。
- `forward_threshold`：最终回答超过该字符数时改用合并转发，避免单条消息超限。思考块也受这个阈值影响。

防抖按「会话 + 用户」分桶，群聊不会把不同人的话并在一起；发完文字补的图片也会进同一批。窗口内持续发言会重置计时，但受最大条数和最长存活时间兜底。

## 6. 技能配置

```toml
[skills]
enable = true
mode = "progressive"       # progressive / invoke
all_skills = true
selected = []
echo_skill_directory = true
allow_script_execution = true
```

- `all_skills = true` 时 `selected` 不生效；
- `all_skills = false` 时只启用 `selected` 里的技能，空列表表示一个都不启用；
- `mode = "progressive"` 统一注册 `skill_open` / `skill_read`，技能多了也不会撑爆工具池；
- `mode = "invoke"` 为每个技能注册一个工具，只用于兼容旧行为；
- 远程沙箱或不想暴露本机路径时关 `echo_skill_directory`；
- 不信任技能脚本时关 `allow_script_execution`，技能仍然能返回正文。

编写方法见[编写有效的 Skills](./skills.md)。

## 7. 会话与限额

```toml
[session]
session_control = true
session_control_time = 60
session_control_history = 10
session_allow_continue = true
session_long_running_notify_seconds = 180

[usage_limit]
enable_usage_limit = true
group_daily_limit = 100
group_daily_token_limit = 200000
user_daily_limit = 100
user_daily_token_limit = 100000
total_daily_limit = 1500
total_daily_token_limit = 1000000
```

- `session_control_time` 太短会导致上下文频繁归档，用户感觉「聊两句就忘了」；太长会让不活跃会话占着内存。
- `session_control_history` 是保留的归档条数，不是上下文轮数。
- `session_long_running_notify_seconds` 只影响私聊 Agent 的超时提示，不终止任务。
- `usage_limit` 对 `lp.admin` 不生效。token 用量以 provider 上报为准，本地不再估算。

## 8. 上下文静默存储与图片

```toml
[context]
enable = true
max_records = 200
record_ttl_hours = 72
read_context_limit = 30
read_context_images = false
max_image_kb = 10240
max_allowed_size = 2048
max_image_width = 2048
max_image_height = 2048
max_images_per_message = 4
max_images_per_request = 8
media_ttl_hours = 24
local_media_dirs = []
fake_ip_ranges = []
```

几个安全相关的点：

- `local_media_dirs` 为空表示禁止读取任何本地文件。放开白名单等于允许读取这些目录，只填确实需要的绝对路径。
- `fake_ip_ranges` 只对域名解析结果生效，字面量 IP 仍按公网判定。Clash 等代理开启 fake-ip 后，要登记 `198.18.0.0/15` 一类保留段，否则图床域名会被 SSRF 护栏拒绝。
- `read_context_images = false` 时 `read_context` 只返回文本，避免历史图片一次性撑满上下文。
- `max_images_per_request` 是本轮新图与历史图片的总上限，超出会降级为文字提示。

## 9. 模型预设与提示词

```toml
preset = "default"
group_prompt_character = "default"
private_prompt_character = "default"

[preset_extension]
backup_preset_list = []
```

模型参数在预设文件里，不在 `[core.llm]`：

```toml
[default_preset]
model = "auto"
base_url = ""
api_key = ""
protocol = "__main__"
max_context = 128000
max_output = 28000

[default_preset.config]
temperature = 0.6
top_p = 0.8
top_k = 50
stream = true
multimodal = false
cot_model = false
```

`stream = true` 建议开启，改善长文本体验。把 `stream` 写在 `[llm]` 下会被静默忽略。

`group_prompt_character` / `private_prompt_character` 是顶层字段，写在 `[extended]` 下无效。提示词写法见[提示词设计](./prompt.md)。

## 10. 三套起点配置

### 10.1 群聊助手

```toml
[function]
chat_pending_mode = "queue"
chat_debounce_window = 1.5
chat_debounce_max_wait = 5.0
message_type = "xml"
nature_chat_style = true

[meta]
reasoning = false
stream_reasoning = false
tool_call = false
skill_trigger = false

[core.function_config]
agent_tool_call_limit = 8
agent_tool_parallel_limit = 4

[core.llm]
context_strategy = "compact"
compaction_trigger_ratio = 0.75
```

群聊重点是不刷屏、不抢话、上下文别爆。`message_type = "xml"` 让模型分得清谁在说话；防抖把连发合并；思考与工具通知关闭。

### 10.2 个人助理

```toml
[function]
chat_pending_mode = "queue"
chat_debounce_window = 0

[meta]
reasoning = true
stream_reasoning = true
reasoning_summary = true
reasoning_summary_max_chars = 160
tool_call = false

[core.function_config]
agent_tool_call_limit = 15
validate_tool_arguments = true

[llm]
agent_workflow = "react"
```

个人助理可以展示思考，但建议摘要，避免几万字刷屏。复杂任务再把 `agent_workflow` 换成 `step-react`。

### 10.3 低成本 / 高并发

```toml
[core.builtin]
tool_calling_mode = "rag"

[core.function_config]
agent_tool_call_limit = 4
use_minimal_context = true

[core.llm]
context_strategy = "slide"
slide_target_ratio = 0.6
max_tokens = 4096

[meta]
reasoning = false
stream_reasoning = false
reasoning_summary = false
tool_call = false
skill_trigger = false

[usage_limit]
enable_usage_limit = true
```

只调用一次工具、裁掉旧上下文、关闭所有中间展示。适合公开群或按量计费场景，代价是多步任务能力下降。

## 11. 常见配错点

| 配错 | 后果 | 正确做法 |
| --- | --- | --- |
| `stream` 写在 `[llm]` | 静默忽略，仍不流式 | 写进预设的 `[default_preset.config]` |
| 提示词字段写在 `[extended]` | 静默忽略 | 放顶层 |
| `agent_tool_call_limit` 写在 `[function]` | 静默忽略 | 放 `[core.function_config]` |
| 继续用 `core.builtin.agent_reasoning_hide` | 1.0 起已移除 | 用 `[meta].reasoning` |
| 继续用 `core.builtin.agent_tool_call_notice` | 已移除 | 用 `[meta].tool_call` |
| 继续用 `session_max_tokens` | 1.0 起无效 | 用 `[core.llm].session_tokens_windows` 或预设 `max_context` |
| `selected = []` 想表达「全部启用」 | 1.19 起表示「一个都不启用」 | 设 `all_skills = true` |
| 以为 `stream_reasoning` 是逐 token | 1.19 起是整段发送 | 想看摘要再开 `reasoning_summary` |
| MySQL 上不跑迁移 | 会话标签、重命名异常 | 升级后 `ambot orm upgrade` |

## 12. 调优顺序

1. 先定模型与预设：窗口、输出上限、流式、温度；
2. 再定上下文策略：`compact` 还是 `slide`，触发比例多少；
3. 再定 Agent 预算：轮次、并发、参数校验；
4. 最后调展示：思考、工具通知、技能通知。

一次只改一到两个参数，改完观察一轮真实对话。不要同时改模型、提示词、工具和预算，否则出了问题不知道是哪一项导致的。
