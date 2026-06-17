# AIHues 工具站 PRD — design-refresh 版

**Version**: design-refresh · 基于 feature/design-refresh 分支  
**Date**: 2026-06-17  
**Status**: 设计刷新 + Humanize LLM 接入完成，待合并评估

---

## 1. 产品概述

AIHues 是一个面向创作者、开发者和出海增长团队的一站式 AI 工具站。当前分支已从早期静态 HTML 迁移到 **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4** 架构，保留 57 个工具 + 3 个小游戏，并持续优化设计质感与 AI 输出质量。

### 1.1 当前分支关键变化

- **架构**：静态 HTML → Next.js App Router（`feature/design-refresh`）
- **设计**：引入 spacing rhythm 4/8 规范、统一 hero 标题、全局间距对齐
- **Humanize**：从纯前端 buzzword 替换升级为真实 LLM API 调用
- **Prompt 工程**：20+ AI 写作工具集中管理在 `app/lib/ai-prompts.ts`

---

## 2. 已完成工作

### 2.1 设计刷新（Design Refresh）

- **全局 spacing rhythm**：将 `globals.css` 中约 60 处非 4/8 倍数的间距/尺寸对齐到设计 token
- **Hero 区统一**：所有页面 hero 标题使用 `.hero-title`（`font-size: 48px`、`line-height: 1.15`、`letter-spacing: -0.02em`）
- **首页细节**：category cards、quick tags、Dual Engine CTA、Wishlist CTA 的间距统一
- **HumanizeTool UI**：标题规范、loading spinner、空输入校验、空结果占位

### 2.2 Humanize 接入 LLM + Prompt 优化

Humanize 已接入 `/api/ai-generate`，通过千循代理调用 OpenAI 兼容 API。Prompt 从原来的简单"改写得更自然"升级为 5 条核心规则：

1. 保持原意和原语言，不添加解释
2. 替换 AI 套话（`leverage` / `robust` / `值得一提的是` / `综上所述` 等）
3. 减少 hedging（`generally speaking` / `often` / `一般来说` / `通常情况下` 等）
4. 增加人声：口语连接词、人称、反问、句子长短错落
5. 不要 bullet、编号、总结性结构

每个规则都配有中英 few-shot 示例，输出稳定性明显提升。

### 2.3 测试结果摘要

2026-06-17 使用 6 组测试数据验证：

- **中文 AI 套话**：`leveraging` / `robust` / `streamline` 等被自然替换
- **中文 hedging**："一般来说 / 通常情况下 / 可能会"被压缩为直接断言
- **中文 bullet 结构**："第一/第二/第三"和"综上所述"被改为连贯短句
- **英文 clichés**："fast-paced digital landscape / leverage robust / it is worth noting"全部去除
- **英文 hedging**：大量软化词被直接表达替代
- **英文 bullet**："First/Second/Third/In conclusion"结构被自然段落替代

> **遗留问题**：中文 bullet 那组仍保留"有三个明显的优点："这种半清单表达，可进一步微调。

---

## 3. 工具清单（当前分支）

- 开发工具 30 个
- 实用工具 8 个
- AI 写作工具 19 个
- 小游戏 3 个

**Humanize** 已从"15个AI词替换"升级为 LLM 驱动。

---

## 4. 技术架构

### 4.1 当前栈

- Next.js 16.1.1 + React 19 + TypeScript 5.8
- Tailwind CSS v4 + `@tailwindcss/postcss`
- moonrepo + pnpm workspace
- Vitest + Playwright

### 4.2 AI 生成链路

```
前端组件 → aiGenerate client → /api/ai-generate → buildPrompt → LLM API
```

- 支持多 provider：Kimi / DeepSeek / OpenAI（通过环境变量切换）
- 当前测试使用千循代理：`https://openai.app.msh.team/`

---

## 5. 后续规划

### 5.1 近期（design-refresh 完成前）

- 继续用 4/8 rhythm 优化剩余 56 个工具组件的间距
- 修复 `ai-prompts.ts` 中 `seo-title` 重复定义的 bug
- 为主要 AI 写作工具增加 few-shot 和输出格式约束
- 按工具覆盖 `temperature` / `max_tokens`

### 5.2 中期

- 将 `design-refresh` 分支与 `master` 对齐或决定合并策略
- 为所有 19 个 AI 写作工具接入 LLM API
- 实现真实 Credit 扣除逻辑

### 5.3 长期

- 开源项目评测 + 出海营销工具方向
- Agent Chat UI 重构
- 支付系统 / Pro 订阅

---

AIHues — Find your AI vibe.  
design-refresh · 2026-06-17
