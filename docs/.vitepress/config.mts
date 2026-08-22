import { text } from "mermaid/dist/rendering-util/rendering-elements/shapes/text.js";
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid({
  lastUpdated: true,
  ignoreDeadLinks: true,
  title: "AmritaBot 文档中心",
  description:
    "AmritaBot 文档 — 基于 NoneBot2 与 AmritaCore 的 LLM 聊天机器人。快速开始、部署指南、Agent 配置、插件开发、权限管理、MCP 集成、WebUI 定制。",
  lang: "zh-CN",
  vite: {
    build: {
      rollupOptions: {
        onLog(level, log, handler) {
          if (log.message?.includes("points to missing source files")) return;
          handler(level, log);
        },
      },
    },
    optimizeDeps: {
      exclude: [
        "@nolebase/vitepress-plugin-enhanced-readabilities/client",
        "vitepress",
        "@nolebase/ui",
      ],
    },
    ssr: {
      noExternal: [
        "@nolebase/vitepress-plugin-enhanced-readabilities",
        "@nolebase/ui",
      ],
    },
  },
  sitemap: {
    hostname: "https://bot.amritabot.com",
  },

  head: [
    // favicon
    ["link", { rel: "icon", href: "/Amrita.png" }],
    // SEO meta
    [
      "meta",
      {
        name: "keywords",
        content:
          "AmritaBot,Amrita,NoneBot,QQ机器人,LLM聊天机器人,AmritaCore,Agent,AmritaSense,OneBot,MCP,大语言模型,智能体",
      },
    ],
    ["meta", { name: "author", content: "AmritaBot Team" }],
    ["meta", { name: "robots", content: "index, follow" }],
    // Open Graph
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    [
      "meta",
      {
        property: "og:title",
        content: "AmritaBot — 基于 NoneBot2 与 AmritaCore 的 LLM 聊天机器人",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "AmritaBot 是一个基于 NoneBot2 的强大智能聊天机器人。以 AmritaCore 为 Agent 引擎、AmritaSense 为工作流运行时，支持多模型、Agent 模式、MCP、权限管理、WebUI。",
      },
    ],
    ["meta", { property: "og:image", content: "/Amrita.png" }],
    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary" }],
    [
      "meta",
      {
        name: "twitter:title",
        content: "AmritaBot 文档中心",
      },
    ],
    [
      "meta",
      {
        name: "twitter:description",
        content: "AmritaBot — 强大、灵活、开箱即用的 LLM 聊天机器人解决方案。",
      },
    ],
    ["meta", { name: "twitter:image", content: "/Amrita.png" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: "AmritaBot 文档中心",
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/amrita" },
    ],
    logo: "/Amrita.png",
    search: {
      provider: "local",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },

    sidebar: [
      {
        text: "入门指南",
        collapsed: true,
        items: [
          { text: "快速开始", link: "/amrita/guide/quick-start" },
          { text: "部署指南", link: "/amrita/guide/installation" },
          { text: "配置参考", link: "/amrita/guide/configuration" },
          { text: "连接 QQ 机器人", link: "/amrita/guide/to_bot" },
          { text: "创建第一个对话机器人", link: "/amrita/guide/first-bot" },
        ],
      },
      {
        text: "功能使用",
        collapsed: true,
        items: [
          {
            text: "聊天功能",
            collapsed: true,
            items: [
              { text: "概述", link: "/amrita/features/chat/" },
              { text: "基础对话", link: "/amrita/features/chat/basic" },
              { text: "高级对话功能", link: "/amrita/features/chat/advanced" },
              {
                text: "工具调用 (Function Calling)",
                link: "/amrita/features/chat/tools",
              },
              { text: "Skills 接入", link: "/amrita/features/chat/skills" },
              { text: "MCP 服务集成", link: "/amrita/features/chat/mcp" },
              {
                text: "长期记忆与知识库",
                link: "/amrita/features/chat/memory",
              },
            ],
          },
          {
            text: "权限管理",
            collapsed: true,
            items: [
              { text: "概述", link: "/amrita/features/permission/" },
              {
                text: "指令参考",
                link: "/amrita/features/permission/commands",
              },
              { text: "权限 API", link: "/amrita/features/permission/API" },
            ],
          },
          {
            text: "Web 管理界面",
            collapsed: true,
            items: [
              { text: "功能介绍", link: "/amrita/features/webui/" },
              {
                text: "页面扩展开发 (TODO)",
                link: "/amrita/features/webui/customization",
              },
              {
                text: "前端 API (TODO)",
                link: "/amrita/features/webui/frontend-api",
              },
              {
                text: "UI 组件库 (TODO)",
                link: "/amrita/features/webui/components",
              },
            ],
          },
          {
            text: "其他内置模块",
            collapsed: true,
            items: [
              {
                text: "菜单系统 (Menu)",
                link: "/amrita/features/other-modules/menu",
              },
            ],
          },
        ],
      },
      {
        text: "高级主题",
        collapsed: true,
        items: [
          { text: "系统架构", link: "/amrita/advanced/architecture" },
          { text: "插件扩展", link: "/amrita/advanced/extension" },
        ],
      },
      {
        text: "最佳实践",
        collapsed: true,
        items: [
          { text: "提示词工程", link: "/amrita/best-practices/prompt" },
          { text: "Agent 设计与配置", link: "/amrita/best-practices/agent" },
          { text: "性能与配置优化", link: "/amrita/best-practices/config" },
        ],
      },
      {
        text: "开发者参考",
        collapsed: true,
        items: [
          { text: "贡献指南", link: "/amrita/developer/contributing" },
          { text: "核心 API 参考", link: "/amrita/developer/api-reference/" },
          { text: "插件开发指南", link: "/amrita/developer/plugin-dev" },
        ],
      },
      {
        text: "社区",
        collapsed: true,
        items: [
          { text: "获取帮助", link: "/amrita/community/support" },
          { text: "Discord 社区守则", link: "/amrita/community/discord-rules" },
        ],
      },
      { text: "常见问题 (FAQ)", link: "/amrita/faq" },
    ],
    footer: {
      message: `MIT License 发布`,
      copyright: `© AmritaBot 2025-${new Date().getFullYear()}`,
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/AmritaBot/AmritaBot" },
    ],
  },
  mermaidPlugin: {
    class: "mermaid my-class",
  },
});
