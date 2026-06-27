# 管理仪表板组件库文档

AmritaBot WebUI 基于 [Tailwind CSS](https://tailwindcss.com/) 构建，使用 Utility-First 方式实现组件样式。以下列出常用的组件模式。

## 概述

AmritaBot 的管理仪表板使用 Tailwind CSS + Glassmorphism（毛玻璃）设计语言，内置亮色/暗色主题支持（通过 `dark:` 前缀类）。所有 Tailwind 类可直接在 Jinja2 模板中使用。

## 常用组件模式

### 仪表板容器

```html
<div class="dashboard-container">
  <!-- 侧边栏和主内容 -->
</div>
```

### 信息卡片（Glassmorphism 风格）

```html
<div
  class="glass-card p-5 flex items-center transition-transform hover:-translate-y-1 hover:shadow-lg"
>
  <div
    class="w-[50px] h-[50px] rounded-lg flex items-center justify-center mr-4 text-2xl flex-shrink-0 bg-blue-500/10 text-primary dark:text-primary"
  >
    <!-- 图标 -->
  </div>
  <div>
    <h3 class="text-2xl font-bold dark:text-gray-100">数值</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400">标签</p>
  </div>
</div>
```

### 图表容器

```html
<div
  class="h-[300px] bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-black/5 dark:border-white/5 p-2"
>
  <!-- Canvas 图表 -->
</div>
```

### 按钮

```html
<!-- 普通按钮 -->
<button
  class="px-4 py-2 rounded border bg-blue-500 text-white hover:bg-blue-600"
>
  确认
</button>

<!-- 玻璃态按钮 -->
<button
  class="p-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/20"
>
  操作
</button>
```

### 表单元素

```html
<input
  type="text"
  class="input-glass py-2 px-3 rounded"
  placeholder="请输入..."
/>
<select class="ml-1 input-glass py-1 px-2 text-sm">
  <option value="10">10</option>
</select>
```

## 主题切换

通过给 `body` 添加/移除 `.dark-mode` 类来切换主题，Tailwind `dark:` 前缀类会自动生效：

```javascript
document.body.classList.toggle("dark-mode");
```

## 布局

- `.main-content` — 右侧主内容区域
- `.expanded` — 侧边栏折叠时主内容扩展状态

### 基础组件

###### 卡片

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

###### 按钮

多种样式的按钮组件。

```html
<button>默认按钮</button>
<button class="btn-primary">主要按钮</button>
<button class="btn-danger">危险按钮</button>
<button class="btn-success">成功按钮</button>
```

###### 表格

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

###### 表单元素

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

###### 警告框

不同状态的提示信息。

```html
<div class="alert alert-success">成功提示</div>
<div class="alert alert-danger">错误提示</div>
<div class="alert alert-warning">警告提示</div>
```

### 信息展示组件

###### 信息网格

网格布局的信息容器。

```html
<div class="info-grid">
  <div class="info-card">...</div>
  <div class="info-card">...</div>
</div>
```

###### 信息卡片

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

###### 图表卡片

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

###### 状态指示器

用于显示状态信息。

```html
<span class="status-online">在线</span> <span class="status-offline">离线</span>
```

### 工具类

###### 加载条

页面顶部加载进度指示器。

```html
<div class="loading-bar"></div>
```

**状态类**：

- `.hidden` - 隐藏加载条

###### 刷新按钮

带有图标的刷新按钮。

```html
<button class="refresh-btn"><i class="fas fa-sync-alt"></i> 刷新</button>
```

### 响应式设计

组件库内置响应式设计，针对不同屏幕尺寸有相应的适配。

###### 断点

- 移动设备: `max-width: 768px`
- 小屏幕设备: `max-width: 480px`

###### 响应式行为

- 在移动设备上，侧边栏默认隐藏，可通过按钮展开
- 表格和卡片在小屏幕上调整布局
- 信息网格和图表网格在小屏幕上变为单列布局

### 使用示例

###### 基本布局结构

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

:::

::: details dash.css

### Dashboard CSS 目录

- [概述](#概述)
- [组件说明](#组件说明)
  - [统计卡片网格 (Stats Grid)](#统计卡片网格-stats-grid)
  - [图表网格 (Charts Grid)](#图表网格-charts-grid)
  - [最近活动 (Recent Activity)](#最近活动-recent-activity)
- [暗黑模式支持](#暗黑模式支持)
- [响应式设计](#响应式设计)

### 概述

Dashboard 组件库提供了一套完整的仪表板界面组件，包含统计卡片、图表展示和活动列表等功能模块。所有组件都支持暗黑模式和响应式设计。

### 组件说明

#### 统计卡片网格 (Stats Grid)

##### 结构说明

```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon [颜色类]">
      <!-- 图标 -->
    </div>
    <div class="stat-info">
      <h3>数值</h3>
      <p>标题</p>
    </div>
  </div>
  <!-- 更多统计卡片 -->
</div>
```

##### 可用颜色类

- `blue` - 蓝色主题
- `green` - 绿色主题
- `orange` - 橙色主题
- `purple` - 紫色主题

##### 特性

- 自适应网格布局
- 悬停动效
- 暗黑模式支持

#### 图表网格 (Charts Grid)

##### 结构说明

```html
<div class="charts-grid">
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">图表标题</div>
      <div class="chart-actions">
        <!-- 操作按钮 -->
      </div>
    </div>
    <div class="chart-container">
      <!-- 图表内容 -->
    </div>
  </div>
</div>
```

##### 布局选项

- `charts-grid` 默认使用 2:1 的宽窄比例布局
- 支持单列或双列布局

#### 最近活动 (Recent Activity)

##### 结构说明

```html
<div class="recent-activity">
  <ul class="activity-list">
    <li class="activity-item">
      <div class="activity-icon [颜色类]">
        <!-- 图标 -->
      </div>
      <div class="activity-content">
        <div class="activity-title">活动标题</div>
        <div class="activity-desc">活动描述</div>
        <div class="activity-time">时间</div>
      </div>
    </li>
  </ul>
  <div class="activity-pagination">
    <!-- 分页控件 -->
  </div>
</div>
```

##### 可用颜色类

- `yellow`, `purple`, `red`, `blue`, `green`, `orange`

##### 分页组件

包含页面信息显示、页面大小选择器和分页按钮。

### 暗黑模式支持

所有组件都支持暗黑模式，需要在 `body` 元素上添加 `dark-mode` 类：

```javascript
// 切换暗黑模式
document.body.classList.toggle("dark-mode");
```

### 响应式设计

#### 断点说明

- **768px 以下**: 单列布局，分页控件垂直排列
- **480px 以下**: 完全移动端优化布局
- **769px 以上**: 四列统计卡片网格

:::

## 浏览器支持

此组件库支持所有现代浏览器，包括：

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 注意事项

1. 使用前需要引入 Font Awesome 图标库(默认在base.html已引入)
2. 暗色主题需要手动添加`.dark-mode`类到 body 元素
3. 侧边栏折叠功能需要自行实现 JavaScript 逻辑
4. 图表组件需要额外引入图表库(如 Chart.js、ECharts 等)
5. 在 base.html 中已经引入了样式文件，所以不需要再在 extra_head 中重复引入
