# AIHues 首页设计升级 + 游戏积分修复计划

## 背景

- **GitLab 版本** (`feature/design-refresh`): Next.js 16 + React + Tailwind，英文，琥珀色主题
- **GitHub 版本** (`ai-hues-v6` master): v8.5 纯静态站，中文，功能更丰富的首页设计

目标：**以 v8.5 首页设计为参考，升级 Next.js 版本首页；同时修复 v8.5 游戏积分布局问题，再同步回 Next.js。**

---

## Phase 1: 修复 v8.5 游戏积分布局（`ai-hues-v6`）

### 问题诊断

当前 `games.html` 积分信息分散且不一致：

| 问题 | 现状 | 修复方向 |
|:---|:---|:---|
| **积分余额不显示** | 游戏页面没有当前 Credit 余额 | 顶部添加积分余额卡片 |
| **积分收益不一致** | Daily Fortune 有 `+10 Credits`，Slots/Basketball 没有 | 所有游戏统一标注可赚取积分 |
| **Stats Bar 太抽象** | `🪙 Earn Credits` 没有数字 | 改成 `🪙 +5~50 Credits / game` |
| **缺少积分规则** | 用户不知道积分怎么来、怎么花 | 添加"积分规则"折叠面板 |

### 具体修改

1. **游戏页面顶部添加积分余额栏**
   ```
   ┌─────────────────────────────────────────┐
   │  🪙 当前积分: 100      [积分规则 ▼]     │
   └─────────────────────────────────────────┘
   ```

2. **统一游戏卡片的 meta 信息**
   - Daily Fortune: `🧧 30签` · `🪙 +10/次` · `🔥 连签加成`
   - Lucky Slots: `🎰 3×3` · `🆓 3次/天` · `🪙 +5~100/次` · `🏆 排行榜`
   - Hoops Challenge: `⏱️ 60秒` · `🏀 物理引擎` · `🪙 +10~50/次` · `🏆 排行榜`

3. **添加积分规则折叠面板**（点击展开）
   - 初始积分: 100
   - 玩游戏赚积分
   - 使用工具消耗积分
   - 每日签到奖励
   - 连签加成

---

## Phase 2: v8.5 首页设计亮点提取

### 亮点 1: 全局价格筛选（最高优先级）

v8.5 顶部有 `全部 | Free | Freemium | Paid` 筛选，Next.js 版本完全没有。

**迁移方案:**
- 在 Hero 搜索框下方添加价格筛选标签
- 与现有分类卡片联动，点击后过滤工具列表

```
[全部] [Free] [Freemium] [Paid]          ← 新增
```

### 亮点 2: 右上角 Credit 积分显示（高优先级）

v8.5 顶部导航右侧有 `🪙 100` 实时积分显示。

**迁移方案:**
- 在 `SiteChrome.tsx` 导航栏右侧添加 Credit 显示组件
- 显示当前积分余额（从 localStorage 读取）

```
导航栏: [Logo] [Discover] [Tools] [Games] [Blog]      🪙 100  [Theme]
```

### 亮点 3: Playbooks 深色推广卡片（高优先级）

v8.5 的深色卡片设计很突出：
```
┌────────────────────────────────────────────────────────┐
│  🤖 AI Vibe Navigator    Built on Kimi                 │
│  AIHues Growth Stack + AI Tools                        │
│  100+ tools covering growth, AI products...            │
│  [🚀 出海增长 70] [⭐ AI 产品 50] [🔥 开源追踪 30]      │
└────────────────────────────────────────────────────────┘
```

**迁移方案:**
- 在 Hero 和分类卡片之间插入深色推广卡片
- 背景用 `linear-gradient(135deg, #1c1917, #292524)`
- 链接到对应分类锚点

### 亮点 4: 工具卡片增强（中优先级）

v8.5 工具卡片有：**价格标签**（Free/Freemium/Paid 颜色区分）+ **Credit 消耗**（🪙 15）+ **访问链接**

**迁移方案:**
- `ToolCardV2` 组件增加 `price` 和 `credit` 字段显示
- Free = 绿色标签，Freemium = 琥珀色，Paid = 红色

### 亮点 5: 每个 Section 独立标题 + 数量徽章（中优先级）

v8.5 每个分类区域有明确的标题和数量：
```
🚀 出海增长工具 [70]                    [全部] [Free] [Freemium] [Paid]
```

**迁移方案:**
- Developer Tools / Writing Tools / Games 区域添加 Section 标题栏
- 右侧加数量徽章和"View all →"链接

### 亮点 6: 左侧分类边栏（低优先级 / 后续迭代）

v8.5 有左侧树状分类导航，需要大量数据和交互，建议作为后续迭代。

---

## Phase 3: Next.js 首页升级实施计划

### 改动清单（按优先级排序）

| # | 改动 | 文件 | 预估工作量 |
|:---|:---|:---|:---|
| 1 | 导航栏添加 Credit 积分显示 | `SiteChrome.tsx` | 30min |
| 2 | Hero 下方添加价格筛选标签 | `page.tsx` | 1h |
| 3 | 添加 Playbooks 深色推广卡片 | `page.tsx` | 1h |
| 4 | 改进 Section 标题栏（标题+数量+筛选） | `page.tsx` | 1h |
| 5 | ToolCardV2 增加 price/credit 标签 | `CatalogCards.tsx` | 1h |
| 6 | Game Center 添加积分规则说明 | `page.tsx` | 30min |
| 7 | 整体响应式适配检查 | 多个文件 | 1h |

### 预计总时间

**2~3 小时**（不含测试和部署）

---

## 执行顺序建议

```
Step 1: 修 v8.5 游戏积分（games.html）→ 本地验证 → push 到 ai-hues-v6
Step 2: 同步改进后的积分设计到 Next.js（Game Center 区域）
Step 3: 升级 Next.js 首页（价格筛选 → Playbooks 卡片 → Section 标题 → ToolCard）
Step 4: 导航栏加 Credit 显示
Step 5: 整体测试 → push 到 feature/design-refresh
Step 6: 找研发老师部署到测试环境
```

---

## 需要确认的问题

1. **价格筛选的数据来源** — 工具数据里目前有没有 `price` 字段？（v8.5 是硬编码的，Next.js 是从 API 读取的）
2. **Credit 积分的后端支持** — 目前积分存在 localStorage，导航栏显示读取 localStorage 即可，但多设备同步需要后端
3. **左侧分类边栏** — 这次迭代做不做？数据量较大，建议放到下一阶段
