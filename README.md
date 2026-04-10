# Aiushtha

面向产品型站点的 `Next.js App Router + TypeScript + Tailwind CSS 4` 基线。  
默认假设是前端不再强制纯静态导出，站点可以直接运行在 Node 环境中，同时保留 SEO、首屏性能、多页面路由和后续动态能力扩展空间。

## 目标

- 使用 `App Router` 组织多页面站点
- 生成 `standalone` 产物，便于 Node/容器部署
- 同时支持静态页面、服务端渲染和客户端交互
- 为搜索、登录态、个性化推荐、BFF API 预留演进空间
- 保持官网页和产品页共用一套 React 工程

## 目录结构

```text
.
├── app/                     # App Router 页面与元数据路由
├── components/              # 公共组件
├── lib/                     # 站点级配置与辅助函数
├── public/                  # 直接暴露的静态文件
├── postcss.config.mjs       # Tailwind 4 PostCSS 配置
├── .env.example             # 环境变量示例
├── .gitlab-ci.yml           # GitLab CI
├── next.config.ts           # Next.js 配置
└── package.json
```

## 本地开发

要求：

- Node.js 20+
- pnpm 10.x

安装依赖并启动：

```bash
corepack enable
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm dev
pnpm build
pnpm start
pnpm check
pnpm format
pnpm format:check
```

## 部署模型

当前脚手架默认按 Node 服务运行：

- `next build` 生成 `.next/standalone`
- 启动命令为 `node .next/standalone/server.js`
- `.next/static` 和 `public/` 需要与 `standalone` 一起部署
- 线上通常在 CDN 或网关后面挂一个 Node 服务或容器

如果后续需要容器化，可以再加 `Dockerfile`；当前仓库先不引入 K8s 或 Helm 约束。

## 环境变量

复制 `.env.example` 为 `.env`，填入真实值：

```bash
cp .env.example .env
```

关键变量：

- `NEXT_PUBLIC_SITE_URL`：站点正式域名，用于 canonical、sitemap、robots 等元数据；生产构建缺失时会直接失败
- `PORT`：本地或生产启动端口，默认 `3000`

## 推荐架构

这套基线更适合类似 `papers.cool` 的产品站：

- `Next.js` 负责官网页、列表页、详情页和部分 BFF API
- 搜索索引、抓取任务、推荐、队列等能力拆成独立后端服务
- 需要交互的地方用 Client Component
- 强 SEO 和首屏内容优先用 Server Component / 服务端渲染

也就是说：

- 前端框架统一为 React
- 页面和业务交互放在同一套工程
- 重后端能力保持独立，避免把采集、索引、队列硬塞进前端仓库

## 发布流程

推荐流程：

1. `pnpm build`
2. 部署 `.next/standalone`、`.next/static`、`public/`
3. 启动 `node .next/standalone/server.js`
4. 在前面挂 CDN、SLB 或网关

## GitLab CI

仓库已带一个基础的 [`.gitlab-ci.yml`](/Users/gaozhongfu/workspace_rec/aiushtha/.gitlab-ci.yml)：

- `verify`：执行类型检查、格式检查和构建
- `build_artifact`：产出 `.next/standalone`、`.next/static` 和 `public/`

你需要在 GitLab CI Variables 中配置：

- `NEXT_PUBLIC_SITE_URL`

## 下一步建议

- 补一个部署方式：Node 直跑、Docker 或你们现有发布平台三选一
- 明确后端边界：哪些能力由 Next Route Handlers 承接，哪些拆独立服务
- 把首页和产品页替换成真实信息架构
- 如果要做论文搜索类产品，再补搜索 API、任务队列和索引服务
