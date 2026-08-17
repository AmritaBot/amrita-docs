# AmritaBot Menu 文档

## API(`amrita.plugins.menu.models`)

```python
class MatcherData(pydantic.BaseModel):
    """功能模型"""

    name: str = pydantic.Field(..., description="功能名称")
    usage: str | list[str] | None = pydantic.Field(
        default=None, description="功能用法（str 单行或 list[str] 逐行展示）"
    )
    description: str = pydantic.Field(..., description="功能描述")
    related: str | None = pydantic.Field(description="父级菜单", default=None)
    show_if: str | None = pydantic.Field(
        default=None, description="权限节点，调用者不满足该节点则不展示该功能（None=总是展示）"
    )

    @property
    def usage_text(self) -> str:
        """渲染后的用法文本：list 逐行缩进展示，str 原样"""
```

- `usage` 支持字符串或多行列表（多行时会分行展示）
- `usage_text`：将 `usage` 渲染为展示文本的只读属性（`list` 时逐行缩进）
- `show_if` 指定展示该菜单项所需的权限节点（例如 `lp.admin`），未设置时对所有用户可见

### PluginData（插件模型）

```python
class PluginData:
    """插件模型"""

    metadata: PluginMetadata | None
    matchers: list[MatcherData]
    matcher_grouping: dict[str, list[MatcherData]]
```

- 由 `MenuManager` 构建：先登记所有无 `related` 的顶级菜单，再按 `related` 将子菜单挂载到对应父菜单下，最终形成 `matcher_grouping` 分组
- `metadata` 为插件的 `PluginMetadata`（可能为 `None`）

## 注册方式

您只需要在您的 Matcher 的 `state` 传入 `MatcherData` 格式的 `dict`，即可注册菜单。框架启动时会自动扫描各插件的 Matcher state（`matcher._default_state`），通过 `MatcherData.model_validate` 加载并分组。

```python
from nonebot import on_command, require

require("amrita.plugins.menu")
from amrita.plugins.menu.models import MatcherData

hello = on_command("hello", state=MatcherData(name="hello", description="你好，世界", usage="/hello"))

@hello.handle()
async def hello():
    await hello.finish("你好，世界")
```

## 指令

- `/menu`：展示菜单（按父级分组，受 `show_if` 权限过滤）
- `/menu --sudo`：以管理员身份展示**完整**菜单（需 `lp.admin` 权限）
- 环境变量 `DISABLE_BUILTIN_MENU=true` 可禁用内置菜单指令

## MenuManager

`amrita.plugins.menu.manager.MenuManager` 提供菜单的加载与渲染（单例 `menu_mamager`）：

- `load_menus()`：扫描所有插件 Matcher 的 state 并构建 `PluginData` 列表
- `print_menus()`：渲染菜单文本
