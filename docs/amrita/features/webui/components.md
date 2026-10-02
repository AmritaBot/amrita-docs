# UI 组件库

Amrita 的 WebUI 组件基于 **React + Tailwind CSS v4** 构建，采用 ShadCN 风格
（组件源码直接放在仓库里，按需修改，而非从 npm 引入黑盒）。

::: tip 相关阅读

- [页面扩展开发](./customization) —— 插件页面如何复用这些组件
- [前端 API](./frontend-api) —— 数据接口

:::

## 目录结构

```
frontend/src/components/
├── layout/     # 应用外壳与导航
├── shared/     # 页面级复用组件
└── ui/         # 基础 UI 原子组件
```

## 基础组件（`ui/`）

| 组件 | 文件 | 说明 |
| --- | --- | --- |
| `Button` | `button.tsx` | 按钮，支持多种 variant / size |
| `Card` | `card.tsx` | 卡片容器（`CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`） |
| `Input` | `input.tsx` | 单行输入框 |
| `Textarea` | `textarea.tsx` | 多行输入框 |
| `Label` | `label.tsx` | 表单标签 |
| `Select` | `select.tsx` | 下拉选择 |
| `Switch` | `switch.tsx` | 开关 |
| `Dialog` | `dialog.tsx` | 模态对话框 |
| `Tabs` | `tabs.tsx` | 标签页 |
| `Table` | `table.tsx` | 表格原语 |
| `Badge` | `badge.tsx` | 徽章 / 状态标签 |
| `Separator` | `separator.tsx` | 分隔线 |
| `Skeleton` | `skeleton.tsx` | 加载占位 |
| `Toaster` | `sonner.tsx` | 全局消息提示（sonner） |

## 共享组件（`shared/`）

| 组件 | 说明 |
| --- | --- |
| `AppShell` | 应用外壳：侧边栏 + 内容区布局 |
| `Sidebar` | 侧边栏导航（由 `/api/meta/menu` 驱动） |
| `DataTable` | 带排序 / 分页的数据表格 |
| `StatCard` | 统计数字卡片 |
| `ConfirmDialog` | 二次确认对话框 |
| `PermissionEditor` | 权限编辑器 |
| `PagePlaceholder` | 页面未接入时的占位页 |
| `ExternalPage` | iframe 页面容器（`external_url`） |
| `RemoteModulePage` | 运行期 ESM 页面容器（`module_url`），含错误边界 |

::: tip 插件复用宿主组件

`module_url` 方式接入的插件页面可以直接 import 这些组件
（构建时把 `@/components/ui/*` 一并设为 external，或复制所需组件源码）。
但要注意保持 React 单实例 —— 见[页面扩展开发](./customization#方式二运行期-esm-模块原生-ui)。

:::

## 主题与暗色模式

主题基于 **CSS 变量 + Tailwind v4 的 `@theme` 指令**，
定义在 `frontend/src/styles/globals.css`：

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... */
}
```

- 颜色通过 `--background` / `--foreground` / `--primary` 等 CSS 变量声明，
  亮暗两套值分别定义在 `:root` 与 `.dark` 下
- 组件里直接用语义类名（`bg-background`、`text-muted-foreground`），
  不要硬编码颜色，这样自动适配暗色模式
- 暗色变体写作 `dark:`（由 `@custom-variant` 绑定到 `.dark` 祖先类）

### 切换逻辑

`hooks/use-theme.ts` 是模块级单例：

- 记忆到 `localStorage`（键 `amrita-theme`），未设置时跟随系统
- 通过 `useSyncExternalStore` 共享状态，任意组件（侧边栏、Toaster 等）都能订阅
- 切换时对 `document.documentElement` 增删 `.dark` 类

```tsx
import { useTheme } from "@/hooks/use-theme";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>切换主题</button>;
}
```

## 二次开发

组件源码就在仓库里，直接改即可：

```bash
cd frontend
bun install
bun run dev     # 开发服务器（HMR）
```

新增基础组件时建议：

1. 放在 `components/ui/`，保持与现有组件一致的 props 风格
2. 用 CSS 变量而非硬编码颜色，保证暗色模式可用
3. 通过 `cn()`（`lib/utils.ts`）合并类名，便于调用方覆盖样式

## 已知限制

- 组件库**没有独立发布**，第三方插件无法直接从 npm 安装，
  只能复制源码或把宿主组件设为 external
- 没有 Storybook 之类的组件预览环境
- 图表依赖（`--color-chart-*`）已定义变量，但图表组件尚未抽出复用组件
