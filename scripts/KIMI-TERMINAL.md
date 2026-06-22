# Kimi Code 终端使用（从 Cursor 扩展迁移）

> 原扩展会话：`3fef679e-321f-41c4-969d-02775838f8ee`（标题「你还在跑吗」）

## 快速启动

```bash
./scripts/kimi.sh          # 或：kimi-hues（需 source ~/.zshrc）
kimi login                 # 首次未登录时
```

## 续接扩展里的工作

扩展会话已导出到项目根目录（**已 gitignore，勿提交**）：

- `kimi-export-3fef679e-20260616-120034.md` — 300 条消息摘要
- `.kimi-handoff/session-3fef679e.zip` — 完整备份

启动 `kimi` 后粘贴：

```
我从 Cursor Kimi 扩展迁到终端了。请先阅读项目根目录的 kimi-export-3fef679e-20260616-120034.md（会话导出）和 PLAN-v2.md、RESEARCH.md，继承上下文。

当前分支 feature/design-refresh，测试环境 https://aihues-test.mse.msh.work。

请从待办「整理并确认本版上线内容清单」继续，先给我一版上线 checklist，再问我确认。
```

## 待办（从扩展继承）

- [ ] 整理并确认本版上线内容清单

## 说明

扩展崩溃因旧会话 wire.jsonl 约 89MB。终端 `kimi` 0.14.3 使用 `~/.kimi-code/`，与扩展旧目录 `~/.kimi/sessions/` 分离，不能直接 `-S 3fef679e...`，需用上面的导出文件续上下文。
