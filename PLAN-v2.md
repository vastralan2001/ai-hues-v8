# AIHues vNext 方向：出海营销 AI Agent 工具站

> 作业：基于当前 `feature/design-refresh` 代码，构思下一个版本的迭代方向。
> 关键词：**Agent** + **出海营销工具站**。

---

## 1. 为什么是这个方向

当前 AIHues 已经具备很好的基础：

- **57 个本地工具** 里，写作/增长类工具占了一半以上：`ad-copy`、`seo-title`、`x-post`、`linkedin`、`cold-email`、`newsletter`、`lp-hero`、`meta`、`tagline`、`video-title`、`yt-script` 等。
- **Agent 后端已经存在**：`app/api/agent/route.ts` + `lib/agent/orchestrator.ts` + `lib/agent/tools.ts`，能识别用户意图、推荐工具、直接调用写作工具生成内容。
- **Agent UI 已被移除**：之前删掉了 `AgentChat.tsx` / `AgentChatContext.tsx`，但后端完整保留。
- **出海营销天然适合 Agent**：一个营销活动需要多个工具串行/并行（标语 → 广告文案 → 落地页 → 社媒帖子 → 邮件 → PR），Agent 正好能把这些散落的工具组合成“工作流”。

所以下一个版本的核心命题是：

> **把 AIHues 从“工具目录”升级成“出海营销 AI Agent 工具站”**。

---

## 2. 愿景一句话

**AIHues — AI marketing toolkit for global growth.**

用户输入一个产品/目标，Agent 自动规划并执行一套出海营销物料生成工作流。

---

## 3. 推荐路线图（分 3 个阶段）

### Phase 1：复活 Agent UI（最小可用）

目标：让用户能在聊天里使唤 Agent，直接生成内容。

| # | 改动 | 说明 |
|---|---|---|
| 1 | 新建 `/agent` 页面 | 一个简洁的聊天界面，调用现有 `/api/agent` |
| 2 | 渲染 Agent 返回的三种消息 | ① 纯文本 ② 工具生成结果（可复制 + 链接到工具页） ③ 推荐工具卡片 |
| 3 | 导航加 Agent 入口 | 顶部导航增加 `Agent`，首页 Hero 加 "Ask AI Agent" 副 CTA |
| 4 | 调优 Agent 系统提示 | 把 `orchestrator.ts` 里的 `buildAgentSystemPrompt` 改成更出海营销导向的助手 |
| 5 | 移动端适配 | 聊天界面在手机上全屏/抽屉式 |

**预计工作量**：1～1.5 天。

---

### Phase 2：Campaign 工作流（差异化卖点）

目标：Agent 不再只是单次生成，而是产出完整的“营销活动包”。

**用户场景**：

> “我要在 Product Hunt 上发布一个远程团队协作 SaaS，目标美国市场。”

**Agent 执行**：

1. `tagline` → 生成标语
2. `lp-hero` → 生成落地页 Hero 文案
3. `faq` → 生成 FAQ
4. `x-post` → 生成 X 推文串
5. `linkedin` → 生成 LinkedIn 帖子
6. `cold-email` → 生成外联邮件
7. `pr-desc` → 生成 PR/发布说明
8. 汇总到一个 `/campaign/[id]` 页面

**需要做的**：

| # | 改动 | 说明 |
|---|---|---|
| 1 | 扩展 `orchestrator.ts` | 新增 `campaign` 意图识别和分步执行逻辑 |
| 2 | 定义 Campaign 数据结构 | `{ title, goal, locale, steps: [{ tool, inputs, output }] }` |
| 3 | 新建 `/campaigns` 列表页 + `/campaign/[id]` 详情页 | 详情页展示所有生成的物料卡片，可编辑/重跑/复制 |
| 4 | 本地存储 | 先用 `localStorage` 保存 campaigns；后续可接 `/api/wishes` 同类持久化 |
| 5 | 新增首页区块 | “Build a campaign in one prompt” 深色推广卡片 |

**预计工作量**：2～3 天。

---

### Phase 3：补齐出海营销工具 + 重新定位

目标：把“出海营销”这个定位做厚，让工具站和 Agent 互相导流。

#### 3.1 新增工具（高优先级）

| 工具 | 用途 | 和 Agent 的关系 |
|---|---|---|
| `aso` / `app-store` | App Store / Google Play 标题、副标题、关键词、描述 | 应用出海上架必备 |
| `amazon-listing` | Amazon 商品标题、五点、描述 | 电商出海 |
| `facebook-ads` | Facebook / Instagram 广告文案 | 付费投放 |
| `google-ads` | Google Search / Display 广告文案 | 付费投放 |
| `tiktok-hook` | TikTok / Reels / Shorts 开头钩子 | 短视频出海 |
| `influencer-email` | 给海外网红/编辑的外联邮件 | 冷启动获客 |
| `localization-review` | 把中文营销稿润色成地道英文 | 出海语言门槛 |
| `reddit-post` | Reddit / Indie Hackers 帖子 | 社区营销 |
| `testimonial-generator` | 生成用户评价/案例背书 | 社会证明 |
| `pricing-page` | 定价页文案 | SaaS 转化 |

> 工具实现沿用现有 `app/tools/[slug]/page.tsx` + `app/components/tools/*Tool.tsx` 模式。

#### 3.2 重新定位首页

- Hero 标题改为：
  - EN: **AI marketing toolkit for global growth.**
  - ZH: **出海营销 AI 工具箱。**
- 副标题强调：57+ tools + AI Agent for ads, ASO, content, and launch campaigns.
- 分类区把 `AI Writing` 改成更显眼的 `Growth` / `Ads` / `ASO`。
- 新增 **Playbooks** 区块：
  - “Launch on Product Hunt”
  - “Run a Meta Ad Campaign”
  - “Localize Your App for Japan”
  - 每个 Playbook 就是一个预设的 Agent Campaign 模板。

#### 3.3 积分与付费闭环

- 沿用 `PLAN.md` 里的 Credit 思路：
  - 免费工具 0 credit；Freemium 工具按次扣 credit；Agent Campaign 按步扣 credit。
  - 玩游戏赚 credit。
  - 导航栏显示 `🪙 Credits`。
- 与现有 `/pricing` 页打通：Pro / Team 给更多 credits 和 Agent 高级功能。

**预计工作量**：3～5 天（取决于新增工具数量）。

---

## 4. 和现有代码的衔接点

| 现有能力 | vNext 用法 |
|---|---|
| `/api/agent` + `lib/agent/orchestrator.ts` | 直接作为 Agent 后端，扩展 `campaign` 意图 |
| `lib/agent/tools.ts` 里的 `WRITING_TOOL_INPUTS` | 把新出海工具注册进去，让 Agent 能调用 |
| `lib/tool-data.ts` | 新增出海工具的本地元数据、价格、credit |
| `app/components/CatalogCards.tsx` 的 `ToolCardV2` | 卡片已经显示 price/credit，新增工具自然融入 |
| `app/lib/published-tools.ts` + `sitemap.ts` | 新工具 slug 加入白名单和 sitemap |
| 已删除的 `AgentChat.tsx` | 可以参考旧代码，但建议重写一个更轻量的 `/app/agent/page.tsx` |
| 现有 `/wishlist` | 可以升级为“Campaign ideas / Agent request”看板 |

---

## 5. 明天验收后建议的下一步

1. **先补 Agent UI（Phase 1）**：这是最快能看到效果的，且后端已就绪。
2. **同时新增 2～3 个出海工具**（推荐 `aso`、`facebook-ads`、`influencer-email`），验证新增工具的完整流程。
3. **再做 1 个 Playbook Campaign**（推荐 Product Hunt Launch），让用户第一次感受到 Agent 工作流。
4. **最后做积分和定价闭环**。

---

## 6. 风险与待决策

| 问题 | 说明 |
|---|---|
| LLM 成本 | Agent / Campaign 比单次生成消耗更多 token，需要加 `max_tokens` 限制并观察账单 |
| 中文 → 英文本地化 | 是否需要把界面也做中文？当前站点是英文，出海营销工具的目标用户可能是中国团队，但界面可以后续加 i18n |
| 用户账户 | Campaign 持久化先放 localStorage，正式上线前需要考虑登录/后端存储 |
| 新工具数据来源 | ASO/Amazon/广告文案等需要预设 prompt，不需要外部 API，但 prompt 质量决定效果 |

---

## 7. 一句话总结

> **下一个版本 = 复活 Agent UI + 上线 Campaign 工作流 + 补齐出海营销工具 + 把 AIHues 重新定位为“出海营销 AI Agent 工具站”。**
