# AIHues 待决策事项

> 测试环境：https://aihues-test.mse.msh.work
> 分支：`feature/design-refresh` → MR #3
> 更新时间：2026-06-02

---

## 当前状态（已完成 15 项）

- ✅ 57 个工具页面全部 React 化，统一导航和布局
- ✅ 19 个 AI 写作工具接入真实 LLM（OpenRouter → DeepSeek/OpenAI）
- ✅ 评论系统、愿望单、排名、积分系统全部可用
- ✅ 中英文切换、深色模式已修复
- ✅ Google Analytics 4 埋点代码已集成

---

## 需要老板判断的 3 件事

### 1. LLM API Key（影响 19 个 AI 工具的核心功能）

**现状**：
- 代码已完成，本地开发环境可用
- **测试环境点击 Generate 报 503**：`LLM API key not configured`

**需要**：
- 选一个 LLM 提供商
- 提供 API Key，我 5 分钟配好部署

| 选项 | 成本 | 中文质量 | 速度 | 需要配置 |
|------|------|---------|------|---------|
| **DeepSeek** | ¥0.002~0.008/次 | ⭐⭐⭐ 极好 | 快 | `DEEPSEEK_API_KEY` |
| **OpenAI** | $0.0015~0.002/次 | ⭐⭐ 一般 | 快 | `OPENAI_API_KEY` |

**建议**：DeepSeek，中文好、便宜、国内可用。

---

### 2. Google Analytics（可选，不影响功能）

**现状**：
- 埋点代码已写好（页面浏览、工具使用、搜索、语言切换等 8 个事件）
- 当前 `NEXT_PUBLIC_GA_ID` 为空，**不收集任何数据**

**需要**：
- 决定是否要数据追踪
- 如果要，去 GA 后台创建数据流，拿 `G-XXXXXXXXXX` 给我

**建议**：先不配，等产品上线后再加也不迟。

---

### 3. Newsletter 邮件订阅（当前是假功能）

**现状**：
- 页面有订阅框，点击后显示"Thanks for subscribing"
- **实际上邮箱没存任何地方**，只是前端动画

**需要**：
- 决定是否要做真实邮件订阅
- 如果要，需要邮件服务（SendGrid / Mailchimp / Resend）

**建议**：Phase 2 再做，当前优先级低。

---

## 一句话总结

> **只有第 1 项（LLM API Key）是阻塞性需求**，否则 19 个 AI 工具点 Generate 会报错。其他两项都是锦上添花，可以后面再说。
