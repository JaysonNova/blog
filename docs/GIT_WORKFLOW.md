# Git 工作流规范

本仓库采用 `main + develop + 短生命周期工作分支` 的 Git 工作流。

目标只有两个：

1. 保持 `main` 始终可发布
2. 让日常开发在 `develop` 上稳定集成

## 1. 分支职责

- `main`
  - 生产分支
  - 只接收已经完成验证、可以上线的代码
  - 不直接在此分支上开发
- `develop`
  - 日常集成分支
  - 普通功能、修复、重构、文档更新都先合到这里
- `feature/<scope>-<topic>`
  - 新功能分支
  - 从 `develop` 拉出
- `fix/<scope>-<topic>`
  - 普通缺陷修复分支
  - 从 `develop` 拉出
- `chore/<scope>-<topic>`
  - 工具链、依赖、CI、文档、非功能性整理
  - 从 `develop` 拉出
- `hotfix/<scope>-<topic>`
  - 线上紧急修复分支
  - 从 `main` 拉出

除非明确需要，不创建长期存在的 `release/*` 分支。

## 2. 在什么分支上开发

按下面规则判断：

1. 如果是线上紧急问题，直接从 `main` 拉 `hotfix/...`
2. 如果是常规开发任务，从 `develop` 拉工作分支
3. 如果当前所在分支不符合规则，先切分支，再开始改代码

## 3. 开发前更新基线

普通开发：

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/<scope>-<topic>
```

线上热修：

```bash
git switch main
git pull --ff-only origin main
git switch -c hotfix/<scope>-<topic>
```

统一使用 `git pull --ff-only`，避免无意生成额外 merge commit。

## 4. 提交规范

提交信息遵循 Conventional Commits：

- `feat:` 新功能
- `fix:` 缺陷修复
- `docs:` 文档修改
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 工具链、依赖、配置
- `perf:` 性能优化

约束如下：

- 一次提交只做一个逻辑变化
- 不把无关改动混进同一个 commit
- 不在 `main` 或 `develop` 上直接提交日常开发内容
- 如果工作区里有不属于当前任务的改动，先隔离，不要顺手一起提交

## 5. Pull Request 规则

本仓库要求：

- 合入 `develop` 必须走 Pull Request
- 合入 `main` 必须走 Pull Request
- 即使是单人项目，也保留 PR 作为评审、检查和发布记录

优先使用 GitHub CLI：

```bash
gh pr create --base develop --head feature/<scope>-<topic>
gh pr checks
gh pr view --web
```

如果 `gh` 认证失效，可以先 `git push`，之后再补建 PR。

## 6. 合并策略

### 工作分支 -> `develop`

- 目标：保持集成分支整洁
- 默认使用 `squash merge`
- 合并后删除源分支

### `develop` -> `main`

- 目标：形成明确的发布边界
- 默认使用 `merge commit`
- 如需版本号或标签，单独打 tag

### `hotfix/...` -> `main`

- 如果是单个独立修复，优先 `squash merge`
- 如果热修由多次审计过的提交组成，可使用 `merge commit`

## 7. 发布与回合并

### 正常发布流程

1. 确认 `develop` 状态稳定
2. 从 `develop` 向 `main` 发起 PR
3. 合并到 `main`
4. 按需打版本 tag
5. 将 `main` 的结果同步回 `develop`

### 热修流程

1. 从 `main` 拉出 `hotfix/...`
2. 修复并验证
3. 发起 PR 合入 `main`
4. 合并后把 `main` 回合并到 `develop`

无论是发布还是热修，只要有内容进入 `main`，都必须把结果同步回 `develop`，不能让两个分支长期分叉。

## 8. 合并前检查

前端或应用代码改动，至少运行：

```bash
pnpm lint
pnpm typecheck
pnpm exec next build --webpack
```

以下情况还应补跑：

```bash
pnpm test
```

适用场景：

- 修改已有测试覆盖的逻辑
- 修复 bug，需要回归验证
- 调整 DAO、数据处理、状态流转等容易引发回归的逻辑

## 9. 生产分支约束

- `main` 是生产分支
- 不直接 push 到 `main`
- 不把未经检查的本地代码直接并入 `main`
- 不在脏工作区执行发布操作

## 10. 推荐实践

- 开发统一从 `develop` 开始
- 功能、修复、文档、工具链都用独立工作分支
- 每个 PR 尽量只解决一个问题
- 合并前给出本次变更说明和验证结果
- 合并后及时删除工作分支

## 11. 快速模板

### 新功能

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/<scope>-<topic>
```

### 普通修复

```bash
git switch develop
git pull --ff-only origin develop
git switch -c fix/<scope>-<topic>
```

### 线上热修

```bash
git switch main
git pull --ff-only origin main
git switch -c hotfix/<scope>-<topic>
```

---

如果后续仓库的发布流程、审查要求或 CI 门禁变化，应优先更新本文件和 `.codex/skills/blog-git-governance/` 中对应规则，保持两处内容一致。
