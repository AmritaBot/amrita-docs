# UI 组件库

Amrita 的 WebUI 组件基于 **React 19 + Tailwind CSS v4**，采用 ShadCN 风格。1.18 起，组件实现从宿主源码迁到独立子模块 **AmritaBot-UI**，以 `@amrita-constant/ambot-ui` 形式同时供宿主和插件使用。

::: tip 相关阅读

- [页面扩展开发](./customization) —— 插件如何复用这些组件
- [前端 API](./frontend-api) —— 数据接口

:::

<!-- TODO: UI 组件库总览截图占位（亮色/暗色各一张），后续统一补拍 -->

## 包结构

```
frontend/packages/ui/          # git submodule: AmritaBot-UI
├── src/
│   ├── components/
│   │   ├── ui/                # 原子组件
│   │   └── shared/            # 业务通用件
│   ├── hooks/use-theme.ts     # 明暗主题单例
│   ├── lib/utils.ts           # cn()
│   ├── exports.ts             # UI_EXPORTS 清单
│   └── index.ts               # 包入口
└── package.json               # @amrita-constant/ambot-ui
```

宿主通过 `file:packages/ui` 依赖该包，页面里统一从 `@amrita-constant/ambot-ui` 引入。旧的 `@/components/ui/*`、`@/components/shared/{DataTable,StatCard,ConfirmDialog}`、`@/hooks/use-theme`、`@/lib/utils` 内部路径已经不存在。

## 基础组件

| 组件 | 说明 |
| --- | --- |
| `Button` / `buttonVariants` | 按钮，支持 variant / size |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` / `CardAction` | 卡片容器 |
| `Input` | 单行输入框 |
| `Textarea` | 多行输入框 |
| `Label` | 表单标签 |
| `Select` 及一组子组件 | 下拉选择 |
| `Switch` | 开关 |
| `Dialog` 及一组子组件 | 模态对话框 |
| `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` | 标签页 |
| `Table` / `TableHeader` / `TableBody` / `TableHead` / `TableRow` / `TableCell` | 表格原语 |
| `Badge` / `badgeVariants` | 徽章 / 状态标签 |
| `Separator` | 分隔线 |
| `Skeleton` | 加载占位 |
| `Toaster` | 全局消息提示（sonner） |

## 业务通用件

| 组件 | 说明 |
| --- | --- |
| `DataTable` | 带列定义、加载态与空状态的数据表格 |
| `StatCard` | 统计数字卡片 |
| `ConfirmDialog` | 二次确认对话框 |
| `StatusBadge` | 状态徽章（与六态插件状态等配合） |
| `cn()` | 合并 Tailwind 类名 |
| `useTheme()` | 读取/切换明暗主题 |

`UI_EXPORTS` 是组件名清单。宿主把它挂到 `window.__AMRITA_HOST__.UI`，插件构建套件据此生成「从宿主取组件」的再导出，因此增删导出时要同步改 `src/exports.ts`，并提醒宿主 bump `HOST_CONTRACT_VERSION`。

## 在宿主页面中使用

```tsx
import { Button, Card, CardContent, useTheme } from "@amrita-constant/ambot-ui";

export function Example() {
  const { theme, setTheme } = useTheme();
  return (
    <Card>
      <CardContent className="space-y-4">
        <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          切换主题
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 在插件页面中使用

插件不直接打包组件实现，而是写：

```tsx
import { Button, Card, DataTable } from "@amrita-constant/webui-plugin-kit/ui";
```

构建时这一段会被替换成从 `window.__AMRITA_HOST__.UI` 取值的再导出模块，插件产物里不会出现第二份组件实现。类型来自同一个 `@amrita-constant/ambot-ui` 包，所以插件项目需要把它装成开发依赖：

```bash
bun add -d @amrita-constant/ambot-ui
```

## 主题与暗色模式

主题基于 **CSS 变量 + Tailwind v4 的 `@theme` 指令**，定义在 `frontend/styles/globals.css`：

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... */
}
```

- 颜色通过 `--background` / `--foreground` / `--primary` 等 CSS 变量声明，亮暗两套值分别定义在 `:root` 与 `.dark` 下
- 组件里用语义类名（`bg-background`、`text-muted-foreground`），不要硬编码颜色
- 暗色变体写作 `dark:`，由 `@custom-variant` 绑定到 `.dark` 祖先类

`useTheme` 是模块级单例：

- 记忆到 `localStorage`（键 `amrita-theme`），未设置时跟随系统
- 通过 `useSyncExternalStore` 共享状态，侧边栏、Toaster 等任意组件都能订阅
- 切换时对 `document.documentElement` 增删 `.dark` 类

## 样式扫描

宿主构建 Tailwind 时会扫描：

- `frontend/src`
- `frontend/packages/ui/src`（子模块）
- 插件注入的 CSS

最后一条很关键：宿主**不会扫描插件源码**，插件里写宿主从未使用过的类（如 `bg-fuchsia-700`、`ring-8`、`columns-3`、`prose`）不会生成对应规则。插件应自带 CSS 并用 `injectCss` / `injectStyleText` 注入，或只使用宿主已有的设计 token。

## 二次开发

```bash
git submodule update --init --recursive
cd frontend
bun install
bun run dev       # 宿主开发服务器
```

修改子模块后：

1. 在 `frontend/packages/ui` 内跑 `bun run typecheck`；
2. 新增/删除导出时更新 `src/exports.ts`；
3. 如果变更影响插件可见的组件集合，同步 bump 宿主契约版本；
4. 提交子模块仓库，再在宿主仓库更新子模块指针。

## 已知限制

- 没有 Storybook 之类的独立预览环境，组件在宿主页面中直接验证。
- 包不单独发 npm 版本给第三方直接运行时安装；插件通过构建套件从宿主全局取组件。
- 图表依赖（`--color-chart-*`）已定义变量，但图表组件尚未抽成通用组件。
