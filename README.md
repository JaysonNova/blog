# Blog Project

一个简约、设计精巧、交互舒适的个人博客网站，用于展示文章、个人简介、摄影、视频等内容。

## ✨ 特性

- 📝 Markdown/MDX 支持，代码高亮
- 🎨 极简设计，响应式布局
- 🌙 深色模式支持
- 🏷️ 标签和分类系统
- 💬 评论系统（嵌套回复）
- 📸 摄影作品展示（瀑布流布局）
- 🎬 视频内容展示
- 🔐 后台管理系统
- 📊 文章统计（浏览量、点赞数）
- ⚡ 高性能优化（图片懒加载、代码分割）

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **UI**: shadcn/ui + Tailwind CSS
- **动画**: Framer Motion
- **认证**: NextAuth.js
- **测试**: Vitest + Testing Library
- **包管理**: pnpm

## 📚 文档

- [CLAUDE.md](./CLAUDE.md) - Claude Code 开发指南
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - 架构设计文档
- [docs/DESIGN_PROPOSAL.md](./docs/DESIGN_PROPOSAL.md) - UI/UX 设计方案
- [docs/DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md) - 开发实施计划
- [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) - Git 分支、PR 与发布流程规范
- [docs/PROJECT_SETUP.md](./docs/PROJECT_SETUP.md) - 项目初始化指南

## 🚀 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+
- SQLite (开发环境) 或 PostgreSQL (生产环境)

### 安装步骤

1. 克隆仓库：
```bash
git clone <repo-url>
cd blog
```

2. 安装依赖：
```bash
pnpm install
```

3. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接
```

4. 初始化数据库：
```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

5. 启动开发服务器：
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 💻 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器

# 代码质量
pnpm lint             # 运行 ESLint
pnpm lint:fix         # 自动修复 ESLint 错误
pnpm format           # 使用 Prettier 格式化
pnpm format:check     # 检查代码格式
pnpm typecheck        # TypeScript 类型检查

# 测试
pnpm test             # 运行测试
pnpm test:watch       # 监听模式
pnpm test:coverage    # 生成覆盖率报告

# 数据库
pnpm prisma:generate  # 生成 Prisma Client
pnpm prisma:migrate   # 运行数据库迁移
pnpm prisma:studio    # 打开 Prisma Studio
pnpm prisma:seed      # 填充测试数据
```

## 📁 项目结构

```
blog/
├── docs/                  # 项目文档
├── prisma/                # 数据库 schema 和迁移
├── public/                # 静态资源
├── src/
│   ├── app/              # Next.js 应用路由
│   │   ├── (blog)/       # 博客前台
│   │   ├── (admin)/      # 后台管理
│   │   └── api/          # API 路由
│   ├── components/       # React 组件
│   │   ├── layout/       # 布局组件
│   │   ├── post/         # 文章组件
│   │   ├── media/        # 媒体组件
│   │   ├── common/       # 通用组件
│   │   └── ui/           # shadcn/ui 组件
│   ├── lib/              # 工具库
│   │   ├── db/           # 数据库和 DAO
│   │   ├── auth/         # 认证逻辑
│   │   ├── markdown/     # Markdown 处理
│   │   └── utils/        # 工具函数
│   └── types/            # TypeScript 类型定义
└── tests/                # 测试文件
```

## 🔑 默认账号

数据库初始化后的默认管理员账号：
- 邮箱: `admin@example.com`
- 密码: `admin123`

**⚠️ 生产环境请务必修改默认密码！**

## 🎨 设计理念

- **极简主义**：去除一切不必要的装饰，让内容成为主角
- **舒适阅读**：合理的字号、行高、宽度，提供最佳阅读体验
- **流畅交互**：细腻的动画和微交互，提升用户体验
- **响应式设计**：完美适配桌面、平板、手机等各种设备

## 📝 开发规范

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 提交规范
- 使用 DAO 模式访问数据库，不直接调用 Prisma
- 仅使用 shadcn/ui 组件和 Tailwind CSS，不使用其他 UI 库
- 所有文档放在 `docs/` 目录下

## 🚢 部署

推荐部署平台：
- **Vercel** (推荐，Next.js 官方平台)
- **Netlify**
- **自建服务器** (Docker)

生产环境数据库推荐：
- PostgreSQL
- Supabase
- PlanetScale

## 📄 许可证

MIT

## 🤝 贡献

欢迎贡献！请先阅读贡献指南。
