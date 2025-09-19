# Amrita CSS组件库文档

本文档详细介绍了Amrita项目Web界面中使用的CSS组件和样式规范。

## 目录

1. [颜色变量](#颜色变量)
2. [布局组件](#布局组件)
   - [仪表板容器](#仪表板容器)
   - [侧边栏](#侧边栏)
   - [顶部导航栏](#顶部导航栏)
   - [主要内容区](#主要内容区)
3. [UI组件](#ui组件)
   - [卡片](#卡片)
   - [按钮](#按钮)
   - [表单元素](#表单元素)
   - [表格](#表格)
   - [警告框](#警告框)
   - [标签页](#标签页)
   - [信息卡片](#信息卡片)
   - [图表组件](#图表组件)
   - [日志组件](#日志组件)
4. [功能组件](#功能组件)
   - [加载条](#加载条)
5. [响应式设计](#响应式设计)

## 颜色变量

Amrita使用CSS变量来管理颜色，支持浅色和深色主题。

### 浅色主题变量

```css
:root {
  --primary-color: #3498db;      /* 主色调 */
  --secondary-color: #2980b9;    /* 辅助色调 */
  --accent-color: #1abc9c;       /* 强调色 */
  --text-color: #333;            /* 文字颜色 */
  --text-light: #fff;            /* 浅色文字 */
  --bg-color: #f8f9fa;           /* 背景颜色 */
  --sidebar-bg: #2c3e50;         /* 侧边栏背景 */
  --sidebar-hover: #34495e;      /* 侧边栏悬停背景 */
  --header-height: 60px;         /* 顶部栏高度 */
  --transition-speed: 0.3s;      /* 过渡动画速度 */
}
```

### 深色主题变量

```css
:root {
  --dark-bg-color: #1a1a1a;         /* 深色背景 */
  --dark-text-color: #f0f0f0;       /* 深色文字 */
  --dark-sidebar-bg: #121212;       /* 深色侧边栏背景 */
  --dark-sidebar-hover: #1e1e1e;    /* 深色侧边栏悬停 */
  --dark-header-bg: #2d2d2d;        /* 深色顶部栏背景 */
  --dark-card-bg: #252525;          /* 深色卡片背景 */
  --dark-button-bg: #3b424b;        /* 深色按钮背景 */
  --dark-border-color: #444;        /* 深色边框 */
}
```

## 布局组件

### 仪表板容器

仪表板容器是整个页面的根布局容器，使用Flex布局。

```html
<div class="dashboard-container">
  <!-- 侧边栏和主要内容 -->
</div>
```

```css
.dashboard-container {
  display: flex;
  min-height: 100vh;
}
```

### 侧边栏

侧边栏位于页面左侧，包含导航菜单。

```html
<div class="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-logo"></div>
    <div class="sidebar-title">Amrita</div>
  </div>
  <div class="sidebar-menu">
    <div class="menu-item">
      <a class="menu-link" href="#">
        <div class="menu-icon">图标</div>
        <div class="menu-text">菜单项</div>
        <div class="menu-arrow">></div>
      </a>
      <div class="submenu">
        <div class="submenu-item">
          <a class="submenu-link" href="#">子菜单项</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.sidebar {
  width: 250px;
  background: var(--sidebar-bg);
  color: var(--text-light);
  transition: width var(--transition-speed);
  overflow-y: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 60px;
}
```

### 顶部导航栏

顶部导航栏位于页面顶部，包含页面标题和用户操作按钮。

```html
<div class="topbar">
  <div class="topbar-left">
    <button class="toggle-sidebar">☰</button>
    <div class="topbar-title">页面标题</div>
  </div>
  <div class="topbar-right">
    <button class="theme-toggle">🌙</button>
    <div class="user-info">
      <div class="user-avatar">U</div>
      <div class="user-name">用户名</div>
      <button class="logout-btn">⇥</button>
    </div>
  </div>
</div>
```

```css
.topbar {
  height: var(--header-height);
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 999;
}
```

### 主要内容区

主要内容区位于侧边栏右侧，包含页面的主要内容。

```html
<div class="main-content">
  <div class="content">
    <!-- 页面内容 -->
  </div>
</div>
```

```css
.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left var(--transition-speed);
}

.main-content.expanded {
  margin-left: 60px;
}
```

## UI组件

### 卡片

卡片是页面中最基本的容器组件，用于组织相关内容。

```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">卡片标题</h2>
  </div>
  <div class="card-body">
    <!-- 卡片内容 -->
  </div>
</div>
```

```css
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}
```

### 按钮

提供多种样式的按钮组件。

```html
<button class="btn-primary">主要按钮</button>
<button class="btn-danger">危险按钮</button>
<button class="btn-success">成功按钮</button>
<button class="refresh-btn">刷新按钮</button>
```

```css
button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.btn-danger:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}

.btn-success {
  background-color: #27ae60;
  color: white;
  border-color: #27ae60;
}

.btn-success:hover {
  background-color: #219653;
  border-color: #219653;
}

.refresh-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.3s;
}
```

### 表单元素

包含输入框、选择框、文本域等表单组件。

```html
<div class="form-group">
  <label class="form-label">标签</label>
  <input type="text" class="form-input">
  <select class="form-select">
    <option>选项1</option>
    <option>选项2</option>
  </select>
  <textarea class="form-textarea"></textarea>
</div>
```

```css
input,
select,
textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(26, 188, 156, 0.25);
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
```

### 表格

用于展示结构化数据的表格组件。

```html
<table>
  <thead>
    <tr>
      <th>列1</th>
      <th>列2</th>
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

```css
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

table th,
table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

table tr:last-child td {
  border-bottom: none;
}

table tr:nth-child(even) {
  background-color: #f8f9fa;
}
```

### 警告框

用于显示不同类型的消息提示。

```html
<div class="alert alert-success">成功消息</div>
<div class="alert alert-danger">错误消息</div>
<div class="alert alert-warning">警告消息</div>
```

```css
.alert {
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}
```

### 标签页

用于在同一区域展示不同内容的标签页组件。

```html
<div class="tabs-container">
  <div class="tab active">标签1</div>
  <div class="tab">标签2</div>
</div>
<div class="tab-content active">
  <!-- 标签1内容 -->
</div>
<div class="tab-content">
  <!-- 标签2内容 -->
</div>
```

```css
.tabs-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  color: #555;
}

.tab.active {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
```

### 信息卡片

用于展示关键信息的卡片组件。

```html
<div class="info-grid">
  <div class="info-card">
    <div class="card-header">
      <h3 class="card-title">信息标题</h3>
    </div>
    <div class="info-item">
      <span class="info-label">标签</span>
      <span class="info-value">值</span>
    </div>
  </div>
</div>
```

```css
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #777;
  font-weight: 500;
}

.info-value {
  font-weight: 600;
}
```

### 图表组件

用于展示图表数据的容器组件。

```html
<div class="charts-grid">
  <div class="chart-card">
    <div class="card-header">
      <h3 class="card-title">图表标题</h3>
    </div>
    <div class="chart-container">
      <div class="gauge-container">
        <div class="gauge-title">图表说明</div>
        <div class="gauge-value">值</div>
      </div>
    </div>
  </div>
</div>
```

```css
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 10px;
}

.chart-container {
  margin: 35px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gauge-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #777;
}

.gauge-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  margin-top: 10px;
}
```

### 日志组件

用于展示日志信息的组件。

```html
<div class="log-container">
  <div class="log-header">
    <h3 class="log-title">日志标题</h3>
  </div>
  <div class="log-content">
    <div class="log-line">
      <span class="log-timestamp">时间戳</span>
      <span class="log-info">日志信息</span>
    </div>
  </div>
</div>
```

```css
.log-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-top: 20px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.log-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

.log-content {
  background: #f8f9fa;
  border-radius: 5px;
  padding: 15px;
  font-family: "Courier New", Courier, monospace;
  font-size: 13px;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
  color: #333;
}

.log-line {
  margin-bottom: 5px;
}

.log-line:last-child {
  margin-bottom: 0;
}

.log-timestamp {
  color: #6c757d;
}

.log-info {
  color: #2c3e50;
}

.log-warning {
  color: #f39c12;
}

.log-error {
  color: #e74c3c;
}
```

## 功能组件

### 加载条

页面加载时显示的进度条组件。

```html
<div class="loading-bar"></div>
```

```css
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--secondary-color)
  );
  z-index: 9999;
  transition: width 0.3s ease;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.loading-bar.hidden {
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

## 响应式设计

Amrita使用媒体查询实现响应式设计，适配不同屏幕尺寸。

```css
@media (max-width: 768px) {
  /* 移动端样式 */
  .sidebar {
    width: 0;
    overflow-x: hidden;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  /* 小屏幕移动端样式 */
  .topbar {
    padding: 0 10px;
  }
  
  .user-name {
    display: none;
  }
}

@media (min-width: 769px) {
  /* 桌面端样式 */
}
```

## 深色主题支持

所有组件都支持深色主题，通过添加`body.dark-mode`类来激活。

```css
body.dark-mode .card {
  background: var(--dark-card-bg);
  border: 1px solid var(--dark-border-color);
}

body.dark-mode .card-title {
  color: var(--accent-color);
}

/* 其他深色主题样式 */
```

要切换深色主题，只需在body元素上添加或移除`dark-mode`类。