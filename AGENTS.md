# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js 16 App Router application. Put routes in `src/app/`, shared UI in `src/components/`, business logic and utilities in `src/lib/`, and type declarations in `src/types/`. Database schema, migrations, and seed data live in `prisma/`. Tests live under `tests/` (`tests/unit/*.test.ts` and `tests/setup.ts`). Keep project docs in `docs/`; update `docs/GIT_WORKFLOW.md` when branch or release policy changes.

Use the DAO layer in `src/lib/db/dao/` for all database access. Do not import Prisma directly in pages, components, or route handlers.

## Build, Test, and Development Commands

- `pnpm dev`: start the local dev server on `http://localhost:3000`
- `pnpm lint`: run ESLint with Next.js + TypeScript rules
- `pnpm typecheck`: run strict TypeScript checks
- `pnpm test`: run Vitest once in `happy-dom`
- `pnpm test:coverage`: generate V8 coverage reports
- `pnpm build`: create a production build
- `pnpm exec next build --webpack`: preferred pre-merge verification path for this repo's current automation environment
- `pnpm prisma:generate` / `pnpm prisma:migrate` / `pnpm prisma:seed`: update and initialize database artifacts

## Coding Style & Naming Conventions

Use TypeScript, 2-space indentation, and the existing Prettier style (no manual formatting drift). Prefer Server Components by default; add `'use client'` only when needed. Name React components in PascalCase (`PostCard.tsx`), utilities in kebab-case (`reading-time.ts`), and test files as `*.test.ts(x)`.

Use Tailwind CSS and shadcn/ui patterns only. Reuse `cn()` from `src/lib/utils/cn.ts` for class composition. Keep route loading and error states colocated with their segment when applicable.

## Testing Guidelines

Vitest and Testing Library are the default stack. Add unit tests for utilities, DAO logic, and regression-prone UI behavior. When changing data flow, slug/date helpers, or rendering logic, add or update tests in `tests/unit/`. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before opening a PR.

## Commit & Pull Request Guidelines

Follow Conventional Commits, e.g. `feat: add article route skeleton` or `fix: prevent duplicate slug generation`. Production is `main`; daily integration is `develop`. Treat `develop` as merge-only integration: branch from it using `feature/*`, `fix/*`, or `chore/*`, and do not develop current features directly on `develop`. Use `hotfix/*` only from `main`.

Pull requests are required for merges into both `develop` and `main`. Prefer GitHub CLI: `gh pr create --base develop --head feature/<scope>-<topic>`. PRs should include a concise summary, linked issue when relevant, validation commands run, and screenshots for visible UI changes.
