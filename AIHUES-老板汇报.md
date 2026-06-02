# AIHues 产品现状汇报

> **测试环境**：https://aihues-test.mse.msh.work  
> **分支**：`feature/design-refresh` → GitLab MR #3  
> **汇报时间**：2026-06-02

---

## 一、产品是什么

AIHues 定位 **"AI Vibe Navigator"** —— AI 工具导航站 + 实用工具集合。

| 模块     | 数据                                                  |
| -------- | ----------------------------------------------------- |
| 工具页面 | **57 个**（Developer 30 / Utility 8 / AI Writing 19） |
| 轻量游戏 | **3 个**（每日运势 / 老虎机 / 篮球）                  |
| SEO 博客 | **86 篇**                                             |
| 评测数据 | **15 条** 6 维度评分 + 雷达图                         |
| 定价档位 | Free(100 credits) / Pro($9/月) / Team($29/月)         |

**技术栈**：Next.js 16 + React 19 + Tailwind CSS + TypeScript，moonrepo + pnpm 构建，ArgoCD 自动部署。

**后端状态**：Go 服务（port 9005）当前 offline，所有 API 走本地静态数据 fallback。

---

## 二、本周已完成（14 项）

| #   | 工作                                                                               | 状态      |
| --- | ---------------------------------------------------------------------------------- | --------- |
| 1   | 删除 68 篇博客中重复的 "Related AIHues Tools" 旧区块                               | ✅ 已上线 |
| 2   | 评测数据从 7 条扩展到 15 条                                                        | ✅ 已上线 |
| 3   | 博客 Tag→工具映射覆盖全部 11 个标签                                                | ✅ 已上线 |
| 4   | 评论系统重写（localStorage 持久化、点赞、回复、排序）                              | ✅ 已上线 |
| 5   | 工具详情页添加积分消耗显示                                                         | ✅ 已上线 |
| 6   | 首页 6 个热词快捷标签改为可点击链接                                                | ✅ 已上线 |
| 7   | 删除无效的价格筛选栏（All/Free/Freemium/Paid）                                     | ✅ 已上线 |
| 8   | 首页推广位改为外部合作伙伴链接（Girgrils）                                         | ✅ 已上线 |
| 9   | **首页统计数字修复** — 57/30/8/19/3 全部正确                                       | ✅ 已上线 |
| 10  | **评测系统双语化** — 15 条评测 + 维度标签 + 评论 UI 全部支持中英切换               | ✅ 已上线 |
| 11  | **26 个 HTML 工具迁移 React** — 删除遗留 HTML 文件，57 个工具全部走 React 统一体验 | ✅ 已上线 |
| 12  | **博客底部工具推荐双语化**                                                         | ✅ 已上线 |
| 13  | **Wishlist 后端** — Next.js API Route + JSON 持久化，提交/投票全链路可用，双语 UI  | ✅ 已上线 |

---

## 三、需要老板决策的 1 件事

### 决策 1：AI 写作工具是否接入真实 LLM？

**现状**：19 个 AI 写作工具（Ad Copy、Blog Outline、X Post、LinkedIn 等）能打开、能点击 Generate，但输出是**纯前端模板替换**（`{product}` → 用户输入），不是真正的 AI 生成。用户反馈"没效果"。

**接入需要**：

- 前端各工具改为调用统一 API（Next.js API Route 或 Go 后端中转）
- LLM API Key（OpenAI / Kimi / DeepSeek，约 **¥0.05/次**）
- 每个 AI 调用消耗积分（积分系统 UI 已铺垫好）

**影响**：接入后 19 个 AI 工具从"模板填空"升级为"真正 AI 生成"，是**产品核心体验跃迁**。

**建议**：接入。成本极低（¥0.05/次），体验提升巨大。

---

### 决策 2：✅ 已完成 — Wishlist 后端已上线

**实现**：Next.js API Route + JSON 文件持久化。

- `GET /api/wishes` 拉取列表
- `POST /api/wishes` 提交新需求
- `POST /api/wishes/vote` 投票/取消投票（anonymous ID 防刷票）
- 前端乐观更新，双语 UI

---

## 四、截图索引（`screenshots/` 目录）

| 截图                  | 内容                               |
| --------------------- | ---------------------------------- |
| `demo-home.png`       | 首页（热词 + 推广位 + 统计）       |
| `demo-tools.png`      | 工具列表页（57 个工具）            |
| `demo-json.png`       | JSON Formatter 纯前端工具          |
| `demo-adcopy.png`     | Ad Copy AI 工具（评测标签 + 积分） |
| `demo-blog.png`       | 博客文章 + 底部工具推荐卡片        |
| `demo-compare.png`    | 工具对比页（雷达图）               |
| `demo-review-tab.png` | 工具详情页（评测 + 评论标签）      |
| `demo-pricing.png`    | 定价页（Free/Pro/Team）            |

---

## 五、下一步

1. **若决策 1 通过**：接入 LLM API，19 个 AI 工具改为真实 AI 生成
