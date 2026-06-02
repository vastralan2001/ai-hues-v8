# AIHues 产品现状汇报

> **测试环境**：https://aihues-test.mse.msh.work
> **分支**：`feature/design-refresh` → GitLab MR #3
> **汇报时间**：2026-06-02

---

## 一、产品是什么

AIHues 定位 **"AI Vibe Navigator"** —— AI 工具导航站 + 实用工具集合。

| 模块 | 数据 |
|------|------|
| 工具页面 | **57 个**（Developer 30 / Utility 8 / AI Writing 19） |
| 轻量游戏 | **3 个**（每日运势 / 老虎机 / 篮球） |
| SEO 博客 | **86 篇** |
| 评测数据 | **15 条** 6 维度评分 + 雷达图 |
| 定价档位 | Free(100 credits) / Pro($9/月) / Team($29/月) |

**技术栈**：Next.js 16 + React 19 + Tailwind CSS + TypeScript，moonrepo + pnpm 构建，ArgoCD 自动部署。

**后端状态**：Go 服务（port 9005）当前 offline，所有 API 走本地静态数据 fallback。LLM 请求走 Next.js API Route 代理 OpenRouter。

---

## 二、本周已完成（15 项）

| # | 工作 | 状态 |
|---|------|------|
| 1 | 删除 68 篇博客中重复的 "Related AIHues Tools" 旧区块 | ✅ |
| 2 | 评测数据 7→15 条 | ✅ |
| 3 | 博客 Tag→工具映射覆盖 11 标签 | ✅ |
| 4 | 评论系统重写（localStorage、点赞、回复、排序） | ✅ |
| 5 | 工具详情页积分消耗显示 | ✅ |
| 6 | 首页 6 热词改为可点击链接 | ✅ |
| 7 | 删除无效价格筛选栏（后恢复并修复计数对齐） | ✅ |
| 8 | 首页推广位改为 "Coming soon" 占位卡片（Phase 2） | ✅ |
| 9 | 首页统计数字修复 57/30/8/19/3 | ✅ |
| 10 | 评测系统双语化 | ✅ |
| 11 | 57 个工具全部走 React 统一体验 | ✅ |
| 12 | 博客底部工具推荐双语化 | ✅ |
| 13 | **Wishlist 纯前端化** — localStorage 持久化，10 条种子数据，提交/投票全链路可用，双语 UI | ✅ |
| 14 | **Ranking 动态重写** — 基于真实使用行为的动态排行榜，替换硬编码数据 | ✅ |
| 15 | **LLM 集成** — 19 个 AI 写作工具全部接入 OpenRouter 真实 AI 生成，统一 API 代理 | ✅ |

---

## 三、关键决策（全部已完成）

### 决策 1：✅ AI 写作工具已接入真实 LLM

**实现**：19 个 AI 写作工具通过 `/api/ai-generate` → OpenRouter `gpt-3.5-turbo` 生成真实内容。

- 成本：OpenRouter 免费 tier（低用量免 key）
- Prompt 集中管理（`ai-prompts.ts`），中英双语
- 30 秒超时 + 503 降级保护
- 删除所有旧模板替换逻辑

### 决策 2：✅ Wishlist 改为纯 localStorage

**原因**：Docker 容器只读文件系统，API Route 的 JSON 文件 I/O 不可靠。

**实现**：纯前端 CRUD（`wishlist-local.ts`），10 条种子数据，乐观 UI，anonymous ID 防重复投票。

---

## 四、截图索引

| 截图 | 内容 |
|------|------|
| `demo-home.png` | 首页（热词 + 推广位 + 实时统计） |
| `demo-tools.png` | 工具列表页（57 个工具） |
| `demo-ai-writing.png` | AI Writing 分类页（19 个 LLM 工具） |
| `demo-json.png` | JSON Formatter 纯前端工具 |
| `demo-humanize.png` | Humanize AI 工具（LLM 生成） |
| `demo-blog.png` | 博客文章 + 底部工具推荐卡片 |
| `demo-compare.png` | 工具对比页（雷达图） |
| `demo-review-tab.png` | 工具详情页（评测 + 评论标签） |
| `demo-pricing.png` | 定价页（Free/Pro/Team） |
| `demo-ranking.png` | 动态排名页 |
| `demo-wishlist.png` | 愿望单页 |
| `demo-games.png` | 游戏中心 |

---

## 五、下一步

1. **ArgoCD 自动部署验证** — 确认测试环境所有 19 个 AI 工具 LLM 调用正常
2. **OpenRouter 用量监控** — 若免费 tier 受限，配置 `OPENROUTER_API_KEY` 到 `deploy/aihues/web/values.yaml`
3. **UsageTracker 细化** — 当前在工具页面 mount 时计数，可改为仅在点击 "Generate" 时记录
4. **Phase 2 Partner 推广位** — 替换 "Coming soon" 占位卡片为真实合作伙伴内容
