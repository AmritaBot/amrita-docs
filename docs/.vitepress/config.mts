import { text } from "mermaid/dist/rendering-util/rendering-elements/shapes/text.js";
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid({
  lastUpdated: true,
  ignoreDeadLinks: true,
  title: "Amrita",
  description: "Amrita文档中心",
  head: [
    // 添加图标
    [
      "link",
      {
        rel: "icon",
        href: "/Amrita.png",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: "Amrita文档中心",
    nav: [
      { text: "首页", link: "/" },
      { text: "开始", link: "/amrita" },
    ],
    logo: "/Amrita.png",

    sidebar: [
      {
        text: "介绍",
        collapsed: true,
        items: [
          { text: "快速开始", link: "/amrita/guide/quick-start" },
          { text: "进一步部署", link: "/amrita/guide/installation" },
          { text: "配置参考", link: "/amrita/guide/configuration" },
          { text: "连接机器人", link: "/amrita/guide/to_bot" },
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
              { text: "高级对话", link: "/amrita/features/chat/advanced" },
              { text: "工具调用", link: "/amrita/features/chat/tools" },
              { text: "MCP服务集成", link: "/amrita/features/chat/mcp" },
            ],
          },
          {
            text: "权限管理",
            collapsed: true,
            items: [
              { text: "概述", link: "/amrita/features/permission/" },
              {
                text: "命令参考",
                link: "/amrita/features/permission/commands",
              },
              { text: "API", link: "/amrita/features/permission/API" },
            ],
          },
          {
            text: "Web界面",
            collapsed: true,
            items: [
              { text: "功能介绍", link: "/amrita/features/webui/" },
              {
                text: "页面扩展",
                link: "/amrita/features/webui/customization",
              },
              { text: "前端API", link: "/amrita/features/webui/frontend-api" },
              { text: "UI组件库", link: "/amrita/features/webui/components" },
            ],
          },
          {
            text: "其他功能",
            collapsed: true,
            items: [
              { text: "Menu", link: "/amrita/features/other-modules/menu" },
            ],
          },
        ],
      },
      {
        text: "高级主题",
        collapsed: true,
        items: [
          { text: "系统架构", link: "/amrita/advanced/architecture" },
          { text: "功能扩展", link: "/amrita/advanced/extension" },
        ],
      },
      {
        text: "最佳实践",
        collapsed: true,
        items: [
          {
            text: "提示词工程",
            link: "/amrita/best-practices/prompt",
          },
          {
            text: "Agent设计模式",
            link: "/amrita/best-practices/agent",
          },
          { text: "配置优化", link: "/amrita/best-practices/config" },
        ],
      },
      {
        text: "开发者",
        collapsed: true,
        items: [
          { text: "贡献指南", link: "/amrita/developer/contributing" },
          { text: "API参考", link: "/amrita/developer/api-reference/" },
          { text: "插件开发指南", link: "/amrita/developer/plugin-dev" },
        ],
      },
      {
        text: "社区",
        collapsed: true,
        items: [{ text: "获取帮助", link: "/amrita/community/support" }],
      },
      { text: "常见问题", link: "/amrita/faq" },
    ],
    footer: {
      message: `MIT License 发布`,
      copyright: `© AmritaBot 2025-${new Date().getFullYear()}`,
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/AmritaBot/amrita-docs" },
    ],
  },
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container
  },
});
