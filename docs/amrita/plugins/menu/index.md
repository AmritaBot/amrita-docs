# Amrita Menu 文档

## API(`amrita.plugins.menu.models`)

```python
class MatcherData(pydantic.BaseModel):
    """功能模型"""

    name: str = pydantic.Field(..., description="功能名称")
    usage: str | None = pydantic.Field(default=None, description="功能用法")
    description: str = pydantic.Field(..., description="功能描述")
    related: str | None = pydantic.Field(description="父级菜单", default=None)
```

您只需要在您的Matcher的state传入`MatcherData`格式的`dict`，即可注册菜单。

```python
from nonebot import on_command, require

require("amrita.plugins.menu")
from amrita.plugins.menu.models import MatcherData

hello = on_command("hello",state=MatcherData(name="hello",description="你好，世界",usage="/hello"))

@hello.handle()
async def hello():
    await hello.finish("你好，世界")
```
