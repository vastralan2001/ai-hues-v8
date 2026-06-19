'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';
import { Panel, ToolHeader, TOOL_WRAP } from './_kit';

interface KimiCodeCheatSheetToolProps {
  locale: Locale;
}

interface CheatItem {
  cmd: string;
  desc: string;
}

interface CheatSection {
  title: string;
  items: CheatItem[];
}

const CHEAT_SHEET: CheatSection[] = [
  {
    title: '安装',
    items: [
      {
        cmd: 'curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash',
        desc: '脚本安装（macOS / Linux，推荐）',
      },
      {
        cmd: 'irm https://code.kimi.com/kimi-code/install.ps1 | iex',
        desc: 'Windows PowerShell',
      },
      {
        cmd: 'npm install -g @moonshot-ai/kimi-code',
        desc: 'npm 安装（需要 Node.js 24.15.0+）',
      },
      {
        cmd: 'pnpm add -g @moonshot-ai/kimi-code',
        desc: 'pnpm 安装',
      },
    ],
  },
  {
    title: '快速开始',
    items: [
      { cmd: 'kimi', desc: '在当前仓库打开 Kimi Code' },
      { cmd: 'kimi --continue', desc: '恢复此处最近的会话' },
      { cmd: 'kimi --session', desc: '选择较早的会话恢复' },
      { cmd: 'kimi -p "..."', desc: '运行一次非交互提示' },
      { cmd: 'kimi --prompt "..."', desc: '长文本一次性提示' },
      {
        cmd: 'kimi --output-format stream-json',
        desc: '输出 JSONL，便于自动化',
      },
      { cmd: 'kimi --model <model>', desc: '使用指定模型启动' },
    ],
  },
  {
    title: '模式',
    items: [
      { cmd: 'kimi --plan', desc: '启动时开启 Plan Mode' },
      { cmd: 'kimi --yolo', desc: '自动批准常规操作（仅可信仓库）' },
      { cmd: 'kimi --auto', desc: '自动处理审批且不提问' },
      { cmd: 'kimi --skills-dir <dir>', desc: '加载自定义 Skills' },
    ],
  },
  {
    title: 'CLI 自动化',
    items: [
      { cmd: 'kimi -p "..."', desc: '非交互提示' },
      {
        cmd: 'kimi --output-format stream-json',
        desc: '结构化输出 JSONL 事件',
      },
      { cmd: 'kimi --model <model>', desc: '为本次运行选择模型' },
      { cmd: 'kimi --continue', desc: '恢复当前目录最近的会话' },
      { cmd: 'kimi --session <id>', desc: '恢复指定会话' },
      { cmd: 'kimi export [id]', desc: '导出会话包' },
      { cmd: 'kimi login', desc: 'OAuth 设备码登录' },
      { cmd: 'kimi acp', desc: 'IDE / ACP JSON-RPC 模式' },
      { cmd: 'kimi doctor', desc: '校验配置文件' },
      { cmd: 'kimi provider', desc: '从终端管理供应商' },
      { cmd: 'kimi upgrade', desc: '检查并安装更新' },
      { cmd: 'kimi migrate', desc: '迁移旧版数据' },
    ],
  },
  {
    title: '后台任务',
    items: [
      { cmd: '/tasks', desc: '打开后台任务列表' },
      { cmd: 'TaskList', desc: '列出正在运行的后台任务' },
      { cmd: 'TaskOutput', desc: '查看任务输出' },
      { cmd: 'TaskStop', desc: '停止正在运行的任务' },
      { cmd: 'CronCreate', desc: '安排未来触发的提示' },
      { cmd: 'CronList', desc: '列出定时提示' },
      { cmd: 'CronDelete', desc: '取消定时提示' },
    ],
  },
  {
    title: '常用斜杠命令',
    items: [
      { cmd: '/new', desc: '开启新会话' },
      { cmd: '/clear', desc: '新建干净会话的别名' },
      { cmd: '/sessions', desc: '恢复历史工作' },
      { cmd: '/resume', desc: '会话浏览器别名' },
      { cmd: '/fork', desc: '尝试不同方向' },
      { cmd: '/title "..."', desc: '命名会话' },
      { cmd: '/rename', desc: '标题重命名别名' },
      { cmd: '/compact', desc: '压缩较长上下文' },
      { cmd: '/model', desc: '切换模型' },
      { cmd: '/provider', desc: '配置供应商和模型' },
      { cmd: '/settings', desc: '打开设置' },
      { cmd: '/config', desc: '设置别名' },
      { cmd: '/experiments', desc: '打开实验功能' },
      { cmd: '/permission', desc: '选择审批模式' },
      { cmd: '/editor', desc: '设置 Ctrl-G 外部编辑器' },
      { cmd: '/help', desc: '显示命令和快捷键' },
      { cmd: '/usage', desc: '查看 Token 与额度' },
      { cmd: '/status', desc: '查看版本、模型、目录、模式' },
      { cmd: '/version', desc: '显示 CLI 版本' },
      { cmd: '/feedback', desc: '发送产品反馈' },
      { cmd: '/btw', desc: '打开旁路 Agent 对话' },
      { cmd: '/exit', desc: '退出' },
    ],
  },
  {
    title: 'Skills 与扩展',
    items: [
      { cmd: '/skill:name', desc: '运行已安装的 Skill' },
      { cmd: '/name', desc: '无内置冲突时的快捷写法' },
      { cmd: '/mcp', desc: '查看 MCP 服务状态' },
      { cmd: '/mcp-config', desc: '配置 MCP 服务与 OAuth' },
      { cmd: '/custom-theme', desc: '创建或编辑 TUI 主题' },
      { cmd: '/update-config', desc: '编辑配置和 TUI 设置' },
      {
        cmd: '/import-from-cc-codex',
        desc: '导入 instructions、skills 和 MCP',
      },
      { cmd: '/sub-skill', desc: '整理本地 skill 库' },
      { cmd: '/plugins', desc: '管理插件' },
    ],
  },
  {
    title: 'Plan Mode',
    items: [
      { cmd: 'Shift + Tab', desc: '切换 Plan Mode' },
      { cmd: '/plan on', desc: '进入 Plan Mode' },
      { cmd: '/plan off', desc: '退出 Plan Mode' },
      { cmd: '/plan clear', desc: '清空当前计划' },
      { cmd: 'EnterPlanMode', desc: '工具进入 Plan Mode' },
      { cmd: 'ExitPlanMode', desc: '计划审批后工具退出' },
    ],
  },
  {
    title: '权限',
    items: [
      { cmd: '/permission', desc: '选择权限模式' },
      { cmd: '/yolo [on|off]', desc: '切换自动批准模式' },
      { cmd: '/yesyolo', desc: 'yolo 别名' },
      { cmd: '/auto [on|off]', desc: '自动处理工具审批' },
      { cmd: '--yolo', desc: '仅用于可信工作区' },
    ],
  },
  {
    title: '内置工具',
    items: [
      { cmd: 'Read', desc: '读取文本文件' },
      { cmd: 'Write', desc: '创建或覆盖文件' },
      { cmd: 'Edit', desc: '替换精确文件内容' },
      { cmd: 'Grep', desc: '搜索文件内容' },
      { cmd: 'Glob', desc: '按模式查找文件' },
      { cmd: 'Bash', desc: '运行终端命令' },
      { cmd: 'WebSearch', desc: '搜索网页' },
      { cmd: 'FetchURL', desc: '抓取 URL 内容' },
      { cmd: 'ReadMediaFile', desc: '读取图片/视频文件' },
      { cmd: 'TodoList', desc: '管理可见待办' },
      { cmd: 'Agent', desc: '启动子代理' },
      { cmd: 'AgentSwarm', desc: '运行或恢复多个子代理' },
      { cmd: 'AskUserQuestion', desc: '提出结构化问题' },
      { cmd: 'Skill', desc: '调用已注册 Skill' },
    ],
  },
  {
    title: '键盘快捷键',
    items: [
      { cmd: 'Enter', desc: '提交提示' },
      { cmd: 'Shift + Enter / Ctrl + J', desc: '换行' },
      { cmd: 'Up / Down', desc: '输入历史' },
      { cmd: 'Ctrl + G', desc: '用外部编辑器编辑' },
      { cmd: 'Ctrl + V', desc: 'macOS/Linux 粘贴图片/视频' },
      { cmd: 'Alt + V', desc: 'Windows 粘贴图片/视频' },
      { cmd: 'Ctrl + S', desc: '引导正在生成的回复' },
      { cmd: 'Esc', desc: '停止、取消或关闭弹窗' },
      { cmd: 'Ctrl + C', desc: '中断输出或清空输入' },
      { cmd: 'Ctrl + D', desc: '输入为空时退出' },
      { cmd: 'Ctrl + O', desc: '展开/收起工具输出' },
      { cmd: 'Ctrl + E', desc: '展开/收起计划或预览' },
      { cmd: '1 - 9', desc: '审批面板按数字选择选项' },
    ],
  },
];

export default function KimiCodeCheatSheetTool({
  locale,
}: KimiCodeCheatSheetToolProps) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHEAT_SHEET;
    return CHEAT_SHEET.map((section) => {
      const titleMatch = section.title.toLowerCase().includes(q);
      const items = titleMatch
        ? section.items
        : section.items.filter(
            (item) =>
              item.cmd.toLowerCase().includes(q) ||
              item.desc.toLowerCase().includes(q)
          );
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [query]);

  function copy(cmd: string) {
    navigator.clipboard.writeText(cmd);
    setCopied(cmd);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.kimiCode.title')}
        desc={t(locale, 'tool.kimiCode.desc')}
      />

      <input
        className='mb-6 h-11 w-full rounded-[12px] border border-border bg-surface px-4 text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(locale, 'tool.kimiCode.search')}
        type='text'
        value={query}
      />

      <div className='space-y-5'>
        {filtered.map((section) => (
          <Panel key={section.title} label={section.title}>
            <div className='divide-y divide-border'>
              {section.items.map((item, idx) => (
                <div
                  key={`${section.title}-${idx}`}
                  className='grid items-start gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_1.4fr]'
                >
                  <div className='flex items-start gap-2'>
                    <code className='break-all rounded-[8px] bg-bg px-2 py-1 font-mono text-[13px] text-foreground'>
                      {item.cmd}
                    </code>
                    <button
                      className='h-7 shrink-0 rounded-[8px] border border-border bg-bg px-2.5 text-[11px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
                      onClick={() => copy(item.cmd)}
                      type='button'
                    >
                      {copied === item.cmd
                        ? t(locale, 'tool.kimiCode.copied')
                        : t(locale, 'tool.kimiCode.copy')}
                    </button>
                  </div>
                  <p className='text-[13px] leading-relaxed text-secondary'>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        ))}

        {filtered.length === 0 && (
          <p className='text-center text-[13px] text-muted'>
            {locale === 'zh'
              ? '没有找到匹配的命令。'
              : 'No matching commands found.'}
          </p>
        )}
      </div>
    </div>
  );
}
