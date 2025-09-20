# Amrita WebUI API 文档

本文档包含前端 JavaScript API 和后端网络 API 请求接口的详细说明，用于 Amrita WebUI 页面开发。

## 1. 前端 API (JavaScript)

以下是在 base.html 模板中定义的可以直接在页面中调用的 JavaScript 函数和对象。

### 1.1 加载状态管理

```javascript
// 显示加载状态
showLoading();

// 更新加载进度 (0-100)
updateLoading(progress);

// 隐藏加载状态
hideLoading();
```

### 1.2 主题管理

```javascript
// 切换主题 (亮色/暗色)
toggleTheme();

// 设置主题 ("light" 或 "dark")
setTheme(theme);

// 检测系统主题偏好
detectSystemTheme();

// 初始化主题 (从localStorage或系统偏好)
initTheme();
```

### 1.3 侧边栏控制

侧边栏通过 CSS 类和 JavaScript 事件自动控制折叠和展开，无需直接调用 API。

### 1.4 认证相关

```javascript
// 获取一次性令牌 (用于某些需要额外认证的操作)
async function getOnetimeToken()
```

### 1.5 工具函数

```javascript
// 检查令牌是否过期 (通过URL参数)
checkTokenExpired();
```

## 2. 网络 API 请求

以下是后端提供的 RESTful API 接口，可通过 AJAX 请求调用。

### 2.1 认证接口

#### 获取一次性令牌

- **URL**: `GET /api/auth/otk`
- **说明**: 获取一次性令牌，用于某些需要额外认证的操作
- **请求头**: 需要包含有效的 access_token cookie
- **响应**:
  ```json
  {
    "token": "一次性令牌字符串"
  }
  ```

其他请访问Swagger文档(address:port/docs)。
