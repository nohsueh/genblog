# GenBlog

[English](../README.md) | [Español](README-es.md) | [Deutsch](README-de.md) | [日本語](README-ja.md) | [Français](README-fr.md)

## 项目介绍

GenBlog 是一个现代化的博客系统，基于 Next.js 构建，支持多语言内容管理。它提供了一个优雅的用户界面和强大的管理功能，让您可以轻松创建和管理博客内容。

![/path/to/your/blog/console page](../imgs/dashboard-create.png "/path/to/your/blog/console page")

## 主要功能

- 📝 基于 AI + 搜索引擎 + 爬虫的批量博客内容生成
- 💻 支持部署到你网站的任意路径
- 🌐 多语言支持（英语、西班牙语、德语、日语、法语、中文）
- 🔍 SEO优化，robots.txt，sitemap_index.xml，ads.txt等
- 📱 响应式设计，支持移动端
- 🎨 现代化的 UI 界面
- 🔒 安全的身份验证系统
- 📊 博客分组管理
- 🔄 实时预览和编辑

## 技术栈

- **前端框架**: Next.js 15
- **UI 组件**:
  - Radix UI
  - Tailwind CSS
  - shadcn/ui
- **内容处理**:
  - Markdown 支持
  - Prism.js 代码高亮
- **状态管理**: React Hooks
- **样式**: Tailwind CSS
- **国际化**: 内置多语言支持

## 快速开始

### 环境要求

- [Vercel 账号](https://vercel.com)
- [Searchlysis 账号](https://searchlysis.com)

### Vercel 部署步骤

1. Fork 项目

   - 访问 [GenBlog GitHub 仓库](https://github.com/nohsueh/genblog)
   - 点击右上角的 "Fork" 按钮，将项目复制到您的 GitHub 账号

2. 导入到 Vercel

   - 登录 [Vercel](https://vercel.com)
   - 点击 "Add New..." 按钮
   - 选择 "Project"
   - 在 "Import Git Repository" 部分，选择您刚才 fork 的 GenBlog 仓库
   - 点击 "Import"

3. 配置项目

   - 在项目配置页面，保持默认设置
   - 点击 "Environment Variables" 添加以下环境变量：

   ```env
   # 必需配置
   NEXT_PUBLIC_APP_NAME="您的应用名称"
   NEXT_PUBLIC_ROOT_DOMAIN="您的域名"
   SEARCHLYSIS_API_KEY="您的 Searchlysis API 密钥"
   PASSWORD="您的管理员密码"

   # 可选配置
   NEXT_PUBLIC_BASE_PATH="/path/to/your/blog"  # 如果您的博客不是部署在根路径
   NEXT_PUBLIC_APP_DESCRIPTION="您的应用描述"
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="您的 Google 站点验证码"
   NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT="您的 Google AdSense 账号"
   ```

4. 部署项目

   - 点击 "Deploy" 按钮
   - Vercel 将自动开始构建和部署过程
   - 等待部署完成，通常需要 1-2 分钟

5. 配置自定义域名（可选）

   - 在 Vercel 项目仪表板中，点击 "Settings"
   - 选择 "Domains"
   - 添加您的自定义域名
   - 按照 Vercel 的指示配置 DNS 记录

6. 验证部署

   - 访问您的 Vercel 部署 URL 或自定义域名
   - 确认网站正常运行
   - 测试管理员登录功能 (yourdomain.com/path/to/your/blog/[en | es | de | ja | fr | zh]/console)
   - 检查多语言切换是否正常

7. 在 /path/to/your/blog 子路径上托管博客（以 Next.js 为例）
   - 在 `next.config.ts` 中添加反向代理即可

```ts next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/path/to/your/blog",
        destination: "https://yoursubdomain.vercel.app/path/to/your/blog",
      },
      {
        source: "/path/to/your/blog/:path*",
        destination:
          "https://yoursubdomain.vercel.app/path/to/your/blog/:path*",
      },
    ];
  },
};

export default nextConfig;
```

## 部署说明

### 环境变量说明

- `NEXT_PUBLIC_APP_NAME`: 您的博客名称，将显示在浏览器标签和页面标题中
- `NEXT_PUBLIC_ROOT_DOMAIN`: 您的网站域名，用于生成规范链接和社交媒体分享
- `SEARCHLYSIS_API_KEY`: Searchlysis API 密钥，用于内容分析和生成
- `PASSWORD`: 管理员登录密码
- `NEXT_PUBLIC_BASE_PATH`: 如果您的博客不是部署在根路径，请设置此值
- `NEXT_PUBLIC_APP_DESCRIPTION`: 网站描述，用于 SEO
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console 验证码
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT`: Google AdSense 账号，用于显示广告

## 贡献指南

欢迎提交 Pull Request 或创建 Issue 来帮助改进项目。

## 交流群

![QQ Group](../imgs/qrcode_1746489578956.jpg)
QQ群：364697359

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](../LICENSE) 文件
