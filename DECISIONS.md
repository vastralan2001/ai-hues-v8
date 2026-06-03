# AIHues 产品更新汇报 & 待决策事项

> **测试环境**：https://aihues-test.mse.msh.work
> **分支**：`feature/design-refresh` → GitLab MR #3
> **汇报时间**：2026-06-02

---

## 一、本次版本更新内容

### 1. 文章系统（86 篇博客）

- 删除 68 篇博客中重复的 "Related AIHues Tools" 旧区块
- 博客 Tag→工具映射覆盖全部 11 个标签
- 文章底部自动推荐相关工具卡片（基于 tag 匹配，支持中英双语）
- 86 篇文章全部可用，含目录导航、JSON-LD Schema、RSS

### 2. 评测系统（15 条评测数据）

- 评测数据从 7 条扩展到 **15 条**
- 6 维度雷达图：输出质量 30% / 易用性 20% / 性价比 20% / 生态 15% / 迭代 10% / 社区 5%
- 评测系统完全双语化（维度标签、Pros/Cons、使用建议、替代方案）
- 工具详情页 Tab 切换：Tool / Review / Comments

### 3. 首页设计 & 配色

- 统一温暖大地色系（主色 `#b45309` 琥珀橙 + `#1c1917` 深色文字）
- 实时统计栏：57 AI Tools / 30 Dev Tools / 3 Games / 100 Free Credits / 0 Day Streak
- 分类浏览卡片：Utility / Developer / AI Writing / Games
- 6 个热词快捷入口（JWT / JSON / Regex / QR Code / Fortune / Hoops）
- Partner 推广位改为 "Coming soon" 半透明占位卡片（Phase 2 预留）
- Game Center 展示 3 个游戏 + 积分余额
- Popular Tools 推荐位 + CTA 区块

### 4. 交互系统

- **评论系统**：localStorage 持久化、点赞、回复、最热/最新排序、双语占位评论
- **愿望单**：纯 localStorage 持久化、10 条种子数据、投票排行榜、提交表单
- **动态排名**：基于真实使用行为的排行榜（替代硬编码数据）
- **积分系统**：新用户默认 100 credits、游戏签到赢积分、工具消耗积分

### 5. 技术底座

- 57 个工具全部 React 组件化（删除遗留 HTML）
- 中英文切换（刷新页面生效）
- 深色模式适配（header / 卡片 / 背景自动切换）
- Google Analytics 4 埋点（8 个事件追踪，待启用）

---

## 二、⚠️ 阻塞性问题：LLM API Key

### 现状

19 个 AI 写作工具（Humanize、Ad Copy、Blog Outline、X Post、LinkedIn、SEO Title、Meta、TL;DR、PR Desc、YT Script、Video Title、Tagline、LP Hero、Newsletter、Docs、FAQ、Push、Changelog、Code Explain）**代码已全部接入真实 LLM**。

但**测试/生产环境没有配置 API Key**，用户点击 **Generate** 按钮后返回：

```
LLM API key not configured. Set KIMI_API_KEY, DEEPSEEK_API_KEY or OPENAI_API_KEY environment variable.
```

### 影响范围

- 19 个 AI 写作工具全部不可用（页面能打开，但生成失败）
- 这是产品核心功能，直接影响用户体验

### 需要老板决策

| 选项 | 成本 | 中文质量 | 国内访问 | 配置项 |
|------|------|---------|---------|--------|
| **Kimi**（最推荐） | ¥0.012/千 tokens | ⭐⭐⭐ 极好 | ✅ 直接访问 | `KIMI_API_KEY` |
| **DeepSeek** | ¥0.002~0.008/次 | ⭐⭐⭐ 极好 | ✅ 直接访问 | `DEEPSEEK_API_KEY` |
| **OpenAI** | $0.0015~0.002/次 | ⭐⭐ 一般 | ❌ 需中转 | `OPENAI_API_KEY` |

**建议**：**Kimi**（自家 API，中文长文本最强，接口完全兼容 OpenAI 格式，代码已支持）。DeepSeek 备选。

**拿到 Key 后我 5 分钟配好部署。**

---

## 三、其他待决策事项（非阻塞）

### 1. Google Analytics（可选）

- 埋点代码已写好（页面浏览、工具使用、搜索、语言切换等 8 个事件）
- 当前未启用（`NEXT_PUBLIC_GA_ID` 为空）
- **建议**：上线后再配，不阻塞发版

### 2. Newsletter 邮件订阅（当前是假功能）

- 页面有订阅框，点击后显示成功动画
- **实际上邮箱没存任何地方**
- **建议**：Phase 2 接入邮件服务（SendGrid / Resend）

---

## 四、一句话总结

> **所有前端开发已完成，页面设计、文章、评测、交互全部可用。唯一阻塞发版的是 LLM API Key。**
>
> 请老板决定用 Kimi / DeepSeek / OpenAI，提供 API Key，我立即配置部署。
