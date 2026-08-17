# 基础对话

AmritaBot 的基础对话功能基于 AmritaCore 的 `ChatObject` / `ChatManager` 体系，让你的机器人能够进行自然、流畅的流式对话。

## 核心概念

- **ChatObject**：会话的最小单元，维护单次对话的上下文、工具调用状态和响应生成
- **ChatManager**：管理 ChatObject 生命周期，支持挂起/恢复（`SuspendEnum`）
- **流式响应**：所有消息输出均为异步流，用户可实时看到 LLM 逐字生成的内容
- **适配器系统**：通过 AmritaCore 的 `AdapterManager`，统一的 API 调用接口屏蔽不同模型厂商的差异

## 启用基础对话

我们在[第一个机器人](../../guide/first-bot.md)中有提及如何进行基本配置，这里不再赘述。

- 支持使用 `${变量名}` 作为环境变量占位符(例如在模型预设中使用)。

## 对话上下文

### 上下文窗口

AmritaBot 会自动维护对话上下文，解析的消息段包括：文字、@、合并转发。

消息格式示例：

- **私聊普通消息**：`[YYYY-MM-DD weekday hh:mm:ss AM/PM]用户昵称（QQ号）：<内容>`
- **群聊普通消息**：`[管理员/群主/自己/群员][YYYY-MM-DD weekday hh:mm:ss AM/PM][昵称（QQ号）]说:<内容>`
- **引用消息**：在普通消息格式后添加 `<REFERRED>引用消息内其他消息段解析后内容</REFERRED>`

AmritaBot 内置了基础提示词，因此您无需在提示词中而外对格式进行描述。

## 个性化设置

### 提示词设置

提示词文件位于 localstore 插件配置目录（机器人启动时打印，或运行 `ambot nb localstore` 查看）下的 `group_prompts` 目录与 `private_prompts` 目录，内文件格式为 `提示词.txt`，分别对应群聊和私聊的提示词，在WebUI中，我们提供了完整的编辑功能。

- 默认会生成 `default.txt` 文件
- 通常只需要修改 `default.txt` 即可
- 可以使用指令切换提示词或在WebUI中修改

### 模型预设

预设文件位于配置文件目录的 `models` 文件夹下，预设文件为 JSON 格式，在WebUI中可以进行修改，此处仅展示默认预设文件：

::: details

```json
{
  "model": "auto",
  "name": "default",
  "base_url": "",
  "api_key": "",
  "protocol": "__main__",
  "config": {
    "top_k": 50,
    "top_p": 0.8,
    "temperature": 0.6,
    "stream": false,
    "multimodal": false,
    "cot_model": false
  }
}
```

:::

## 指令使用

> (全部指令请参考`/menu`或Bot启动时的输出，指令权限详见各指令说明)

| 指令名称      | 参数                                                                                                      | 解释                           | 权限       |
| ------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------- |
| **/model**    | `/model list` 可用模型<br>`/model switch <名>` 切换<br>`/model info` 详情<br>`/model test [名] [-d]` 测试 | 查看、切换与测试模型           | `lp.admin` |
| **/prompt**   | `/prompt set <文本>` 设置<br>`/prompt clear` 清空<br>`/prompt template [group\|private] [名称]` 模板      | 设置自定义提示词与切换模板     | 群管理     |
| **/session**  | `/session info\|list\|use <编号>\|del <编号>\|archive\|clear\|compact [force]\|forget\|abstract [clear]`  | 会话信息、历史、压缩与记忆管理 | 群管理     |
| **/chat**     | `/chat on\|off` 聊天开关<br>`/chat auto <on\|off>` 自动回复<br>`/chat status` 状态                        | 开启/关闭聊天与自动回复        | 群管理     |
| **/debug**    | `/debug <on\|off\|status>`                                                                                | 调试模式开关                   | `lp.admin` |
| **/insights** | `/insights [global\|top10 <--group\|private\|all>]`                                                       | 查看今日AI用量统计             | 所有用户   |
| **/mcp**      | `/mcp <stats [-d\|--details];add <server_script>;del <server_script>;reload>`                             | 管理MCP服务                    | `lp.admin` |
| **/chatobj**  | `/chatobj status` 状态<br>`/chatobj terminate\|kill <ID前缀>` 终止<br>`/chatobj clear` 清除               | 管理聊天对话（会话进程）       | 群管理     |

## 找到配置文件

如果无法找到配置文件目录，可以在机器人根目录执行 `ambot nb localstore` 即可获取到当前的存储位置。

## 常见问题

### 对话中断

如果对话上下文丢失，检查：

- 配置文件是否正确设置
- 缓存是否正常工作
- 是否有异常错误导致上下文重置

### 回复质量

如果回复质量不佳，尝试：

- 调整提示词文件内容
- 使用更强大的 LLM 模型
- 检查模型预设配置是否正确

## 下一步

- [高级对话功能](./advanced.md)
- [工具调用](./tools.md)
