# Aiushtha

pnpm + moonrepo 单体仓库。当前主应用为 `apps/aihues-web`，一个基于 **Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4** 的 AI 工具导航与工具站。

## 仓库结构

```text
.
├── apps/
│   └── aihues-web/        # AIHues Next.js 应用（端口 3000）
├── packages/              # 未来共享包占位
├── .moon/                 # moonrepo 工作区、工具链与任务配置
├── .kimi-handoff/         # 本地项目记忆与用户偏好（gitignored）
├── .gitlab-ci.yml         # CI 流水线
└── pnpm-workspace.yaml
```

## 环境要求

- Node.js `^22 || ^24 || >=25`
- pnpm `>=10.18.3`（`packageManager` 锁定为 `pnpm@10.18.3`，corepack 自动生效）

## 本地开发

```bash
pnpm install                       # 安装依赖（自动安装 git hooks）
pnpm check                         # lint + format + typecheck + test
pnpm moon run aihues-web:dev       # 启动开发服务器（默认端口 3000）
pnpm moon run aihues-web:build     # 生产构建
pnpm moon run :format-check        # 检查格式
pnpm moon run :format              # 写入格式化
```

应用级测试：

```bash
pnpm --filter @aiushtha/aihues-web test       # Vitest 单元测试
pnpm --filter @aiushtha/aihues-web test:e2e   # Playwright E2E 测试
```

Git pre-commit 会跑 `moon run :format-check :lint :typecheck --affected --status=staged`。  
commit-msg 由 `git-conventional-commits` 校验 `<type>(<scope>)?: <subject>` 格式。

## CI

`.gitlab-ci.yml` 三阶段：

- `test`：`pnpm check`
- `build`（仅默认分支）：`pnpm moon run :container`（当前无 container 任务消费者）
- `security-test`：SAST JavaScript 扫描（仅默认分支）

## 当前状态

- 57 个 React 工具已发布（`apps/aihues-web/app/lib/published-tools.ts`）
- 约 99 篇博客 HTML（`apps/aihues-web/public/blog/*.html`）
- 3 个 legacy HTML 小游戏
- Agent Chat UI / Ranking / Review Comments 在 Phase 1 已隐藏或移除，后端能力保留

## 与 mars 的对齐与差异

| 维度       | mars                    | aiushtha                     |
| ---------- | ----------------------- | ---------------------------- |
| 默认分支   | `main`                  | `master`                     |
| 主应用     | 多（Web/API/Go/Python） | `apps/aihues-web`（Next.js） |
| TypeScript | 多个 composite 项目     | `apps/aihues-web` 使用 TS    |
| 私有依赖   | kimi-proto 等           | 无                           |
| Git LFS    | 需要                    | 不需要                       |
