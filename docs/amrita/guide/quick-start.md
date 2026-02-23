# 5分钟快速开始

在本指南中，你将在5分钟内完成 Amrita 的安装和基本配置，创建你的第一个对话机器人。

## 前提条件

- Python 3.10+
- pip 包管理器
- 一个大语言模型 API Key（如 OpenAI、DeepSeek 等）

## 安装步骤

### 1. 安装 Amrita (CLI)

```bash
pip install amrita
```

### 2. 初始化项目

```bash
amrita create
# 根据提示创建完bot
cd your-bot # 替换为你实际的Bot文件夹
```

::: details

<pre>$ amrita create
<font color="#12488B">[?]</font> 项目名称: Test
<font color="#12488B">[?]</font> 项目描述 []: My first robot
<font color="#26A269">[+]</font> 正在创建项目 Test...
已初始化空的 Git 仓库于 /home/johnrichard/Test/.git/
<font color="#12488B">[?]</font> 您现在想要安装依赖吗? [Y/n]: y
<font color="#26A269">[+]</font> 正在安装依赖......
<font color="#12488B">[?]</font> 您想要使用虚拟环境吗（这通常是推荐的做法）? [Y/n]: y
Using CPython <font color="#2AA1B3">3.12.9</font>
Creating virtual environment at: <font color="#2AA1B3">.venv</font>
<font color="#AAAAAA">Resolved </font><font color="#AAAAAA"><b>154 packages</b></font> in 2.86s
      <font color="#26A269"><b>Built</b></font> test @ file:///home/user/Test
<font color="#AAAAAA">Prepared </font><font color="#AAAAAA"><b>17 packages</b></font> in 16.22s
<font color="#AAAAAA">Installed </font><font color="#AAAAAA"><b>149 packages</b></font> in 190ms
...
<font color="#26A269">[+]</font> 您的项目 Test 已完成创建!
<font color="#26A269">[+]</font> 您接下来可以运行以下命令启动项目:
<font color="#26A269">[+]</font>   cd Test
<font color="#26A269">[+]</font>   amrita run
$ 
</pre>

:::

### 3. 配置`.env`
```dotenv
PORT=8080
ONEBOT_ACCESS_TOKEN=your-onebot-access-token # 你需要设置一个安全的访问令牌，就像密码一样。
WEBUI_USE_RNAME=admin
WEBUI_PASSWORD=your-webui-password # 你需要为Amrita的WebUI设置一个安全的密码。
```

### 4. 启动机器人
```bash
amrita run
```


## 验证安装

访问`http://127.0.0.1:8080`可打开WebUI。

![WebUI](/webui.png)

如果成功打开，恭喜你！Amrita 已成功运行。

## 下一步

- [部署与配置](./installation.md)
- [基础配置](./configuration.md)  
- [创建第一个对话机器人](./first-bot.md)

> **提示**：遇到问题？查看我们的 [常见问题](../faq.md) 或 [获取社区支持](../community/support.md)。