# 快速开始

## 初次配置

- **配置文件路径**： 通常位于`config/chat/`，为`config.toml`。
  主要说明：
  对于部署一个简单的聊天机器人，你只需要在`config`的`default_preset`表填写`api_key`,`base_url`,`model`;并将`enable`的值改为 true。我们提供了一个即配即用的部署方式。

  支持使用`${变量名}`或者`{{变量名}}`作为环境变量占位符

### 提示词设置

提示词位于在控制台打印的 config 文件夹，分别为`group_prompts`目录与`private_prompts`，内文件格式为`提示词.txt`，分别对应群聊和私聊的提示词，您可以使用指令切换或者在配置文件修改，默认会生成 default.txt，您通常只需要修改 default.txt 即可。

## 文件位置

如果您无法找到配置文件目录，可以在机器人根目录执行`nb localstore`即可获取到当前的存储位置。

## [进一步配置](./next)
