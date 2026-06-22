# AIHues 版本备份说明

> 备份时间：2026-06-03
> 分支：`feature/design-refresh`
> GitLab MR：https://dev.msh.team/search-engine/rec/aiushtha/-/merge_requests/3

---

## 这个版本包含什么

### 核心功能
- **57 个工具页面** — 全部 React 组件化（32 纯前端 + 19 AI 写作 + 3 游戏 + 3 其他）
- **86 篇博客** — 含目录导航、JSON-LD Schema、RSS、底部相关工具推荐
- **评测系统** — 57 个工具全部有 6 维度评分 + 雷达图 + 英文翻译
- **评论系统** — localStorage 持久化，点赞/回复/排序，双语占位评论
- **愿望单** — 纯 localStorage，10 条种子数据，投票排行榜，提交表单
- **动态排名** — 基于真实 tool 使用行为（localStorage 统计）
- **积分系统** — 新用户 100 credits，游戏赢积分 / 工具消耗积分
- **LLM 接入** — 19 个 AI 写作工具代码已接入 `/api/ai-generate`，支持 Kimi/DeepSeek/OpenAI
- **GA4 埋点** — 代码已写好（8 个事件），待启用
- **中英文切换** — 刷新页面生效
- **深色模式** — 全站适配

### 技术栈
- Next.js 16.2 + React 19 + Tailwind CSS 4 + TypeScript
- moonrepo + pnpm
- Go service（port 9005，当前 offline）

### 测试环境
https://aihues-test.mse.msh.work

---

## 已知问题

1. **LLM API Key 未配置** — 19 个 AI 写作工具点击 Generate 返回 503
2. **Hydration mismatch** — CreditDisplay 已修复（useSyncExternalStore）
3. **Newsletter 前端持久化** — 已接入 localStorage，后端邮件服务未接

---

## 一期上线计划（基于会议反馈）

### 保留
- 积分系统 ✅
- 中英文双语 ✅
- 57 工具 + 评测 + 博客 ✅

### 新增
- 数据埋点（工具点击、停留时长、按钮点击）
- Wishlist 提交收集邮箱
- PWA / 浏览器书签标志
- 部分工具接 API Key

### 优化（等 UI 参考图）
- Hero 区改得更诱人
- 全局 UI 去 AI 味

### 不做
- 工作流平台（二期）
- Chrome 扩展（二期）
- 开源发布（二期）
- 社区评测 UGC（二期）
- 登录/注册页（二期）

---

## 文件结构关键路径

```
apps/aihues-web/
├── app/
│   ├── page.tsx              # 首页
│   ├── tools/[slug]/page.tsx # 工具详情页（57 个工具路由）
│   ├── tools/page.tsx        # 工具列表页
│   ├── blog/                 # 博客系统
│   ├── games/                # 游戏页面（引用 public/games/*.html）
│   ├── pricing/page.tsx      # 定价页
│   ├── ranking/page.tsx      # 动态排名
│   ├── wishlist/page.tsx     # 愿望单
│   └── api/ai-generate/      # LLM 代理 API
├── components/               # React 组件
├── lib/
│   ├── reviews.ts            # 57 条评测数据 + 英文翻译
│   ├── dict.ts               # 中英双语字典
│   ├── tool-data.ts          # 工具元数据
│   └── gtag.ts               # GA4 埋点封装
└── public/
    ├── games/                # 3 个 HTML 游戏
    └── demo.html             # 终极愿景演示页（独立文件）
```

---

## 如何恢复这个版本

```bash
git clone <repo-url>
git checkout feature/design-refresh
cd apps/aihues-web
pnpm install
pnpm dev
```

---

## 备注

- 此版本为 **一期上线前基准版本**
- 后续修改基于此分支进行
- 如需回滚，checkout 到本备份 commit
