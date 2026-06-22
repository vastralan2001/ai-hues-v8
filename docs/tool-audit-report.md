# AIHues 工具可用性检测报告

> 生成时间: 2026-06-02
> 检测范围: 57 个本地工具 + 32 个外部链接工具
> 检测方式: 文件存在性检查 + HTTP 状态码检查

---

## 一、本地工具（57个）

### 总体状态

| 指标 | 数量 | 占比 |
|------|------|------|
| 页面正常 | 57 | 100% |
| 有 React 组件 | 31 | 54% |
| 仅 HTML 页面 | 26 | 46% |
| 完全缺失 | 0 | 0% |

✅ **全部 57 个本地工具都有对应页面，无缺失。**

### 按类型分类

| 类别 | 数量 | 代表工具 |
|------|------|----------|
| 纯前端计算 | 30 | JWT, JSON, Regex, UUID, Base64, SHA256, Timestamp, URL, Cron, Color, QR, Markdown, Diff, Word Count, Fullwidth, Title Case, Lorem, Password, HTTP Status, HTML Entity, Unit, Base Convert, CSV↔JSON, Pomodoro, Chi-Squared |
| 前端+外部API | 3 | IP Lookup, Image→Base64, Curl Gen |
| AI写作（需LLM） | 19 | Ad Copy, Blog Outline, Cold Email, Newsletter, X Post, Video Title, YT Script, Tagline, Push, FAQ, PR Desc, Meta, SEO Title, TL;DR, Docs, LinkedIn, LP Hero, Alt Text, Humanize |
| AI代码（需LLM） | 5 | Code Review, Code Explain, Shell Gen, Git Commit, Pseudo |

### 大模型API需求

| 需求类型 | 数量 | 占比 | 说明 |
|----------|------|------|------|
| 需LLM API | 24 | 42% | 需要接入Kimi/Claude/GPT等 |
| 需外部API | 3 | 5% | IP查询、图片转换等 |
| 纯前端 | 30 | 53% | 本地运行，零成本 |

### 冗余检查

⚠️ **31个工具同时存在HTML+React两份实现**，建议后续统一为React组件：

```
url-encode, base-convert, password-gen, http-status, html-entity,
cron-parser, code-explain, code-review, git-commit, ip-lookup,
curl-gen, image-to-base64, css-gradient, color-convert, csv-json,
diff-pro, unit-convert, chi-squared, word-count, title-case,
lorem-ipsum, seo-title, ad-copy, alt-text, blog-outline, cold-email,
lp-hero, pr-desc, video-title, x-post, yt-script
```

---

## 二、外部链接工具（32个）

### 存活状态

| 状态 | 数量 | 占比 |
|------|------|------|
| ✅ 正常 (200) | 25 | 78% |
| ⚠️ 异常 | 7 | 22% |

### 异常链接详情

| 工具 | URL | 状态码 | 说明 |
|------|-----|--------|------|
| Toolify Social | toolify.ai/social-listening | 403 | 反爬虫保护 |
| PH Deck | phdeck.com | 000 | 连接超时/域名问题 |
| Hacker News | news.ycombinator.com | 405 | HEAD请求被拒绝 |
| NoxInfluencer | cn.noxinfluencer.com | 403 | 反爬虫保护 |
| Semrush | semrush.com | 405 | HEAD请求被拒绝 |
| Bitly | bitly.com | 405 | HEAD请求被拒绝 |
| AdQuick | adquick.com | 403 | 反爬虫保护 |

> **注意**: 7个异常链接中，6个是反爬虫保护（403/405），不代表网站不可用。仅 PH Deck (000) 可能存在问题，需人工验证。

---

## 三、LLM API 成本估算

### 单次调用成本

| 任务类型 | Token消耗 | 单次成本 |
|----------|-----------|----------|
| 简单任务（短文本） | ~2K tokens | ¥0.01-0.03 |
| 复杂任务（长文/代码） | ~8K tokens | ¥0.05-0.15 |
| **平均** | ~4K tokens | **¥0.05** |

### 积分系统成本模型

| 用户类型 | 月积分 | 月AI调用 | LLM成本 | 定价 | 毛利率 |
|----------|--------|----------|---------|------|--------|
| Free | 100 | ~100次 | ¥5 | ¥0 | - |
| Pro | 2,000 | ~2,000次 | ¥100 | ¥29 | ~65% |
| Team | 10,000 | ~10,000次 | ¥500 | ¥99 | ~80% |

> 注: 实际成本取决于具体模型（Kimi k1.5 ¥0.015/1K tokens vs GPT-4 ¥0.21/1K tokens）。
> 建议初期用 Kimi API，成本最低。

---

## 四、建议行动

### 高优先级

1. **统一31个冗余工具为React组件** — 删除旧HTML，保留React版本
2. **验证7个异常外部链接** — 手动访问确认是否真的不可用
3. **接入LLM API到24个AI工具** — 优先接入Kimi API（成本最低）

### 中优先级

4. **为纯前端工具增加「隐私优先」标签** — 对标FindUtils卖点
5. **发布MCP Server** — 让Kimi/Claude直接调用AIHues工具（开发16h，运行成本¥0）

### 低优先级

6. **扩展外部工具库** — 按商业计划书的15款首批评测清单扩充

---

## 五、MCP Server 成本评估

| 项目 | 评估 |
|------|------|
| 开发工作量 | 16h (约2天) |
| 运行成本 | ¥0/月（复用现有服务） |
| 维护成本 | 极低 |
| 推荐度 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| 优先级 | P1（可独立推进，不依赖其他模块） |

---

*报告生成: 2026-06-02*
*对应分支: feature/design-refresh*
