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
        text: "指南",
        items: [
          { text: "项目介绍", link: "/amrita/" },
          { text: "快速开始", link: "/amrita/quick-start" },
          { text: "部署", link: "/amrita/deployment" },
          { text: "高级用法", link: "/amrita/advanced-usage" },
          { text: "高级功能", link: "/amrita/advanced-features" },
          { text: "社区支持", link: "/amrita/community" },
        ],
      },
      { text: "配置", items: [{ text: "配置", link: "/amrita/config" }] },
      {
        text: "API参考",
        items: [{ text: "API参考", link: "/amrita/api/reference" }],
      },
      {
        text: "模块",
        items: [
          {
            text: "Liteperm",
            items: [
              { text: "简介", link: "/amrita/plugins/liteperm/" },
              { text: "命令", link: "/amrita/plugins/liteperm/docs/commands" },
              { text: "API", link: "/amrita/plugins/liteperm/docs/API" },
            ],
          },
          {
            text: "Suggarchat",
            items: [
              { text: "简介", link: "/amrita/plugins/suggarchat/" },
              { text: "详细介绍", link: "/amrita/plugins/suggarchat/next" },
              { text: "高级功能", link: "/amrita/plugins/suggarchat/advanced" },
              {
                text: "Tools调用",
                link: "/amrita/plugins/suggarchat/function_calling",
              },
            ],
          },
          {
            text: "WebUI",
            link: "/amrita/plugins/webui/",
            items: [
              { text: "介绍", link: "/amrita/plugins/webui/" },
              { text: "页面开发", link: "/amrita/plugins/webui/DEV" },
              { text: "前端API", link: "/amrita/plugins/webui/frontendAPI" },
            ],
          },
          { text: "Menu", link: "/amrita/plugins/menu/" },
        ],
      },
    ],
    footer: {
      message: `MIT License 发布`,
      copyright: `© Amrita 2025-${new Date().getFullYear()}`,
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/AmritaBot/amrita-docs" },
    ],
  },
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container
  },
});
