# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern blog system built with Next.js 16 App Router, TypeScript, Prisma ORM, and SQLite (for local development). The project follows a layered architecture with clear separation between presentation, application logic, and data access layers.

**Note**: The project is currently configured to use SQLite for local development. To switch to PostgreSQL for production, update `prisma/schema.prisma` datasource provider and the `DATABASE_URL` in `.env`.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint errors
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type checking

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode (DO NOT use in Claude Code)
pnpm test:coverage    # Generate coverage report

# Database
pnpm prisma:generate  # Generate Prisma Client (run after schema changes)
pnpm prisma:migrate   # Create and run migrations
pnpm prisma:studio    # Open Prisma Studio GUI
pnpm prisma:seed      # Seed database with test data
```

## Architecture

### Layered Structure

1. **Presentation Layer** (`src/app/`, `src/components/`)
   - Next.js App Router with Server Components
   - Route groups: `(auth)`, `(blog)`, `(admin)`
   - UI components built with shadcn/ui + Tailwind CSS

2. **Application Layer** (`src/lib/`)
   - Business logic and services
   - Authentication (NextAuth.js)
   - Markdown processing (MDX + Shiki)
   - Utilities and helpers

3. **Data Layer** (`src/lib/db/`)
   - Prisma ORM with PostgreSQL
   - DAO pattern for data access
   - All database queries go through DAO classes

### DAO Pattern

All database operations MUST use the DAO layer (`src/lib/db/dao/`). Never call Prisma directly from components or API routes.

```typescript
// ✅ Correct
import { postDAO } from '@/lib/db/dao/post-dao'
const posts = await postDAO.findMany({ published: true })

// ❌ Wrong
import { prisma } from '@/lib/db/prisma'
const posts = await prisma.post.findMany({ where: { published: true } })
```

Available DAOs:
- `postDAO` - Post CRUD, view/like counters, filtering by category/tag/author
- `userDAO` - User management
- `commentDAO` - Comment CRUD with nested replies
- `categoryDAO` - Category management
- `tagDAO` - Tag management

### Database Schema

Key models:
- **User**: Authentication, role-based access (USER/ADMIN)
- **Post**: Articles with slug, content (Markdown), published status, view/like counts
- **Category**: One-to-many with Post
- **Tag**: Many-to-many with Post
- **Comment**: Nested comments with parent-child relationships

All models use `cuid()` for IDs and include `createdAt`/`updatedAt` timestamps.

## Code Standards

### UI Components

- **ONLY use shadcn/ui components** - no other UI libraries
- **ONLY use Tailwind CSS** - no inline styles or CSS modules
- Use `cn()` utility from `@/lib/utils/cn` for conditional classes
- Components in `src/components/ui/` are from shadcn/ui (don't modify)
- Custom components go in `src/components/layout/`, `src/components/post/`, etc.

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

<Button className={cn("px-4", isActive && "bg-primary")}>Click</Button>

// ❌ Wrong
<button style={{ padding: '16px' }}>Click</button>
```

### TypeScript

- Strict type checking enabled
- All types defined in `src/types/`
- Use interfaces for object shapes
- Avoid `any` - use `unknown` if type is truly unknown
- Leverage Prisma's generated types

### API Routes

- Use Zod for request validation
- Return consistent response format: `{ success: boolean, data?: T, error?: string }`
- Authentication checks via NextAuth.js
- All data access through DAO layer

### Testing

- Vitest + Testing Library for unit/component tests
- Tests in `tests/` directory
- Run `pnpm test` (NOT `pnpm test:watch` in Claude Code)
- Core utilities and DAOs should have test coverage

## Git Workflow

### Commit Convention

Follow Conventional Commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting (no functional changes)
- `refactor:` - Code restructuring
- `test:` - Test additions/changes
- `chore:` - Build/tooling changes
- `perf:` - Performance improvements

Examples:
```bash
feat: add markdown editor component
fix: resolve image upload issue in post creation
docs: update API documentation
```

### Branch Strategy

- `main` - Production branch
- `develop` - Integration branch only; do not implement current feature work directly here
- `feature/*` - Feature branches (from develop)
- `fix/*` - Bug fixes
- `chore/*` - Docs, tooling, dependency, and non-feature work
- `hotfix/*` - Emergency fixes (from main)

Rule: start regular work from `develop`, but do the actual implementation on a short-lived work branch and merge back by PR.

## Important Notes

### Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth.js secret (min 32 chars)

### MDX Configuration

- MDX files processed with `@next/mdx`
- Code highlighting via Shiki
- Configuration in `next.config.js`

### Image Handling

- Use Next.js `<Image>` component
- Remote patterns configured for any HTTPS domain
- Local images in `public/` directory

### Server Actions

- Body size limit: 2MB (configured in next.config.js)
- Use for form submissions and mutations
- Always validate input with Zod

## Common Patterns

### Creating a New Page

1. Add route in `src/app/(blog)/` or `src/app/(admin)/`
2. Use Server Components by default
3. Mark as Client Component only if needed (`'use client'`)
4. Fetch data directly in Server Components via DAO

### Adding a New API Endpoint

1. Create route handler in `src/app/api/`
2. Define Zod schema for validation
3. Use DAO for database operations
4. Return consistent response format

### Adding a New Database Model

1. Update `prisma/schema.prisma`
2. Run `pnpm prisma:migrate`
3. Create DAO class in `src/lib/db/dao/`
4. Define TypeScript types in `src/types/`
5. Export DAO instance for use in app

## Documentation

All project documentation is organized in the `docs/` directory:
- `docs/ARCHITECTURE.md` - Detailed architecture and design patterns
- `docs/PROJECT_SETUP.md` - Initial setup and configuration guide
- `docs/DESIGN_PROPOSAL.md` - UI/UX design specifications
- `docs/DEVELOPMENT_PLAN.md` - Implementation roadmap and tasks
- `docs/GIT_WORKFLOW.md` - Git branching, PR, merge, and release workflow

**Important**: When creating new documentation files, always place them in the `docs/` directory.

## Troubleshooting

- **Prisma Client errors**: Run `pnpm prisma:generate`
- **Type errors after schema changes**: Restart TypeScript server
- **Database connection issues**: Check `DATABASE_URL` in `.env`
- **Build errors**: Run `pnpm typecheck` and `pnpm lint` first
