# 指令文档

> 指令采用 `.` 分隔的子命令体系，例如 `lp.user.permission`、`lp.chat_group.parent` 等。

## 主指令

- **格式**：`/lp`
- **功能**：显示插件帮助信息
- **响应**：`LP LitePerm 请输入参数 lp.user lp.chat_group lp.perm_group`

## 用户权限管理

::: details

### `lp.user.permission` — 用户权限节点操作

- **格式**：`lp.user.permission <用户ID> <操作> [权限节点] [值]`

| 操作    | 格式                                              | 示例                                           | 说明             |
| ------- | ------------------------------------------------- | ---------------------------------------------- | ---------------- |
| `del`   | `lp.user.permission <ID> del <节点>`              | `lp.user.permission 123 del user.edit`         | 删除权限节点     |
| `set`   | `lp.user.permission <ID> set <节点> <true/false>` | `lp.user.permission 123 set admin.access true` | 设置权限节点状态 |
| `check` | `lp.user.permission <ID> check <节点>`            | `lp.user.permission 123 check plugin.admin`    | 检查是否拥有权限 |
| `list`  | `lp.user.permission <ID> list`                    | `lp.user.permission 123 list`                  | 列出用户所有权限 |

### `lp.user.parent` — 用户权限组继承操作

| 操作  | 格式                               | 示例                                 | 说明                   |
| ----- | ---------------------------------- | ------------------------------------ | ---------------------- |
| `add` | `lp.user.parent <ID> add <权限组>` | `lp.user.parent 123 add admin_group` | 添加继承的权限组       |
| `del` | `lp.user.parent <ID> del <权限组>` | `lp.user.parent 123 del vip_group`   | 移除继承的权限组       |
| `set` | `lp.user.parent <ID> set <权限组>` | `lp.user.parent 123 set admin_group` | 完全覆盖为权限组的权限 |

### `lp.user.perm_group` — 用户权限组关系操作

| 操作  | 格式                                   | 示例                               | 说明               |
| ----- | -------------------------------------- | ---------------------------------- | ------------------ |
| `add` | `lp.user.perm_group <ID> add <权限组>` | `lp.user.perm_group 123 add vip`   | 将用户添加到权限组 |
| `del` | `lp.user.perm_group <ID> del <权限组>` | `lp.user.perm_group 123 del guest` | 将用户从权限组移除 |

:::

## 群组权限管理

::: details

### `lp.chat_group.permission` — 群权限节点操作

- **格式**：`lp.chat_group.permission <群组ID> <操作> [权限节点] [值]`

| 操作    | 格式                                                    | 示例                                                 | 说明             |
| ------- | ------------------------------------------------------- | ---------------------------------------------------- | ---------------- |
| `set`   | `lp.chat_group.permission <ID> set <节点> <true/false>` | `lp.chat_group.permission 456 set group.manage true` | 设置权限节点状态 |
| `del`   | `lp.chat_group.permission <ID> del <节点>`              | `lp.chat_group.permission 456 del group.kick`        | 删除权限节点     |
| `check` | `lp.chat_group.permission <ID> check <节点>`            | `lp.chat_group.permission 456 check plugin.admin`    | 检查是否拥有权限 |
| `list`  | `lp.chat_group.permission <ID> list`                    | `lp.chat_group.permission 456 list`                  | 列出群组所有权限 |

### `lp.chat_group.parent` — 群权限组继承操作

| 操作  | 格式                                     | 示例                                       | 说明                   |
| ----- | ---------------------------------------- | ------------------------------------------ | ---------------------- |
| `add` | `lp.chat_group.parent <ID> add <权限组>` | `lp.chat_group.parent 456 add group_admin` | 添加继承的权限组       |
| `del` | `lp.chat_group.parent <ID> del <权限组>` | `lp.chat_group.parent 456 del group_vip`   | 移除继承的权限组       |
| `set` | `lp.chat_group.parent <ID> set <权限组>` | `lp.chat_group.parent 456 set group_admin` | 完全覆盖为权限组的权限 |

### `lp.chat_group.perm_group` — 群权限组关系操作

| 操作  | 格式                                         | 示例                                     | 说明               |
| ----- | -------------------------------------------- | ---------------------------------------- | ------------------ |
| `add` | `lp.chat_group.perm_group <ID> add <权限组>` | `lp.chat_group.perm_group 456 add vip`   | 将群组添加到权限组 |
| `del` | `lp.chat_group.perm_group <ID> del <权限组>` | `lp.chat_group.perm_group 456 del guest` | 将群组从权限组移除 |

:::

## 权限组管理

::: details

### `lp.perm_group.permission` — 权限组权限节点操作

- **格式**：`lp.perm_group.permission <权限组ID> <操作> [权限节点] [值]`

| 操作    | 格式                                                    | 示例                                                | 说明               |
| ------- | ------------------------------------------------------- | --------------------------------------------------- | ------------------ |
| `set`   | `lp.perm_group.permission <ID> set <节点> <true/false>` | `lp.perm_group.permission admin set system.* true`  | 设置权限节点状态   |
| `del`   | `lp.perm_group.permission <ID> del <节点>`              | `lp.perm_group.permission admin del user.edit`      | 删除权限节点       |
| `check` | `lp.perm_group.permission <ID> check <节点>`            | `lp.perm_group.permission admin check plugin.admin` | 检查是否拥有权限   |
| `list`  | `lp.perm_group.permission <ID> list`                    | `lp.perm_group.permission admin list`               | 列出权限组所有权限 |

### `lp.perm_group.parent` — 权限组继承操作

- **格式**：`lp.perm_group.parent <权限组ID> <操作> <继承权限组名>`

| 操作  | 格式                                     | 示例                                 | 说明                   |
| ----- | ---------------------------------------- | ------------------------------------ | ---------------------- |
| `add` | `lp.perm_group.parent <ID> add <权限组>` | `lp.perm_group.parent vip add base`  | 添加继承的权限组       |
| `del` | `lp.perm_group.parent <ID> del <权限组>` | `lp.perm_group.parent vip del base`  | 移除继承的权限组       |
| `set` | `lp.perm_group.parent <ID> set <权限组>` | `lp.perm_group.parent vip set admin` | 完全覆盖为权限组的权限 |

### `lp.perm_group.to` — 权限组管理

- **格式**：`lp.perm_group.to <操作> <权限组ID>`

| 操作     | 格式                             | 示例                             | 说明         |
| -------- | -------------------------------- | -------------------------------- | ------------ |
| `create` | `lp.perm_group.to create <组名>` | `lp.perm_group.to create newgrp` | 创建新权限组 |
| `remove` | `lp.perm_group.to remove <组名>` | `lp.perm_group.to remove oldgrp` | 删除权限组   |

> **注意**：默认权限组 `default` / `default_group` 不允许被删除。

### `lp.perm_group.list` — 列出所有权限组

- **格式**：`lp.perm_group.list`
- **功能**：列出所有权限组名称

## 通用参数说明

- 用户 ID：QQ 号或其他平台的用户标识
- 群组 ID：QQ 群号或其他平台的群组标识
- 权限组名：自定义的权限组名称
- 权限节点：使用点分隔的权限标识（如 plugin.admin）
- 值：true 或 false，表示权限状态

> **注意**：所有指令需要管理员权限（`lp.admin`）才能执行
