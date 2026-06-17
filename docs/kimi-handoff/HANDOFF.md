# AIHues 会话交接 — 2026-06-17

> 会话时间：2026-06-17  
> 工作分支：`feature/design-refresh`  
> 关联 MR：https://dev.msh.team/search-engine/rec/aiushtha/-/merge_requests/3

## 当前状态

- **PRD 去 AI 味完成**：`scripts/prd-design-refresh.md` 已用 humanize 处理，标题从“1. / 2. / 3.”编号式改成更口语化表达，删除了多余空行，文风更像人话。
- **本地检查通过**：`pnpm check` 全绿（lint / format-check / typecheck / test）。
- **已推送**：commit `5acd964` 已推到 GitLab 与 GitHub 的 `feature/design-refresh`。

## 本次提交内容

| 文件 | 说明 |
|------|------|
| `scripts/prd-design-refresh.md` | 去 AI 味后的正式 PRD |
| `scripts/prd-design-refresh-humanized.md` | humanize 中间产物备份 |
| `scripts/humanize-prd.cjs` | 分段调用 `/api/ai-generate` 对 PRD 去 AI 味的脚本 |

## 还没做完的待办

- [x] 修复 `apps/aihues-web/app/lib/ai-prompts.ts` 里 `seo-title` 重复定义的 bug
- [x] 为主要 AI 写作工具补充 few-shot 和输出格式约束
- [x] 为每个 AI 工具设置合适的 `temperature` 和 `max_tokens`
- [ ] 继续优化剩余 56 个工具组件的 spacing（4/8 rhythm）
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

## 飞书 PRD 脚本升级

- `scripts/create-feishu-prd.cjs` 已重写：现在直接读 Markdown 文件，走官方 `documents/blocks/convert` 接口转成 Block，再用 `descendant` 接口插入文档。
- `scripts/read-feishu-prd.cjs` 已修正 block_type 枚举映射，能正确识别 heading/bullet/ordered/quote/divider/code。
- 最新同步成功的飞书文档：https://moonshot.feishu.cn/docx/GiKqdsblMo40hYxfWZPcwKaPnNp
- 用法：
  ```bash
  FEISHU_APP_ID=xxx FEISHU_APP_SECRET=yyy node scripts/create-feishu-prd.cjs [path/to/prd.md]
  ```

## 已知问题

- `master` 分支已改为静态 HTML 架构，与 `feature/design-refresh` 的 Next.js 架构严重分叉，后续合并需要专门规划。
- 飞书文档权限问题已解决：脚本创建文档后自动调用 `drive/v1/permissions/{token}/public?type=docx` 设置为组织内可编辑。

## 续接建议

下次启动时，先读：

1. `AGENTS.md` — 仓库约定
2. `scripts/prd-design-refresh.md` — 最新 PRD
3. 本文件 — 会话上下文

然后按待办顺序继续，建议先做 `ai-prompts.ts` 的 `seo-title` 重复定义修复，再继续 spacing 优化。
