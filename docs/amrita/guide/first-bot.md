# 创建第一个对话机器人

本教程将引导你创建一个完整的对话机器人，涵盖从基础对话到高级功能的实现。

## 前提

确保你已经完成以下步骤：

- [安装 Amrita](./quick-start.md)
- [部署 Amrita](./installation.md)
- [配置 Amrita](./configuration.md)

## 对接到OneBot V11协议实现

请参考[对接](./to_bot.md)

## 配置

### 1. 登录WebUI

浏览器打开 `http://127.0.0.1:8080`

输入用户名和密码登录

![Login](/login.png)

### 2. 编辑预设


![Preset](/preset.png)

进入此页面，点击`创建预设`

![Create](/create_preset.png)

在此处填写预设信息：

![Edit](/edit_preset.png)

完成后点击`保存`

![Save](/save_preset.png)

您可以看到您的预设已保存

![view](/view_preset.png)

### 3. 使用预设

在sidebar找到`系统管理`->`配置管理`

![conf](/conf.png)

进入后点击`chat`进入聊天模块的配置页面

![chat](/conf-chat.png)

![chat-conf](/chat-conf.png)

将预设的名称填入`preset`字段中

![chat-conf-preset](/chat-conf-preset.png)

启用聊天能力

![chat-conf-enable](/chat-conf-enable.png)

保存配置

![chat-conf-save](/chat-conf-save.png)

### 4. 设置Prompt

找到`聊天管理`->`提示词预设`

![prompt](/prompt.png)

点击`编辑`

![prompt-edit](/prompt-edit.png)

填写提示词并保存

![prompt-content](/prompt-content.png)

### 结束

现在，您完成了一个最基本的聊天配置，您可以开始使用Amrita进行聊天了。

## 下一步学习

- [聊天功能详解](../features/chat/index.md)
- [权限管理深入](../features/permission/index.md)  
- [WebUI 扩展](../features/webui/index.md)
