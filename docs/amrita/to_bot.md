# Amrita 连接到 OneBot V11 配置指南

## 概述

本文档介绍了如何将已安装的 Amrita 项目对接到 OneBot V11 协议实现（连接 Bot）。

## 前置条件

- 已完成 Amrita 项目的[配置](https://amrita.suggar.top/amrita/deployment.html)
- 您的协议实现支持 OneBot V11 协议，例如 `NapCat` , `LLOneBot`, `GO-CQHTTP`, `Lagrange` ...本文档内所提及协议实现均表示此含义。

## 连接方式

::: tip

限于文章篇幅，本文档仅介绍 NapCat 端的反向 WebSocket 连接方式，其他协议实现同理。

:::


### 反向 WebSocket 连接

1. 启动 Amrita 项目

```shell
...
2026-01-16 20:42:11 | INFO    | uvicorn:startup:62 | Application startup complete.
2026-01-16 20:42:11 | INFO    | uvicorn:_log_started_message:216 | Uvicorn running on http://127.0.0.1:8080 (Press CTRL+C to quit)
```

此时 Amrita 项目已启动，监听地址为`http://127.0.0.1:8080`，可以开始配置 OneBot V11 协议实现。

2. 配置 OneBot V11 协议实现

打开 NapCat 的 WebUI，选择 `网络配置` -> `新建` -> `WebSocket 客户端`

![nc-0](/nc-0.png)

![nc-1](/nc-1.png)

配置 Amrita 项目的监听地址和端口。

![nc-2](/nc-2.png)

**注意**: 此处连接的URL应在末端添加 `/onebot/v11/ws` 否则将无法连接。因此此处正确的链接URL为 `ws://127.0.0.1:8082/onebot/v11/ws`

## 注意事项

- 请不要将 Amrita 的 WebUI **暴露给公网**，我们并没有对WebUI做过多的安全措施，请务必在部署 Amrita 项目时务必将 WebUI 配置为仅允许内网访问，否则您的数据**可能会被泄露**。

- 我们建议您配置 OneBot V11 协议实现 时，启用[连接Token验证](/amrita/config.html#env-%E9%85%8D%E7%BD%AE%E5%8F%82%E8%80%83)，并配置一个难以破解的Token，否则攻击者可能会利用此漏洞进行攻击，使用Bot账户发送违规消息。

- 确保 Amrita 项目和 OneBot V11 协议实现之间的网络连通性。如果在不同机器上部署，请确认防火墙设置允许相应端口通信。

- 在生产环境中，建议使用更安全的连接方式，如反向代理配合 HTTPS，避免明文传输敏感信息。

- 配置完成后，建议测试各种事件类型（如群消息、私聊消息、群成员变动等）是否能够正常接收和处理。

## 故障排除

- Q: 我在Docker容器中部署了Amrita/NapCat，但是OneBot V11协议实现无法连接Amrita

  A: 对于跨容器的连接请使用`容器网络别名`。

- Q: 连接建立后很快断开

  A: 检查 Amrita 和 OneBot V11 协议实现的日志，确认是否存在认证失败、心跳超时或其他错误。

- Q: 出现`connection rejected (403 Forbidden)`

  A: 确认 Amrita 项目中的 OneBot V11 协议实现配置正确，特别是 access token 是否匹配。

- Q: 无法建立 WebSocket 连接（出现`404`错误）

  A: 确认 Amrita 项目已正常启动并监听指定端口；检查 URL 地址格式是否正确（包括协议 ws/wss、IP、端口、路径等）；确认防火墙和安全组设置。

- Q: 部分事件无法正常接收

  A: 检查 OneBot V11 协议实现的配置，确认是否开启了相应事件的推送权限；检查 Amrita 项目的事件处理逻辑是否有异常。

- Q: 连接后出现认证失败错误

  A: 确认 Amrita 的 ACCESS_TOKEN 与 OneBot V11 协议实现中的 token 设置完全一致，区分大小写。
