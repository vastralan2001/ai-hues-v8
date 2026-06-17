# AIHues 会话交接 — 2026-06-17

> 会话时间：2026-06-17
> 工作分支：`feature/design-refresh`
> 关联 MR：https://dev.msh.team/search-engine/rec/aiushtha/-/merge_requests/3

## 当前状态

- **PRD 去 AI 味完成**：`scripts/prd-design-refresh.md` 已用 humanize 处理，标题从“1. / 2. / 3.”编号式改成更口语化表达，删除了多余空行，文风更像人话。
- **工具组件 spacing 批量优化完成**：用 `scripts/normalize-tool-spacing.cjs` 把剩余 54 个工具组件的 `.5` 间距、非 8 倍数圆角/最大宽度等对齐到 4/8 rhythm。
- **新增 Kimi Code Cheat Sheet 工具**：组件 + 注册 + 文案 + 图标 + slug 路由，全站工具数量从 57 更新为 58。
- **本地检查通过**：`pnpm check` 全绿（lint / format-check / typecheck / test），`pnpm moon run aihues-web:build` 通过（179 页静态生成）。

## 本次提交内容

| 文件 | 说明 |
|------|------|
| `apps/aihues-web/app/components/tools/KimiCodeCheatSheetTool.tsx` | 新增 Kimi Code 速查表工具组件 |
| `apps/aihues-web/app/lib/tool-data.ts` | 注册 `kimi-code` 工具元数据 |
| `apps/aihues-web/app/lib/published-tools.ts` | 把 `kimi-code` 加入已发布列表 |
| `apps/aihues-web/app/components/ToolIcon.tsx` | 增加 Kimi Code 图标映射 |
| `apps/aihues-web/app/tools/[slug]/page.tsx` | 增加 `kimi-code` 组件动态导入 |
| `apps/aihues-web/app/lib/dict.ts` | 增加 `kimiCode.*` 中英双语键 |
| `apps/aihues-web/app/about/page.tsx` | 工具数量 57 → 58 |
| `apps/aihues-web/app/page.tsx` | 隐藏 hero 副标题，让搜索/对话区域上移 |
| `apps/aihues-web/app/tools/page.tsx` | 工具数量 57 → 58 |
| `apps/aihues-web/app/components/SearchForm.tsx` | 搜索占位文案 57 → 58 |
| `apps/aihues-web/app/components/SiteChrome.tsx` | 导航/页脚相关数量 57 → 58 |
| `apps/aihues-web/app/components/tools/*.tsx`（约 54 个） | spacing rhythm 规范化 |
| `apps/aihues-web/app/lib/ai-prompts.ts` | 去重 `seo-title`、加输出格式约束、设置 `temperature` / `maxTokens` |
| `apps/aihues-web/app/api/ai-generate/route.ts` | 读取 prompt 的 `temperature` / `maxTokens` |
| `scripts/normalize-tool-spacing.cjs` | spacing 批量优化脚本 |
| `scripts/prd-design-refresh.md` | 去 AI 味后的正式 PRD |
| `scripts/humanize-prd.cjs` | 分段调用 `/api/ai-generate` 对 PRD 去 AI 味的脚本 |
| `scripts/create-feishu-prd.cjs` / `scripts/read-feishu-prd.cjs` | 改用官方 Markdown convert + descendant API，设置组织内可编辑权限 |

## 还没做完的待办

- [x] 修复 `apps/aihues-web/app/lib/ai-prompts.ts` 里 `seo-title` 重复定义的 bug
- [x] 为主要 AI 写作工具补充 few-shot 和输出格式约束
- [x] 为每个 AI 工具设置合适的 `temperature` 和 `max_tokens`
- [x] 优化剩余 56 个工具组件的 spacing（4/8 rhythm）
- [x] 新增 Kimi Code Cheat Sheet 工具
- [ ] 决定 `feature/design-refresh` 与 `master`（已切为静态 HTML 架构）的合并策略

## 关键环境配置

- **LLM 代理**：千循 `https://openai.app.msh.team/`，key 已配置
- **飞书应用**：`cli_aa9fe8eb60b99bd1` / `TldaGsdXdZuuwOWVMUsvChlKJQNttTUW`
- **Git 远程**：
  - GitLab `origin`: `dev.msh.team/search-engine/rec/aiushtha`
  - GitHub `github`: `vastralan2001/ai-hues-v8`

## 用户偏好

- 沟通语言：中文；代码/技术术语保持英文
- 做选择时先解释选项利弊，推荐项标注“(推荐)”
- 不改 CI/CD 配置，确需修改时先说明并征得同意
- 每次 push 前本地跑 `pnpm check` + `pnpm moon run aihues-web:build`（文档-only 可跳过 build）
- 遇到权限问题先向用户求助，不继续硬做

## 首页调整

- `apps/aihues-web/app/page.tsx`：把 hero 区下方的 "57 款精选工具 + 3 个轻量小游戏..." / "57 curated tools + 3 mini games..." 副标题暂时注释隐藏，让搜索框/对话区域整体上移。

## AI 写作工具 prompt 升级

- `apps/aihues-web/app/lib/ai-prompts.ts`：
  - 删掉了重复的 `seo-title` case。
  - 给所有 AI 写作工具加了输出格式约束。
  - 为每个工具设置了 `temperature` 和 `maxTokens`：创意类偏高（0.75-0.85），事实/解释类偏低（0.3-0.5）。
- `apps/aihues-web/app/api/ai-generate/route.ts`：读取 prompt 的 `temperature` / `maxTokens`，未设置时回退到 0.7 / 2000。
- 本地测试：`seo-title`、`ad-copy`、`humanize` 三个工具通过 `curl` 调用 `/api/ai-generate` 验证通过。

## 工具组件 spacing 规范化

- 脚本 `scripts/normalize-tool-spacing.cjs` 对 54 个组件做了批量替换：
  - `.5` 间距 → 最近的 4/8 倍数（如 `mb-1.5` → `mb-2`，`py-2.5` → `py-3`）
  - 非 8 倍数圆角 → 标准 token（如 `rounded-[10px]` → `rounded-lg`，`rounded-[14px]` → `rounded-2xl`）
  - 非标准最大宽度 → 标准 token（如 `max-w-[700px]` → `max-w-3xl`，`max-w-[900px]` → `max-w-4xl`）
- 游戏主题 UI（Slots / Hoops）的 Vegas / dark court 装饰性间距未强行改动，保留原有视觉密度。

## Kimi Code Cheat Sheet 工具

- 路径：`/tools/kimi-code`
- 内容模块：安装、快速开始、模式（默认 / Agent / 计划）、CLI 自动化、后台任务、斜杠命令、Skills、Plan Mode、权限、内置工具、快捷键
- 支持：搜索过滤、一键复制命令、中英双语
- 数据来源：https://www.kimi.com/zh-cn/lp/kimi-code-cheat-sheet

## 飞书 PRD 脚本升级

- `scripts/create-feishu-prd.cjs` 已重写：直接读 Markdown 文件，走官方 `documents/blocks/convert` 接口转成 Block，再用 `descendant` 接口插入文档。
- `scripts/read-feishu-prd.cjs` 已修正 block_type 枚举映射，能正确识别 heading/bullet/ordered/quote/divider/code。
- 最新同步成功的飞书文档：https://moonshot.feishu.cn/docx/GiKqdsblMo40hYxfWZPcwKaPnNp
- 用法：
  ```bash
  FEISHU_APP_ID=xxx FEISHU_APP_SECRET=yyy node scripts/create-feishu-prd.cjs [path/to/prd.md]
  ```

## 已知问题

- `master` 分支已改为静态 HTML 架构，与 `feature/design-refresh` 的 Next.js 架构严重分叉，后续合并需要专门规划。
- 飞书文档权限问题已解决：脚本创建文档后自动调用 `drive/v1/permissions/{token}/public?type=docx` 设置为组织内可编辑。

## 2026-06-17 夜间迭代（用户离线后）

- **AI 写作工具 prompt 二轮迭代**：修复 pr-desc/pseudo/faq/yt-script/push/docs/cold-email/ad-copy 的格式与 AI 味问题。
- **重新评估**：生成 `docs/ai-writing-evaluation-2026-06-17-v2.md` 对比报告，21 个工具全部成功。
- **上线前合规/UI 修复**：
  - 新增 `/privacy` 隐私政策页
  - 新增 Cookie Consent Banner，`GoogleAnalytics` 仅在同意后加载
  - 工具详情页显示工具名称和描述
  - Newsletter 成功文案去掉了虚假承诺
  - Pricing 页面清理遗留 migration 文案
  - 页脚增加 Privacy 和 Contact（mailto）
- **生成报告**：`docs/pre-launch-readiness-2026-06-17.md`
- **验证**：`pnpm check` + `pnpm moon run aihues-web:build` 全绿（180 页静态生成）。

## 明天验收重点

1. 查看 `docs/pre-launch-readiness-2026-06-17.md`。
2. 在 `docs/ai-writing-evaluation-2026-06-17-v2.md` 里填写人工评估。
3. 决定：是否保留 Newsletter 表单 / Pricing 页面 / 评论评测功能。

## 续接建议

下次启动时，先读：

1. `AGENTS.md` — 仓库约定
2. `docs/pre-launch-readiness-2026-06-17.md` — 上线前准备度
3. `docs/ai-writing-evaluation-2026-06-17-v2.md` — AI 写作效果
4. 本文件 — 会话上下文

然后按待办顺序继续，建议先解决 Newsletter / Pricing 的上线策略。
