# 给开发老师的功能对接清单

> 更新时间：2026-06-01
> 当前状态：前端 UI 已完成，需要后端 API 支持才能让数据从"假"变"真"

---

## 🔴 优先级 1：用户核心资产（上线前必须完成）

### 1. 用户积分余额 API

**前端现状**：
- 导航栏、Game Center、games 页面都显示了积分余额
- 但全部硬编码为 `100`，且代码里有 `TODO: read from localStorage or API`

**需要后端提供**：
```
GET /api/v1/user/credits
Response: { balance: number, dailyClaimed: boolean, streakDays: number }
```

**影响页面**：
- `app/page.tsx` 第 522-524 行
- `app/games/page.tsx` 第 33-35 行
- `app/components/CreditDisplay.tsx`
- `public/games/*.html`（3 个游戏页面都从 localStorage 读积分）

---

### 2. 游戏排行榜 API

**前端现状**：
- Daily Luck、Slot Machine、Basketball 三个游戏都有排行榜
- 但全部使用假数据（虚构玩家名、NBA 球星名）

**需要后端提供**：
```
GET /api/v1/games/{gameSlug}/leaderboard?limit=10
Response: { entries: [{ rank, playerName, score, date }] }
```

**影响页面**：
- `public/games/daily-luck.html` — `defaultDailyLeaderboard`（10 条假数据）
- `public/games/slot-machine.html` — `defaultSlotsLeaderboard`（10 条假数据）
- `public/games/basketball.html` — `DEFAULT_LEADERBOARD`（10 条假数据，含 Curry/Lebron/Kobe）

**上线风险**：用户看到 NBA 球星在排行榜上会认为是 Bug

---

## 🟡 优先级 2：产品数据真实性（上线前建议完成）

### 3. 工具排行榜 / 使用统计 API

**前端现状**：
- `app/ranking/page.tsx` 整页都是假数据
- `#1 JWT Parser 12.5k 4.9`、个人排名 `#7`、Usage `76`、Credit `380` 全是写死的

**需要后端提供**：
```
GET /api/v1/analytics/tool-rankings
Response: { tools: [{ slug, name, usageCount, rating }] }

GET /api/v1/user/stats
Response: { rank, usageCount, creditBalance, achievements: [] }
```

**影响页面**：`app/ranking/page.tsx`（整页）

---

### 4. 工具定价与 Credit 消耗配置

**前端现状**：
- `app/components/CatalogCards.tsx` 里有 `TOOL_PRICING` 硬编码了 50+ 工具的 price/credit
- 注释明确写了 `backend has no price field yet`
- Pricing 页面也是硬编码：Free/100 credits、Pro/$9/2000 credits、Team/$29/10000 credits

**需要后端提供**：
```
// 在现有的 CatalogService.ListTools 响应中补充字段
Tool: {
  ...existingFields,
  priceTag: "free" | "freemium" | "paid",
  creditCost: number,       // 使用一次消耗多少积分
  externalUrl: string,      // 外部链接（已存在，需确认数据）
}
```

**影响页面**：
- `app/components/CatalogCards.tsx`
- `app/pricing/page.tsx`
- `public/tools/faq.html`

---

### 5. 许愿板（Wishlist）投票 API

**前端现状**：
- `app/components/WishlistBoard.tsx` 里有 `WISHLIST_ITEMS` 硬编码 9 条数据（votes、date、status 全是假的）

**需要后端提供**：
```
GET  /api/v1/wishlist/items          // 获取投票列表
POST /api/v1/wishlist/items          // 提交新想法
POST /api/v1/wishlist/items/{id}/vote // 投票
```

**影响页面**：`app/components/WishlistBoard.tsx`

---

## 🟢 优先级 3：体验优化（可迭代）

### 6. 用户成就系统

**前端现状**：
- `app/ranking/page.tsx` 里有写死的成就 toast：`Save 3 tools to wishlist`

**需要后端提供**：
```
GET /api/v1/user/achievements
Response: [{ id, title, description, unlocked, progress }]
```

---

### 7. 博客 CMS / 管理后台

**前端现状**：
- 博客文章是 8 个静态 HTML 文件放在 `public/blog/`
- 博客列表、详情页、RSS 三处各维护一套硬编码的元数据

**建议方案**：
- 短期：继续用静态 HTML，但把元数据统一到一个 JSON 文件
- 长期：接入 headless CMS（如 Strapi、Notion API）

---

### 8. 分类数量统计

**前端现状**：
- 首页分类卡片上的工具数量是硬编码的（Utility 8 个、Developer 30 个、AI Writing 19 个、Games 3 个）

**需要后端提供**：
```
GET /api/v1/catalog/category-counts
Response: { utility: 12, developer: 35, "ai-writing": 21, games: 3 }
```

**或者**：前端已有 `listTools({ pageSize: 100 })` 的返回数据，可以直接 `tools.filter(...).length` 计算，无需后端新接口。

---

## ✅ 前端已完整实现、无需后端支持的功能

| 功能 | 状态 | 说明 |
|---|---|---|
| 工具目录 + 分类筛选 | ✅ | 已接 `CatalogService.ListTools`，API 正常 |
| 游戏目录 | ✅ | 已接 `CatalogService.ListGames`，API 正常 |
| 价格筛选（All/Free/Freemium/Paid） | ✅ | 前端基于 `priceTag` 字段筛选 |
| 工具详情页 SEO | ✅ | `generateMetadata` 动态生成 |
| Sitemap + RSS + robots.txt | ✅ | 动态路由生成 |
| Command Palette（Cmd+K） | ✅ | 纯前端 |
| Loading Skeletons | ✅ | 纯前端 |
| 404 页面 | ✅ | 纯前端 |
| 博客文章展示 | ✅ | 静态 HTML |
| 双语支持（en/zh） | ✅ | 字典文件已完整 |

---

## 📌 需要确认的问题

1. **积分系统业务规则**：初始积分给多少？每日签到给多少？连签加成怎么算？玩游戏赚积分、用工具消耗积分的规则是什么？
2. **排行榜数据范围**：是全局排行榜还是只显示好友？数据多久刷新？
3. **Pricing 页面**：Free/Pro/Team 三档定价和积分配额是最终确定的吗？是否需要对接支付系统？
4. **用户体系**：目前没有看到登录/注册功能，积分和排行榜是基于设备（localStorage）还是基于用户账号？
