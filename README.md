# Aiushtha

面向产品型站点的 `Next.js App Router + TypeScript + Tailwind CSS 4` 基线。  
默认假设是前端不再强制纯静态导出，站点可以直接运行在 Node 环境中，同时保留 SEO、首屏性能、多页面路由和后续动态能力扩展空间。

## Monorepo 结构

这是一个 pnpm workspace monorepo，包含以下应用和包：

```text
.
├── apps/
│   ├── web/                  # Next.js 前端应用
│   └── data-api/             # Fastify 数据 API 服务
├── packages/
│   └── shared-types/         # 共享 TypeScript 类型定义
├── pnpm-workspace.yaml       # Workspace 配置
└── package.json              # 根 package.json
```

### Apps

| 应用 | 路径 | 说明 | 端口 |
|------|------|------|------|
| web | `apps/web/` | Next.js 前端站点 | 3000 |
| data-api | `apps/data-api/` | Fastify 数据服务 (连接 Hologres) | 3001 |

### Packages

| 包 | 路径 | 说明 |
|------|------|------|
| shared-types | `packages/shared-types/` | Web 和 Data API 共享的 TypeScript 类型 |

## 目标

- 使用 `App Router` 组织多页面站点
- 生成 `standalone` 产物，便于 Node/容器部署
- 同时支持静态页面、服务端渲染和客户端交互
- 为搜索、登录态、个性化推荐、BFF API 预留演进空间
- 保持官网页和产品页共用一套 React 工程
- 数据服务独立部署，通过 API 与前端通信

## 本地开发

要求：

- Node.js 20+
- pnpm 10.x

安装依赖并启动：

```bash
corepack enable
pnpm install

# 只启动前端
pnpm dev:web

# 只启动数据 API
pnpm dev:api

# 同时启动所有服务
pnpm dev
```

常用命令：

```bash
# 开发
pnpm dev:web        # 前端开发
pnpm dev:api        # API 服务开发

# 构建
pnpm build          # 构建所有包和应用

# 检查
pnpm check          # 类型检查所有项目
pnpm lint           # 代码检查
pnpm format         # 格式化代码
```

## 部署模型

### Web 前端

- `pnpm build` 生成 `apps/web/.next/standalone`
- 启动命令为 `node server.js`
- 线上通常在 CDN 或网关后面挂一个 Node 服务或容器

### Data API 服务

- Fastify + PostgreSQL (Hologres)
- 支持 K8s 无状态部署，可水平扩展
- 环境变量配置数据库连接

```bash
cd apps/data-api
pnpm build
pnpm start
```

## 环境变量

### Web 前端 (`apps/web/.env`)

```bash
NEXT_PUBLIC_SITE_URL=https://your-site.com
PORT=3000
```

### Data API (`apps/data-api/.env`)

```bash
PORT=3001
HOLOGRES_HOST=your-host.hologres.aliyuncs.com
HOLOGRES_PORT=80
HOLOGRES_DATABASE=your-db
HOLOGRES_USER=your-user
HOLOGRES_PASSWORD=your-password
```

## 推荐架构

这套基线更适合类似 `papers.cool` 的产品站：

- `Next.js` 负责官网页、列表页、详情页
- `Data API` 服务提供论文数据查询接口
- 需要交互的地方用 Client Component
- 强 SEO 和首屏内容优先用 Server Component / 服务端渲染

也就是说：

- 前端框架统一为 React
- 页面和业务交互放在同一套工程
- 数据服务保持独立，连接 Hologres 提供 API

## 发布流程

### Web 前端

1. `pnpm build`
2. 部署 `apps/web/.next/standalone`
3. 在前面挂 CDN、SLB 或网关

### Data API

1. `pnpm --filter @aiushtha/data-api build`
2. Docker 构建并推送到镜像仓库
3. K8s 部署 (HPA 自动扩缩容)

## GitLab CI

仓库已带一个基础的 [`.gitlab-ci.yml`](./.gitlab-ci.yml)：

- `verify`: 执行类型检查、格式检查和构建
- `build_artifact`: 产出构建产物

需要在 GitLab CI Variables 中配置：

- `NEXT_PUBLIC_SITE_URL`

## 下一步建议

- [ ] 完善 Data API 的论文查询接口
- [ ] 前端接入 Data API 获取真实数据
- [ ] 配置 Hologres 表结构
- [ ] 添加 Docker Compose 本地开发配置
- [ ] 配置 K8s 部署 YAML
