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

### 2.2 黑名单管理接口

> **此处只列举了部分API，更多请查看Swagger UI文档**

#### 添加黑名单条目

- **URL**: `POST /api/blacklist/add`
- **说明**: 添加用户或群组到黑名单
- **请求体** (JSON):
  ```json
  {
    "id": "用户或群组ID",
    "type": "user|group",
    "reason": "添加到黑名单的原因"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "error": null
  }
  ```

#### 批量删除黑名单条目

- **URL**: `POST /api/blacklist/remove-batch/{type}`
- **说明**: 批量删除黑名单中的用户或群组
- **路径参数**:
  - `type`: "user" 或 "group"
- **请求体** (JSON):
  ```json
  {
    "ids": ["ID1", "ID2", "ID3"]
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "error": null
  }
  ```

#### 删除单个黑名单条目

- **URL**: `POST /api/blacklist/remove/{type}/{id}`
- **说明**: 删除黑名单中的指定用户或群组
- **路径参数**:
  - `type`: "user" 或 "group"
  - `id`: 要删除的用户或群组 ID
- **响应**:
  ```json
  {
    "code": 200,
    "error": null
  }
  ```

### 2.3 图表数据接口

#### 获取消息图表数据

- **URL**: `GET /api/chart/messages`
- **说明**: 获取消息统计数据用于图表展示
- **响应**:
  ```json
  {
    "labels": ["日期1", "日期2", ...],
    "data": [数值1, 数值2, ...]
  }
  ```

#### 获取今日消息使用量图表数据

- **URL**: `GET /api/chart/today-usage`
- **说明**: 获取今日消息收发统计数据用于图表展示
- **响应**:
  ```json
  {
    "labels": ["收", "发"],
    "data": [接收数量, 发送数量]
  }
  ```

### 2.4 插件管理接口

#### 获取插件列表

- **URL**: `GET /api/plugins/list`
- **说明**: 获取已加载插件的详细信息列表
- **响应**:
  ```json
  [
    {
      "name": "插件名称",
      "homepage": "插件主页URL",
      "is_local": true|false,
      "type": "插件类型",
      "description": "插件描述",
      "version": "插件版本"
    },
    ...
  ]
  ```

### 2.5 机器人状态接口

#### 获取机器人状态

- **URL**: `GET /api/bot/status`
- **说明**: 获取机器人在线状态、系统使用情况和侧边栏项目信息
- **响应**:
  ```json
  {
    "status": "online|offline",
    "cpu_usage": CPU使用率,
    "memory_usage": 内存使用率,
    "disk_usage": 磁盘使用率,
    "sidebar_items": [侧边栏项目数组]
  }
  ```

### 2.6 配置管理接口

#### 获取配置文件内容

- **URL**: `GET /api/bot/config/{filename}`
- **说明**: 获取指定配置文件的内容
- **路径参数**:
  - `filename`: 配置文件名 (如 ".env")
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "content": "配置文件内容"
  }
  ```

#### 更新配置文件

- **URL**: `POST /api/bot/config`
- **说明**: 更新指定配置文件的内容
- **请求体** (JSON):
  ```json
  {
    "content": "配置文件内容",
    "filename": "配置文件名"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "配置文件 {filename} 更新成功",
    "error": null
  }
  ```

### 2.7 权限管理接口

#### 更新用户权限

- **URL**: `POST /api/users/permissions/user/{user_id}`
- **说明**: 更新指定用户的权限设置
- **路径参数**:
  - `user_id`: 用户 ID
- **请求体**: Form 表单数据
  - `permissions`: 权限字符串
- **响应**:
  ```json
  {
    "success": true,
    "message": "用户权限已更新"
  }
  ```

#### 更新群组权限

- **URL**: `POST /api/users/permissions/group/{group_id}`
- **说明**: 更新指定群组的权限设置
- **路径参数**:
  - `group_id`: 群组 ID
- **请求体**: Form 表单数据
  - `permissions`: 权限字符串
- **响应**:
  ```json
  {
    "success": true,
    "message": "群组权限已更新"
  }
  ```

#### 更新权限组权限

- **URL**: `POST /api/users/permissions/perm_group/{group_name}`
- **说明**: 更新指定权限组的权限设置
- **路径参数**:
  - `group_name`: 权限组名称
- **请求体**: Form 表单数据
  - `permissions`: 权限字符串
- **响应**:
  ```json
  {
    "success": true,
    "message": "权限组权限已更新"
  }
  ```
