# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 权威文档

根目录的 **`AGENTS.md`** 是完整指南。本文件只提炼跨文件理解的架构要点。

## 顶层架构

这是一个 **pnpm + moonrepo** 单体仓库，构建/CI/lint/format 脚手架**全部对齐 [`workspace_rec/mars`](../mars)**。当前只有一个应用：

```
apps/aihues-web    → AIHues 静态站点（HTML/CSS/JS，默认端口 3000）
```

`packages/`、`apps/papers-*`、`shared-types` 等历史 TS 项目**已删除**。`.moon/tasks/tag-nextjs.yml`、`tag-react.yml`、根 `.eslintrc.js`、`tsconfig-moon` 等 mars 风格脚手架作为预留位保留，目前**无消费者**——添加 TS 应用时即可对接。

## 常用命令

```bash
pnpm install                         # 安装依赖（自动装 git hooks）
pnpm check                           # moon run :lint :format :typecheck :test
pnpm moon run aihues-web:dev         # 启动 aihues-web（默认端口 3000）
```

根 `package.json` 只暴露 `prepare` / `check`（对齐 mars）；其他任务统一走 `pnpm moon run ...`。

Git 钩子（`simple-git-hooks`，`pnpm install` 自动安装）：
- pre-commit: `pnpm moon run :format-check :lint :typecheck --affected --status=staged`
- commit-msg: `pnpm git-conventional-commits commit-msg-hook -c .commitlintrc.yaml "$1"`

## 必须知道的跨文件约定

### 1. 全对齐 mars
仓库的脚手架文件直接 mirror `workspace_rec/mars`。修改 moonrepo / CI / Prettier / ESLint 配置前先看 mars 对应文件，保持两边一致。差异列表见 `AGENTS.md` 的「与 mars 的对齐与差异」章节。

### 2. 默认分支是 master
`.moon/workspace.yml` 的 `defaultBranch: master`（mars 是 `main`）。修改 moon 配置时不要误改。

### 3. aihues-web 是纯静态站
`apps/aihues-web` 没有 TypeScript、没有 build 链。`moon.yml` 设 `language: html`，所以 `.moon/tasks/node.yml` 里的 lint/typecheck/test 任务**不会**派发到它——`pnpm check` 显示 "No tasks found" 是预期行为。

### 4. 中文优先
所有 UI 文案、注释、文档一律中文。

### 5. Conventional Commits
commit-msg 由 `git-conventional-commits` 校验。允许类型：build / chore / ci / docs / feat / fix / perf / refactor / revert / style / test。Merge / fixup / squash 提交工具自动跳过。

## 添加新应用

参考 mars 对应 app：
- Next.js: `mars/apps/landing-ui/` 或 `mars/apps/kimi-help-center-web/`
- React (Vite): `mars/apps/growth-seo-web/`
- 静态站点: 当前 `apps/aihues-web/moon.yml`

同步更新 `pnpm-workspace.yaml`（如需 catalog）和 `tsconfig.json`（如需 composite reference，可从 mars 复制）。

## 部署要点

- **aihues-web**：纯静态 HTML/CSS/JS。`pnpm -C apps/aihues-web start` 用 `serve` 启动（默认 3000 端口，被占用时 `serve` 会自动顺延到下一个可用端口）。生产部署到 CDN/Vercel/任何静态服务即可。
- **CI 构建镜像**：`.gitlab-ci.yml` 的 `build` 阶段调用 `pnpm moon run :container`，目前没有项目定义 container task，所以空跑——添加需要镜像的应用时在其 `moon.yml` 加 `container` task 即可。
