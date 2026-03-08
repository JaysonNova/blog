/model# 开发方案

基于 [DESIGN_PROPOSAL.md](./DESIGN_PROPOSAL.md) 的详细实施计划。

## 一、技术栈确认

### 1.1 现有技术栈（保持）

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **数据库**: Prisma ORM + SQLite (开发) / PostgreSQL (生产)
- **认证**: NextAuth.js
- **测试**: Vitest + Testing Library

### 1.2 新增依赖库

**动画库**
- `framer-motion` - 页面过渡、微交互动画

**图片处理**
- `react-photo-view` - 图片灯箱（Lightbox）
- `react-masonry-css` - 瀑布流布局

**Markdown 增强**
- `rehype-pretty-code` - 代码高亮（基于 Shiki）
- `rehype-slug` - 为标题生成 ID
- `rehype-autolink-headings` - 标题锚点链接
- `remark-gfm` - GitHub Flavored Markdown 支持

**工具库**
- `date-fns` - 日期格式化
- `reading-time` - 计算文章阅读时间
- `react-intersection-observer` - 滚动动画触发

**图标库**
- `lucide-react` - 图标组件（shadcn/ui 推荐）

## 二、项目结构规划

### 2.1 目录结构

```
blog/
├── docs/                      # 项目文档
│   ├── ARCHITECTURE.md
│   ├── DESIGN_PROPOSAL.md
│   ├── DEVELOPMENT_PLAN.md
│   └── PROJECT_SETUP.md
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── images/               # 静态图片
│   ├── videos/               # 视频文件（可选）
│   └── fonts/                # 自定义字体（可选）
├── src/
│   ├── app/
│   │   ├── (blog)/          # 博客前台路由组
│   │   │   ├── page.tsx     # 首页
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx           # 文章列表
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # 文章详情
│   │   │   ├── photography/
│   │   │   │   └── page.tsx           # 摄影页
│   │   │   ├── videos/
│   │   │   │   └── page.tsx           # 视频页
│   │   │   └── about/
│   │   │       └── page.tsx           # 关于页
│   │   ├── (admin)/         # 后台管理路由组
│   │   │   ├── dashboard/
│   │   │   ├── posts/
│   │   │   └── media/
│   │   ├── (auth)/          # 认证路由组
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/
│   │   │   ├── posts/
│   │   │   ├── media/
│   │   │   ├── comments/
│   │   │   └── auth/
│   │   ├── layout.tsx       # 根布局
│   │   └── globals.css      # 全局样式
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── post/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostContent.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   └── CodeBlock.tsx
│   │   ├── media/
│   │   │   ├── PhotoGallery.tsx
│   │   │   ├── PhotoLightbox.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   └── VideoPlayer.tsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── ScrollToTop.tsx
│   │   └── ui/              # shadcn/ui 组件
│   ├── lib/
│   │   ├── db/
│   │   │   ├── prisma.ts
│   │   │   └── dao/
│   │   ├── auth/
│   │   ├── markdown/
│   │   │   ├── mdx.ts
│   │   │   └── plugins.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── date.ts
│   │       └── reading-time.ts
│   └── types/
│       ├── post.ts
│       ├── media.ts
│       └── user.ts
├── tests/
├── .env
├── .env.example
├── CLAUDE.md
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### 2.2 数据库模型扩展

在现有模型基础上，需要添加媒体相关模型：

```prisma
// prisma/schema.prisma

model Photo {
  id          String   @id @default(cuid())
  title       String?
  description String?
  url         String
  width       Int
  height      Int
  location    String?
  camera      String?
  lens        String?
  iso         Int?
  aperture    String?
  shutterSpeed String?
  takenAt     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Video {
  id          String   @id @default(cuid())
  title       String
  description String?
  url         String
  thumbnail   String?
  duration    Int?     // 秒
  platform    String?  // youtube, bilibili, local
  platformId  String?  // 平台视频 ID
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// 扩展 User 模型
model User {
  // ... 现有字段
  photos      Photo[]
  videos      Video[]
  bio         String?
  avatar      String?
  website     String?
  github      String?
  twitter     String?
}
```

## 三、开发阶段规划

### 阶段一：基础框架（第 1-2 周）

#### 任务 1.1：设计系统搭建

**目标**：建立统一的设计语言和主题系统

**任务清单**：
- [ ] 配置 Tailwind CSS 颜色变量
  - 定义浅色/深色模式色板
  - 配置语义化颜色（primary, secondary, accent）
- [ ] 设置字体系统
  - 配置中英文字体栈
  - 设置字号、行高、字重变量
- [ ] 实现主题切换功能
  - 创建 ThemeProvider 组件
  - 实现 ThemeToggle 按钮
  - 使用 localStorage 持久化主题选择
- [ ] 配置间距系统（8px 基准网格）

**技术要点**：
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 浅色模式
        light: {
          primary: '#1a1a1a',
          secondary: '#666666',
          tertiary: '#999999',
          background: '#ffffff',
          accent: '#0066cc',
        },
        // 深色模式
        dark: {
          primary: '#e5e5e5',
          secondary: '#a0a0a0',
          tertiary: '#707070',
          background: '#0a0a0a',
          accent: '#4d9fff',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', ...],
        mono: ['SF Mono', 'Fira Code', 'Consolas', ...],
      },
      spacing: {
        // 8px 基准
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
    },
  },
}
```

**验收标准**：
- 主题切换流畅，无闪烁
- 颜色对比度符合 WCAG AA 标准
- 字体在各平台显示正常

#### 任务 1.2：核心布局组件

**目标**：创建可复用的布局组件

**任务清单**：
- [ ] Header 导航栏
  - 桌面端：Logo + 导航链接 + 主题切换
  - 移动端：Logo + 汉堡菜单
  - 滚动时自动隐藏/显示
  - 半透明毛玻璃效果
- [ ] Footer 页脚
  - 版权信息
  - 社交媒体链接
  - 备案信息（可选）
- [ ] MobileMenu 移动端菜单
  - 全屏抽屉式菜单
  - 从右侧滑入动画
  - 点击外部关闭
- [ ] 响应式容器组件
  - 最大宽度 1200px
  - 自动居中
  - 响应式内边距

**技术要点**：
```typescript
// components/layout/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'

export function Header() {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      const previous = scrollY.getPrevious()
      if (latest > previous && latest > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }
    })
  }, [scrollY])

  return (
    <header className={cn(
      "fixed top-0 w-full backdrop-blur-md bg-white/80 dark:bg-black/80",
      "transition-transform duration-300",
      hidden && "-translate-y-full"
    )}>
      {/* 导航内容 */}
    </header>
  )
}
```

**验收标准**：
- 导航栏在所有页面正常显示
- 滚动隐藏/显示动画流畅
- 移动端菜单交互正常
- 响应式布局在各设备正常

#### 任务 1.3：安装新增依赖

**任务清单**：
- [ ] 安装动画库：`pnpm add framer-motion`
- [ ] 安装图片处理库：`pnpm add react-photo-view react-masonry-css`
- [ ] 安装 Markdown 增强：`pnpm add rehype-pretty-code rehype-slug rehype-autolink-headings remark-gfm`
- [ ] 安装工具库：`pnpm add date-fns reading-time react-intersection-observer`
- [ ] 安装图标库：`pnpm add lucide-react`
- [ ] 更新 TypeScript 类型：`pnpm add -D @types/react-masonry-css`

**验收标准**：
- 所有依赖安装成功
- 无版本冲突
- `pnpm typecheck` 通过

---

### 阶段二：首页与文章功能（第 3-5 周）

#### 任务 2.1：首页设计

**目标**：创建简洁优雅的首页

**任务清单**：
- [ ] 个人简介区域
  - 头像组件（圆形，120px）
  - 名字（H1）
  - 一句话介绍
  - 社交媒体图标链接
- [ ] 内容导航卡片
  - 3 个大卡片：文章、摄影、视频
  - Hover 上浮效果
  - 点击跳转到对应页面
- [ ] 最新文章列表
  - 显示 3-5 篇最新文章
  - 文章卡片：标题、摘要、日期、阅读时间
  - "查看更多"链接

**技术要点**：
```typescript
// app/(blog)/page.tsx
import { postDAO } from '@/lib/db/dao/post-dao'
import { PostCard } from '@/components/post/PostCard'

export default async function HomePage() {
  const latestPosts = await postDAO.findMany({
    published: true,
    limit: 5,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main>
      <section className="hero">
        {/* 个人简介 */}
      </section>

      <section className="content-nav">
        {/* 内容导航卡片 */}
      </section>

      <section className="latest-posts">
        <h2>最新文章</h2>
        {latestPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  )
}
```

**验收标准**：
- 首页布局美观，间距合理
- 卡片 hover 效果流畅
- 数据正确从数据库获取

#### 任务 2.2：文章列表页

**目标**：展示所有文章，支持分类筛选

**任务清单**：
- [ ] 分类筛选组件
  - 横向标签列表
  - 当前分类高亮
  - 点击切换分类
- [ ] 文章列表组件
  - 文章卡片列表
  - 每页 10 篇文章
  - 分页导航
- [ ] 空状态处理
  - 无文章时显示提示

**技术要点**：
```typescript
// app/(blog)/articles/page.tsx
import { postDAO } from '@/lib/db/dao/post-dao'
import { categoryDAO } from '@/lib/db/dao/category-dao'

export default async function ArticlesPage({
  searchParams
}: {
  searchParams: { category?: string; page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const categorySlug = searchParams.category

  const [posts, categories, total] = await Promise.all([
    postDAO.findMany({
      published: true,
      categorySlug,
      limit: 10,
      offset: (page - 1) * 10,
    }),
    categoryDAO.findAll(),
    postDAO.count({ published: true, categorySlug })
  ])

  return (
    <main>
      <CategoryFilter categories={categories} current={categorySlug} />
      <PostList posts={posts} />
      <Pagination page={page} total={total} perPage={10} />
    </main>
  )
}
```

**验收标准**：
- 分类筛选正常工作
- 分页导航正确
- URL 参数正确更新

#### 任务 2.3：文章详情页

**目标**：提供舒适的阅读体验

**任务清单**：
- [ ] 文章头部
  - 标题（H1）
  - 元信息：日期、阅读时间、分类、标签
- [ ] 文章内容渲染
  - Markdown 转 HTML
  - 代码高亮（Shiki）
  - 图片优化（Next.js Image）
  - 引用块样式
  - 表格样式
- [ ] 目录导航（可选）
  - 提取 H2、H3 标题
  - 固定在右侧
  - 当前阅读位置高亮
  - 点击滚动到对应位置
- [ ] 文章底部
  - 标签列表
  - 分享按钮（可选）
  - 上一篇/下一篇导航
- [ ] 评论区
  - 评论列表
  - 评论表单
  - 嵌套回复

**技术要点**：
```typescript
// lib/markdown/mdx.ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'

export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypePrettyCode, {
      theme: 'github-dark',
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}
```

**验收标准**：
- Markdown 正确渲染
- 代码高亮美观
- 目录导航正常工作
- 评论功能正常

#### 任务 2.4：阅读时间计算

**任务清单**：
- [ ] 创建 reading-time 工具函数
- [ ] 在文章列表和详情页显示阅读时间

**技术要点**：
```typescript
// lib/utils/reading-time.ts
import readingTime from 'reading-time'

export function getReadingTime(content: string) {
  const stats = readingTime(content, {
    wordsPerMinute: 200, // 中文约 200 字/分钟
  })
  return Math.ceil(stats.minutes)
}
```

---

### 阶段三：媒体展示（第 6-7 周）

#### 任务 3.1：摄影页

**目标**：瀑布流展示照片，支持灯箱查看

**任务清单**：
- [ ] 扩展数据库模型（Photo）
- [ ] 创建 Photo DAO
- [ ] 瀑布流布局组件
  - 响应式列数（桌面 4 列，平板 2 列，手机 1 列）
  - 图片懒加载
  - 滚动渐入动画
- [ ] 图片灯箱组件
  - 点击图片打开灯箱
  - 左右切换
  - 缩放功能
  - ESC 关闭
- [ ] 照片上传功能（后台）

**技术要点**：
```typescript
// components/media/PhotoGallery.tsx
'use client'

import Masonry from 'react-masonry-css'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Image from 'next/image'

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const breakpointColumns = {
    default: 4,
    1024: 2,
    640: 1,
  }

  return (
    <PhotoProvider>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {photos.map(photo => (
          <PhotoView key={photo.id} src={photo.url}>
            <Image
              src={photo.url}
              alt={photo.title || ''}
              width={photo.width}
              height={photo.height}
              className="cursor-pointer"
            />
          </PhotoView>
        ))}
      </Masonry>
    </PhotoProvider>
  )
}
```

**验收标准**：
- 瀑布流布局美观
- 图片懒加载正常
- 灯箱功能完整

#### 任务 3.2：视频页

**目标**：展示视频列表，支持嵌入播放

**任务清单**：
- [ ] 扩展数据库模型（Video）
- [ ] 创建 Video DAO
- [ ] 视频卡片组件
  - 16:9 封面
  - 播放按钮
  - 标题、时长
- [ ] 视频播放器组件
  - 支持 YouTube、Bilibili 嵌入
  - 支持本地视频（HTML5 video）
  - 点击展开播放
- [ ] 视频上传功能（后台）

**技术要点**：
```typescript
// components/media/VideoCard.tsx
'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

export function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="aspect-video">
        {video.platform === 'youtube' && (
          <iframe
            src={`https://www.youtube.com/embed/${video.platformId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {/* Bilibili, local video... */}
      </div>
    )
  }

  return (
    <div
      className="relative aspect-video cursor-pointer group"
      onClick={() => setPlaying(true)}
    >
      <Image src={video.thumbnail} alt={video.title} fill />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
        <Play className="w-16 h-16 text-white" />
      </div>
    </div>
  )
}
```

**验收标准**：
- 视频卡片显示正常
- 播放器嵌入正常
- 支持多平台视频

---

### 阶段四：优化与完善（第 8 周）

#### 任务 4.1：性能优化

**任务清单**：
- [ ] 图片优化
  - 使用 Next.js Image 组件
  - 配置 WebP 格式
  - 添加模糊占位符
- [ ] 代码分割
  - 动态导入重组件
  - 路由级别分割（Next.js 自动）
- [ ] 缓存策略
  - 配置 HTTP 缓存头
  - 使用 SWR 或 React Query（可选）
- [ ] 字体优化
  - 使用 next/font 优化字体加载
  - 字体子集化

**验收标准**：
- Lighthouse 性能分数 > 90
- 首屏加载时间 < 2s
- 图片加载流畅

#### 任务 4.2：动画与微交互

**任务清单**：
- [ ] 页面过渡动画
  - 路由切换淡入淡出
- [ ] 滚动动画
  - 元素进入视口时渐入
  - 使用 Intersection Observer
- [ ] 按钮微交互
  - Hover、Active 状态
- [ ] 卡片 Hover 效果
  - 上浮、阴影变化
- [ ] 加载状态
  - 骨架屏
  - Spinner

**技术要点**：
```typescript
// components/common/FadeIn.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function FadeIn({ children }: { children: React.ReactNode }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
```

**验收标准**：
- 动画流畅，无卡顿
- 不影响性能
- 符合设计规范

#### 任务 4.3：错误处理与边界情况

**任务清单**：
- [ ] 404 页面
- [ ] 500 错误页面
- [ ] 空状态处理
  - 无文章
  - 无照片
  - 无视频
- [ ] 加载状态
- [ ] 错误提示（Toast）

**验收标准**：
- 所有错误情况有友好提示
- 不会出现白屏

#### 任务 4.4：SEO 优化

**任务清单**：
- [ ] 元标签配置
  - title, description
  - Open Graph
  - Twitter Card
- [ ] Sitemap 生成
- [ ] robots.txt
- [ ] 结构化数据（JSON-LD）

**技术要点**：
```typescript
// app/(blog)/articles/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await postDAO.findBySlug(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    },
  }
}
```

**验收标准**：
- 元标签正确
- Sitemap 可访问
- 结构化数据验证通过

---

## 四、测试策略

### 4.1 单元测试

**测试范围**：
- 工具函数（date, reading-time, cn）
- DAO 层方法
- Markdown 处理函数

**工具**：Vitest + Testing Library

### 4.2 组件测试

**测试范围**：
- UI 组件（Button, Card, Input）
- 布局组件（Header, Footer）
- 业务组件（PostCard, PhotoGallery）

**工具**：Vitest + Testing Library

### 4.3 E2E 测试（可选）

**测试范围**：
- 关键用户流程
- 文章浏览
- 评论提交

**工具**：Playwright（可选）

---

## 五、部署方案

### 5.1 开发环境

- 本地开发：`pnpm dev`
- 数据库：SQLite
- 端口：3000

### 5.2 生产环境

**推荐平台**：
- Vercel（推荐，Next.js 官方）
- Netlify
- 自建服务器（Docker）

**数据库**：
- PostgreSQL（推荐）
- Supabase
- PlanetScale

**环境变量**：
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=...
```

**部署步骤**：
1. 推送代码到 GitHub
2. 连接 Vercel 项目
3. 配置环境变量
4. 运行数据库迁移
5. 自动部署

---

## 六、开发规范

### 6.1 代码规范

- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 提交前运行 `pnpm lint` 和 `pnpm typecheck`

### 6.2 Git 规范

- 遵循 Conventional Commits
- 每个功能一个分支
- PR 合并前需要 Review

### 6.3 组件规范

- 使用 TypeScript
- Props 定义接口
- 添加 JSDoc 注释
- 导出类型

---

## 七、时间估算

| 阶段 | 任务 | 预计时间 |
|------|------|----------|
| 阶段一 | 基础框架 | 1-2 周 |
| 阶段二 | 首页与文章 | 2-3 周 |
| 阶段三 | 媒体展示 | 1-2 周 |
| 阶段四 | 优化完善 | 1 周 |
| **总计** | | **5-8 周** |

---

## 八、风险与应对

### 8.1 技术风险

**风险**：Markdown 渲染性能问题
**应对**：使用 SSG 预渲染，缓存 HTML

**风险**：图片加载慢
**应对**：使用 CDN，图片压缩，懒加载

**风险**：数据库查询慢
**应对**：添加索引，使用分页，缓存查询结果

### 8.2 进度风险

**风险**：功能开发超时
**应对**：优先实现核心功能，次要功能后续迭代

---

## 九、后续迭代计划

### 9.1 V1.0（MVP）

- 首页
- 文章列表与详情
- 基础布局

### 9.2 V1.1

- 摄影页
- 视频页
- 关于页

### 9.3 V1.2

- 评论系统
- 搜索功能
- RSS 订阅

### 9.4 V2.0

- 后台管理系统
- Markdown 编辑器
- 图片上传
- 数据统计

---

## 十、参考资源

### 10.1 官方文档

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)

### 10.2 设计参考

- [Lee Robinson 博客](https://leerob.io/)
- [Paco Coursey 博客](https://paco.me/)
- [Rauno Freiberg 博客](https://rauno.me/)

### 10.3 工具

- [Figma](https://www.figma.com/) - 设计工具
- [Coolors](https://coolors.co/) - 配色工具
- [Lucide Icons](https://lucide.dev/) - 图标库
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - 性能测试

---

**下一步**：开始阶段一的开发工作，首先安装新增依赖库。
