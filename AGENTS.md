# Aiushtha — AI 编码代理项目指南

> 本文件面向 AI 编码代理。阅读者应假设对项目没有任何先验知识。

## 当前状态

Aiushtha 是 **pnpm + moonrepo** 单体仓库，构建/CI/lint/format 脚手架完全对齐 [`workspace_rec/mars`](../mars)。仓库主应用为 `apps/aihues-web`，当前是 **Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4** 应用，不再是早期描述的纯静态 HTML 站点。

- 已发布 57 个 React 工具页面（`apps/aihues-web/app/lib/published-tools.ts`）
- 约 99 篇博客 HTML（`apps/aihues-web/public/blog/*.html`）
- 3 个 legacy HTML 小游戏
- Agent Chat UI、`/ranking`、评论/评测在 Phase 1 已隐藏或移除，后端能力保留
- 本地项目记忆与用户偏好沉淀在 `.kimi-handoff/`（已 gitignored）

## 仓库结构

```text
.
├── apps/
│   └── aihues-web/          # AIHues Next.js 应用（App Router，端口 3000）
├── packages/                # 空目录，未来共享包占位
├── .moon/
│   ├── workspace.yml        # 工作区配置
│   ├── toolchain.yml        # node/typescript 工具链
│   └── tasks/
│       ├── node.yml         # Node 项目共享 format/lint/typecheck/test
│       ├── tag-nextjs.yml   # Next.js 项目专用 dev/build/start/test/typecheck
│       └── tag-react.yml    # React (Vite/SPA) 项目专用 dev/build/preview
├── .commitlintrc.yaml       # git-conventional-commits 配置
├── .eslintrc.js             # 根 ESLint legacy 配置（与 mars 同步）
├── .prettierrc.json         # 与 mars 同步
├── .prettierignore
├── .gitlab-ci.yml           # CI 流水线（test/build/security-test 三阶段）
├── .kimi-handoff/           # 本地项目记忆与用户偏好（gitignored）
├── package.json             # 根脚本、devDeps、simple-git-hooks
└── pnpm-workspace.yaml      # workspaces + catalog（react 19）+ onlyBuiltDependencies
```

## 技术栈与版本

| 项目          | 版本/约束                                     | 说明                                              |
| ------------- | --------------------------------------------- | ------------------------------------------------- |
| Node.js       | `^22.0.0 \|\| ^24.0.0 \|\| >=25.0.0`          | engines 约束                                      |
| pnpm          | `>=10.18.3`（packageManager: `pnpm@10.18.3`） | corepack 自动生效                                 |
| moonrepo      | `@moonrepo/cli ^1.41.5`                       | task orchestration                                |
| Next.js       | `16.1.1`                                      | `apps/aihues-web` 主框架                          |
| React         | `catalog: react 19`                           | 通过 pnpm catalog 管理                            |
| TypeScript    | `^5.8.3`                                      | `apps/aihues-web` 使用                            |
| Tailwind CSS  | `^4.1.8`                                      | 含 `@tailwindcss/postcss`                         |
| Prettier      | `^3.5.3`                                      | + `prettier-plugin-tailwindcss`                   |
| ESLint        | `^9.31.0`                                     | + `typescript-eslint`、`eslint-plugin-workspaces` |
| commit lint   | `git-conventional-commits ^2.8.0`             | mars 同款                                         |
| tsconfig 模板 | `tsconfig-moon ^1.4.1`                        | 未来 TS 项目继承                                  |
| 测试          | Vitest + Playwright                           | unit + E2E                                        |

## 常用命令

所有命令在根目录执行，走 moonrepo。

```bash
pnpm install                       # 安装依赖（自动安装 git hooks）
pnpm check                         # 仅检查 aihues-web（lint + format-check + typecheck + test）
pnpm moon run aihues-web:dev       # 启动 aihues-web 开发服务器（默认端口 3000）
pnpm moon run aihues-web:build     # aihues-web 生产构建
pnpm moon run :format              # prettier --write 全仓
pnpm moon run :format-check        # prettier --check 全仓
moon ci                            # CI 模式
```

应用级测试：

```bash
pnpm --filter @aiushtha/aihues-web test       # Vitest 单元测试
pnpm --filter @aiushtha/aihues-web test:e2e   # Playwright E2E 测试
```

> 根 `package.json` 的 scripts 与 mars 完全一致，只暴露 `prepare` 和 `check`；其他任务统一通过 `pnpm moon run ...` 调用。`apps/aihues-web/package.json` 额外提供 `test` 和 `test:e2e`。

## Git 钩子

`simple-git-hooks` 在 `pnpm install` 时自动安装：

- **pre-commit**: `pnpm moon run :format-check :lint :typecheck --affected --status=staged`
- **commit-msg**: `pnpm git-conventional-commits commit-msg-hook -c .commitlintrc.yaml "$1"`

允许的 commit type（来自 `.commitlintrc.yaml`）：`build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test`。Merge / fixup / squash 提交由 `git-conventional-commits` 自动跳过校验。

## CI/CD

`.gitlab-ci.yml` 三阶段：

| 阶段            | 作业           | 触发                         | 说明                                         |
| --------------- | -------------- | ---------------------------- | -------------------------------------------- |
| `test`          | `lint`         | 所有 pipeline                | `pnpm check`                                 |
| `build`         | `build`        | 默认分支 / 兜底 `on_success` | `pnpm moon run :container`（无消费者时空跑） |
| `security-test` | `sast-scan-js` | master 分支                  | Corax JS 扫描                                |

镜像：`msai-cn-beijing.cr.volces.com/msai/devops/ci-base:latest`，runner tag: `kimi`。

## 与 mars 的对齐与差异

**对齐**：

- `.moon/workspace.yml` / `toolchain.yml` / `tasks/node.yml` / `tasks/tag-{nextjs,react}.yml`
- `.prettierrc.json` / `.prettierignore` / `.eslintrc.js`
- `.commitlintrc.yaml`
- `pnpm-workspace.yaml`（含 catalog + onlyBuiltDependencies）
- `package.json` 的 engines / packageManager / devDeps / scripts / simple-git-hooks

**差异**：

- 默认分支：mars `main`，aiushtha `master`
- mars 有 Go/Python apps，aiushtha 目前以 `apps/aihues-web` 的 Next.js 应用为主
- mars 有 `tools/*` 工作区项目和 `tag-docker.yml`（依赖 Go builder），aiushtha 暂未引入
- mars 有私有 npm/go 依赖（kimi-proto、dev.msh.team），aiushtha 不需要
- aiushtha 的 TS 项目消费方为 `apps/aihues-web`，根级 `tsconfig.json` / `tsconfig.options.json` 仍未启用

## 添加新应用的流程

参考 mars 对应 app 的设置：

1. **Next.js 应用**：参考 `mars/apps/landing-ui/`、`mars/apps/kimi-help-center-web/` 的 `moon.yml`、`eslint.config.mjs`、`tsconfig.json`、`package.json`
2. **React (Vite) 应用**：参考 `mars/apps/growth-seo-web/`
3. **静态站点**：参考当前 `apps/aihues-web/moon.yml`
4. 同步更新 `pnpm-workspace.yaml`（如有 catalog 项依赖）和 `tsconfig.json`（如需 composite reference）

## 推送前自查流程（强制）

**每次 `git push` 前必须完成以下三步检查，全绿才能推送。** 这是防止 CI 失败和测试环境出问题的最后防线。

```bash
# 1. init — 确保依赖最新（如有 package.json / pnpm-lock.yaml 变更）
pnpm install

# 2. test — 代码质量检查（lint + format-check + typecheck + test）
pnpm check
# 当前仅检查 apps/aihues-web，与 CI 的 lint 阶段对齐

# 3. build — 生产构建验证
pnpm moon run aihues-web:build
```

**判断标准：**

- `pnpm check` 输出 `Tasks: X completed` 且无 `Error`
- `pnpm moon run aihues-web:build` 输出 `Compiled successfully` 或静态页面列表
- 任一阶段出现红色 `Error` 或 exit code 非 0 → **禁止推送**，先本地修复

**特殊情况：**

- 仅修改文档（`*.md`）或配置文件（非代码）→ 可跳过 build，但仍需 `pnpm check`
- 网络问题导致 Google Fonts 下载失败 → 重试一次，若持续失败可跳过（非代码问题）

## 常见问题

- **`pnpm check` 提示 "No tasks found"**：正常。`aihues-web` 的 lint/format/typecheck/test 任务由 Next.js / node tag 提供，moon 根级 node tasks 不会派发到它。当前 `pnpm check` 已改为直接调用 `aihues-web:*` 任务。
- **`pnpm check` 与全仓 `:lint :format :typecheck :test` 的区别**：全仓检查会包含 Go 包（`aihues-api`、`builder`、`cfg`、`database`），需要本机安装 Go 工具链。当前项目重点为 `aihues-web`，因此 `pnpm check` 默认只检查 `aihues-web`，与 `.gitlab-ci.yml` 保持一致。
- **moonrepo 缓存异常**：`moon run <target> --cache=off` 绕过缓存。
- **commit-msg 拒绝 Merge/Revert 类型**：`git-conventional-commits` 默认跳过 git 自动生成的 merge / fixup / squash 提交。手工写的非常规消息仍会被拦截。
- **E2E 测试污染 wishlist 数据**：E2E 默认会写入本地 wishes 数据文件。跑测试前确认已配置 `AIHUES_WISHES_PATH` 隔离测试数据。
- **AI 写作工具返回 503**：未配置 LLM API Key。设置 `KIMI_API_KEY`、`DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY` 后重试。

## 用户偏好（User Preferences）

> 以下偏好由用户在对话中直接提出，优先级高于一般默认行为。

### 交互语言

- **主要沟通语言**：中文（用户用中文提问，用中文回答）
- **代码/技术术语**：保持英文（如 API、组件名、变量名等）

### 做选择时的交互规范

当需要用户做选择（多选/单选）时：

1. **先用中文说明当前这一步要做什么** — 让用户理解上下文和目的
2. **解释不同选项的区别** — 不要只给选项名，要说明每个选项的利弊
3. **选项标签用中文** — 选项本身如果是英文，要配中文说明
4. **推荐项标注** — 如果有推荐，用 "(推荐)" 标注并说明原因

示例：

```
我们需要为博客选配图。目前 86 篇博客全部使用随机占位图。
三种方案：
A. 手动挑选 Unsplash 真实照片（质量好，耗时约 2h/10篇）
B. 生成品牌风格插画（风格统一，需要设计师 1-2天）
C. 保持现状（最快，但仍有 AI 味）
```
