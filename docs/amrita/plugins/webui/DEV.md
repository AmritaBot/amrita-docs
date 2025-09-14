# WebUI API 文档

## 概述

Amrita 的 WebUI 模块提供了一个基于 FastAPI 的 Web 管理界面，允许用户通过浏览器管理机器人。该模块包含了一套完整的 API 和页面装饰器，方便开发者快速创建新的管理页面。

## 核心组件

### PageContext 类

`PageContext` 是传递给每个页面处理函数的上下文对象，包含了处理请求所需的所有信息。

#### 属性

- `request`: FastAPI 的 Request 对象，包含 HTTP 请求信息
- `sidebar`: 侧边栏菜单项列表
- `auth`: AuthManager 实例，用于处理认证相关操作
- `token_manager`: TokenManager 实例，用于管理访问令牌

#### 方法

- `get_sidebar()`: 返回侧边栏数据的字典列表表示

### on_page 装饰器

`on_page` 是一个装饰器函数，用于注册新的 Web UI 页面。它会自动处理侧边栏管理、页面激活状态设置等通用功能。

#### 函数签名

```python
def on_page(
    path: str,
    page_name: str,
    category: str = "其他功能",
    icon: str | None = None
)
```

#### 参数说明

- `path` (str): 页面的 URL 路径
- `page_name` (str): 页面名称，将显示在侧边栏中
- `category` (str, optional): 页面所属的分类，默认为"其他功能"
- `icon` (str | None, optional): 页面图标，用于在侧边栏中显示

#### 返回值

返回一个装饰器函数，用于装饰页面处理函数。

#### 使用示例

```python
@on_page("/my-page", "我的页面", "自定义分类", "fas fa-star")
async def my_page(ctx: PageContext) -> HTMLResponse:
    # 处理页面逻辑
    return templates.TemplateResponse(
        "my_page.html",
        {
            "request": ctx.request,
            "sidebar_items": ctx.get_sidebar(),
            # 其他模板变量
        }
    )
```

在页面处理函数中，可以通过 `ctx` 参数访问请求信息、侧边栏数据和认证管理器。

## 侧边栏管理

侧边栏是 WebUI 的重要组成部分，用于导航不同的功能页面。

### 数据结构

#### SideBarItem

表示侧边栏中的单个菜单项。

- `name`: 菜单项名称
- `icon`: 图标类名（可选）
- `url`: 菜单项链接（可选）
- `active`: 是否处于激活状态

#### SideBarCategory

表示侧边栏中的分类。

- `name`: 分类名称
- `icon`: 分类图标（可选）
- `url`: 分类链接（可选）
- `active`: 是否处于激活状态
- `children`: 该分类下的子菜单项列表

### SideBarManager

SideBarManager 是一个单例类，用于管理整个应用的侧边栏。

#### 主要方法

- `get_sidebar()`: 获取侧边栏对象
- `get_sidebar_dump()`: 获取侧边栏的字典表示列表
- `add_sidebar_category(item: SideBarCategory)`: 添加新的侧边栏分类
- `add_sidebar_item(category: str, item: SideBarItem)`: 向指定分类添加菜单项

## 认证系统

WebUI 包含一个基于 JWT 的认证系统。

### AuthManager

AuthManager 提供用户认证相关功能。

**主要方法**

- `authenticate_user(username: str, password: str)`: 验证用户凭据
- `create_token(username: str, expires_delta: timedelta)`: 创建访问令牌
- `check_current_user(request: Request)`: 检查当前用户是否已认证

### TokenManager

TokenManager 负责管理访问令牌。

## 页面开发示例

以下是一个完整的页面开发示例：

```python
from fastapi.responses import HTMLResponse
from amrita.plugins.webui.API import on_page, PageContext
from amrita.plugins.webui.service.main import templates

@on_page("/dashboard", "仪表板", "控制台", "fa fa-dashboard")
async def dashboard(ctx: PageContext) -> HTMLResponse:
    # 使用模板渲染页面
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": ctx.request,
            "sidebar_items": ctx.get_sidebar(),
            "custom_data": get_some_data(),
        }
    )
```

对应的模板文件 (dashboard.html) 示例：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>仪表板 - Amrita 管理后台</title>
    {% include "components/head.html" %}
  </head>
  <body>
    <div class="wrapper">
      {% include "components/sidebar.html" %}
      <div class="main-panel">
        {% include "components/header.html" %}
        <div class="content">
          <div class="container-fluid">
            <h1>欢迎使用 Amrita 管理后台</h1>
            <!-- 页面内容 -->
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

在模板中，可以通过 `sidebar_items` 变量访问侧边栏数据：

```html
<!-- 侧边栏渲染示例 -->
{% for category in sidebar_items %}
<li class="nav-item {% if category.active %}active{% endif %}">
  <a class="nav-link" href="{{ category.url or '#' }}">
    {% if category.icon %}
    <i class="{{ category.icon }}"></i>
    {% endif %}
    <p>{{ category.name }}</p>
  </a>
  {% if category.children %}
  <ul class="nav">
    {% for item in category.children %}
    <li class="nav-item {% if item.active %}active{% endif %}">
      <a class="nav-link" href="{{ item.url }}">
        {% if item.icon %}
        <i class="{{ item.icon }}"></i>
        {% endif %}
        <span>{{ item.name }}</span>
      </a>
    </li>
    {% endfor %}
  </ul>
  {% endif %}
</li>
{% endfor %}
```

## 最佳实践

1. **页面组织**: 将相关功能的页面放在同一分类下，提高用户体验
2. **权限控制**: 在页面处理函数中使用 `ctx.auth.check_current_user()` 验证用户权限
3. **错误处理**: 为页面添加适当的错误处理机制
4. **性能优化**: 对于数据量大的页面，考虑添加分页或懒加载功能

## 前端API

请参考[前端API](./frontendAPI.md)