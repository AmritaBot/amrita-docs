# 功能扩展

## 前言

此页面介绍了 Amrita 的官方插件，以及如何使用它们来扩展 Amrita 的功能。

## 官方插件

### plugin-deepseek

DeepSeek 模型目前在工具调用中存在DSML标签对泄露的问题，因此我们提供了一个补丁包插件，用于防止泄露以及提供一个基于Minhash+Jieba分词算法的反注入安全过滤器。

详情请查看 [plugin-deepseek](https://github.com/AmritaBot/plugin-deepseek)

### plugin-omikuji

该插件为用户提供传统日本神社抽签体验的现代化数字版本，通过 AI 生成个性化、富有文化氛围的签文。

御神签（おみくじ）是日本神道教中一种传统的占卜方式，参拜者在神社或寺庙中摇动签筒，随机抽取一支签，上面写着对未来的预言或建议。本插件将这一传统文化与现代 AI 技术相结合，每次抽取都会根据主题和运势等级生成独特的签文内容。

详情请查看 [plugin-omikuji](https://github.com/AmritaBot/plugin-omikuji)

## plugin-exec

Amrita 的命令执行插件，这是一个为Amrita框架开发的命令执行插件，允许授权用户/LLM在聊天中执行服务器命令。

详情请查看 [plugin-exec](https://github.com/AmritaBot/plugin-exec)
