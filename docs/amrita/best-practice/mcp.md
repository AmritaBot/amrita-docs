# MCP（Model Context Protocol）集成指南

## 概述

MCP（Model Context Protocol）是Amrita框架中用于集成外部AI服务和工具的协议。通过MCP，您可以将Dify等LLM应用平台或其他AI服务接入Amrita框架，从而扩展Agent的能力。本文档提供了MCP服务的具体配置和使用方法。

## 重要说明：Amrita的MCP角色

- **Amrita是MCP的消费者**：框架本身实现了MCP客户端功能，可以连接和使用各种MCP服务器提供的工具与资源。
- **框架不提供mcp-server**：Amrita本体不内置或捆绑特定的MCP服务器。您需要自行配置或部署对应的MCP服务器来桥接外部服务（如Dify）。
- **灵活接入**：您可以选择适合的社区或自建的MCP服务器项目进行接入。

## 配置MCP服务器的三种方法

在Amrita中为您的Agent或技能添加MCP服务器支持，主要有以下三种方式：

### 方法一：通过配置文件添加

编辑Amrita的聊天模块配置文件（`config/chat/config.toml`）

```toml
[llm_config.tools]
# 在此处添加MCP服务器的脚本/地址
agent_mcp_server_scripts = [
   "./mcp_servers/dify_connector.py",
   "./mcp_servers/custom_tool_server.py",
   "http://your-mcp-server-address/sse"
]
```

### 方法二：通过Amrita指令添加（动态配置）

在已运行的Amrita机器人实例中，可以使用管理指令动态挂载MCP服务器：

```text
/mcp add your-mcp-server-script
```

### 方法三：通过Web UI添加（图形化配置）

Amrita内置了WebUI，提供图形化配置方式：

1. 登录管理后台
2. 导航到 `聊天管理` -> `MCP 服务器`
3. 点击 "添加 MCP 服务器" 或类似按钮
4. 填写MCP服务器的脚本/地址，并保存

## 实际案例：集成Dify平台

### 什么是Dify集成

Dify是一个功能强大的LLM应用开发平台，这也是我们用来给Amrita具体项目提供功能扩展的方式，Amrita框架支持通过MCP与其集成，从而利用Dify平台托管的模型与应用能力。

### 为什么选择MCP集成Dify

MCP提供了一个标准化、松耦合的集成方式：

- **关注点分离**：业务逻辑（Amrita）与模型服务（Dify）通过清晰协议通信
- **灵活性**：可独立升级或替换Dify侧的MCP服务器，不影响Amrita应用
- **可扩展性**：同一套Amrita应用可通过MCP接入多种后端服务，而不仅仅是Dify
- **复用性**：任何实现了MCP标准的Dify桥接服务都可被Amrita使用

## 最佳实践建议

- **安全性**：目前Amrita并没有对MCP服务进行身份验证支持，请不要将外部服务（如Dify）暴露到公网，以免被攻击。
- **错误处理**：在您的技能代码中，对通过MCP调用外部服务的操作做好错误处理和降级方案。
- **性能监控**：关注MCP服务器的资源使用情况以及到外部服务的网络延迟。
- **社区资源**：在探索具体实现时，可以关注Amrita和MCP相关社区，获取现成的桥接方案或灵感。

## 故障排除

### 常见问题

1. **连接失败**：确认MCP服务器进程正在运行、监听正确的地址/端口
2. **认证错误**：检查API密钥和认证配置是否正确
3. **工具未找到**：确认MCP服务器已成功注册，工具名称拼写正确

### 调试步骤

1. 检查MCP服务器是否正常启动并注册了工具
2. 验证配置文件中的路径是否正确
3. 查看Amrita日志中的MCP相关错误信息
4. 使用`config/chat/config.toml`中的调试选项启用详细日志

## 总结

通过MCP协议，Amrita框架能够以灵活、标准化的方式接入各种外部AI服务的的能力，您可以根据项目需求选择最合适的配置和管理方式。
