# AIHues 产品现状说明

> 测试环境：https://aihues-test.mse.msh.work  
> 分支：`feature/design-refresh` → GitLab MR #3  
> 更新时间：2026-06-02

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
- **6个热词快捷入口**（JWT/JSON/Regex/QR Code/Fortune/Hoops）— 点击直达对应工具/游戏
- 分类浏览卡片：Developer / Utility / AI Writing / Games
- **外部推广位** — 跳转至合作伙伴 Girgrils
- Game Center 展示 3 个游戏 + 积分余额
- Popular Tools 推荐位

### 2. 工具列表页 `/tools`

- **57个工具**，分 3 大类：Developer(30) / Utility(8) / AI Writing(19)
- 每个工具卡片显示：图标、名称、描述、价格标签、积分消耗
- 支持搜索 + 分类筛选

### 3. 工具详情页 `/tools/{slug}`

**三种形态：**

| 形态                  | 说明                         | 示例               |
| --------------------- | ---------------------------- | ------------------ |
| **有评测的React工具** | 顶部标签：工具 / 评测 / 评论 | Ad Copy、JSON、JWT |
| **无评测的React工具** | 仅显示工具本身               | Base64、UUID       |
| **静态HTML工具**      | 跳转到 `.html` 文件          | 遗留的26个工具     |

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

| 档位 | 价格   | 积分              |
| ---- | ------ | ----------------- |
| Free | 免费   | 100 credits/月    |
| Pro  | $9/月  | 2,000 credits/月  |
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

| 层   | 技术                                              |
| ---- | ------------------------------------------------- |
| 前端 | Next.js 16 + React 19 + Tailwind CSS + TypeScript |
| 构建 | moonrepo + pnpm                                   |
| 部署 | ArgoCD 自动部署                                   |
| 后端 | Go service（port 9005，当前 offline）             |
| API  | Connect RPC（JSON over HTTP）                     |

---

## 五、已完成工作（本周）

1. ✅ 删除68篇博客中重复的"Related AIHues Tools"旧区块
2. ✅ 评测数据从7条扩展到15条
3. ✅ 博客Tag→工具映射覆盖全部11个tag
4. ✅ 评论系统重写（localStorage持久化、点赞、回复、排序）
5. ✅ 工具详情页添加积分消耗显示
6. ✅ **首页热词修复** — 6个快捷标签改为可点击链接
7. ✅ **首页去冗余** — 删除无效的 All/Free/Freemium/Paid 筛选
8. ✅ **首页推广位** — Playbooks 改为外部合作伙伴链接
9. ✅ **首页统计修复** — 移除 805 行硬编码 fallback 数组，`catalog-api.ts` fallback 改为动态生成自 `tool-data.ts`，确保首页/Developer/Utility/AI Writing/Games 数字与 57+30+8+19+3 完全一致
10. ✅ **Wishlist 后端** — Next.js API Route + JSON 文件持久化（容器不可写时自动回退内存），提交/投票全链路可用，双语 UI
11. ✅ **评论系统双语化** — 6 条占位评论随 locale 自动切换中英文，用户评论永久保留
12. ✅ **积分初始化修复** — 新用户首次访问自动写入 100 credits（与定价页 Free 档位一致），游戏赢取/消耗同步正确

---

## 六、关键决策点（1 个待 leader 确认）

### 决策 1：AI工具是否接入真实LLM？

**现状：** 19个AI写作工具全是纯前端模板替换，用户觉得"没效果"。

**接入LLM需要：**

- 前端各AI工具改为调用统一API（Next.js API Route 或 Go后端中转）
- LLM API Key（OpenAI/Kimi/DeepSeek，约 ¥0.05/次）
- 每个AI调用消耗积分（已有积分系统UI铺垫）

**影响：** 接入后19个AI工具从"模板填空"升级为"真正AI生成"，是产品核心体验跃迁。

### 决策 2：✅ 已完成 — Wishlist 后端已上线

**实现：** Next.js API Route + JSON 文件持久化（`/tmp/aihues-wishes.json`），容器文件系统不可写时自动回退内存存储，功能永不挂掉。

- `GET /api/wishes` 拉取列表
- `POST /api/wishes` 提交新需求
- `POST /api/wishes/vote` 投票/取消投票（anonymous ID 防刷票）
- 前端乐观更新，双语 UI

### 决策 3：✅ 已完成 — 26 个 HTML 工具已迁移 React

**现状：** 57 个工具已全部走 React 组件，统一导航和布局。26 个遗留 HTML 文件已删除。

---

## 七、截图索引

截图保存在 `screenshots/`：

| 截图                  | 内容                              |
| --------------------- | --------------------------------- |
| `demo-home.png`       | 首页（含热词+推广位）             |
| `demo-tools.png`      | 工具列表页（57个工具）            |
| `demo-json.png`       | JSON Formatter 纯前端工具         |
| `demo-adcopy.png`     | Ad Copy AI工具（带评测标签+积分） |
| `demo-blog.png`       | 博客文章 + 底部工具推荐卡片       |
| `demo-compare.png`    | 工具对比页                        |
| `demo-review-tab.png` | 工具详情页（评测+评论标签）       |
| `demo-pricing.png`    | 定价页（Free/Pro/Team）           |
