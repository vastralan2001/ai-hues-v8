# AIHues 开发指南

> 本文档面向继续开发 AIHues 的前端/后端同学。阅读前请先了解项目基本结构（见 `AGENTS.md` / `CLAUDE.md`）。

---

## 🎨 设计规范

### 颜色系统（Claude Warm 琥珀主题）

当前默认主题为 **v8.4 Claude Warm**，所有颜色使用以下 Design Tokens：

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-bg` | `#ffffff` | 页面背景 |
| `--color-surface` | `#f8f9fb` | 卡片/浮层背景 |
| `--color-surface-hover` | `#f1f3f7` | 悬浮态背景 |
| `--color-border` | `#e8ecf1` | 边框 |
| `--color-border-strong` | `#d1d8e0` | 强调边框 |
| `--color-foreground` | `#0f172a` | 主文字 |
| `--color-secondary` | `#475569` | 次要文字 |
| `--color-muted` | `#94a3b8` | 弱化文字 |
| `--color-accent` | `#b45309` | 主强调色（琥珀） |
| `--color-accent-light` | `#d97706` | 亮强调色 |
| `--color-accent-bg` | `#fff3e0` | 强调背景 |
| `--color-green` | `#059669` | 成功/免费标签 |
| `--color-green-bg` | `#ecfdf5` | 成功背景 |
| `--color-blue` | `#2563eb` | 信息色 |
| `--color-blue-bg` | `#eff6ff` | 信息背景 |
| `--color-orange` | `#ea580c` | 警告色 |

**渐变规范**：
```css
/* 主渐变 - 用于按钮、Logo、标签 */
linear-gradient(135deg, #b45309, #d97706)

/* 阴影 */
--shadow-hover: 0 4px 12px rgba(180, 83, 9, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08);
```

### 字体规范

| 元素 | 大小 | 字重 | 颜色 |
|------|------|------|------|
| 页面标题 H1 | 32-40px | 800 | `#1c1917` |
| 区块标题 H2 | 24px | 700 | `#1c1917` |
| 卡片标题 | 16-18px | 700 | `#1c1917` |
| 正文 | 14-15px | 400 | `#475569` |
| 辅助文字 | 12-13px | 400 | `#94a3b8` |
| 标签/徽章 | 11-12px | 700 | `#b45309` |

字体栈：
```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 圆角规范

| 元素 | 圆角 |
|------|------|
| 大卡片 | 14px (`--radius`) |
| 小卡片/按钮 | 10px (`--radius-sm`) |
| 标签/徽章 | 6px |
| Logo 图标 | 10px |

---

## 📁 前端项目结构

```
apps/aihues-web/
├── app/
│   ├── page.tsx              # 首页
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式 + Design Tokens
│   ├── blog/
│   │   ├── page.tsx          # 博客列表页
│   │   └── [slug]/
│   │       └── page.tsx      # 文章详情页（动态路由）
│   ├── tools/
│   │   └── page.tsx          # 工具列表页
│   ├── games/
│   │   └── page.tsx          # 游戏列表页
│   ├── wishlist/
│   ├── ranking/
│   ├── collection/
│   ├── discover/
│   ├── showcase/
│   ├── pricing/
│   ├── components/
│   │   ├── SiteChrome.tsx    # 导航栏 + 页脚 + 页面外壳
│   │   ├── CatalogCards.tsx  # 工具/游戏卡片
│   │   ├── SearchForm.tsx    # 搜索框
│   │   ├── ToolsInfiniteList.tsx  # 无限滚动工具列表
│   │   └── ...
│   ├── lib/
│   │   ├── routes.ts         # 路由常量
│   │   └── catalog-api.ts    # 后端 API 调用
│   └── api/                  # Next.js API Routes
│       └── catalog/
│           ├── games/
│           └── tools/
├── public/
│   ├── blog/                 # 静态文章 HTML（数据源）
│   │   ├── growth-tools-2026.html
│   │   ├── reddit-marketing.html
│   │   └── kol-marketing.html
│   ├── tools/                # 静态工具页面
│   ├── games/                # 静态游戏页面
│   └── logo.svg              # 彩虹机器人 Logo
└── package.json
```

---

## 🔧 常用开发命令

```bash
# 安装依赖
cd apps/aihues-web && pnpm install

# 启动前端开发服务器
pnpm dev          # http://localhost:3000

# 启动后端 API（在另一个终端）
cd apps/aihues-api
AIHUES_API__USE_MEMORY=true go run . api -c aihues-api.yaml

# 或使用一键脚本
cd /Users/moonshot/Desktop/ai-hues-\ new
./scripts/dev.sh   # 启动 PostgreSQL + API + Web
./scripts/stop.sh  # 停止所有服务
```

---

## 🧩 组件使用规范

### 页面外壳（PageShell）

所有新页面必须使用 `PageShell` 包裹，确保导航栏和页脚一致：

```tsx
import { PageShell } from '@/components/SiteChrome';

export default function MyPage() {
  return (
    <PageShell>
      <main>页面内容</main>
    </PageShell>
  );
}
```

**注意**：`PageShell` 已经包含 `<SiteHeader>` 和 `<SiteFooter>`，不需要手动引入。

### 导航栏链接

所有页面导航栏统一为：
```
Home / Tools / Games / Blog / Wishlist / Ranking
```

如需修改，编辑 `app/components/SiteChrome.tsx` 中的 `headerLinks`。

### 颜色使用

**推荐方式（CSS 变量）**：
```tsx
<div className="text-accent bg-accent-bg border-border">
```

**硬编码颜色（仅用于无法使用变量的场景）**：
```tsx
// 渐变
style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}

// 特定文字色
className="text-[#78716c]"
```

---

## 📝 添加新文章流程

1. **准备文章 HTML**：按 v8.4 格式，包含 `<article>` 标签
2. **放入 `public/blog/`**：`{slug}.html`
3. **注册元数据**：在 `app/blog/[slug]/page.tsx` 的 `articleMetaMap` 中添加条目
4. **更新列表页**：在 `app/blog/page.tsx` 的 `posts` 数组中添加卡片数据

---

## 🐛 已知问题 & TODO

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 主题切换系统 | P2 | 迁移 v8.4 `themes.css` 的 6 套主题 |
| 文章详情页 CTA 框样式 | P3 | 当前 CTA 框使用 v8.4 的旧类名，可能需要微调 |
| 页脚不统一 | P3 | Games 页和 Ranking 页的页脚与其他页面不同 |
| 移动端适配 | P3 | 部分页面在小屏幕上可能需要调整 |
| Blog 标签颜色 | P3 | 当前用 `text-green`，建议改为琥珀色保持一致 |

---

## 🔗 相关链接

- 线上仓库：`https://dev.msh.team/search-engine/rec/aiushtha`
- v8.4 参考仓库：`~/.openclaw/workspace/ai-hues-dev`
- 后端 API 文档：`apps/aihues-api/proto/aihues/catalog/v1/`

---

> 有任何问题随时问！中文优先，注释和文档都用中文。
