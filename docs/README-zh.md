# Blog Builder

[English](../README.md)

一个现代化的博客构建平台，使用 Next.js 15+ 构建，提供 AI 批量博客创作和管理功能。

## 特点

- 🚀 5分钟部署网站生成博客（通过 AI 读取你提供的搜索关键词或 URLs）
- 💻 作为独立的博客网站，或者你网站的 /blog 路径
- 📝 支持 Markdown 编辑
- 🌐 国际化支持
- 📱 移动端优化

## 技术栈

- **框架**: Next.js 15+
- **样式**: Tailwind CSS
- **UI 组件**: Shadcn UI

## 安装步骤

1. 克隆仓库

```bash
git clone git@github.com:nohsueh/blog-builder.git
cd blog-builder
```

2. 安装依赖

```bash
pnpm install
```

3. 创建环境变量

```properties
SEARCHLYSIS_API_KEY="你的 Searchlysis API Key，可以在 https://searchlysis.com/key 获取，新用户前 100 篇免费"
PASSWORD="你的博客管理密码，自定义"
NEXT_PUBLIC_ROOT_DOMAIN="网站域名，如果你想为 example.com 的所有页面生成博客，这里填 example.com"
```

4. 启动开发服务器

```bash
pnpm dev
```

## 使用方法

1. 访问 `localhost:3000` 启动开发服务器
2. 使用提供的 UI 组件进行博客创作
3. 通过管理界面进行博客内容的编辑和发布

## 项目结构

```
blog-builder/
├── app/                 # Next.js 应用路由
├── components/         # React 组件
├── hooks/             # 自定义 React Hooks
├── lib/               # 工具函数和配置
├── public/            # 静态资源
└── styles/            # 全局样式
└── types/            # TypeScript 类型定义
```

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规范
- 使用 Prettier 进行代码格式化

## 贡献指南

1. Fork 仓库
2. 创建新功能分支
3. 提交更改
4. 提交 Pull Request

## 许可证

MIT License
