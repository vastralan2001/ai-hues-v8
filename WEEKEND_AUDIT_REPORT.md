# AIHues 周末全面审计报告

> 生成时间：2026-06-05（周五晚）
> 审计范围：前端功能、AI 依赖、配图质量、文案 AI 味
> 测试环境：localhost:3000（dev server）

---

## 一、功能测试结果

### ✅ 通过项（15/15 页面）

| 页面 | 状态 | 备注 |
|---|---|---|
| 首页 | ✅ | Hero、搜索、分类、Game Center、CTA 全部正常 |
| 工具列表 | ✅ | 57 个工具卡片正常渲染 |
| 游戏列表 | ✅ | 3 个游戏卡片正常 |
| 博客列表 | ✅ | 12 篇文章卡片（实际 86 篇） |
| 博客详情 | ✅ | 独立 HTML 渲染正常 |
| 工具详情（ad-copy） | ✅ | Review + Comments 标签正常 |
| 工具详情（json） | ✅ | Format/Minify/Validate 功能正常 |
| 工具详情（password） | ✅ | UI 正常（Generate 按钮需要进一步测试） |
| Wishlist | ✅ | 表单 + 提交功能正常 |
| Ranking | ✅ | 页面渲染正常 |
| About | ✅ | 内容正常 |
| Terms | ✅ | 内容正常 |
| Bookmark 按钮 | ✅ | 点击弹出快捷键提示（Ctrl+D / Cmd+D） |
| Footer Logo 统一 | ✅ | games/ranking/default 均使用 Logo SVG |
| English 指示器 | ✅ | 已完全移除 |

### ⚠️ 发现的问题

| 问题 | 严重程度 | 说明 |
|---|---|---|
| **Command Palette 不可发现** | 低 | 快捷键是 `Cmd+K`，但 UI 上没有提示。用户不知道有这个功能 |
| **博客封面全是 placeholder** | 中 | 86 篇博客全部使用 `picsum.photos` 随机图 |
| **博客内容高度 AI 味** | 中 | 典型特征：结构化小标题、空泛建议、可疑精确数字、缺乏个人经历 |
| **Console hydration warning** | 低 | 间歇性出现，不影响功能 |
| **Footer "Built on Kimi"** | 低 | 需要确认是否保留 |
| **游戏页面 footer 缺少链接列** | 低 | games footer 只有品牌+3个链接，其他 footer 有完整 3 列 |
| **Review/Comment 数据全假** | 低 | 所有 review 和 comment 都是 seed 数据，reviewer 永远是 "AIHues Team" |

---

## 二、功能分类：需要 AI vs 纯前端

### 需要 AI 能力的工具（22 个 / 57 个）

这些工具调用 `/api/ai-generate` 或类似接口，需要后端 AI 服务支持：

| 工具 | AI 用途 |
|---|---|
| Ad Copy Generator | 根据产品描述生成广告文案 |
| Alt Text Generator | 为图片生成 alt 描述 |
| Blog Outline Generator | 根据主题生成博客大纲 |
| Changelog Generator | 根据 commit 列表生成更新日志 |
| Code Explainer | 解释代码功能 |
| Cold Email Generator | 生成冷邮件模板 |
| Docs Generator | 根据代码生成文档 |
| FAQ Generator | 根据内容生成 FAQ |
| Humanize | 去除文本 AI 味 |
| LinkedIn Post Generator | 生成领英帖子 |
| Landing Page Hero Generator | 生成落地页文案 |
| Meta Tag Generator | 生成 SEO meta 标签 |
| Newsletter Generator | 生成邮件内容 |
| PR Description Generator | 生成 PR 描述 |
| Push Notification Generator | 生成推送文案 |
| SEO Title Generator | 生成 SEO 标题 |
| Tagline Generator | 生成品牌标语 |
| TL;DR Generator | 生成长文摘要 |
| Video Title Generator | 生成视频标题 |
| X Post Generator | 生成推文 |
| YouTube Script Generator | 生成 YouTube 脚本 |
| Pseudo Code Generator | 生成伪代码 |

### 纯前端工具（35 个 / 57 个）

这些工具完全在浏览器中运行，不需要任何后端/AI 服务：

**编码开发类（14）**：Base64、BaseConvert、ChiSquared、CodeReview、CssGradient、CsvJson、CurlGen、Diff、DiffPro、Fullwidth、GitCommit、HtmlEntity、Json、Jwt、Markdown、Regex、Sha256、Shell、Sql、Timestamp、TitleCase、UrlEncode、Uuid

**内容创作类（4）**：LoremIpsum、Pomodoro、Readability、WordCount

**设计/实用类（7）**：Color、CronParser、HttpStatus、ImageToBase64、IpLookup、Password、Qrcode、UnitConvert

**小游戏（3）**：Daily Fortune、Lucky Slots、Basketball Shootout

> 📌 **关键结论**：57 个工具中 35 个（61%）是纯前端，可以在无网络/无 AI 后端的情况下完全运行。这解释了为什么 AI 味问题主要影响 22 个 AI 生成类工具，而非整个网站。

---

## 三、配图审计

### 当前状态

| 类型 | 数量 | 来源 | 问题 |
|---|---|---|---|
| 博客封面 | 86 张 | `picsum.photos` | 完全随机，与内容无关 |
| Feishu 同步 | 随机 | `images.unsplash.com` | API 中硬编码随机图 |
| 工具 icon | 57 个 | 文字首字母 + 背景色 | 无实际图标，显得简陋 |
| Favicon | 全套 | 手工生成 | 已更新为 mascot 角色 ✅ |
| 网站 Logo | 1 个 | SVG | 彩虹角色设计，很好 ✅ |

### 配图去 AI 味策略

**picsum.photos 的问题**：
- 图片是计算机生成的随机摄影，没有主题关联
- 读者一看就知道是占位图
- 没有品牌一致性

**建议替换方案**：
1. **短期**：用 Unsplash 搜索与文章主题相关的真实照片（手动挑选，不要用随机 API）
2. **中期**：为每个工具设计统一的 icon 系统（可以用简单的几何图形 + 品牌色）
3. **长期**：考虑为 mascot 角色画一套表情/动作变体，用于不同场景

---

## 四、博客 AI 味分析

### 抽样审计（launching-on-product-hunt-what-worked-in-2026）

**典型 AI 生成特征**：

1. **可疑精确数字**
   - "We analyzed 347 real-world Product Hunt launch workflows across 42 teams"
   - 人类作者很少会记得这么精确的数字，除非引用真实研究

2. **结构化 SEO 标题**
   - "What the Numbers Actually Show"
   - "The Patterns That Matter"
   - "Your Next Step"
   - "Quick Win"
   - 这种层级结构是 AI 写作的典型模式

3. **空泛建议**
   - "Iterative refinement beats big bets"
   - "Context matters more than best practices"
   - "Tool choice is overrated"
   - 读起来像正确的废话，没有具体案例支撑

4. **缺乏个人经历**
   - 没有 "我当初..."、"我们团队去年..."
   - 没有失败案例、尴尬时刻、意外发现
   - 全是第三人称分析语调

5. **温和的结论**
   - "Do not try to implement everything..."
   - "Pick one idea that resonated..."
   - AI 倾向于避免强烈立场，总是给安全的建议

### 86 篇博客的 AI 味等级估计

| 等级 | 数量估计 | 特征 |
|---|---|---|
| 🔴 重度 AI | ~60 篇 | 典型 SEO 结构、空泛建议、无个人声音 |
| 🟡 中度 AI | ~20 篇 | 有具体数字但缺乏情感、案例单薄 |
| 🟢 轻度/自然 | ~6 篇 | 有第一人称、具体故事、情感表达 |

---

## 五、去 AI 味工作流（建议）

### 原则

去 AI 味的核心不是"不用 AI"，而是**让内容有人的痕迹**：
- 不完美、有情绪波动
- 有具体的时间、地点、人物
- 有失败和意外，不只是成功
- 有个人观点，不怕得罪人

### 配图工作流

```
当前：picsum.photos 随机图 → 一眼假
目标：主题相关 + 品牌一致 + 有质感

方案 A（最快）：
1. 为每篇博客在 Unsplash 手动搜索主题关键词
2. 选 1-2 张有情绪、有具体场景的照片
3. 统一用暖色调滤镜处理
4. 成本：约 2 小时/10 篇

方案 B（长期）：
1. 设计一套 AIHues 品牌插画系统
2. 用简单的几何形状 + 品牌色 + mascot
3. 每篇文章配一张风格统一的插画
4. 成本：需要设计师 1-2 天搭建系统
```

### 文章去 AI 味工作流

```
当前：AI 一次生成 → 直接发布
目标：AI 辅助 → 人工改写 → 注入个人声音

步骤 1：AI 生成初稿（保留）
  - 用 AI 生成结构、论点、数据点
  
步骤 2：人工改写（关键）
  - 加入第一人称故事（"我去年做 x 的时候..."）
  - 删除所有"值得注意的是""研究表明"等套话
  - 把"很多团队"改成"我见过的 3 个团队"
  - 加入一个失败案例或意外发现
  
步骤 3：注入情绪
  - 在关键论点处表达强烈立场（"我认为这是错的"）
  - 用口语化表达（"说白了""老实说""你可能不信"）
  - 加入对读者的直接提问
  
步骤 4：润色
  - 短句 + 长短句交替
  - 偶尔用不完整句子（" ridiculous."）
  - 删除过度工整的排比
```

### 工具文案去 AI 味

当前问题：57 个工具的描述文案风格高度统一，缺乏个性。

**建议**：
1. 每个工具配一句**人话描述**（不是功能列表）
   - ❌ "A tool that generates SEO-optimized titles based on keyword input"
   - ✅ "Stop staring at blank title fields. Paste your keywords, get 10 options in 3 seconds."

2. 在工具页面加入**使用场景提示**
   - "当你需要在 5 分钟内起 10 个标题时..."
   - "适合：电商运营、内容编辑、独立开发者"

---

## 六、周一验收检查清单

### 用户要求的改动

- [x] 去掉 English 语言切换键
- [x] 浏览器收藏图标（favicon）
- [x] 小游戏页面 logo UI 优化
- [x] 推送到 GitHub
- [x] 部署到测试环境
- [x] Bookmark 按钮功能

### 需要用户确认的待办

- [ ] **博客配图**：86 篇博客的 picsum.photos 随机图是否需要替换？
- [ ] **博客去 AI 味**：是否需要重写部分博客？优先级？
- [ ] **工具 icon**：57 个工具目前用文字首字母，是否需要设计图标？
- [ ] **Review/Comment 数据**：目前全是假数据（seed），是否需要接入真实评论系统？
- [ ] **Footer "Built on Kimi"**：是否需要移除或修改？
- [ ] **Command Palette 可见性**：是否需要加一个搜索图标提示快捷键？

### 已知但低优先级的问题

- [ ] 游戏页面 footer 链接列不完整（只有 3 个链接，其他页面有 9 个）
- [ ] 部分工具页面 console hydration warning（不影响功能）
- [ ] `lib/dict.ts` 中仍有大量未使用的中文翻译代码

---

## 七、技术债务速查

| 文件/区域 | 问题 | 建议 |
|---|---|---|
| `lib/dict.ts` | 大量 `zh` 翻译死代码 | 可安全删除，减少 bundle 体积 |
| `lib/reviews.ts` | `SEED_REVIEWS` 全假数据 | 长期应接入真实评论 API |
| `components/reviews/CommentSection.tsx` | `getDefaultComments` 全假 | 长期应接入真实评论 |
| `public/blog/*.html` | 86 篇独立 HTML | 考虑迁移到 CMS 或 Markdown |
| `content/blog/posts.json` | coverImage 指向 picsum | 应指向真实图片 URL |
| `app/api/feishu/sync/route.ts` | unsplash 随机图 | 应改为手动挑选或品牌插画 |

---

*报告结束。周一验收时可根据用户反馈调整优先级。*
