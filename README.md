# Aiushtha

pnpm + moonrepo 单体仓库。构建脚手架对齐 [`workspace_rec/mars`](../mars)。当前只有一个静态站点应用 `apps/aihues-web`。

## 仓库结构

```text
.
├── apps/
│   └── aihues-web/        # AIHues 静态站点（HTML/CSS/JS）
├── .moon/                 # moonrepo 工作区、工具链与任务配置
├── .gitlab-ci.yml         # CI 流水线
└── pnpm-workspace.yaml
```

## 环境要求

- Node.js `^22 || ^24 || >=25`（与 mars 一致）
- pnpm `>=10.18.3`（`packageManager` 字段锁定为 `pnpm@10.18.3`，启用 corepack 自动生效）

## 本地开发

```bash
pnpm install                       # 安装依赖（自动安装 git hooks）
pnpm check                         # moon run :lint :format :typecheck :test（mars 同款）
pnpm moon run aihues-web:dev       # 启动 aihues-web（端口 3002）
pnpm moon run :format-check        # 检查格式
pnpm moon run :format              # 写入格式化
```

Git pre-commit 会跑 `moon run :format-check :lint :typecheck --affected --status=staged`。
commit-msg 由 `git-conventional-commits` 校验 `<type>(<scope>)?: <subject>` 格式（与 mars 一致）。

## CI

`.gitlab-ci.yml` 结构对齐 mars：
- `test`：`pnpm check`
- `build`（仅默认分支）：`pnpm moon run :container`（当前无 container 任务消费者）
- `security-test`：SAST JavaScript 扫描（仅默认分支）

## 与 mars 的差异

| 维度 | mars | aiushtha |
|---|---|---|
| 默认分支 | `main` | `master` |
| 应用数量 | 多（Web/API/Go/Python） | 1（仅 `aihues-web`） |
| TypeScript | 多个 composite 项目 | 暂无 |
| 私有依赖 | kimi-proto 等 | 无 |
| Git LFS | 需要 | 不需要 |

未来添加 React/Next.js 应用时，参考 mars 对应 app 的 `moon.yml` 与 `eslint.config.mjs` 即可直接对接。
