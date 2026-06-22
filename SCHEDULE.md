# AIHues 一期上线排期确认

> 会议反馈整理 + 修改清单 + 工时评估
> 目标：下周推测试环境简单上线

---

## 一、反馈转任务清单

### 本期必做（下周上线）

| #   | 任务                   | 说明                                         | 工时 | 阻塞           |
| --- | ---------------------- | -------------------------------------------- | ---- | -------------- |
| 1   | **数据埋点**           | 工具点击率、页面停留时长、按钮点击、搜索词   | 4h   | 无             |
| 2   | **Wishlist 收集邮箱**  | 提交 idea 时增加 email 字段 + 校验           | 2h   | 无             |
| 3   | **PWA/书签标志**       | manifest.json + favicon + apple-touch-icon   | 2h   | 无             |
| 4   | **保留积分系统**       | 会议确认保留（不改）                         | 0h   | 无             |
| 5   | **保留中英文**         | 会议确认保留双语                             | 0h   | 无             |
| 6   | **页面颜色修改不保留** | 回滚之前的临时颜色调整                       | 1h   | 无             |
| 7   | **Hero 优化**          | 改得更诱人（等参考图）                       | 2-4h | **等 UI 参考** |
| 8   | **全局 UI 去 AI 味**   | 减少 generic AI aesthetics（等参考图）       | 4-8h | **等 UI 参考** |
| 9   | **部分工具接 API Key** | 确认哪些 AI 写作工具需要接 + 配置            | 2h   | **等 Key**     |

**本期合计：14~20h（约 2-3 个工作日）**

> 注：积分系统、中英文、登录页均保留（会议确认），颜色修改不保留。

### 本期不做（挪到二期）

| 功能          | 原因               |
| ------------- | ------------------ |
| 工作流平台    | 复杂度太高，非一期 |
| Chrome 扩展   | 非一期             |
| 工作流平台    | 复杂度太高，非一期 |
| Chrome 扩展   | 非一期             |
| 开源发布      | 非一期             |
| 社区评测 UGC  | 非一期             |
| 出海 SEO 优化 | 非一期             |

---

## 二、任务详细说明

### 1. 数据埋点（4h）

**埋点清单：**

```
【页面级】
- page_view: 每个页面进入时触发（已有）
- page_duration: 页面停留时长（离开页面时计算）

【工具级】
- tool_click: 点击工具卡片时触发（记录 tool_slug, category, position）
- tool_generate: AI 工具点击 Generate 时触发
- tool_copy: 点击 Copy 结果时触发

【搜索级】
- search: 搜索框提交时触发（记录关键词）
- search_suggestion_click: 点击快捷标签时触发

【交互级】
- category_switch: 切换分类标签时触发
- price_filter: 切换价格筛选时触发
- locale_switch: 切换语言时触发（已有）
- theme_switch: 切换深色模式时触发
- workflow_click: 点击工作流卡片时触发
- newsletter_submit: 提交订阅时触发
- wishlist_submit: 提交愿望单时触发
```

**实现方式：**

- 复用已有的 `gtag.ts` + `GoogleAnalytics.tsx`
- 在关键交互点调用 `event()`
- 页面停留时长用 `beforeunload` + `performance.now()` 计算

---

### 2. Wishlist 收集邮箱（2h）

**修改点：**

- `WishlistSubmitForm` 增加 email 输入框
- 前端校验 email 格式
- localStorage 存储时包含 email 字段
- 显示已提交的 wishlist 时展示 email（脱敏显示）

**数据结构变更：**

```ts
interface WishlistItem {
  id: string;
  title: string;
  description: string;
  email: string; // 新增
  votes: number;
  createdAt: string;
}
```

---

### 3. PWA / 浏览器书签标志（2h）

**交付物：**

- `public/manifest.json` — PWA 清单
- `public/favicon.ico` — 浏览器标签图标
- `public/apple-touch-icon.png` — iOS 书签图标
- `public/icon-192.png` / `icon-512.png` — PWA 图标
- `app/layout.tsx` 中添加 `<link rel="manifest">` 和 icon links

**manifest.json 内容：**

```json
{
  "name": "AIHues — AI Tool Discovery",
  "short_name": "AIHues",
  "description": "57 AI tools, deep reviews, and workflows",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf9f6",
  "theme_color": "#b45309",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" }
  ]
}
```

---

### 4. 保留积分系统（0h）

会议确认保留。无需修改。

---

### 5. 保留中英文（0h）

会议确认保留双语切换。无需修改。

---

### 6. 页面颜色修改不保留（1h）

回滚之前做的临时颜色调整（如 SiteChrome 深色模式 header 背景等）。
恢复为原始设计。

---

### 6. Hero 优化（2-4h，等参考）

**当前问题：** 用户反馈"不够诱人"
**待确认：** 等用户发参考页面后，确定优化方向
**可能方向：**

- 更大的视觉冲击力（动态背景 / 3D 元素）
- 更具体的价值主张（从"57 tools"改为具体场景）
- 社会证明（用户数量 / 评分 / 知名用户 logo）
- 视频/GIF 演示

---

### 7. 全局 UI 去 AI 味（4-8h，等参考）

**用户反馈：** "不要那么 AI 味"
**当前问题：**

- 紫色/蓝色渐变（AI 工具站常见）→ 我们用的是琥珀色，相对好
- 通用卡片布局 → 可能需要更有机/杂志感的设计
- 过于规整的网格 → 可能需要不对称/错落布局
- 默认字体 Inter → 可能需要更有特色的字体组合

**待确认：** 等用户发参考页面后，确定具体修改范围

---

### 8. 部分工具接 API Key（2h，等 Key）

**需要确认：**

- 哪些工具需要接？（19 个 AI 写作工具全部？还是部分？）
- 用哪家 API？（Kimi / DeepSeek / OpenAI？）
- 预算多少？（影响模型选择和用量限制）

**实现：**

- 已有 `/api/ai-generate` 代理，只需配置环境变量
- 如需限流/配额，需加简单中间件

---

## 三、排期建议（下周上线）

```
Day 1（周二）：做不需要参考图的任务
  - 上午：数据埋点（4h）
  - 下午：Wishlist 邮箱 + PWA 标志（4h）

Day 2（周三）：继续 + 等参考图
  - 上午：颜色修改回滚 + API Key 配置（3h）
  - 下午：等用户发 UI 参考图
  - 如收到参考图：开始 Hero 优化

Day 3（周四）：UI 优化
  - Hero 优化（等参考图确认后）
  - 全局 UI 去 AI 味（等参考图确认后）

Day 4（周五）：测试 + 部署
  - 全量测试
  - 推送到测试环境
  - 准备上线检查清单
```

---

## 四、需要用户确认的事项

| #   | 事项                  | 影响                                               |
| --- | --------------------- | -------------------------------------------------- |
| 1   | **发 UI 参考图**      | 决定 Hero + 全局 UI 的修改方向                     |
| 2   | **确认 API Key**      | 哪家？预算？哪些工具需要接？                       |
| 3   | **埋点需求确认**      | 上面列的埋点清单是否够用？是否需要更多？           |
| 4   | **Wishlist 邮箱存储** | 只存 localStorage 还是后端也存？                   |
| 5   | **PWA 图标设计**      | 是否需要设计一个品牌 logo？还是先用文字/简单图形？ |

---

## 五、上线检查清单（上线前必须过）

- [ ] 所有 57 个工具可正常访问
- [ ] 19 个 AI 工具 Generate 正常输出（API Key 配置后）
- [ ] 埋点数据正常上报（GA4 事件）
- [ ] Wishlist 提交包含邮箱字段
- [ ] 积分系统正常显示
- [ ] 中英文切换正常
- [ ] PWA manifest 正确配置
- [ ] 移动端响应式正常
- [ ] Lighthouse 性能评分 > 70
- [ ] 0 errors, 0 warnings
