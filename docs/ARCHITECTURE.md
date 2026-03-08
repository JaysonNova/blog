# Blog 项目架构设计方案

> 基于 Next.js 14+ 的简约博客系统 - 参考 ArchMind 架构设计

---

## 项目概述

**简约博客系统** - 一个现代化、高性能的个人博客平台，专注于内容创作和阅读体验。

### 核心特性

- 📝 Markdown 文章编写与渲染
- 🎨 响应式设计，支持暗色模式
- 🏷️ 标签和分类管理
- 🔍 全文搜索
- 💬 评论系统
- 📊 文章统计（阅读量、点赞）
- 🚀 静态生成 (SSG) + 增量静态再生 (ISR)
- 🔐 管理后台（文章 CRUD）

---

## 技术栈

### 核心框架

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Next.js | ^14.2.0 | App Router + Server Components |
| 语言 | TypeScript | ^5.4.0 | 严格类型检查 |
| UI 组件 | shadcn/ui | latest | Radix UI + Tailwind |
| 样式 | Tailwind CSS | ^3.4.0 | 原子化 CSS |
| 数据库 | PostgreSQL | 14+ | 关系型数据库 |
| ORM | Prisma | ^5.0.0 | 类型安全的 ORM |
| 认证 | NextAuth.js | ^5.0.0 | 认证解决方案 |
| 表单验证 | React Hook Form + Zod | ^7.51.0 / ^3.23.0 | 表单管理 + 验证 |
| 状态管理 | Zustand | ^4.5.0 | 轻量级状态管理 |
| Markdown | MDX | ^3.0.0 | Markdown + JSX |
| 代码高亮 | Shiki | ^1.0.0 | 语法高亮 |
| 测试 | Vitest + Testing Library | ^1.6.0 | 单元测试 + 组件测试 |

### 开发工具

| 工具 | 用途 |
|------|------|
| ESLint | 代码检查 |
| Prettier | 代码格式化 |
| Husky | Git Hooks |
| lint-staged | 提交前检查 |
| commitlint | Commit 规范检查 |

---

## 项目结构

```
blog/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # 认证路由组
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (blog)/              # 博客路由组
│   │   │   ├── page.tsx         # 首页
│   │   │   ├── posts/           # 文章列表
│   │   │   ├── post/[slug]/     # 文章详情
│   │   │   ├── tags/            # 标签页
│   │   │   ├── categories/      # 分类页
│   │   │   └── about/           # 关于页
│   │   ├── (admin)/             # 管理后台路由组
│   │   │   ├── dashboard/
│   │   │   ├── posts/
│   │   │   ├── comments/
│   │   │   └── settings/
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/            # 认证 API
│   │   │   ├── posts/           # 文章 API
│   │   │   ├── comments/        # 评论 API
│   │   │   └── search/          # 搜索 API
│   │   ├── layout.tsx           # 根布局
│   │   └── globals.css          # 全局样式
│   │
│   ├── components/              # React 组件
│   │   ├── ui/                  # shadcn/ui 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/              # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── post/                # 文章相关组件
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostContent.tsx
│   │   │   └── PostMeta.tsx
│   │   ├── comment/             # 评论组件
│   │   │   ├── CommentList.tsx
│   │   │   └── CommentForm.tsx
│   │   ├── editor/              # 编辑器组件
│   │   │   └── MarkdownEditor.tsx
│   │   └── common/              # 通用组件
│   │       ├── SearchBar.tsx
│   │       ├── TagCloud.tsx
│   │       └── Pagination.tsx
│   │
│   ├── lib/                     # 核心业务逻辑
│   │   ├── db/                  # 数据库层
│   │   │   ├── prisma.ts        # Prisma 客户端
│   │   │   └── dao/             # 数据访问层
│   │   │       ├── post-dao.ts
│   │   │       ├── comment-dao.ts
│   │   │       ├── tag-dao.ts
│   │   │       └── user-dao.ts
│   │   ├── auth/                # 认证逻辑
│   │   │   └── auth-config.ts
│   │   ├── markdown/            # Markdown 处理
│   │   │   ├── parser.ts
│   │   │   └── renderer.ts
│   │   ├── search/              # 搜索引擎
│   │   │   └── search-service.ts
│   │   └── utils/               # 工具函数
│   │       ├── cn.ts            # className 合并
│   │       ├── date.ts          # 日期格式化
│   │       └── slug.ts          # URL slug 生成
│   │
│   ├── hooks/                   # React Hooks
│   │   ├── use-posts.ts
│   │   ├── use-comments.ts
│   │   └── use-theme.ts
│   │
│   ├── stores/                  # Zustand 状态管理
│   │   ├── auth-store.ts
│   │   └── ui-store.ts
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── post.ts
│   │   ├── comment.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   └── middleware.ts            # Next.js 中间件
│
├── prisma/                      # Prisma 配置
│   ├── schema.prisma            # 数据库 Schema
│   ├── migrations/              # 数据库迁移
│   └── seed.ts                  # 种子数据
│
├── public/                      # 静态资源
│   ├── images/
│   └── fonts/
│
├── tests/                       # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                     # GitHub 配置
│   └── workflows/
│       ├── ci.yml               # CI 流程
│       └── deploy.yml           # 部署流程
│
├── .husky/                      # Git Hooks
├── components.json              # shadcn/ui 配置
├── next.config.js               # Next.js 配置
├── tailwind.config.ts           # Tailwind 配置
├── tsconfig.json                # TypeScript 配置
├── .eslintrc.json               # ESLint 配置
├── .prettierrc                  # Prettier 配置
├── .env.example                 # 环境变量模板
└── package.json
```

---

## 核心架构

### 1. 分层架构

```
┌─────────────────────────────────────────────────────────┐
│              Presentation Layer (UI)                     │
│  App Router · Server Components · Client Components     │
│         shadcn/ui + Tailwind CSS                        │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              Application Layer (Logic)                   │
│  API Routes · Server Actions · Business Logic           │
│  Hooks · Stores · Validation (Zod)                      │
└──────┬────────────────────┬────────────────┬────────────┘
       │                    │                │
┌──────▼──────┐  ┌──────────▼──────┐  ┌─────▼────────────┐
│  Auth       │  │  Markdown        │  │  Search          │
│  Service    │  │  Service         │  │  Service         │
│             │  │                  │  │                  │
│ NextAuth.js │  │  MDX + Shiki     │  │  PostgreSQL FTS  │
└──────┬──────┘  └──────────┬───────┘  └─────┬────────────┘
       │                    │                │
┌──────▼────────────────────▼────────────────▼────────────┐
│                    Data Layer                            │
│  Prisma ORM · PostgreSQL · DAO Pattern                  │
│  Type-safe queries · Migrations                         │
└─────────────────────────────────────────────────────────┘
```

### 2. 数据库设计

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  avatar        String?
  role          Role      @default(USER)
  posts         Post[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Post {
  id            String     @id @default(cuid())
  title         String
  slug          String     @unique
  content       String     @db.Text
  excerpt       String?
  coverImage    String?
  published     Boolean    @default(false)
  viewCount     Int        @default(0)
  likeCount     Int        @default(0)
  author        User       @relation(fields: [authorId], references: [id])
  authorId      String
  category      Category?  @relation(fields: [categoryId], references: [id])
  categoryId    String?
  tags          Tag[]      @relation("PostTags")
  comments      Comment[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  publishedAt   DateTime?

  @@index([slug])
  @@index([published])
  @@index([authorId])
}

model Category {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  description   String?
  posts         Post[]
  createdAt     DateTime  @default(now())
}

model Tag {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  posts         Post[]    @relation("PostTags")
  createdAt     DateTime  @default(now())
}

model Comment {
  id            String    @id @default(cuid())
  content       String    @db.Text
  author        User      @relation(fields: [authorId], references: [id])
  authorId      String
  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId        String
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  parentId      String?
  replies       Comment[] @relation("CommentReplies")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([postId])
  @@index([authorId])
}

enum Role {
  USER
  ADMIN
}
```

### 3. API 设计

#### RESTful API 规范

```typescript
// GET /api/posts - 获取文章列表
// GET /api/posts/[id] - 获取文章详情
// POST /api/posts - 创建文章（需认证）
// PUT /api/posts/[id] - 更新文章（需认证）
// DELETE /api/posts/[id] - 删除文章（需认证）

// 示例实现
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { postDAO } from '@/lib/db/dao/post-dao'
import { requireAuth } from '@/lib/auth/auth-helpers'

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  tag: z.string().optional(),
  published: z.coerce.boolean().optional()
})

export async function GET(request: NextRequest) {
  try {
    // 1. 验证查询参数
    const { searchParams } = new URL(request.url)
    const query = QuerySchema.parse(Object.fromEntries(searchParams))

    // 2. 查询数据
    const result = await postDAO.findMany(query)

    // 3. 返回结果
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. 认证检查
    const user = await requireAuth(request)

    // 2. 验证请求体
    const body = await request.json()
    const data = PostSchema.parse(body)

    // 3. 创建文章
    const post = await postDAO.create({
      ...data,
      authorId: user.id
    })

    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
}
```

---

## 开发规范

### 1. Git 工作流（参考 ArchMind）

#### 分支策略

```
main          ← 生产分支，永远保持可发布状态
develop       ← 开发分支，功能集成
feature/*     ← 功能分支，从 develop 切出
fix/*         ← 修复分支
hotfix/*      ← 紧急修复，从 main 切出
```

#### Commit 规范（Conventional Commits）

```bash
feat: 新功能
fix: Bug 修复
docs: 文档变更
style: 代码格式（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具链变更
perf: 性能优化
```

示例：
```bash
feat: add markdown editor component
fix: resolve image upload issue in post creation
docs: update API documentation
```

### 2. 代码规范

#### TypeScript 规范

```typescript
// ✅ 使用接口定义类型
interface Post {
  id: string
  title: string
  content: string
  published: boolean
}

// ✅ 使用类型推断
const posts = await postDAO.findMany() // 自动推断类型

// ✅ 避免 any
function processPost(post: Post): void { // 明确类型
  // ...
}

// ❌ 避免
function processPost(post: any): any {
  // ...
}
```

#### React 组件规范

```typescript
// ✅ 使用函数组件 + TypeScript
interface PostCardProps {
  post: Post
  onLike?: (id: string) => void
}

export function PostCard({ post, onLike }: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.excerpt}</p>
      </CardContent>
    </Card>
  )
}

// ✅ 使用 shadcn/ui 组件
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// ❌ 禁止使用其他 UI 库
// import { Button } from 'antd' // ❌
```

#### 样式规范

```tsx
// ✅ 只使用 Tailwind CSS
<div className="flex items-center gap-4 p-6 rounded-lg bg-card">
  <h2 className="text-2xl font-bold">Title</h2>
</div>

// ✅ 使用 cn() 处理条件类名
import { cn } from '@/lib/utils/cn'

<Button
  className={cn(
    "px-4 py-2",
    isActive && "bg-primary",
    isDisabled && "opacity-50"
  )}
>
  Click me
</Button>

// ❌ 禁止内联样式
<div style={{ padding: '24px' }}> // ❌
```

### 3. 测试规范

```typescript
// tests/unit/lib/utils/slug.test.ts
import { describe, it, expect } from 'vitest'
import { generateSlug } from '@/lib/utils/slug'

describe('generateSlug', () => {
  it('should convert title to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('should handle Chinese characters', () => {
    expect(generateSlug('你好世界')).toBe('ni-hao-shi-jie')
  })

  it('should remove special characters', () => {
    expect(generateSlug('Hello@World!')).toBe('hello-world')
  })
})
```

---

## 环境配置

### 环境变量

```bash
# .env.example

# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/blog"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# 应用配置
APP_URL="http://localhost:3000"
NODE_ENV="development"

# 可选：图片上传（Cloudinary/S3）
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# 可选：邮件服务（评论通知）
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER=""
EMAIL_PASS=""
```

---

## 部署方案

### Vercel 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 性能优化

### 1. 静态生成 (SSG)

```typescript
// src/app/post/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await postDAO.findAll({ published: true })
  return posts.map((post) => ({
    slug: post.slug
  }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await postDAO.findBySlug(params.slug)
  return <PostContent post={post} />
}
```

### 2. 增量静态再生 (ISR)

```typescript
export const revalidate = 3600 // 1 hour
```

### 3. 图片优化

```tsx
import Image from 'next/image'

<Image
  src={post.coverImage}
  alt={post.title}
  width={800}
  height={400}
  priority
  className="rounded-lg"
/>
```

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev              # 启动开发服务器 (http://localhost:3000)
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器

# 代码质量
pnpm lint             # ESLint 检查
pnpm lint:fix         # 自动修复
pnpm format           # Prettier 格式化
pnpm typecheck        # TypeScript 类型检查

# 测试
pnpm test             # 运行测试
pnpm test:watch       # 监听模式
pnpm test:coverage    # 测试覆盖率

# 数据库
pnpm prisma:generate  # 生成 Prisma Client
pnpm prisma:migrate   # 运行迁移
pnpm prisma:studio    # 打开 Prisma Studio
pnpm prisma:seed      # 添加种子数据
```

---

## 安全最佳实践

1. **认证与授权**
   - 使用 NextAuth.js 处理认证
   - JWT token 存储在 httpOnly cookie
   - API 路由强制认证检查

2. **输入验证**
   - 所有用户输入使用 Zod 验证
   - 防止 SQL 注入（Prisma 自动处理）
   - XSS 防护（React 自动转义）

3. **CSRF 防护**
   - NextAuth.js 内置 CSRF token
   - API 路由验证 Origin header

4. **Rate Limiting**
   - 使用 Upstash Rate Limit
   - 限制 API 请求频率

---

## 参考文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com)
- [Prisma 文档](https://www.prisma.io/docs)
- [NextAuth.js 文档](https://next-auth.js.org)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

*架构设计版本: 1.0.0*
*最后更新: 2026-03-08*
