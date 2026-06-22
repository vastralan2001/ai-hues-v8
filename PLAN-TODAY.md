# AIHues 开发方案 — 2026-06-02

> 本文档对应用户提出的 8 项任务，包含范围定义、时间估算、优先级排序、阻塞风险和验收标准。

---

## 一、任务总览与优先级

| 编号 | 任务 | 优先级 | 预计工时 | 阻塞点 | 前置依赖 |
|------|------|--------|----------|--------|----------|
| 1 | 工具可用性全量检测 + 大模型API需求报告 | P0 | 4-6h | 无 | 无 |
| 5 | Wishlist + Ranking 后端配置（占位→上线） | P0 | 6-8h | 后端API设计 | 任务1 |
| 4 | 积分系统（消耗/回复/付费定价） | P1 | 2-3d | 后端接口 + 支付 | 任务5 |
| 2 | AI评测模块 + Blog工具联动 | P1 | 2-3d | 交互设计需确认 | 任务1 |
| 3 | 首页外链扩展（GitHub AI目录对标） | P2 | 1d | 无 | 任务1 |
| 6 | AI产品/Skill/评测/社区架构规划 | P2 | 1d | 需参考网站 | 任务2 |
| 7 | 后端待决策 + Agent植入点分析 | P3 | 4-6h | 无 | 任务5 |
| 8 | 出海推广 + Kimi主站结合策略 | P3 | 4-6h | 需Kimi资源对接人 | 无 |

**今日建议批次**：1 → 5 → 4 → 2 → 3 → 6/7/8

---

## 二、任务1：工具可用性全量检测

### 范围
- **57个本地工具**：每个工具的HTML页面或React组件进行功能可用性测试
- **32个外部工具**：验证链接是否存活、页面是否正常加载
- **AI工具专项**：标注哪些需要接入大模型API才能正常工作

### 分类
本地57个工具按类型分：

| 类别 | 数量 | 是否需要LLM API | 代表工具 |
|------|------|----------------|----------|
| 纯前端计算 | 25 | ❌ | JWT Parser, JSON Formatter, Regex, UUID, Base64, SHA256, Timestamp, URL Encode, Cron, Color, QR Code, Markdown, Diff, Word Count, Fullwidth, Title Case, Lorem Ipsum, Password Gen, HTTP Status, HTML Entity, Unit Convert, Base Convert, CSV↔JSON, Pomodoro, Chi-Squared |
| 前端+外部API | 5 | ❌ | IP Lookup, Image→Base64, SQL Formatter, CSS Gradient, Code Explain |
| AI写作（需LLM） | 19 | ✅ | Ad Copy, Blog Outline, Cold Email, Newsletter, X Post, Video Title, YT Script, Tagline, Push, FAQ, PR Desc, Meta Tag, SEO Title, TL;DR, Docs, LinkedIn, LP Hero, Alt Text, Humanize |
| AI代码（需LLM） | 4 | ✅ | Code Review, Code Explain, Shell Gen, Git Commit |
| 未归类 | 4 | 待确认 | Curl Gen, Pseudo, Readability, Diff Pro |

### 检测方式
1. **自动化脚本**：对每个工具页面做HTTP请求，检查返回200 + 关键DOM元素存在
2. **AI辅助验证**：对AI类工具，尝试输入简单prompt，检查是否有输出区域
3. **大模型API需求报告**：列出每个AI工具的prompt模板、期望输出格式、建议模型

### 预计时间
- 自动化检测脚本：1h
- 57个工具跑测+记录：2-3h
- 32个外链存活检查：30min
- 大模型API需求报告撰写：1h
- **总计：4-6小时**

### 交付物
- `docs/tool-audit-report.md` — 每个工具的可用性状态（✅正常/⚠️异常/❌不可用）
- `docs/llm-api-requirements.md` — AI工具的API接入方案
- `docs/external-links-health.md` — 外链存活状态

---

## 三、任务5：Wishlist + Ranking 后端配置

### 5.1 Wishlist 现状
- 当前：前端占位，`WishlistBoard` 组件只有静态UI，无后端
- 需要：提交工具想法 → 存储 → 投票 → 排序 → 展示

### 5.2 Ranking 现状
- 当前：假数据表格 + 个人面板 + 成就提示
- 需要：真实使用数据排名（工具使用次数、用户活跃度、积分排行）

### 后端方案（Go Connect API）

#### Wishlist API
```protobuf
service WishlistService {
  rpc SubmitIdea(SubmitIdeaRequest) returns (SubmitIdeaResponse);
  rpc ListIdeas(ListIdeasRequest) returns (ListIdeasResponse);
  rpc VoteIdea(VoteIdeaRequest) returns (VoteIdeaResponse);
}

message Idea {
  string id = 1;
  string title = 2;
  string description = 3;
  string author = 4;  // anonymous or user_id
  int32 votes = 5;
  string status = 6;  // pending / planned / done / rejected
  string created_at = 7;
}
```

#### Ranking API
```protobuf
service RankingService {
  rpc GetToolRankings(GetToolRankingsRequest) returns (GetToolRankingsResponse);
  rpc GetUserRanking(GetUserRankingRequest) returns (GetUserRankingResponse);
  rpc GetLeaderboard(GetLeaderboardRequest) returns (GetLeaderboardResponse);
}
```

### 前端改造
- WishlistBoard：接入 Submit/List/Vote API
- RankingPage：接入真实排名数据，移除假数据
- 需要 loading / error / empty 状态

### 预计时间
- 后端proto + API实现：4-6h（需要Go服务在线）
- 前端改造：2-3h
- **总计：6-8小时**

### 阻塞点
- Go后端服务当前离线（端口9005），需要先确认能否启动
- 数据库表设计（ideas表、rankings表、user_stats表）

---

## 四、任务4：积分系统

### 设计

#### 积分消耗规则
| 工具类别 | 难度 | 单次消耗积分 | 说明 |
|----------|------|-------------|------|
| 纯前端计算 | ⭐ | 0 | 本地执行，无成本 |
| 前端+外部API | ⭐⭐ | 0-5 | 轻量外部调用 |
| AI写作（简单） | ⭐⭐⭐ | 5-10 | 短篇生成，如X Post、Push |
| AI写作（复杂） | ⭐⭐⭐⭐ | 15-20 | 长文生成，如YT Script、Blog Outline |
| AI代码审查 | ⭐⭐⭐⭐⭐ | 15-25 | 代码分析，token消耗大 |

#### 积分获取规则
| 行为 | 奖励积分 | 限制 |
|------|----------|------|
| 注册/首次访问 | 100 | 一次性 |
| 每日签到 | 10-50 | 每日1次，连续签到递增 |
| 玩Daily Fortune | 5-15 | 每日1次 |
| 玩Lucky Slots | 5-100 | 每日3次免费 |
| 玩Basketball | 10-50 | 每日不限 |
| 分享工具 | 20 | 每日限3次 |
| 提交Wishlist | 10 | 审核通过 |

#### 付费套餐
| 套餐 | 月费 | 月积分 | 额外权益 |
|------|------|--------|----------|
| Free | ¥0 | 100/月 | 基础工具全免费，AI工具有限 |
| Pro | ¥29 | 2000/月 | 高级模型、历史记录、导出 |
| Team | ¥99 | 10000/月 | 团队空间、共享预设、管理后台 |

### 后端需要
- 用户积分表（user_credits）
- 积分流水表（credit_transactions）
- 套餐订阅表（subscriptions）
- 积分消耗接口（deductCredits）
- 积分获取接口（addCredits）

### 前端需要
- 工具页面显示积分消耗提示
- 积分不足时弹窗引导升级
- 积分余额实时显示（Header已有CreditDisplay）
- 签到按钮 + 连续签到日历

### 预计时间
- 后端：2-3天（含数据库设计+API+测试）
- 前端：1-2天（积分UI+消耗逻辑+付费页面改造）
- **总计：2-3天**

### 阻塞点
- 后端Go服务需在线
- 支付接入（Stripe/支付宝/微信）

---

## 五、任务2：AI评测模块 + Blog工具联动

### 方案

#### 数据层（`app/lib/reviews.ts`）
```typescript
export interface ToolReview {
  slug: string;
  rating: number;        // 1-5，总体评分
  dimensions: {
    easeOfUse: number;   // 易用性
    functionality: number; // 功能性
    value: number;       // 性价比
    design: number;      // 设计
    speed: number;       // 速度
  };
  pros: string[];
  cons: string[];
  verdict: string;       // 一句话总结
  bestFor: string[];     // 适合人群
  alternatives: string[]; // 替代工具slug
  testedDate: string;
  lastUpdated: string;
  reviewer: string;
}
```

#### 页面改造
1. **工具详情页**（`/tools/[slug]`）：
   - 新增「评测」Tab，展示评分雷达图 + Pros/Cons + Verdict
   - 替代工具推荐卡片（内链）
   - 如果 `isExternal`，加「访问官网」按钮带UTM

2. **新增聚合页**：
   - `/reviews` — 所有评测工具列表，按评分排序
   - `/comparisons` — 横向对比（如 Claude vs GPT-4o）
   - `/alternatives` — 替代方案发现页

3. **Blog文章联动**：
   - 每篇文章末尾加「相关工具推荐」区块（3个卡片）
   - 根据文章tag匹配工具category
   - 文章内工具名自动加内链（如提到"JWT" → 链接到 `/tools/jwt`）

#### 交互设计（需二次确认）
- 评分展示：五星制 vs 十分制 vs 雷达图？
- 评测Tab位置：工具页顶部Tabs vs 底部折叠？
- Blog工具推荐：文章末尾固定区块 vs 文中浮动卡片？
- 对比页：表格对比 vs 卡片对比 vs 交互式选择器？

### 预计时间
- 数据层+类型定义：2h
- 工具详情页评测组件：1天
- 聚合页（reviews/comparisons/alternatives）：1天
- Blog联动（相关工具推荐+自动内链）：1天
- **总计：2-3天**

### 阻塞点
- 需确认交互设计（上述4个问题）
- 需先完成工具可用性检测（任务1）

---

## 六、任务3：首页外链扩展

### 对标来源
- `tomrzv/AI-Directories` — 200+ AI目录站
- `QAInsights/awesome-ai-tools` — AI编程工具合集
- `starryrbs/awesome-ai-tools` — AI营销工具

### 执行内容
1. **扩展 `GROWTH_TOOLS`**：增加50-100个AI工具外链，覆盖：
   - AI写作（Copy.ai, Jasper, Writesonic, Rytr）
   - AI图像（Midjourney, Stable Diffusion, DALL-E, Leonardo）
   - AI视频（Runway, Pika, Sora, HeyGen）
   - AI代码（Cursor, Copilot, Cody, Codeium）
   - AI音频（ElevenLabs, Murf, Descript）
   - AI搜索（Perplexity, You.com, Andi）
   - AI自动化（Zapier AI, Make, n8n）

2. **首页改造**：
   - Playbooks卡片增加「AI工具发现」入口
   - Stats Bar增加「外部工具」数量统计
   - 新增「本周新增工具」区块

3. **所有外链加UTM**：
   ```
   ?utm_source=aihues&utm_medium=referral&utm_campaign=ai-writing
   ```

### 预计时间
- 工具数据收集+录入：4-6h
- 首页改造：2-3h
- UTM参数统一：1h
- **总计：1天**

---

## 七、任务6：AI产品/Skill/评测/社区架构规划

### 范围
- 等用户提供参考网站后做对标分析
- 规划长期内容架构：AI产品库、Skill目录、评测体系、社区功能

### 预计时间
- 参考网站分析：2-3h
- 架构方案文档：3-4h
- **总计：1天**

### 阻塞点
- 需用户提供参考网站列表

---

## 八、任务7：后端待决策 + Agent植入点

### 后端待决策清单
| 决策项 | 选项 | 建议 |
|--------|------|------|
| 数据库 | PostgreSQL vs MySQL vs SQLite | PostgreSQL（已有Go生态支持） |
| 缓存 | Redis vs 内存缓存 | Redis（积分、排行榜、session） |
| 支付 | Stripe vs 支付宝 vs 微信 | Stripe（出海优先）+ 支付宝（国内） |
| 文件存储 | S3 vs 本地 | S3（封面图、用户上传） |
| 消息队列 | 不需要 vs Kafka vs NATS | 初期不需要 |
| 监控 | Prometheus+Grafana vs 云监控 | 云监控（快速上线） |

### Agent植入点分析
| 植入位置 | Agent能力 | 价值 |
|----------|----------|------|
| 首页搜索框 | 自然语言→工具推荐 | 降低发现成本 |
| 工具详情页 | 根据输入自动选择最佳工具 | 提升转化率 |
| Blog文章 | 自动生成工具推荐卡片 | 内容变现 |
| Wishlist | 自动归类+相似度匹配 | 提升社区质量 |
| 客服/FAQ | 自动回答工具使用问题 | 降低支持成本 |
| 积分系统 | 智能推荐积分使用策略 | 提升留存 |

### 预计时间
- 后端决策文档：2-3h
- Agent植入点分析：2-3h
- **总计：4-6小时**

---

## 九、任务8：出海推广 + Kimi主站结合

### 出海推广策略
1. **目录站提交**：
   - Product Hunt（首发）
   - Futurepedia / FutureTools / Toolify
   - TheresAnAIForThat / SaaSHub / Capterra
   - Reddit r/artificial / r/SideProject / r/IndieHackers
   - Hacker News Show

2. **内容营销**：
   - 每月2-3篇「AI工具对比」文章（SEO长尾词）
   - Twitter/X 每日一条工具推荐
   - YouTube Shorts / TikTok 工具演示

3. **SEO外链建设**：
   - GitHub awesome 列表（新建 `aiushtha/awesome-ai-tools`）
   - 客座博客（Guest Post）
   - 工具评论网站（G2, Capterra）

### Kimi主站结合
| 结合点 | 方案 | 优先级 |
|--------|------|--------|
| 工具推荐API | Kimi主站调用AIHues工具目录API | P1 |
| 联合登录 | 用Kimi账号体系登录AIHues | P2 |
| 内容同步 | AIHues博客文章同步到Kimi社区 | P2 |
| 积分互通 | Kimi积分与AIHues积分兑换 | P3 |
| Agent集成 | Kimi Agent调用AIHues工具 | P1 |

### 预计时间
- 推广策略文档：2-3h
- Kimi结合方案：2-3h
- **总计：4-6小时**

### 阻塞点
- 需Kimi产品/运营团队对接人

---

## 十、今日执行建议

### 批次1：上午（4-6h）
- [ ] **任务1**：工具可用性全量检测
  - 跑自动化脚本检测57个本地工具
  - 检查32个外部链接存活
  - 输出大模型API需求报告

### 批次2：下午（6-8h）
- [ ] **任务5**：Wishlist + Ranking 后端
  - 确认Go服务能否启动
  - 设计Wishlist/Ranking proto
  - 前端接入真实数据

### 批次3：次日（2-3d）
- [ ] **任务4**：积分系统
- [ ] **任务2**：AI评测模块（需交互设计确认）
- [ ] **任务3**：首页外链扩展

### 批次4：后续（1-2d）
- [ ] **任务6/7/8**：长期规划文档

---

## 十一、需要用户确认的事项

1. **交互设计确认**（影响任务2）：
   - 评分展示方式？（五星/十分/雷达图）
   - 评测Tab位置？（顶部/底部/侧边）
   - Blog工具推荐位置？（文末/文中/侧边栏）
   - 对比页形式？（表格/卡片/交互式）

2. **后端资源确认**（影响任务4/5）：
   - Go服务能否启动？端口9005是否可用？
   - 数据库用PostgreSQL还是其他？
   - 支付接入Stripe还是国内渠道？

3. **参考网站**（影响任务6）：
   - 请提供你想对标的AI产品/评测/社区网站

4. **Kimi对接**（影响任务8）：
   - 是否有Kimi产品/运营团队的对接人？

---

*文档生成时间：2026-06-02*
*对应分支：feature/design-refresh*
