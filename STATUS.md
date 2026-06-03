# AIHues 现状速览

> 测试环境：https://aihues-test.mse.msh.work
> 分支：`feature/design-refresh` → GitLab MR #3

---

## ✅ 已完成

| 模块 | 状态 |
|------|------|
| **57 个工具** | 全部 React 组件化，含 32 个纯前端计算工具 + 19 个 AI 写作工具 + 3 个游戏 |
| **评测系统** | 57 个工具全部有 6 维度评分 + 雷达图 + 英文翻译 |
| **86 篇博客** | 含目录、JSON-LD Schema、RSS、底部相关工具推荐 |
| **评论系统** | localStorage 持久化，点赞/回复/排序，双语占位评论 |
| **愿望单** | 纯 localStorage，10 条种子数据，投票排行榜 |
| **动态排名** | 基于真实 tool 使用行为（localStorage 统计）|
| **积分系统** | 新用户自动 100 credits，游戏赢积分 / 工具消耗积分 |
| **LLM 接入** | 19 个 AI 写作工具代码已接入 `/api/ai-generate`，支持 Kimi/DeepSeek/OpenAI |
| **GA4 埋点** | 代码已写好（8 个事件），待启用 |
| **中英文切换** | 刷新页面生效 |
| **深色模式** | 全站适配 |

---

## ⏳ 下一步要做

| 优先级 | 事项 | 说明 |
|--------|------|------|
| **P0 — 阻塞发版** | **配置 LLM API Key** | 19 个 AI 写作工具点击 Generate 返回 503。建议配 `KIMI_API_KEY`（中文最好，自家 API），5 分钟搞定 |
| P2 | 启用 GA4 | 配 `NEXT_PUBLIC_GA_ID` 环境变量即可 |
| P2 | Newsletter 接邮件服务 | 前端已持久化到 localStorage，Phase 2 接 SendGrid/Resend |
| P3 | 游戏积分布局优化 | 游戏页顶部加积分余额栏 + 统一收益标注 |

---

## 一句话

> **所有前端开发已完成，页面/文章/评测/交互全部可用。唯一需要你做的是给 Kimi API Key，我来 5 分钟配好部署。**
