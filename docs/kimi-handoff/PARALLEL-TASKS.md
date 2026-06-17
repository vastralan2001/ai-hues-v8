# 并行任务清单（Parallel Tasks）

> 这些任务可以和当前 UI 优化同步进行，不阻塞主线程。
> 由用户和/或 background agent 推进，完成后把结论更新回本文件。

---

## 任务 1：确定下一版 Agent / 出海营销方向（优先级：高）

**目标**：为 `PLAN-v2.md` 圈出前 3 个必须做的功能。

**需要你思考并回复**：
- 下一版目标用户是谁？（独立开发者 / 出海增长团队 / 内容运营 / 其他）
- 核心场景是什么？（ launch campaign / 日常内容生产 / 竞品分析 / 多语言本地化）
- 必须有的 3 个功能是什么？
- 哪些可以放 vNext+1？

**输出**：把结论直接回复给 AI 助手，或写进本文件。

---

## 任务 2：检查 GitHub 已 push 的交接文件（优先级：高）

**目标**：确认 `docs/kimi-handoff/` 下的文件是否符合预期。

**链接**：
- `https://github.com/vastralan2001/ai-hues-v8/tree/feature/design-refresh/docs/kimi-handoff`

**需要你确认**：
- `PROJECT-HANDOFF.md` 内容是否准确
- `USER-PREFERENCES.md` 是否遗漏了你的偏好
- 是否需要新建一个**独立的个人偏好仓库**（如 `vastralan2001/kimi-preferences`）

**输出**：告诉 AI 助手是否需要拆分个人偏好仓库。

---

## 任务 3：处理 GitLab token 安全（优先级：高）

**目标**：撤销或缩短刚才给 AI 助手的 token 有效期。

**步骤**：
1. 登录 `https://dev.msh.team`
2. 头像 → Preferences → Access Tokens
3. 找到名为 `kimi-code-glab` 的 token
4. 点击 **Revoke** 或设置更早的 Expiration date

**注意**：token 撤销后，AI 助手下次读 skill 需要重新授权。这没问题，用的时候再配。

**输出**：完成后在本文件对应条目打勾。

---

## 任务 4：收集竞品 / 参考站的 Hero 设计（优先级：中）

**目标**：给 AI 助手提供 2-3 个你觉得 hero 区做得好的工具站/产品站。

**问题**：
- 你喜欢哪个网站的标题处理方式？
- 你喜欢哪种分类卡片样式？
- 有没有你觉得 CTA 按钮做得特别好的参考？

**输出**：把链接或截图发群里/发给 AI 助手。

---

## 任务 5：确认上线 checklist（优先级：中）

**目标**：`feature/design-refresh` 上线前还需要确认什么。

**待确认项**：
- [ ] 生产环境 `KIMI_API_KEY` + `KIMI_API_BASE_URL` 已配置
- [ ] 测试环境 CI/CD 已修复并部署最新版
- [ ] `aihues-web-data` PVC 已在集群创建
- [ ] 域名 / SSL / CDN 正常
- [ ] SEO metadata（sitemap, robots, OG）已检查
- [ ] E2E 测试在生产镜像上跑过

**输出**：把结果告诉 AI 助手，或更新到 `PROJECT-HANDOFF.md`。

---

## 任务 6：阅读 kimi-design-skill 的 Button / Card 规范（优先级：中）

**目标**：判断 Kimi 的按钮/卡片规范是否值得部分迁移到 AIHues。

**Background agent 正在处理此任务**，会输出一份笔记到本目录：
- `KIMI-BUTTON-CARD-NOTES.md`

**输出**：AI 助手会基于笔记给出建议，你来决定是否采用。

---

## 任务状态跟踪

| 任务 | 负责人 | 状态 |
|---|---|---|
| 确定下一版方向 | 用户 | ⏳ 待开始 |
| 检查 GitHub 交接文件 | 用户 | ⏳ 待开始 |
| 撤销 GitLab token | 用户 | ⏳ 待开始 |
| 收集竞品参考 | 用户 | ⏳ 待开始 |
| 确认上线 checklist | 用户 | ⏳ 待开始 |
| 阅读 Button/Card 规范 | Background Agent | 🔄 进行中 |

---

## 使用方式

1. 用户在浏览器看效果 / 思考产品方向。
2. Background agent 读 skill 写笔记。
3. 任何结论直接回复给主对话的 AI 助手，或编辑本文件。
