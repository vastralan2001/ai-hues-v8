# Aiushtha — AI 编码代理项目指南

> 本文件面向 AI 编码代理。阅读者应假设对项目没有任何先验知识。

## 当前状态

Aiushtha 是 **pnpm + moonrepo** 单体仓库，构建/CI/lint/format 脚手架完全对齐 [`workspace_rec/mars`](../mars)。仓库只有一个应用：`apps/aihues-web`（纯静态站点）。所有面向 React/Next.js/TypeScript 的脚手架（`tag-nextjs.yml`、`tag-react.yml`、`tsconfig`、ESLint flat config）作为 mars 风格预留位，**当前没有消费者**。

## 仓库结构

```text
.
├── apps/
│   └── aihues-web/          # AIHues 静态站点（HTML/CSS/JS，serve 默认端口 3000）
├── packages/                # 空目录，未来共享包占位
├── .moon/
│   ├── workspace.yml        # 工作区配置
│   ├── toolchain.yml        # node/typescript 工具链
│   └── tasks/
│       ├── node.yml         # Node 项目共享 format/lint/typecheck/test
│       ├── tag-nextjs.yml   # Next.js 项目专用 dev/build/start/test/typecheck
│       └── tag-react.yml    # React (Vite/SPA) 项目专用 dev/build/preview
├── .commitlintrc.yaml       # git-conventional-commits 配置
├── .eslintrc.js             # 根 ESLint legacy 配置（与 mars 同步，目前无 TS 项目消费）
├── .prettierrc.json         # 与 mars 同步
├── .prettierignore
├── .gitlab-ci.yml           # CI 流水线（test/build/security-test 三阶段）
├── package.json             # 根脚本、devDeps、simple-git-hooks
└── pnpm-workspace.yaml      # workspaces + catalog（react 19）+ onlyBuiltDependencies
```

## 技术栈与版本

| 项目 | 版本/约束 | 说明 |
|---|---|---|
| Node.js | `^22.0.0 \|\| ^24.0.0 \|\| >=25.0.0` | engines 约束 |
| pnpm | `>=10.18.3`（packageManager: `pnpm@10.18.3`） | corepack 自动生效 |
| moonrepo | `@moonrepo/cli ^1.41.5` | task orchestration |
| Prettier | `^3.5.3` | + `prettier-plugin-tailwindcss` |
| ESLint | `^9.31.0` | + `typescript-eslint`、`eslint-plugin-workspaces` |
| commit lint | `git-conventional-commits ^2.8.0` | mars 同款 |
| tsconfig 模板 | `tsconfig-moon ^1.4.1` | 未来 TS 项目继承 |

## 常用命令

所有命令在根目录执行，走 moonrepo。

```bash
pnpm install                       # 安装依赖（自动安装 git hooks）
pnpm check                         # moon run :lint :format :typecheck :test
pnpm moon run aihues-web:dev       # 启动 aihues-web（serve 默认端口 3000）
pnpm moon run aihues-web:build     # aihues-web 是占位 build
pnpm moon run :format              # prettier --write 全仓
pnpm moon run :format-check        # prettier --check 全仓
moon ci                            # CI 模式
```

> 根 `package.json` 的 scripts 与 mars 完全一致，只暴露 `prepare` 和 `check`；其他任务统一通过 `pnpm moon run ...` 调用。

## Git 钩子

`simple-git-hooks` 在 `pnpm install` 时自动安装：

- **pre-commit**: `pnpm moon run :format-check :lint :typecheck --affected --status=staged`
- **commit-msg**: `pnpm git-conventional-commits commit-msg-hook -c .commitlintrc.yaml "$1"`

允许的 commit type（来自 `.commitlintrc.yaml`）：`build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test`。Merge / fixup / squash 提交由 `git-conventional-commits` 自动跳过校验。

## CI/CD

`.gitlab-ci.yml` 三阶段：

| 阶段 | 作业 | 触发 | 说明 |
|---|---|---|---|
| `test` | `lint` | 所有 pipeline | `pnpm check` |
| `build` | `build` | 默认分支 / 兜底 `on_success` | `pnpm moon run :container`（无消费者时空跑） |
| `security-test` | `sast-scan-js` | master 分支 | Corax JS 扫描 |

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
- mars 有 Go/Python apps，aiushtha 只有 HTML 静态站点
- mars 有 `tools/*` 工作区项目和 `tag-docker.yml`（依赖 Go builder），aiushtha 暂未引入
- mars 有私有 npm/go 依赖（kimi-proto、dev.msh.team），aiushtha 不需要
- aiushtha **没有** `tsconfig.json` / `tsconfig.options.json`（无 TS 项目消费）

## 添加新应用的流程

参考 mars 对应 app 的设置：

1. **Next.js 应用**：参考 `mars/apps/landing-ui/`、`mars/apps/kimi-help-center-web/` 的 `moon.yml`、`eslint.config.mjs`、`tsconfig.json`、`package.json`
2. **React (Vite) 应用**：参考 `mars/apps/growth-seo-web/`
3. **静态站点**：参考当前 `apps/aihues-web/moon.yml`
4. 同步更新 `pnpm-workspace.yaml`（如有 catalog 项依赖）和 `tsconfig.json`（如需 composite reference）

## 常见问题

- **`pnpm check` 提示 "No tasks found"**：正常。aihues-web 是 HTML 项目，moon node tasks 不会派发到它。等有 TS 项目时会自然激活。
- **moonrepo 缓存异常**：`moon run <target> --cache=off` 绕过缓存。
- **commit-msg 拒绝 Merge/Revert 类型**：`git-conventional-commits` 默认跳过 git 自动生成的 merge / fixup / squash 提交。手工写的非常规消息仍会被拦截。

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
