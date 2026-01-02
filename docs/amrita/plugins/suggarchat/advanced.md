# Sugarchat API 文档

## 适配器

什么是适配器？
适配器是 SuggarChat 与模型接口沟通的桥梁，协议依靠适配器

### 规范

适配器规范定义了适配器应该实现的功能，用作与模型沟通的桥梁，在 3.2.0 进行了重构。继承自 ModelAdapter 时会自动注册模型适配器，您无需手动实现注册。

exapmle:

```python
from nonebot import require
from typing import Any, Iterable
require("amrita.plugins.chat")

from amrita.plugins.chat.API import ModelAdapter, UniResponse

class YourAdapter(ModelAdapter):
    # 需要实现call_api方法以及get_adapter_protocol()静态方法

    async def call_api(self, messages: Iterable[Any]) -> UniResponse:
        ...

    async def call_tools(self, tools: Iterable[Any], tool_choice: ...) -> UniResponse:
        ...
        # 可选实现

    def get_adapter_protocol() -> str | tuple[str, ...]:
        ...

```

## SuggarMatcher

- Suggar 聊天事件钩子实现了一个简单的依赖注入 Matcher 功能，可以注册处理器函数，并进行额外处理，可以实现对于 SuggarChat 功能的扩展。

```python
from nonebot import logger
from nonebot.plugin import require

require("amrita.plugins.chat")
from amrita.plugins.chat.event import (
    BeforeChatEvent,
    BeforePokeEvent,
    ChatEvent,
    PokeEvent,
)
from amrita.plugins.chat.on_event import (
    on_before_chat,
    on_before_poke,
    on_chat,
    on_poke,
)


@on_poke(priority=10).handle()
async def _(event: PokeEvent):
    logger.info("戳了！")
    logger.info(event)


@on_before_poke(priority=10).handle()
async def _(event: BeforePokeEvent):
    logger.info("现在在获取模型的回复之前！")
    logger.info(event)


@on_before_chat(priority=10).handle()
async def _(event: BeforeChatEvent):
    logger.info("现在在获取模型的回复之前！")
    logger.info(event)


@on_chat(priority=10).handle()
async def _(event: ChatEvent):
    logger.info("收到聊天事件!")
    logger.info(event)


```

## Function Calling(`amrita.plugins.chat.API`)

请见[Function Calling](./function_calling)一章
