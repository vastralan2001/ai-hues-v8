# AIHues v7 — Product Requirements Document

> **Version**: 7.0  
> **Date**: 2026-05-20  
> **Status**: v7 Shipped — 57 Tools + 3 Games + 11 Feature Pages, Categorized + Theme-Ready

---

## 1. 产品概述

### 1.1 定位
AIHues 是一个纯前端 AI 工具站 + 小游戏社区，覆盖 **开发工具、实用工具、AI写作工具** 三大场景，通过小游戏驱动留存和积分循环。所有工具在浏览器本地运行，无需后端，无需注册即可使用。

### 1.2 Slogan
> **Find your AI vibe.**  
> **找到你的 AI vibe。**

### 1.3 核心数据
| 指标 | 数值 |
|------|------|
| 工具总数 | **57** |
| 小游戏 | **3** |
| 功能页面 | **11** |
| HTML文件 | **71** |
| 代码行数 | ~52,000+ |
| 主题皮肤 | **6套** |
| 成就系统 | **10个** 可解锁 |
| 需求完成率 | 100% |

---

## 2. 工具清单 (57个)

### 2.1 开发工具 (30个)

| # | 工具 | 图标 | 核心功能 | Credit | 状态 |
|---|------|------|----------|--------|------|
| 1 | JWT Parser | 🔐 | Base64Url解码、三部分高亮、过期检测 | 免费 | ✅ |
| 2 | JSON Formatter | 📋 | 格式化/压缩/校验、语法高亮、树形折叠 | 免费 | ✅ |
| 3 | Regex Tester | 🔍 | 实时匹配高亮、8种预设、替换预览 | 免费 | ✅ |
| 4 | UUID Generator | 🆔 | 批量生成、格式选项、历史记录 | 免费 | ✅ |
| 5 | Timestamp | ⏱️ | 秒/毫秒自动识别、双向转换、实时时钟 | 免费 | ✅ |
| 6 | Base64 | 🔢 | 编解码、文件支持 | 免费 | ✅ |
| 7 | SHA256 Hash | 🔒 | SHA-256/SHA-1/MD5、文件哈希 | 免费 | ✅ |
| 8 | SQL Formatter | 🗄️ | SQL查询格式化 | 免费 | ✅ |
| 9 | URL Encode | 🔗 | 4种模式、查询参数表格 | 免费 | ✅ |
| 10 | Base Converter | 🔢 | 二/八/十/十六进制+位运算 | 免费 | ✅ |
| 11 | Password Gen | 🔑 | 强度评估、短语密码、历史 | 免费 | ✅ |
| 12 | HTTP Status | 🌐 | 完整状态码查表、搜索 | 免费 | ✅ |
| 13 | HTML Entity | ◈ | 24实体速查、Unicode/Decimal/Hex | 免费 | ✅ |
| 14 | Cron Parser | ⏰ | 12预设、自然语言、5次执行时间 | 免费 | ✅ |
| 15 | Code Explain | 💻 | 代码统计+函数列表+摘要 | 免费 | ✅ |
| 16 | Code Review | 👁️ | 问题检测+评分+建议 | 免费 | ✅ |
| 17 | Shell Gen | 🐚 | 10种场景Shell命令生成 | 免费 | ✅ |
| 18 | Git Commit | 📌 | 7种conventional commit格式 | 免费 | ✅ |
| 19 | IP Lookup | 🔍 | IP地理位置查询（调用ipapi.co） | 免费 | ✅ |
| 20 | Curl Gen | 🌐 | HTTP方法+Headers+认证+curl生成 | 免费 | ✅ |
| 21 | Diff Pro | 📑 | 行级diff(+-高亮)+单词/字符模式 | 免费 | ✅ |
| 22 | Unit Convert | 📐 | 6分类(长度/重量/温度/面积/数据/时间) | 免费 | ✅ |
| 23 | Image→Base64 | 🖼️ | 拖拽上传、批量转换、缩略图预览 | 免费 | ✅ |
| 24 | CSS Gradient | 🌈 | 线性/径向/圆锥、色标拖拽、12预设 | 免费 | ✅ |
| 25 | Color Convert | 🎨 | HEX/RGB/HSL/CMYK四向互转+调和 | 免费 | ✅ |
| 26 | CSV↔JSON | 📊 | 自动检测分隔符、表格预览、双向转换 | 免费 | ✅ |
| 27 | Markdown | 📝 | 双栏可拖拽、GFM渲染、代码高亮 | 免费 | ✅ |
| 28 | QR Code | 📱 | URL/WiFi/Email/Phone多类型 | 免费 | ✅ |
| 29 | Pomodoro | 🍅 | 圆形进度条、Focus/Break、音效+通知 | 免费 | ✅ |
| 30 | Chi-Squared | 📊 | 卡方检验、置信区间、可视化柱状图 | 免费 | ✅ |

### 2.2 实用工具 (8个)

| # | 工具 | 图标 | 核心功能 | Credit | 状态 |
|---|------|------|----------|--------|------|
| 1 | Word Count | 📊 | 实时字数、字符数、阅读时长 | 免费 | ✅ |
| 2 | Diff | 📑 | 文本差异对比 | 免费 | ✅ |
| 3 | Fullwidth | ↔️ | 全角半角转换+空格/换行清理 | 免费 | ✅ |
| 4 | Title Case | 📰 | 12种格式(AP/Chicago/camel等) | 免费 | ✅ |
| 5 | Readability | 📖 | Flesch-Kincaid可读性分析 | 1cr | ✅ |
| 6 | Humanize | ✨ | 15个AI词替换、去AI味 | 5cr | ✅ |
| 7 | Lorem Ipsum | 📝 | 中文/英文/Latin+HTML模式 | 免费 | ✅ |
| 8 | SEO Title | 🔍 | SEO标题+评分+多维度分析 | 5cr | ✅ |

### 2.3 AI写作工具 (19个)

| # | 工具 | 图标 | 核心功能 | Credit | 状态 |
|---|------|------|----------|--------|------|
| 1 | Ad Copy | 📢 | 3组广告文案（标题+正文+CTA） | 3cr | ✅ |
| 2 | Alt Text | 🖼️ | 4种长度alt文本+SEO优化 | 1cr | ✅ |
| 3 | Blog Outline | 📝 | 6节博客大纲自动生成 | 3cr | ✅ |
| 4 | Changelog | 📋 | 分类changelog（Added/Fixed/Changed） | 3cr | ✅ |
| 5 | Cold Email | 📧 | 3套邮件模板（价值/社交证明/问题） | 3cr | ✅ |
| 6 | Docs | 📚 | API文档+参数表+使用示例 | 2cr | ✅ |
| 7 | FAQ | ❓ | 8组FAQ问答生成 | 3cr | ✅ |
| 8 | LinkedIn | 💼 | 3种LinkedIn帖子格式 | 1cr | ✅ |
| 9 | LP Hero | 🎯 | Landing Page文案全套 | 2cr | ✅ |
| 10 | Meta | 🏷️ | SEO meta标签完整HTML | 1cr | ✅ |
| 11 | Newsletter | 📰 | 完整Newsletter结构 | 1cr | ✅ |
| 12 | PR Desc | 🔀 | PR描述模板+检查清单 | 1cr | ✅ |
| 13 | Pseudo | 🎭 | 伪代码生成 | 1cr | ✅ |
| 14 | Push | 🔔 | 4种推送通知文案 | 1cr | ✅ |
| 15 | Tagline | ✒️ | 8个品牌标语 | 1cr | ✅ |
| 16 | TLDR | 📄 | 摘要+关键提取+压缩率 | 1cr | ✅ |
| 17 | Video Title | 🎬 | 8个YouTube标题+长度检测 | 1cr | ✅ |
| 18 | X Post | 𝕏 | 3种X帖子格式+随机模板 | 1cr | ✅ |
| 19 | YT Script | 🎥 | YouTube脚本完整结构 | 2cr | ✅ |

### 2.4 小游戏 (3个)

| 游戏 | 图标 | 核心功能 | 产出/消耗 | 排行榜 | 状态 |
|------|------|----------|-----------|--------|------|
| 日历幸运签 | 📅 | 3D翻转、30条箴言、运势分级 | +10 Credits/日 | ✅ | ✅ |
| 幸运老虎机 | 🎰 | 3x3滚轮、8条中奖线、每日3次 | +5~50 Credits | ✅ | ✅ |
| 投篮挑战 | 🏀 | Canvas物理引擎、60秒挑战 | +5~30 Credits | ✅ | ✅ |

---

## 3. 功能页面 (11个)

| 页面 | 说明 | 状态 |
|------|------|------|
| index.html | 首页 — AI搜索框+分类浏览+工具展示+游戏入口 | ✅ |
| tools.html | 完整工具目录 — 57工具一览+分类Pill+搜索过滤 | ✅ |
| games.html | 游戏大厅 — 3个游戏卡片+统计+入口 | ✅ |
| discover.html | 发现页 — 热门工具+新上架+分类探索+随机推荐 | ✅ |
| pricing.html | 定价页 — Free/Pro/Team三档+Credit说明+FAQ | ✅ |
| login.html | 登录 — Kimi登录+本地快速登录+游客模式 | ✅ |
| wishlist.html | 许愿单 — 投票+TOP5排行+提交需求 | ✅ |
| ranking.html | 排行榜 — 工具排行(可点击跳转)+用户排行+成就墙 | ✅ |
| showcase.html | 展示页 — 工具展示墙 | ✅ |
| collection.html | 收藏页 — 工具收藏管理 | ✅ |
| profile.html | 个人页 — 用户资料+成就+使用统计 | ✅ |

---

## 4. 基础设施

### 4.1 分类标签系统 (v7新增)
- 57个工具全部打上 `data-cat` 属性（developer/utility/ai-writing）
- tools.html 分类Pill按钮（全部/开发/实用/AI写作）
- 组合过滤：分类 + 搜索关键词同时生效
- URL参数支持：`?cat=developer` 自动选中分类
- 首页分类卡片链接：`tools.html?cat=xxx`

### 4.2 主题系统 (v7完成)
- **6套主题皮肤**：默认浅色、暗夜紫、森林绿、日落橙、深海蓝、极简白
- 所有11个功能页面均支持主题切换
- CSS变量 + `[data-theme]` 属性切换
- localStorage持久化

### 4.3 i18n 中英文切换
- **71个HTML文件**全部引用i18n.js
- data-zh属性标记中文内容
- localStorage持久化语言选择
- 全局toggleLang()函数

### 4.4 深色模式
- CSS变量覆盖：`[data-theme="dark"]`
- 自动跟随 `prefers-color-scheme`
- localStorage持久化

### 4.5 PWA 离线支持
- `manifest.json` — Web App Manifest
- `sw.js` — Service Worker缓存全部71个页面
- 首次访问自动缓存
- 离线时返回缓存内容

### 4.6 SEO
- `robots.txt` — 允许索引
- `sitemap.xml` — 68个URL
- 每个页面独立meta description

### 4.7 Credit系统
- localStorage存储余额
- 初始100 Credit
- 游戏产出（玩小游戏赚积分）
- AI文本工具消耗（1cr/3cr/5cr三档）
- 基础开发/实用工具免费

### 4.8 成就系统
- 10个可解锁成就
- localStorage统计驱动
- Toast通知+动画效果

---

## 5. 技术架构

### 5.1 技术栈
- **纯静态HTML+CSS+JS** — 零框架、零后端
- **localStorage** — 所有数据本地持久化
- **CDN库**: marked.js (Markdown)、qrcode.js (二维码)
- **Web API**: Canvas, Web Crypto, FileReader, Web Audio, Notification, Service Worker

### 5.2 文件结构
```
ai-hues-v7/
├── index.html              # 首页
├── tools.html              # 完整工具目录(57工具+分类过滤)
├── games.html              # 游戏大厅
├── discover.html           # 发现页
├── pricing.html            # 定价页
├── login.html              # 登录/注册/游客
├── wishlist.html           # 工具许愿单
├── ranking.html            # 排行榜
├── showcase.html           # 展示页
├── collection.html         # 收藏页
├── profile.html            # 个人页
├── manifest.json           # PWA Manifest
├── sw.js                   # Service Worker
├── robots.txt              # 搜索引擎
├── sitemap.xml             # 站点地图
├── plan.md                 # 开发计划
├── PRD.md                  # 本文档
├── CREDIT_ASSESSMENT.md    # Credit消耗评估
├── TOOL_INVENTORY.csv      # 工具清单
├── js/
│   ├── i18n.js             # 中英文切换系统
│   ├── theme-system.js     # 6套主题皮肤
│   ├── achievements.js     # 成就系统
│   └── auth.js             # 登录状态
├── css/
│   └── themes.css          # 主题变量
├── tools/                  # 57个工具页面
├── games/                  # 3个小游戏
└── img/                    # 图标和截图
```

### 5.3 localStorage Key
```
aihues_credit              # 全局Credit余额
aihues_lang                # i18n语言 (en/zh)
aihues_theme               # 主题 (light/dark)
aihues_users               # 注册用户列表
aihues_current_user        # 当前登录用户
aihues_wishlist            # 许愿单数据
aihues_wishlist_voted      # 已投票ID
aihues_achievements        # 成就解锁状态
aihues_hoops_*             # 投篮游戏数据
aihues_slots_*             # 老虎机数据
aihues_daily_*             # 幸运签数据
```

---

## 6. Credit 定价策略

| 等级 | 数量 | 定价 | 代表工具 |
|------|------|------|----------|
| 🆓 免费 | **38款** | 0cr | JSON格式化、Base64、二维码、字数统计、Markdown... |
| 🥉 轻量AI | **14款** | 1cr | X Post、TL;DR、Tagline、LinkedIn、PR Desc... |
| 🥈 中等AI | **3款** | 2cr | Docs、LP Hero、YT Script |
| 🥈 中等AI | **4款** | 3cr | Blog Outline、Code Review、Ad Copy、Cold Email... |
| 🥇 复杂AI | **2款** | 5cr | Humanize、SEO Title（待接入LLM API） |

> 注：当前所有AI工具均为纯前端模板生成，未接入真实LLM API。Credit标记为预设定价，实际扣除逻辑待实现。

---

## 7. 变更日志

### v7.0 (2026-05-20)
- ✅ 分类标签系统：57工具打标签（developer/utility/ai-writing）
- ✅ tools.html分类Pill按钮+组合过滤+URL参数
- ✅ 首页分类卡片链接修复（tools.html?cat=xxx）
- ✅ 新增games.html游戏大厅
- ✅ 所有页面主题选择器（11个页面全部支持）
- ✅ 导航栏Games死链修复
- ✅ Browse All Tools按钮修复
- ✅ Footer过时数字修复（57工具）
- ✅ Credit消耗评估报告

### v6.5 (2026-05-19)
- ✅ 57工具+3游戏全部实现
- ✅ 10个功能页面实现
- ✅ 成就系统+6套主题
- ✅ PWA+i18n+深色模式

---

## 8. 后续规划

### Phase 3 (进行中)
| 功能 | 说明 | 优先级 |
|------|------|--------|
| LLM API接入 | 为19个AI写作工具接入Kimi/DeepSeek API | P0 |
| Credit真实扣除 | localStorage扣减+余额不足提示 | P0 |
| 今日免费轮换 | 每天1款AI工具免费使用 | P1 |
| 使用历史记录 | 记录每次工具使用+Credit消耗 | P1 |

### Phase 4 (建议)
| 功能 | 说明 | 优先级 |
|------|------|--------|
| 支付系统 | Stripe/支付宝Pro订阅 | P2 |
| 用户反馈 | 每个工具添加反馈按钮 | P2 |
| 推荐算法 | 根据使用历史推荐工具 | P3 |
| Vercel正式部署 | 自定义域名+CI/CD | P3 |

---

*AIHues — Find your AI vibe.*  
*v7.0 · 2026-05-20 · 57 Tools + 3 Games + 11 Pages*
