# Blog Repository Git Workflow Policy

## 1. Branch Model

- `main`: production branch. Keep deployable. Do not develop directly on it.
- `develop`: default integration branch. Start normal work from here, but do not implement current feature changes directly on it.
- `feature/<scope>-<topic>`: new user-facing or internal feature work. Branch from `develop`.
- `fix/<scope>-<topic>`: non-production bugfix. Branch from `develop`.
- `chore/<scope>-<topic>`: tooling, dependency, docs, CI, or refactor work with no direct user-facing behavior. Branch from `develop`.
- `hotfix/<scope>-<topic>`: urgent production fix. Branch from `main`.

Do not create long-lived release branches unless the user explicitly asks for one.

## 2. Source Branch Decision

Choose the branch with this rule set:

1. If the change fixes production immediately, branch from `main` as `hotfix/...`.
2. If the change is regular feature, bugfix, refactor, docs, or tooling work, branch from `develop` and complete the implementation on `feature/*`, `fix/*`, or `chore/*`.
3. If the repository is currently on the wrong branch, switch before editing whenever practical.

Hard rule:

- `develop` receives merges; it is not the branch for current feature development.

## 3. Update Before Branching

Before creating a work branch:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/<scope>-<topic>
```

For hotfix work:

```bash
git switch main
git pull --ff-only origin main
git switch -c hotfix/<scope>-<topic>
```

Prefer `--ff-only` pulls. Avoid implicit merge commits from `git pull`.

## 4. Commit Rules

- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`.
- Keep one logical change per commit.
- Avoid mixing formatting-only edits with functional changes unless unavoidable.
- Commit from the work branch, not from `main` or `develop`.
- Current feature development commits must not be created directly on `develop`.
- If the worktree contains unrelated user changes, do not sweep them into the same commit without explicit approval.

## 5. Pull Request Policy

- Require a pull request for every merge into `develop`.
- Require a pull request for every merge into `main`.
- Even in solo development, open a PR for history, checks, and rollback clarity.
- Use GitHub CLI when possible:

```bash
gh pr create --base develop --head feature/<scope>-<topic>
gh pr checks
gh pr view --web
```

- If `gh` authentication is broken, push the branch and report that PR creation must be completed after re-authentication.

## 6. Merge Policy

### Feature, fix, and chore branches into `develop`

- Open PR from work branch to `develop`.
- Prefer **squash merge** to keep `develop` readable.
- Delete the source branch after merge.

### Release from `develop` into `main`

- Open PR from `develop` to `main`.
- Prefer a **merge commit** so the release boundary remains visible in history.
- Tag the release separately if the user asks for versioning.

### Hotfix into `main`

- Open PR from `hotfix/...` to `main`.
- Prefer **squash merge** if the hotfix is a single isolated patch.
- Prefer **merge commit** if the hotfix contains multiple audited commits that should stay grouped.

## 7. Back-Merge Rule

After anything lands on `main`, sync it back into `develop`.

Use one of these approaches:

1. Preferred: open a PR from `main` to `develop`.
2. Acceptable for a small solo repo: merge `main` into `develop` locally, then push.

Do not leave `develop` behind `main` after release or hotfix work.

## 8. Validation Gates

Before opening or merging a PR for this repository, run:

```bash
pnpm lint
pnpm typecheck
pnpm exec next build --webpack
```

Also run:

```bash
pnpm test
```

when touching tested logic, data access behavior, or bugfixes that should carry regression coverage.

## 9. Production Rules

- `main` is the production branch.
- Do not push directly to `main`.
- Do not merge unreviewed local work into `main`.
- Do not release from a dirty worktree.

## 10. Practical Playbooks

### Normal feature

1. Update `develop`.
2. Create `feature/...`.
3. Implement and commit.
4. Push branch.
5. Open PR to `develop`.
6. Pass checks.
7. Squash merge.

### Normal bugfix

1. Update `develop`.
2. Create `fix/...`.
3. Implement and commit.
4. Push branch.
5. Open PR to `develop`.
6. Pass checks.
7. Squash merge.

### Production hotfix

1. Update `main`.
2. Create `hotfix/...`.
3. Implement and validate.
4. Push branch.
5. Open PR to `main`.
6. Merge.
7. Sync `main` back into `develop`.

### Release

1. Ensure `develop` is stable.
2. Open PR from `develop` to `main`.
3. Merge to `main`.
4. Optionally tag release.
5. Sync `main` back into `develop`.
