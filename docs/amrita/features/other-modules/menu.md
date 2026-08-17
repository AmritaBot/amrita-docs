# AmritaBot Menu 文档

## API(`amrita.plugins.menu.models`)

```python
class MatcherData(pydantic.BaseModel):
    """功能模型"""

    name: str = pydantic.Field(..., description="功能名称")
    usage: str | list[str] | None = pydantic.Field(default=None, description="功能用法")
    description: str = pydantic.Field(..., description="功能描述")
    related: str | None = pydantic.Field(description="父级菜单", default=None)
    show_if: str | None = pydantic.Field(description="显示所需权限节点（如 lp.admin），未设置则始终显示", default=None)
```

- `usage` 支持字符串或多行列表（多行时会分行展示）
- `show_if` 指定展示该菜单项所需的权限节点（例如 `lp.admin`），未设置时对所有用户可见

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
