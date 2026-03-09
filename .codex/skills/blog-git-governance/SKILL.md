---
name: blog-git-governance
description: Standardize Git and GitHub workflow for the blog repository. Use when deciding which branch to work on, how to name branches, how to commit, when to open a pull request, how to merge changes into develop or main, how to handle hotfixes, or when executing repository Git operations that must follow this project's release policy.
---

# Blog Git Governance

## Overview

Apply the repository's branch, commit, pull request, merge, and release policy consistently.
Prefer this skill whenever the task touches `git`, `gh`, branch selection, commit strategy, PR flow, or production release decisions.

## Workflow

1. Read [references/workflow-policy.md](./references/workflow-policy.md) before changing branches, committing, or proposing a merge strategy.
2. Identify the target outcome first: feature work, bugfix, release, or hotfix.
3. Choose the branch according to the policy instead of improvising.
4. Keep commits scoped and use Conventional Commits.
5. Use GitHub pull requests for all merges into `develop` and `main`.
6. Run required validation before opening or merging a PR.
7. After release or hotfix work reaches `main`, sync the result back into `develop`.

## Execution Rules

- Treat `main` as production and keep it releasable.
- Treat `develop` as the integration branch for ongoing work.
- Do not commit directly to `main` or `develop` unless the user explicitly asks to bypass policy.
- Use `gh` for PR-oriented operations when authentication is available. Fall back to plain `git` only when `gh` is unavailable or unauthenticated.
- If the local repository state conflicts with policy, call it out before taking action.

## Validation

- For frontend or app changes, run:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm exec next build --webpack`
- Run `pnpm test` when changes touch logic that already has tests or should have regression coverage.
- Report validation results in the final response or PR summary.

## References

- Read [references/workflow-policy.md](./references/workflow-policy.md) for the exact branch model, PR rules, merge method, release flow, hotfix flow, and command playbook.
