# 详细说明

传入 LLM 的信息格式如下，Amrita 有内置的 Prompt 会对内容进行解释：

::: details 点击查看详细格式

可解析的消息段：文字，at，合并转发

at+文字：

```plaintext
你好世界@Somebody
```

合并转发：

```plaintext
\（合并转发
[YYYY-MM-DD hh:mm:ss PM/AM][昵称(QQ号)]说：<内容>
[[YYYY-MM-DD hh:mm:ss PM/AM][昵称(QQ号)]说：<内容>]
）\
......以此类推
```

---

私聊普通消息：

```plaintext
[YYYY-MM-DD weekday hh:mm:ss AM/PM]用户昵称（QQ号）：<内容>
```

私聊引用消息：

```plaintext
私聊普通消息格式+ （（（引用的消息）））：引用消息内其他消息段解析后内容
```

私聊合并转发消息：

```plaintext
私聊普通消息格式+合并转发消息格式
```

---

聊群普通消息：

```plaintext
[管理员/群主/自己/群员][YYYY-MM-DD weekday hh:mm:ss AM/PM][昵称（QQ号）]说:<内容>
```

聊群引用消息：

```plaintext
聊群普通消息格式+ （（（引用的消息）））：引用消息内其他消息段解析后内容
```

聊群合并转发消息：

```plaintext
聊群普通消息格式+合并转发消息格式
```

---

戳一戳消息：

```plaintext
\(戳一戳消息\) 昵称(QQ:qq号) 戳了戳你
```

:::

### 前言

本文档可能会更新不及时，WebUI的配置文件管理页面具有完整的配置项说明，Chat插件的字符串配置项支持环境变量占位符`{{KEY}}`与`${KEY}`

### **配置项完整说明**

#### 配置文件

```toml
# ========================
#      基本核心配置
# ========================
enable = true  # 是否启用 SuggarChat 主功能
parse_segments = true  # 是否解析特殊消息段（如@提及/合并转发等）
matcher_function = true  # 是否启用 SuggarMatcher 事件钩子功能（Amrita Agent能力的核心功能）
preset = "default"  # 默认使用的模型预设配置名称
group_prompt_character = "default"  # 群聊场景使用的提示词模板名称
private_prompt_character = "default"  # 私聊场景使用的提示词模板名称

# ========================
#     预设模型扩展配置
# ========================
[preset_extension]
backup_preset_list = []  # 主模型不可用时自动切换的备选模型预设列表
multi_modal_preset_list = []  # 多模态场景预设调用顺序(默认为空)

# ========================
#      默认预设配置
# ========================
[default_preset]
model = ""  # 使用的AI模型名称（如gpt-3.5-turbo）
name = "default"  # 当前预设的标识名称
base_url = ""  # API服务的基础地址（为空则使用官方默认地址）
api_key = ""  # 访问API所需的密钥
protocol = "__main__"  # 协议适配器类型（保持默认即可）
thought_chain_model = false  # 是否启用思维链模型优化（增强复杂问题处理）
multimodal = false  # 是否支持多模态输入（如图片识别）

# 预设模型的额外扩展参数
[default_preset.extra]

# ========================
#       会话管理
# ========================
[session]
session_control = true  # 是否启用会话超时自动清理
session_control_time = 60  # 会话超时时间（单位：分钟）
session_control_history = 10  # 会话历史记录最大保存条数
session_max_tokens = 5000  # 单次会话上下文最大token容量

# ========================
#     电子水印检测功能
# ========================
[cookies]
cookie = ""  # 用于安全检测的Cookie字符串
enable_cookie = false  # 是否启用Cookie泄露检测机制

# ========================
#      自动回复设置
# ========================
[autoreply]
enable = false  # 是否启用自动回复系统
global_enable = false  # 是否全局启用自动回复（无视会话状态）
probability = 0.01  # 随机触发概率（0.01=1%）
keywords = [  # 触发自动回复的关键字列表
    "at",  # 当被@时触发
]
keywords_mode = "starts_with" # 关键词匹配模式(starts_with/contains)

# ========================
#      功能开关
# ========================
[function]
chat_pending_mode = "queue" # 当同一个Session实例进行会话(私聊/群聊视为一个Session)时，并发下所使用的模式。
# queue: 队列模式，等待前一条消息处理完后继续；
# single: 单个模式，仅处理当前消息，不处理后续消息；
# single_with_report: 单个模式，但是回复用户一条消息表示正在处理。
synthesize_forward_message = true  # 是否解析合并转发消息
nature_chat_style = true  # 是否启用自然对话风格优化
nature_chat_cut_pattern = "([。！？!?;；\\n]+)[\"\"\\'\\'\"\\s]*"  # 自然对话切分正则模式
poke_reply = true  # 是否响应戳一戳事件
enable_group_chat = true  # 是否启用群聊功能
enable_private_chat = true  # 是否启用私聊功能
allow_custom_prompt = true  # 是否允许用户自定义提示词
use_user_nickname = false  # 在群聊中使用QQ昵称而非群名片
chat_object_keep_count = 10  # 聊天对象保持数量

# ========================
#      扩展行为设置
# ========================
[extended]
say_after_self_msg_be_deleted = false  # 消息被撤回后是否自动回复
group_added_msg = "你好，我是Suggar，欢迎使用SuggarAI聊天机器人..."  # 入群欢迎消息
send_msg_after_be_invited = false  # 被邀请入群后是否主动发言
after_deleted_say_what = [  # 消息被撤回后的随机回复列表
    "抱歉啦，不小心说错啦～",
    "嘿，发生什么事啦？我",
    "唔，我是不是说错了什么？",
    "纠错时间到，如果我说错了请告诉我！",
    "发生了什么？我刚刚没听清楚呢~",
    "我会记住的，绝对不再说错话啦~",
    "哦，看来我又犯错了，真是不好意思！",
    "哈哈，看来我得多读书了~",
    "哎呀，真是个小口误，别在意哦~",
    "哎呀，我也有尴尬的时候呢~",
    "希望我能继续为你提供帮助，不要太在意我的小错误哦！",
]

# ========================
#   大语言模型(LLM)配置
# ========================
[llm_config]
stream = true  # 是否启用流式响应（逐字输出）
memory_lenth_limit = 5  # 记忆上下文的最大消息数量
max_tokens = 100  # 单次回复生成的最大token数
tokens_count_mode = "bpe"  # Token计算模式：bpe(子词)/word(词语)/char(字符)
enable_tokens_limit = true  # 是否启用上下文长度限制
llm_timeout = 60  # API请求超时时间（秒）
auto_retry = true  # 请求失败时自动重试
max_retries = 3  # 最大重试次数
enable_memory_abstract = true  # 是否启用记忆摘要功能
memory_abstract_proportion = 0.5  # 记忆摘要压缩比例
block_msg = [  # 触发安全熔断时随机返回的提示消息
    "嗨～你好，我们换个话题吧～"
]

# 工具调用子系统
[llm_config.tools]
enable_tools = true  # 是否启用外部工具调用功能（关闭此选项不影响内容审查系统）
use_minimal_context = true  # 使用最小化上下文
enable_report = true  # 是否启用内容审查系统
report_exclude_system_prompt = false # 是否排除系统提示词
report_exclude_context = false # 是否排除上下文
report_invoke_level = "middle" # 审核的触发敏感度（low, middle, high）
report_then_block = true  # 检测到违规内容后是否熔断会话
require_tools = false  # 是否强制要求每次调用至少使用一个工具
agent_mode_enable = true # 使用智能体模式
agent_tool_call_limit = 10 # 智能体模式下，每个会话最多调用的Tools次数
agent_tool_call_notice = "notify" # 智能体工具调用通知方式
# hide: 隐藏工具调用过程
# notify: 工具调用时通知用户
# verbose: 详细显示工具调用过程
agent_thought_mode = "reasoning" # 智能体模式下的思考模式
# chat: 聊天模式（直接运行Function Calling）
# reasoning: 先分析任务再进行处理
# reasoning-optional: 可选的reasoning
# reasoning-required: 每轮工具调用一定进行reasoning
agent_reasoning_hide = false  # 是否隐藏思考过程
agent_middle_message = true  # 是否显示中间消息
agent_mcp_client_enable = true # 是否启用MCP客户端
agent_mcp_server_scripts = [  # MCP服务端脚本列表
    "http://192.168.1.25/e/305f1x4iiqyhpbws/sse",
]

# ========================
#      使用限额配置
# ========================
[usage_limit]
enable_usage_limit = false  # 是否启用使用频率限制
group_daily_limit = 100  # 单个群组每日最大使用次数
user_daily_limit = 100  # 单个用户每日最大使用次数
group_daily_token_limit = 200000  # 单个群组每日最大token消耗量
user_daily_token_limit = 100000  # 单个用户每日最大token消耗量
total_daily_limit = 1500 # 总使用次数限制
total_daily_token_limit = 1000000 # 总使用token消耗量限制
global_insights_expire_days = 7  # 全局洞察数据过期天数

# ========================
#       扩展预留区
# ========================
[extra]
```

## Cookie 检测

通过检测特定字符串是否包含在模型输出来检测提示词是否泄露

请在提示词文件写入`{cookie}`，(可用占位符：`{cookie}`,`{self_id}`,`{user_id}`)(最好在人设部分，这样如果 Cookie 泄露了人设差不多也出来了。)并配置配置文件的 Cookie 部分。

## 模型预设

预设文件位于将配置文件目录的 models 文件夹下，预设文件为 json 格式，具体格式如下：

```json
{
  "model": "auto",
  "name": "",
  "base_url": "",
  "api_key": "",
  "procotol": "__main__",
  "thought_chain_model": false,
  "multimodal": false,
  "extra": {}
}
```

### 解释

- `model`: 使用的模型，默认为 auto，即自动选择。
- `name`: 预设的名字，用于在插件中选择使用。
- `base_url`: OpenAI 协议 API URL，默认为空。
- `api_key`: OpenAI 协议 API 密钥，默认为空。
- `procotol`: 预设的协议，默认为\***\*main\*\***，其他协议请阅读对应的文档。
- `extra`: 扩展配置文件

### 模型预设使用方法

1. 在控制台打印的 models 文件夹下，创建一个 json 文件，文件名必须与预设的名字一致。
2. 在 json 文件中，填写预设的内容。
3. 在插件配置文件中，将`preset`的值设置为预设的名字（我们更推荐你使用**指令**来切换而不是直接修改配置文件）。

## 提示词预设

在 config 目录下有`private_prompts`目录与`group_prompts`目录，以 txt 格式存放预设文件。

### 切换方法

参考下文指令部分或上文配置文件部分

## 指令使用方法

| 指令名称                           | 参数                                                                                                 | 解释                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **/聊天菜单** 或 **/chat_menu**    | 无                                                                                                   | 显示完整功能菜单                           |
| **/del_memory** 系列指令           | 无                                                                                                   | 删除当前会话的聊天上下文                   |
| **/enable_chat** 或 **/启用聊天**  | 无                                                                                                   | 在群聊中启用聊天功能（需管理员权限）       |
| **/disable_chat** 或 **/禁用聊天** | 无                                                                                                   | 在群聊中禁用聊天功能（需管理员权限）       |
| **/prompt**                        | `--(show)` 展示当前 extra 提示词<br>`--(clear)` 清空提示词<br>`--(set) [文本]` 设置提示词            | 管理自定义提示词（支持 Markdown 格式）     |
| **/presets**                       | 无                                                                                                   | 查看可用模型预设列表                       |
| **/set_preset** 系列指令           | `[模型预设名称]`                                                                                     | 设置使用的模型预设（不填参数则重置为默认） |
| **/choose_prompt**                 | `group` 查看群组预设<br>`private` 查看私聊预设<br>`[提示词预设名称]` 设置预设                        | 选择群组/私聊提示词预设                    |
| **/sessions**                      | 无                                                                                                   | 查看历史会话列表（含编号和时间戳）         |
| **/sessions** 管理指令             | `set <编号>` 覆盖当前会话<br>`del <编号>` 删除会话<br>`archive` 归档当前会话<br>`clear` 清空所有会话 | 高级会话管理功能（需管理员权限）           |
| **/debug**                         | 无                                                                                                   | 开发者调试模式开关（需管理员权限）         |
| **/fakepeople**                    | on/off                                                                                               | 群内自动回复开关                           |
| **/insights**                      | [global]                                                                                             | 今日用户/全局用量统计                      |
| **/test_preset**                   | [-d\|--details]                                                                                      | 测试所有预设                               |
| **/mcp_stats**                     | [-d\|--details]                                                                                      | 获取 MCP 状态                              |
| **/mcp**                           | stats [-d\|--details]<br>add <server_script><br>del <server_script><br>reload                        | 管理 MCP 服务                              |
