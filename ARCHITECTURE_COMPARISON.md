# GitHub main 分支 vs 本地 feature/design-refresh 对比分析

> 分析时间：2026-06-01

---

## 🔍 发现了什么

GitHub `main` 分支（`1dd85cc`）是一个**全新的全栈项目骨架**，和本地 `feature/design-refresh` 完全是两套技术栈：

| 维度 | GitHub `main` | 本地 `feature/design-refresh` |
|---|---|---|
| **项目结构** | 标准 Next.js 单项目（`src/app/`） | moonrepo 单体仓库（`apps/aihues-web/`） |
| **后端** | Prisma ORM + PostgreSQL（Node.js 全栈） | Go 服务（`aihues-api`）+ Connect JSON API |
| **认证** | next-auth（OAuth/邮箱/密码） | ❌ 无认证系统 |
| **国际化** | next-intl | 自建 i18n（`dict.ts`） |
| **状态管理** | zustand | ❌ 无（用 localStorage） |
| **数据库** | Prisma Schema 已设计完整 | Go migrations（PostgreSQL） |
| **前端页面** | 只有初始化骨架（无业务页面） | 完整首页、工具页、游戏页、博客等 |
| **工具数量** | 57 个（Prisma seed） | 90 个（`tool-data.ts`） |
| **分类体系** | 3 个（DEV / UTILITY / AI_WRITING） | 10 个（developer / utility / ai-writing / growth / community / seo / analytics / content / games） |

---

## 📊 工具数据差异详解

### GitHub `main` 的 57 个工具
- 25 个 Developer 工具
- 16 个 Utility 工具
- 16 个 AI Writing 工具
- **全部有**：slug、name（中文）、nameEn、icon、description（中文）、creditCost、tags、url
- **没有**：priceTag（free/freemium/paid）、isExternal 标记

### 本地 `feature/design-refresh` 的 90 个工具
- 58 个本地工具（有独立 HTML/React 页面）
- 32 个外部链接工具（`isExternal: true`，跳转到第三方）
- **全部有**：slug、name、nameZh、description、descriptionZh、category、price、credit、url、isExternal
- **分类更细**：含 growth、community、seo、analytics、content 等出海/营销类工具

### 核心差距
1. **33 个工具缺失**：`main` 的 seed 比本地少了 33 个（主要是外部链接工具和新增分类）
2. **字段不对齐**：`main` 没有 `priceTag`（free/freemium/paid），但本地前端已经用这个字段做筛选和标签展示
3. **分类体系不同**：`main` 只有 3 大分类，本地有 10 个，且含中文名称

---

## 🤔 两个选择

### 选择 A：继续当前架构（Go 后端 + monorepo）

**做法**：
- 以 `feature/design-refresh` 为基础继续迭代
- 把 `main` 的 Prisma schema 作为**参考设计**，让 Go 后端按同样模型补字段
- 补齐 90 个工具到 Go 后端数据库

**优点**：
- 前端页面已经全部做完，不需要重写
- Go 后端已经能跑，API 已通
- 测试环境已部署，CI/CD 已配好
- **最快 2 周可上线**

**缺点**：
- 需要自己维护 Go 后端（人才储备问题）
- 没有 next-auth，用户系统需要自研
- 没有 Prisma 的 ORM 便利性

**需要补的工作**：
| 任务 | 工作量 | 负责人 |
|---|---|---|
| Go 后端补 `priceTag` + `isExternal` 字段 | 0.5 天 | 后端 |
| Go 后端补 90 个工具数据（migration） | 1 天 | 后端 |
| Go 后端加用户积分 API | 2 天 | 后端 |
| 前端把 dict.ts 迁移到 next-intl（可选） | 2 天 | 前端 |

---

### 选择 B：迁移到 GitHub `main` 新架构（Prisma + next-auth + 全栈）

**做法**：
- 以 `main` 分支为新的代码基线
- 把 `feature/design-refresh` 里做好的前端页面，迁移到 `main` 的 `src/app/` 结构
- 补齐 33 个缺失工具到 Prisma seed
- 给 Prisma schema 补 `priceTag` + `isExternal` 字段

**优点**：
- `main` 的 Prisma schema 已经设计了完整的用户/工具/评分/收藏/成就/排行榜/许愿板模型
- next-auth 开箱即用，省去自研认证
- Prisma ORM 开发效率高
- zustand 状态管理比 localStorage 更可靠
- 全栈 Node.js，前后端技术栈统一

**缺点**：
- **迁移工作量巨大**：需要把 monorepo 里的前端代码全部搬到标准 Next.js 项目
- 需要重写 API 层（原来是调用 Go 后端，现在要改成 Prisma Client）
- 测试环境、CI/CD、部署配置全部要重新配
- **预估 3-4 周才能完成迁移**

**需要补的工作**：
| 任务 | 工作量 | 负责人 |
|---|---|---|
| 前端页面迁移（monorepo → `src/app/`） | 5-7 天 | 前端 |
| 适配 next-intl（替换自建 i18n） | 2 天 | 前端 |
| Prisma schema 补 `priceTag` + `isExternal` | 0.5 天 | 后端 |
| Prisma seed 补 33 个缺失工具 | 1 天 | 后端 |
| 重写 API 路由（Prisma Client） | 3-5 天 | 后端 |
| 配置 next-auth + 用户系统 | 2 天 | 后端 |
| 重新配 CI/CD + 部署 | 2 天 | DevOps |

---

## 💡 我的建议

**推荐选择 A（继续当前架构），理由：**

1. **时间成本**：选择 A 2 周可上线，选择 B 要 3-4 周
2. **沉没成本**：`feature/design-refresh` 已经做了 50+ 个 commit，首页/工具页/游戏页/博客全部做完，推倒重来的代价太大
3. **main 分支可以吸收**：不需要全盘迁移，只需要把 `main` 的**数据库设计**和**用户系统思路**借鉴过来，让 Go 后端补齐字段即可

**折中方案（最佳选择）：**
- 继续用 Go 后端 + monorepo 架构
- 让后端同学参考 `main` 的 Prisma schema，在 Go 后端里补齐相同的业务模型（用户积分、排行榜、成就、许愿板）
- 把 `main` 的 57 个工具 seed 数据 + 本地新增的 33 个，统一成一份完整的 90 工具数据
- 给 Go 后端数据库加 `priceTag` 和 `isExternal` 字段
- **保留 future option**：等上线稳定后，再考虑是否逐步迁移到 `main` 的全栈架构

---

## 📋 工具数据补齐清单

如果采用折中方案，需要后端同学把这 33 个缺失工具补进数据库：

### 本地有但 `main` seed 缺失的分类/工具

| 分类 | 数量 | 说明 |
|---|---|---|
| `growth`（出海增长） | ~8 个 | 如 landing page hero、ad copy、yt script 等 |
| `community`（社区目录） | ~5 个 | 社区相关工具 |
| `seo` | ~5 个 | SEO 相关工具 |
| `analytics`（分析埋点） | ~4 个 | 数据分析工具 |
| `content`（内容创作） | ~5 个 | 内容生成工具 |
| `games` | 3 个 | Daily Luck、Slot Machine、Basketball |
| 其他外部链接工具 | ~8 个 | 跳转到第三方的工具 |

**这些工具的数据已经在 `tool-data.ts` 里完整定义，后端同学只需要写 migration 导入即可。**

---

## ⏱️ 排期建议（折中方案）

| 周 | 前端 | 后端 |
|---|---|---|
| **Week 1** | 侧边栏/Footer 数字动态化、博客元数据统一 | Go 后端补 `priceTag` + `isExternal` 字段、补 90 个工具数据 |
| **Week 2** | 等后端 API ready 后切积分读取、Ranking 页面接入 | 用户积分系统（余额+签到+流水）、排行榜 API |
| **Week 3** | 许愿板页面、成就系统 UI | 许愿板 API、成就系统 API |
| **上线后** | — | 逐步参考 `main` 的 schema 完善数据库模型 |
