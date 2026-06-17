# AIHues 上线前准备度报告 — 2026-06-17

> 评估分支：`feature/design-refresh`
> 最后验证：`pnpm check` 全绿，`pnpm moon run aihues-web:build` 通过（180 页静态生成）
> 评估视角：邮箱/订阅、数据埋点、UI/UX、用户反馈、法律合规

---

## 一、今晚已完成的修复

### 1. AI 写作工具 prompt 迭代

基于 `docs/ai-writing-evaluation-2026-06-17.md` 的初版输出，对 8 个工具的 prompt 做了针对性修复：

| 工具 | 修复前问题 | 修复后效果 |
|------|-----------|-----------|
| `pr-desc` | 编造未提供的“测试方式” | 未提供时只写“测试方式：未在改动内容中说明” |
| `pseudo` | 输出带“伪代码如下：”引言 | 直接返回伪代码本体 |
| `faq` | 会额外编造 3 个新问题 | 只回答用户列出的问题 |
| `yt-script` | “5 个技巧”只讲了 3 段 | 明确按主题数量生成对应主体段落 |
| `push` | 过度营销、假紧迫感 | 更自然、场景感更强 |
| `docs` | 编造未提供的参数和示例 | 示例更简单，未提及字段不写 |
| `cold-email` | 出现 `[博主名字]` 占位符 | 用自然通用称呼，无方括号占位符 |
| `ad-copy` | 格式不统一、套话多 | 严格示例格式，减少空泛 CTA |

已重新跑评估生成对比报告：
- `docs/ai-writing-evaluation-2026-06-17-v2.md`
- `docs/ai-writing-evaluation-2026-06-17-v2.json`

### 2. 法律合规（P0 阻断项）

- [x] 新增 `/privacy` 页面（`app/privacy/page.tsx`），说明数据收集、Cookies/Analytics、本地存储、第三方服务。
- [x] 页脚和 sitemap 增加 Privacy 链接。
- [x] 新增 Cookie Consent Banner（`app/components/CookieConsent.tsx`）。
- [x] `GoogleAnalytics` 改为仅在用户同意后才加载 gtag 脚本，默认不加载。

### 3. UI/UX 快速修复

- [x] 工具详情页头部增加工具名称和描述（`ToolDetailTabs.tsx`），之前只显示分类/价格 badge。
- [x] Newsletter 订阅成功文案改成“Newsletter emails aren't live yet”，避免虚假承诺。
- [x] Pricing 页面去掉重复的 "Pricing" kicker，替换掉遗留的 migration FAQ。
- [x] 页脚增加 `mailto:hello@aihues.com` 联系入口。

### 4. 国际化文案

- [x] `dict.ts` 增加 `footer.privacy` 和 `footer.contact` 中英键。

---

## 二、当前上线准备度评分

| 模块 | 状态 | 说明 |
|------|------|------|
| 核心工具目录 | ✅ 就绪 | 58 个工具页面已生成，搜索、分类、工具页正常 |
| AI 写作工具 | ✅ 基本就绪 | Prompt 已迭代两轮，输出质量显著提升 |
| 博客 | ✅ 就绪 | 99 篇文章 SSG，RSS、相关文章正常 |
| 小游戏 | ✅ 就绪 | 3 个 legacy HTML 游戏可用 |
| Wishlist | ✅ 就绪 | 用户可提交想法、投票 |
| 法律合规 | ⚠️ 部分就绪 | Privacy + Cookie Consent 已加；Terms 已存在；仍缺更完整的 Privacy 法务审查 |
| 邮箱/Newsletter | ⚠️ 部分就绪 | 表单存在但无后端；已改文案避免误导 |
| 数据埋点 | ⚠️ 部分就绪 | GA 基础事件已有；缺少分享、收藏、错误、外部链接等事件 |
| UI 细节 | ⚠️ 部分就绪 | 工具标题已补；pricing 仍为静态展示；Hero "Ask AI" 未真正调用 AI |
| 用户反馈 | ⚠️ 部分就绪 | Wishlist 可用；评论/评测已隐藏；缺少直接联系/报错渠道 |

---

## 三、从用户视角看还有哪些摩擦

### 1. 邮箱 / 订阅

- **现状**：Newsletter 只写入 localStorage，没有邮件服务。
- **用户可能遇到的问题**：填了邮箱但永远收不到邮件，会感觉被欺骗。
- **建议**：上线前要么接入 Resend/Mailchimp/Brevo，要么先隐藏订阅表单。

### 2. 数据埋点 / 隐私

- **现状**：已加 Cookie Banner 和 Privacy 页面，GA 默认不加载。
- **用户可能遇到的问题**：如果用户 Decline，后续行为完全无数据，无法做产品决策。
- **建议**：这是合规的正确做法；上线后观察同意率，再决定是否需要更柔和的文案。

### 3. UI / 反馈

- **现状**：
  - 工具详情页现在能看到工具名了 ✅
  - 评论/评测标签被隐藏，用户无法给工具打分或留言
  - 没有专门的 Contact 页面，只有页脚 mailto
  - Pricing 页面 CTAs 都跳到 `/tools`，没有支付流程
- **用户可能遇到的问题**：
  - 想反馈 bug 只能去 Wishlist，路径不对
  - 看到 Pricing 的 “Upgrade to Pro” 按钮点进去却是工具列表，会有被耍的感觉
- **建议**：
  - 上线前把 Pricing CTAs 改成 "Coming soon" 或先隐藏 Pricing
  - 加一个 `/contact` 或 `/feedback` 页面，或者直接保留 mailto
  - 决定是否开放评论/评测；如果不开放，建议从代码里彻底移除相关 tab 死代码

### 4. AI 写作工具效果

- **现状**：prompt 已优化，但仍有部分工具偏 AI 味或格式不够稳。
- **建议**：明天你验收时重点看 `docs/ai-writing-evaluation-2026-06-17-v2.md`，挑 2-3 个最不满意的工具继续改。

---

## 四、剩余推荐清单（按优先级）

| 优先级 | 事项 | 影响 | 建议处理时间 |
|--------|------|------|--------------|
| 🔴 P0 | 接入真实 Newsletter 后端或隐藏订阅表单 | 避免用户信任崩塌 | 2-4h |
| 🔴 P0 | 配置生产环境 `NEXT_PUBLIC_GA_ID` | 否则上线后无数据 | 5min |
| 🟠 P1 | 增加 `/contact` 或反馈表单 | 用户报 bug/提需求有入口 | 2-3h |
| 🟠 P1 | 处理 Pricing 页面：隐藏或加 "Coming soon" | 避免 CTA 误导 | 30min |
| 🟠 P1 | 补全 GA 事件：share、bookmark、tool_error、external_link_click | 埋点覆盖更完整 | 2-3h |
| 🟡 P2 | 移除评论/评测死代码或决定开放 | 减少技术债 | 1-2h |
| 🟡 P2 | 给 Copy 按钮统一加成功反馈 | 提升工具使用爽感 | 1-2h |
| 🟡 P2 | 优化 HeroSearch "Ask AI" 文案或接入 Agent | 避免名不副实 | 2-4h |
| 🟢 P3 | 404 / error 页面增加返回首页入口 | 容错体验 | 30min |
| 🟢 P3 | 图片/字体性能优化（font-display、图片压缩） | 首屏速度 | 2-3h |

---

## 五、明天验收建议

1. 打开 `docs/ai-writing-evaluation-2026-06-17-v2.md`，在每工具下方的“人工评估”栏填上你的判断。
2. 访问 `/privacy` 和任意工具详情页，确认页脚、Cookie Banner、工具标题都正常。
3. 决定是否保留 Pricing 页面和 Newsletter 表单。
4. 从剩余推荐清单里挑 2-3 项作为下一轮任务。

---

## 六、关键文件变更

- `apps/aihues-web/app/lib/ai-prompts.ts` — prompt 迭代
- `apps/aihues-web/app/privacy/page.tsx` — 新增隐私政策页
- `apps/aihues-web/app/components/CookieConsent.tsx` — 新增 Cookie 同意横幅
- `apps/aihues-web/app/components/GoogleAnalytics.tsx` — 按同意加载
- `apps/aihues-web/app/components/reviews/ToolDetailTabs.tsx` — 工具详情显示名称/描述
- `apps/aihues-web/app/components/NewsletterSubscribe.tsx` — 修正成功文案
- `apps/aihues-web/app/pricing/page.tsx` — 清理 FAQ 和标题
- `apps/aihues-web/app/components/SiteChrome.tsx` — 页脚增加 Privacy / Contact
- `apps/aihues-web/app/lib/dict.ts` — 新增 footer.privacy / footer.contact
- `apps/aihues-web/app/sitemap.ts` — 加入 /privacy
- `scripts/evaluate-ai-writing.cjs` — 支持 AIHUES_EVAL_SUFFIX 多版本报告
- `docs/ai-writing-evaluation-2026-06-17.md` — 初版评估报告
- `docs/ai-writing-evaluation-2026-06-17-v2.md` — 迭代后评估报告
- `docs/pre-launch-readiness-2026-06-17.md` — 本报告
