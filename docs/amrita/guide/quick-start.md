# 5分钟快速开始

在本指南中，你将在5分钟内完成 Amrita 的安装和基本配置，创建你的第一个对话机器人。

## 前提条件

- Python 3.10+
- pip 包管理器
- 一个大语言模型 API Key（如 OpenAI、DeepSeek 等）

## 安装步骤

### 0. 安装 amctl 工具

```bash
pip install amctl
```

> `amctl` 是 Amrita 的项目脚手架工具，用于创建和管理项目。

### 1. 安装项目模板

```bash
pip install amctl-template-ambot
```

### 2. 创建项目

```bash
amctl create -t ambot
# 根据提示完成创建（输入项目名称、描述等）
cd your-bot  # 进入项目目录
```

::: details 创建过程示例

<pre>$ amctl create -t ambot
<font color="#12488B">[?]</font> 项目名称: Test
<font color="#12488B">[?]</font> 描述 []: My first robot
<font color="#12488B">[?]</font> 选择一个许可证:
  [1] MIT
  [2] Apache-2.0
  [3] GPL-3.0
  [4] None (skip)
<font color="#26A269">[+]</font> 正在创建项目 Test (v1.3.2)...
<font color="#26A269">[+]</font> 项目 'Test' 创建于 /home/user/Test

  cd Test
<font color="#12488B">[?]</font> 是否现在安装依赖? [Y/n]: y
<font color="#26A269">[+]</font> 正在运行 uv sync...
<font color="#AAAAAA">Resolved </font><font color="#AAAAAA"><b>154 packages</b></font> in 2.86s
<font color="#26A269">[+]</font> 依赖安装完成。
$ 
</pre>

:::

### 3. 配置`.env`

```dotenv
PORT=8080
ONEBOT_ACCESS_TOKEN=your-onebot-access-token # 你需要设置一个安全的访问令牌，就像密码一样。
WEBUI_USER_NAME=admin
WEBUI_PASSWORD=your-webui-password # 你需要为Amrita的WebUI设置一个安全的密码。
```

### 4. 启动机器人

```bash
uv run ambot run
```

> **提示**：`ambot` 命令来自 `ambot-inlinectl` 包（项目依赖中已包含），通过 `uv run` 调用。也可使用 `amctl man run` 快捷启动。激活虚拟环境 (`source .venv/bin/activate`) 后可直接 `ambot run`。

## 验证安装

访问`http://127.0.0.1:8080`可打开WebUI。

<!-- TODO: WebUI首页截图，显示成功运行后的主界面 -->

如果成功打开，恭喜你！Amrita 已成功运行。

## 下一步

- [部署与配置](./installation.md)
- [基础配置](./configuration.md)
- [创建第一个对话机器人](./first-bot.md)

> **提示**：遇到问题？查看我们的 [常见问题](../faq.md) 或 [获取社区支持](../community/support.md)。
