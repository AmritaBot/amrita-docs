# Amrita 框架配置建议

Amrita 框架提供了丰富的配置选项来优化性能和资源使用。本文档将详细介绍这些配置项及其调整方法，帮助您根据实际需求优化系统性能。

## 1. LLM 调用性能优化

### 1.1 超时设置

LLM 调用超时设置是影响用户体验和系统稳定性的关键配置。通过调整超时时间，可以在响应速度和成功率之间找到平衡。

配置项：

```toml
[llm_config]
llm_timeout = 60  # LLM请求超时时间（秒）
```

优化建议：

- 对于快速响应场景，可适当降低超时时间（如 30 秒）
- 对于复杂任务，可适当增加超时时间（如 120 秒）
- 监控实际请求响应时间，根据统计数据调整超时值

### 1.2 重试机制

重试机制可以提高 LLM 调用的成功率，但也可能增加响应时间。

配置项：

```toml
[llm_config]
auto_retry = true     # 是否启用自动重试
max_retries = 3       # 最大重试次数
```

优化建议：

- 生产环境中建议启用自动重试
- 重试次数不宜过多，避免过度消耗资源
- 对于关键任务，可适当增加重试次数

### 1.3 流式响应

流式响应可以让用户更快看到部分结果，改善交互体验。

配置项：

```toml
[llm_config]
stream = false        # 是否启用流式响应
```

优化建议：

- 对于长文本生成任务，建议启用流式响应
- 对于需要完整结果后处理的场景，可禁用流式响应

## 2. Token 管理与限制

### 2.1 Token 数量限制

Token 限制可以控制资源使用，防止个别用户或群组过度消耗资源。

配置项：

```toml
[llm_config]
max_tokens = 100               # 单次请求最大token数
enable_tokens_limit = true     # 是否启用token限制
tokens_count_mode = "bpe"      # token计算模式(word/bpe/char)

[session]
session_max_tokens = 3000      # 会话最大token数
```

优化建议：

- 根据模型能力调整 max_tokens
- 合理设置 session_max_tokens 以平衡上下文长度和资源消耗
- 选择合适的 tokens_count_mode 以匹配模型的 token 计算方式

### 2.2 用量限制

通过设置每日使用限制，可以公平分配资源并控制成本。

配置项：

```toml
[usage_limit]
enable_usage_limit = false     # 是否启用用量限制
group_daily_limit = 100        # 每个群每天的使用次数限制(-1为不限制)
user_daily_limit = 100         # 每个用户每天的使用次数限制(-1为不限制)
group_daily_token_limit = 200000   # 每个群每天使用的token限制(-1为不限制)
user_daily_token_limit = 100000    # 每个用户每天使用的token限制(-1为不限制)
total_daily_limit = 1500       # 总使用次数限制(-1为不限制)
total_daily_token_limit = 1000000  # 总使用token限制(-1为不限制)
```

优化建议：

- 根据实际使用情况和预算设置合理限制
- 对管理员用户可适当放宽限制
- 定期监控用量统计数据，调整限制值

## 3. 会话管理优化

### 3.1 会话控制

会话控制可以有效管理内存使用和上下文长度。

配置项：

```toml
[session]
session_control = false        # 是否启用会话控制
session_control_time = 60      # 会话生命周期时间（分钟）
session_control_history = 10   # 会话历史最大值
```

优化建议：

- 启用会话控制以防止内存无限增长
- 根据用户活跃度调整 session_control_time
- 合理设置 session_control_history 以保留有用的上下文历史

### 3.2 内存长度限制

控制记忆长度可以减少内存占用和处理时间。

配置项：

```toml
[llm_config]
memory_lenth_limit = 50        # 记忆长度限制
```

优化建议：

- 根据模型能力和任务需求调整记忆长度
- 过长的记忆可能影响模型性能和相关性

## 4. 数据库配置

### 4.1 数据库选择

Amrita 默认使用 SQLite 数据库，这是最基本的数据库系统，但在生产环境中，建议根据实际需求选择更合适的数据库系统。

#### SQLite（默认）

适用于：

- 开发和测试环境
- 小规模部署
- 简单应用场景

配置示例：

```dotenv
DATABASE_URL=sqlite+aiosqlite:///./data/db.sqlite3
```

#### MySQL

适用于：

- 中大型生产环境
- 需要高并发访问的场景
- 需要主从复制和集群部署的场景

配置示例：

```dotenv
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/database
```

#### PostgreSQL

适用于：

- 复杂数据处理需求
- 需要高级数据类型支持的场景
- 对数据一致性和可靠性要求高的场景

配置示例：

```dotenv
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/amrita
```

### 4.2 优化建议

- 根据并发访问量调整连接池大小
- 监控数据库连接使用情况，避免连接耗尽
- 合理设置最大溢出连接数以应对突发访问

## 6. 最佳实践

### 6.1 配置管理

1. 使用配置文件而非硬编码参数
2. 为不同环境维护不同的配置文件
3. 定期审查和更新配置参数

### 6.2 资源规划

1. 根据预期用户量规划硬件资源
2. 合理设置各种限制参数防止资源耗尽
3. 建立监控告警机制及时发现性能问题

通过合理配置和优化这些参数，可以显著提升 Amrita 框架的性能和用户体验。建议根据实际使用场景和需求，逐步调整这些配置项以达到最佳效果。
