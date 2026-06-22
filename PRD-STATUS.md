# AIHues 产品现状说明

> 测试环境：https://aihues-test.mse.msh.work
> 分支：`feature/design-refresh` → GitLab MR #3
> 更新时间：2026-06-02

---

## 一、产品概述

AIHues 是 AI 工具导航站 + 实用工具集合，定位 "AI Vibe Navigator"。当前形态：

- **57 个工具页面**（全部 React 组件，统一导航和布局）
- **3 个轻量游戏**（每日运势 / 幸运老虎机 / 篮球挑战）
- **86 篇 SEO 博客文章**
- **评测系统**（6 维度评分 + 雷达图，57 条数据，全部支持中英双语）
- **积分系统**（Free 100 credits / Pro $9 / Team $29）
- **动态排名**（基于用户真实使用行为的工具排行榜）

---

## 二、各模块当前效果

### 1. 首页 `/`

- 搜索框直达工具（支持 `/` 快捷键聚焦）
- **6 个热词快捷入口**（JWT / JSON / Regex / QR Code / Fortune / Hoops）— 点击直达对应工具/游戏
- 分类浏览卡片：Developer / Utility / AI Writing / Games
- **Partner 推广位** — "Coming soon" 半透明占位卡片（Phase 2 预留）
- **实时统计** — 57 AI Tools / 30 Dev Tools / 3 Games / 100 Free Credits / 0 Day Streak，全部读取真实数据
- Game Center 展示 3 个游戏 + 积分余额
- Popular Tools 推荐位

### 2. 工具列表页 `/tools`

- **57 个工具**，分 3 大类：Developer(30) / Utility(8) / AI Writing(19)
- 每个工具卡片显示：图标、名称、描述、价格标签、积分消耗
- 支持搜索 + 分类筛选 + 价格筛选（All / Free / Freemium / Paid）
- 分类计数与真实数据严格对齐

### 3. 工具详情页 `/tools/{slug}`

**两种形态：**

| 形态 | 说明 | 示例 |
|------|------|------|
| **有评测的 React 工具** | 顶部标签：工具 / 评测 / 评论 | Ad Copy、JSON、JWT |
| **无评测的 React 工具** | 仅显示工具本身 | Base64、UUID |

**评测标签内容：**

- 6 维度雷达图（输出质量 30% / 易用性 20% / 性价比 20% / 生态 15% / 迭代 10% / 社区 5%）
- 6 个维度进度条
- Pros/Cons 列表
- 使用建议 + 替代方案
- **当前 57 个工具有评测数据**，全部支持中英双语

**评论标签内容：**

- 6 条占位评论（含评分、回复、点赞），随 locale 自动切换中英文
- 支持提交评论（localStorage 持久化，按工具隔离）
- 最热/最新排序
- 用户评论永久保留，跨语言切换不丢失

### 4. 纯前端计算工具（32 个，完全可用）

JSON Formatter、JWT Parser、Base64、UUID、SHA256、Regex Tester、Diff、Color Converter、Cron Parser、QR Code、Markdown Preview 等 —— **零依赖，打开即用**。

### 5. AI 写作工具（19 个，已接入真实 LLM）✅

Ad Copy、Blog Outline、Cold Email、X Post、LinkedIn、SEO Title、Meta、TL;DR、PR Desc、YT Script、Video Title、Tagline、LP Hero、Newsletter、Docs、FAQ、Push、Changelog、Code Explain、Pseudo、Alt Text —— **全部调用 OpenRouter GPT-3.5-turbo 生成真实内容**。

- 前端通过 `/api/ai-generate` 统一代理请求
- 30 秒超时 + 503 降级保护
- 每个调用消耗积分（UI 已铺垫）
- 支持中英双语 prompt

### 6. 博客 `/blog`

- 86 篇文章，含目录导航、JSON-LD Schema、RSS
- 文章底部自动推荐相关工具卡片（基于 tag 匹配，双语）
- 底部 Newsletter 订阅 + Related Articles

### 7. 工具对比 `/comparisons`

- 选择 2-4 个工具进行 6 维度雷达图对比

### 8. 定价 `/pricing`

| 档位 | 价格 | 积分 |
|------|------|------|
| Free | 免费 | 100 credits/月 |
| Pro | $9/月 | 2,000 credits/月 |
| Team | $29/月 | 10,000 credits/月 |

- 导航栏右上角显示当前积分余额（localStorage）
- 工具详情页 header 显示积分消耗徽章
- 新用户首次访问自动初始化 100 credits

### 9. Wishlist `/wishlist`

- **纯 localStorage 持久化**（10 条种子数据）
- 提交表单即时写入本地存储
- 投票 toggle（乐观 UI，anonymous ID 防重复）
- Top 5 排行榜（按票数排序）
- 全部/进行中/已完成/计划中 筛选
- 双语 UI

### 10. 游戏 `/games`

- 3 个游戏（已统一暗色主题 + 60px 导航）
- 每日运势可赢积分
- 积分余额与工具页共享

### 11. 排名 `/ranking`

- **动态排行榜** — 基于用户真实 tool 使用行为（localStorage 统计）
- 个人统计：My Rank / Usage（总运行次数）/ Credit Balance
- Top 10 工具排名（PR Desc、Push、Shell Gen 等）
- Usage 随每次工具页面访问自动累加

---

## 三、技术栈

| 层 | 技术 |
|----|------|
| 前端 | Next.js 16 + React 19 + Tailwind CSS + TypeScript |
| 构建 | moonrepo + pnpm |
| 部署 | ArgoCD 自动部署 |
| 后端 | Go service（port 9005，当前 offline） |
| API | Connect RPC（JSON over HTTP）+ Next.js API Routes（LLM 代理） |
| LLM | OpenRouter（`gpt-3.5-turbo`，免费 tier） |

---

## 四、已完成工作（全部 15 项）

1. ✅ 删除 68 篇博客中重复的 "Related AIHues Tools" 旧区块
2. ✅ 评测数据从 7 条扩展到 57 条（覆盖全部本地工具）
3. ✅ 博客 Tag→工具映射覆盖全部 11 个 tag
4. ✅ 评论系统重写（localStorage 持久化、点赞、回复、排序）
5. ✅ 工具详情页添加积分消耗显示
6. ✅ **首页热词修复** — 6 个快捷标签改为可点击链接
7. ✅ **首页去冗余** — 删除无效的 All/Free/Freemium/Paid 筛选
8. ✅ **首页推广位** — Girgrils 外链移除，改为 "Coming soon" 半透明占位卡片（Phase 2）
9. ✅ **首页统计修复** — 移除 805 行硬编码 fallback 数组，`catalog-api.ts` fallback 改为动态生成自 `tool-data.ts`，确保首页/Developer/Utility/AI Writing/Games 数字与 57+30+8+19+3 完全一致
10. ✅ **评论系统双语化** — 6 条占位评论随 locale 自动切换中英文，用户评论永久保留
11. ✅ **积分初始化修复** — 新用户首次访问自动写入 100 credits（与定价页 Free 档位一致），游戏赢取/消耗同步正确
12. ✅ **Catalog API 合并修复** — `safeListTools` 现在合并 backend 数据与 `LOCAL_FALLBACK_TOOLS`，确保 57 个工具始终可见
13. ✅ **Wishlist 纯前端化** — 从 API Route + JSON 文件持久化改为纯 localStorage，10 条种子数据，提交/投票全链路可用，双语 UI
14. ✅ **Ranking 动态重写** — 替换硬编码 `TOOL_RANKINGS`，`RankingClient.tsx` + `UsageTracker.tsx` + `tool-usage.ts` 基于真实使用行为动态生成排行榜
15. ✅ **LLM 集成** — 19 个 AI 写作工具全部接入 OpenRouter `/api/ai-generate`，统一 prompt 构建（`ai-prompts.ts`），加载状态 + 错误处理，删除旧模板替换逻辑

---

## 五、关键决策（全部已完成，0 个待决策）

### 决策 1：✅ AI 写作工具已接入真实 LLM

**实现：** 19 个 AI 写作工具通过 Next.js API Route `/api/ai-generate` 代理到 OpenRouter `gpt-3.5-turbo`。

- Prompt 模板集中管理于 `ai-prompts.ts`，支持中英双语
- 30 秒超时 + 503 降级保护
- 删除旧模板替换函数（`explainCode`、`escapeHtml`、`generatePseudo`、`generateAltText` 等）
- Lint 0 errors, 5 warnings（全部历史遗留）

### 决策 2：✅ Wishlist 已改为纯 localStorage

**原因：** Docker 容器文件系统只读，API Route 的 JSON 文件 I/O 不可靠。

**实现：** 纯前端 CRUD（`wishlist-local.ts`），10 条种子数据自动初始化，乐观 UI，双语标签。

---

## 六、截图索引

| 截图 | 内容 |
|------|------|
| `demo-home.png` | 首页（含热词+推广位+实时统计） |
| `demo-tools.png` | 工具列表页（57 个工具） |
| `demo-ai-writing.png` | AI Writing 分类页（19 个工具） |
| `demo-json.png` | JSON Formatter 纯前端工具 |
| `demo-humanize.png` | Humanize AI 工具（LLM 生成） |
| `demo-blog.png` | 博客文章 + 底部工具推荐卡片 |
| `demo-compare.png` | 工具对比页 |
| `demo-review-tab.png` | 工具详情页（评测+评论标签） |
| `demo-pricing.png` | 定价页（Free/Pro/Team） |
| `demo-ranking.png` | 动态排名页 |
| `demo-wishlist.png` | 愿望单页 |
| `demo-games.png` | 游戏中心 |
