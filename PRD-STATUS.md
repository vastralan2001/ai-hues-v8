# AIHues 产品现状说明

> 测试环境：https://aihues-test.mse.msh.work  
> 分支：`feature/design-refresh` → GitLab MR #3  
> 更新时间：2026-06-01

---

## 一、产品概述

AIHues 是 AI 工具导航站 + 实用工具集合，定位 "AI Vibe Navigator"。当前形态：

- **57个工具页面**（React组件 + 静态HTML）
- **3个轻量游戏**（每日运势 / 幸运老虎机 / 篮球挑战）
- **86篇SEO博客文章**
- **评测系统**（6维度评分 + 雷达图）
- **积分系统**（Free 100 credits / Pro $9 / Team $29）

---

## 二、各模块当前效果

### 1. 首页

- 搜索框直达工具（支持 `/` 快捷键聚焦）
- 分类浏览卡片：Developer / Utility / AI Writing / Games
- Game Center 展示 3 个游戏 + 积分余额
- Popular Tools 推荐位

### 2. 工具列表页 `/tools`

- **57个工具**，分 3 大类：Developer(30) / Utility(8) / AI Writing(19)
- 每个工具卡片显示：图标、名称、描述、价格标签、积分消耗
- 支持搜索 + 分类筛选 + 价格筛选

### 3. 工具详情页 `/tools/{slug}`

**三种形态：**

| 形态 | 说明 | 示例 |
|---|---|---|
| **有评测的React工具** | 顶部标签：工具 / 评测 / 评论 | Ad Copy、JSON、JWT |
| **无评测的React工具** | 仅显示工具本身 | Base64、UUID |
| **静态HTML工具** | 跳转到 `.html` 文件 | 遗留的26个工具 |

**评测标签内容：**
- 6维度雷达图（输出质量30% / 易用性20% / 性价比20% / 生态15% / 迭代10% / 社区5%）
- 6个维度进度条
- Pros/Cons 列表
- 使用建议 + 替代方案
- **当前15个工具有评测数据**

**评论标签内容：**
- 6条占位评论（含评分、回复、点赞）
- 支持提交评论（localStorage持久化，按工具隔离）
- 最热/最新排序

### 4. 纯前端计算工具（32个，完全可用）

JSON Formatter、JWT Parser、Base64、UUID、SHA256、Regex Tester、Diff、Color Converter、Cron Parser、QR Code、Markdown Preview 等 —— **零依赖，打开即用**。

### 5. AI写作工具（19个，页面可用但输出是模板）

Ad Copy、Blog Outline、Cold Email、X Post、LinkedIn、SEO Title、Meta、TL;DR 等 —— **能打开、能点击 Generate，但输出是预定义模板替换（`{product}` → 输入值），不是真正的AI生成**。

### 6. 博客 `/blog`

- 86篇文章，含目录导航、JSON-LD Schema、RSS
- 文章底部自动推荐相关工具卡片（基于tag匹配）
- 底部 Newsletter 订阅 + Related Articles

### 7. 工具对比 `/comparisons`

- 选择 2-4 个工具进行6维度雷达图对比

### 8. 定价 `/pricing`

| 档位 | 价格 | 积分 |
|---|---|---|
| Free | 免费 | 100 credits/月 |
| Pro | $9/月 | 2,000 credits/月 |
| Team | $29/月 | 10,000 credits/月 |

- 导航栏右上角显示当前积分余额（localStorage）
- 工具详情页 header 显示积分消耗徽章

### 9. Wishlist `/wishlist`

- 前端占位，7条假数据
- **提交按钮无实际逻辑，投票刷新丢失**
- **需要后端开发**

### 10. 游戏 `/games`

- 3个HTML游戏（已统一暗色主题 + 60px导航）
- 每日运势可赢积分

---

## 三、技术栈

| 层 | 技术 |
|---|---|
| 前端 | Next.js 16 + React 19 + Tailwind CSS + TypeScript |
| 构建 | moonrepo + pnpm |
| 部署 | ArgoCD 自动部署 |
| 后端 | Go service（port 9005，当前 offline） |
| API | Connect RPC（JSON over HTTP） |

---

## 四、已完成工作（本周）

1. ✅ 删除68篇博客中重复的"Related AIHues Tools"旧区块
2. ✅ 评测数据从7条扩展到15条（新增 x-post/lp-hero/seo-title/meta/tldr/regex/code-explain/video-title）
3. ✅ 博客Tag→工具映射覆盖全部11个tag
4. ✅ 评论系统重写（localStorage持久化、点赞、回复、排序）
5. ✅ 工具详情页添加积分消耗显示

---

## 五、关键决策点（需 leader 确认）

### 决策 1：AI工具是否接入真实LLM？

**现状：** 19个AI写作工具全是纯前端模板替换，用户觉得"没效果"。

**接入LLM需要：**
- 前端各AI工具改为调用统一API（Next.js API Route 或 Go后端中转）
- LLM API Key（OpenAI/Kimi/DeepSeek，约 ¥0.05/次）
- 每个AI调用消耗积分（已有积分系统UI铺垫）

**影响：** 接入后19个AI工具从"模板填空"升级为"真正AI生成"，是产品核心体验跃迁。

### 决策 2：Wishlist 后端排期

**现状：** 纯前端占位，提交和投票都不持久化。

**需要后端：** wishes表 + 投票接口 + 用户身份（至少匿名ID）。

### 决策 3：静态HTML工具迁移

**现状：** 26个工具仍是静态HTML，与React工具体验不一致。

**建议：** 逐步迁移为React组件（可复用现有组件库），或至少统一导航和布局。

---

## 六、截图索引

截图保存在 `/tmp/demo-*.png`：

| 截图 | 内容 |
|---|---|
| `demo-home.png` | 首页 |
| `demo-tools.png` | 工具列表页（57个工具） |
| `demo-json.png` | JSON Formatter 纯前端工具 |
| `demo-adcopy.png` | Ad Copy AI工具（带评测标签） |
| `demo-blog.png` | 博客文章 + 底部工具推荐 |
| `demo-compare.png` | 工具对比页 |
| `demo-review-tab.png` | 工具详情页（评测+评论标签） |
| `demo-pricing.png` | 定价页 |
