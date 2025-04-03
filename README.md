# Blog Builder

一个现代化的博客构建平台，使用 Next.js 构建，提供强大的博客创作和管理功能。

## 特点

- 🚀 基于 Next.js 14+ 的现代化架构
- 🎨 使用 Tailwind CSS 实现响应式设计
- 🛠️ 丰富的 UI 组件库（Radix UI）
- 📝 支持 Markdown 编辑
- 🌐 国际化支持
- 📱 移动端优化

## 技术栈

- **框架**: Next.js 14+
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI
- **状态管理**: React Hook Form
- **日期处理**: date-fns
- **认证**: JSON Web Token

## 安装步骤

1. 克隆仓库
```bash
git clone [你的仓库地址]
cd blog-builder
```

2. 安装依赖
```bash
pnpm install
```

3. 复制环境变量
```bash
cp .env.example .env
```

4. 启动开发服务器
```bash
pnpm dev
```

## 使用方法

1. 访问 `http://localhost:3000` 启动开发服务器
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