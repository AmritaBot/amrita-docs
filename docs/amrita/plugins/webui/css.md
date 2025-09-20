# 管理仪表板组件库文档

## 目录

- [概述](#概述)
- [主题与变量](#主题与变量)
- [布局组件](#布局组件)
  - [仪表板容器](#仪表板容器)
  - [侧边栏](#侧边栏)
  - [主内容区域](#主内容区域)
  - [顶部导航栏](#顶部导航栏)
- [基础组件](#基础组件)
  - [卡片](#卡片)
  - [按钮](#按钮)
  - [表格](#表格)
  - [表单元素](#表单元素)
  - [警告框](#警告框)
- [信息展示组件](#信息展示组件)
  - [信息网格](#信息网格)
  - [信息卡片](#信息卡片)
  - [图表卡片](#图表卡片)
  - [状态指示器](#状态指示器)
- [导航组件](#导航组件)
  - [菜单项](#菜单项)
  - [子菜单](#子菜单)
  - [标签页](#标签页)
- [工具类](#工具类)
- [响应式设计](#响应式设计)
- [使用示例](#使用示例)

## 概述

这是 Amrita 的管理仪表板组件库，提供完整的亮色/暗色主题支持，响应式设计和丰富的 UI 组件。所有组件都采用 CSS 变量实现主题定制。

## 主题与变量

组件库使用 CSS 变量实现主题系统，支持亮色和暗色模式切换。

### 亮色主题变量

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2980b9;
  --accent-color: #1abc9c;
  --text-color: #333;
  --text-light: #fff;
  --bg-color: #f8f9fa;
  --sidebar-bg: #2c3e50;
  --sidebar-hover: #34495e;
  --header-height: 60px;
  --transition-speed: 0.3s;
}
```

### 暗色主题变量

```css
:root {
  --dark-bg-color: #1a1a1a;
  --dark-text-color: #f0f0f0;
  --dark-sidebar-bg: #121212;
  --dark-sidebar-hover: #1e1e1e;
  --dark-header-bg: #2d2d2d;
  --dark-card-bg: #252525;
  --dark-button-bg: #3b424b;
  --dark-border-color: #444;
}
```

### 主题切换

通过给 body 添加/移除`.dark-mode`类来切换主题：

```javascript
document.body.classList.toggle("dark-mode");
```

## 布局组件

### 仪表板容器

仪表板的主要容器，采用 flex 布局。

```html
<div class="dashboard-container">
  <!-- 侧边栏和主内容 -->
</div>
```

### 侧边栏

左侧导航栏，可折叠。

```html
<aside class="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-logo">
      <!-- 图标或logo -->
    </div>
    <div class="sidebar-title">标题</div>
  </div>
  <nav class="sidebar-menu">
    <!-- 菜单项 -->
  </nav>
</aside>
```

**状态类**：

- `.collapsed` - 侧边栏折叠状态

### 主内容区域

右侧主要内容区域。

```html
<main class="main-content">
  <!-- 顶部导航栏和内容 -->
</main>
```

**状态类**：

- `.expanded` - 侧边栏折叠时主内容扩展状态

### 顶部导航栏

顶部固定导航栏。

```html
<header class="topbar">
  <div class="topbar-left">
    <button class="toggle-sidebar">
      <i class="fas fa-bars"></i>
    </button>
    <h1 class="topbar-title">页面标题</h1>
  </div>
  <div class="topbar-right">
    <!-- 用户信息和操作 -->
  </div>
</header>
```

## 基础组件

### 卡片

通用卡片容器，用于内容分组。

```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">卡片标题</h2>
    <!-- 可选操作按钮 -->
  </div>
  <!-- 卡片内容 -->
</div>
```

### 按钮

多种样式的按钮组件。

```html
<button>默认按钮</button>
<button class="btn-primary">主要按钮</button>
<button class="btn-danger">危险按钮</button>
<button class="btn-success">成功按钮</button>
```

### 表格

数据表格样式。

```html
<table>
  <thead>
    <tr>
      <th>表头1</th>
      <th>表头2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>数据1</td>
      <td>数据2</td>
    </tr>
  </tbody>
</table>
```

### 表单元素

输入框、选择框和文本域。

```html
<div class="form-group">
  <label class="form-label">输入框</label>
  <input type="text" placeholder="请输入内容" />
</div>

<div class="form-group">
  <label class="form-label">选择框</label>
  <select>
    <option>选项1</option>
    <option>选项2</option>
  </select>
</div>

<div class="form-group">
  <label class="form-label">文本域</label>
  <textarea placeholder="请输入内容"></textarea>
</div>
```

### 警告框

不同状态的提示信息。

```html
<div class="alert alert-success">成功提示</div>
<div class="alert alert-danger">错误提示</div>
<div class="alert alert-warning">警告提示</div>
```

## 信息展示组件

### 信息网格

网格布局的信息容器。

```html
<div class="info-grid">
  <div class="info-card">...</div>
  <div class="info-card">...</div>
</div>
```

### 信息卡片

用于展示键值对信息。

```html
<div class="info-card">
  <h4>卡片标题</h4>
  <div class="info-item">
    <span class="info-label">标签</span>
    <span class="info-value">值</span>
  </div>
  <!-- 更多信息项 -->
</div>
```

### 图表卡片

用于放置图表或数据可视化。

```html
<div class="chart-card">
  <div class="chart-container">
    <!-- 图表内容 -->
    <div class="gauge-container">
      <div class="gauge-title">标题</div>
      <div id="gauge"></div>
      <div class="gauge-value">值</div>
    </div>
  </div>
</div>
```

### 状态指示器

用于显示状态信息。

```html
<span class="status-online">在线</span> <span class="status-offline">离线</span>
```

## 导航组件

### 菜单项

侧边栏菜单项。

```html
<div class="menu-item">
  <a href="#" class="menu-link">
    <span class="menu-icon"><i class="fas fa-icon"></i></span>
    <span class="menu-text">菜单项</span>
    <span class="menu-arrow"><i class="fas fa-angle-right"></i></span>
  </a>
</div>
```

**状态类**：

- `.active` - 当前激活的菜单项
- `.open` - 展开的菜单项（对于有子菜单的项）

### 子菜单

菜单项下的子菜单。

```html
<div class="submenu">
  <div class="submenu-item">
    <a href="#" class="submenu-link">子菜单项</a>
  </div>
  <!-- 更多子菜单项 -->
</div>
```

**状态类**：

- `.active` - 当前激活的子菜单项

### 标签页

标签页导航组件。

```html
<div class="tabs-container">
  <div class="tab active">标签1</div>
  <div class="tab">标签2</div>
</div>

<div class="tab-content active">内容1</div>
<div class="tab-content">内容2</div>
```

## 工具类

### 加载条

页面顶部加载进度指示器。

```html
<div class="loading-bar"></div>
```

**状态类**：

- `.hidden` - 隐藏加载条

### 刷新按钮

带有图标的刷新按钮。

```html
<button class="refresh-btn"><i class="fas fa-sync-alt"></i> 刷新</button>
```

## 响应式设计

组件库内置响应式设计，针对不同屏幕尺寸有相应的适配。

### 断点

- 移动设备: `max-width: 768px`
- 小屏幕设备: `max-width: 480px`

### 响应式行为

- 在移动设备上，侧边栏默认隐藏，可通过按钮展开
- 表格和卡片在小屏幕上调整布局
- 信息网格和图表网格在小屏幕上变为单列布局

## 使用示例

### 基本布局结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>管理控制台</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <style>
      /* 组件库CSS内容 */
    </style>
  </head>
  <body>
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="sidebar-title">管理控制台</div>
        </div>
        <nav class="sidebar-menu">
          <!-- 菜单项 -->
        </nav>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <!-- 顶部导航 -->
        </header>

        <div class="loading-bar"></div>

        <div class="content">
          <!-- 页面内容 -->
        </div>
      </main>
    </div>

    <script>
      // 主题切换，哦当然这里都在base.html里，这里就不重复了
    </script>
  </body>
</html>
```

## 浏览器支持

此组件库支持所有现代浏览器，包括：

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 注意事项

1. 使用前需要引入 Font Awesome 图标库
2. 暗色主题需要手动添加`.dark-mode`类到 body 元素
3. 侧边栏折叠功能需要自行实现 JavaScript 逻辑
4. 图表组件需要额外引入图表库(如 Chart.js、ECharts 等)
