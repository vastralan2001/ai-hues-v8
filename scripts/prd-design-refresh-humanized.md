# AIHues 工具站 PRD（design-refresh 版）

版本：design-refresh · 基于 feature/design-refresh 分支  
日期：2026-06-17  
状态：设计更新和 Humanize LLM 已接入，等着评估后合并

## 这个产品要做什么

AIHues 是专为创作者、开发者和出海团队做的 AI 工具集合。现在已经从最开始的静态 HTML 升级成 Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 这套新架构，原来的 57 个工具和 3 个小游戏都还在，设计和 AI 输出也一直在打磨，体验会越来越顺手。

### 当前分支改了啥

- 架构：原来用静态 HTML，现在切到 Next.js App Router（在 feature/design-refresh 分支上折腾的）。
- 设计：加了 spacing rhythm 4/8 这套规范，把 hero 标题也统一了，整个页面的间距也顺顺齐齐。
- Humanize：以前只是前端喊口号，现在真的接入了 LLM API，能做点实事。
- Prompt 工程：20 多个 AI 写作工具都集中放在 `app/lib/ai-prompts.ts` 里，好找也好改。

## 已经做完的事

### 设计刷新

- 全局 spacing rhythm：把 `globals.css` 里那些不是 4 或 8 倍数的间距和尺寸，大概有 60 个地方，都按设计 token 调整了一遍。
- Hero 区统一：所有页面的 hero 标题现在都用 `.hero-title`，字体大小 48px，行高 1.15，字间距 -0.02em，统一起来了。
- 首页细节：category cards、quick tags、Dual Engine CTA、Wishlist CTA 这些组件的间距对齐，整个首页看起来更顺了。
- HumanizeTool UI：标题风格统一，loading 状态加了 spinner，输入为空会提示，结果为空也有占位显示。

### Humanize 终于接上了 LLM

Humanize 现在已经接入 `/api/ai-generate`，用千循代理去调用 OpenAI 兼容的 API。Prompt 也从原来那种“改写得更自然”升级成五条核心规则：

第一，原意和用词都得保留，不许乱加解释。第二，像 `leverage`、`robust`、`值得一提的是` 这些一看就很 AI 的词统统要换掉。第三，少用那种“通常情况下”、“一般来说”这种模棱两可的表达。第四，人味要有！多用点口语化的连接词，第一人称、第二人称也可以来点，句子别老是一个调，长短交错才像人写的。第五，别弄什么条目、编号，也别来最后总结一句。每条规则都有中英文的例子，输出质量确实比以前稳多了。

### 测试结果怎么样

2026-06-17 用了 6 组测试数据来检验：

中文里的那些“leveraging”、“robust”、“streamline”全都顺手换成了更自然的说法。像“一般来说”、“通常情况下”、“可能会”这些模棱两可的词也直接砍掉了，直接说事。中文的“第一、第二、第三”这种分点方式，不再单列出来，而是用连贯的句子串起来。

英文部分也是一样，什么“fast-paced digital landscape”、“leverage robust”、“it is worth noting”都消失了。软化词全都换成了直接表达，没有绕圈子。英文里的分点结构也都拉成自然段落。

有个小遗留，中文那组还偶尔会冒出“有三个明显的优点”这种半清单的表达，之后可以再琢磨怎么让它更顺嘴。

## 现在有哪些工具

开发工具有 30 个，实用工具 8 个，AI 写作工具 19 个，还有 3 个小游戏。

**Humanize** 以前只是“15 个 AI 词替换”，现在已经升级成 LLM 驱动了。

## 用了什么技术

### 当前技术栈

Next.js 16.1.1 配上 React 19 和 TypeScript 5.8  
Tailwind CSS v4，顺带用了 `@tailwindcss/postcss`  
项目用的是 moonrepo，包管理靠 pnpm workspace  
测试这块，Vitest 和 Playwright 一起上

### AI 是怎么生成内容的

前端组件走 `aiGenerate` client，这里请求 `/api/ai-generate`，`buildPrompt` 之后才丢给 LLM API。

provider 可以选 Kimi、DeepSeek 或 OpenAI，环境变量改一下就行。现在测试用的是千循的代理，地址是：https://openai.app.msh.team/

## 接下来打算干什么

### 近期（design-refresh 合并前）

- 剩下那 56 个工具组件的间距还得用 4/8 rhythm 调一调  
- `ai-prompts.ts` 里 `seo-title` 重复定义的问题修一下  
- 主要的 AI 写作工具得加上 few-shot 和输出格式的约束  
- 每个工具的 `temperature` 和 `max_tokens` 也都设一遍

### 中期

把 `design-refresh` 分支和 `master` 统一一下，或者定个合并方案。  
19 个 AI 写作工具都要接好 LLM API。  
Credit 扣除得做成真的，别只是假装扣了。

### 长期

持续关注开源项目评测和出海营销工具这块。  
Agent Chat 的界面得重新做一遍。  
支付和 Pro 订阅那边也别落下。

---

AIHues — Find your AI vibe.  
design-refresh · 2026-06-17
