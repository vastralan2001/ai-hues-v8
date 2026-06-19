'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Search } from 'lucide-react';

import { t, type Locale } from '@/lib/dict';
import { Panel, ToolHeader, TOOL_WRAP } from './_kit';

interface KimiCodeCheatSheetToolProps {
  locale: Locale;
}

type Approval = 'auto' | 'ask';

interface CheatItem {
  cmd: string;
  desc: string;
  alias?: string;
  approval?: Approval;
}

interface CheatSection {
  title: string;
  items: CheatItem[];
}

const CHEAT_SHEET: CheatSection[] = [
  {
    title: 'Quick start',
    items: [
      { cmd: 'cd your-project', desc: 'Move into your project, then launch' },
      { cmd: 'kimi', desc: 'Start an interactive session in this directory' },
      { cmd: '/login', desc: 'Sign in on first launch' },
      { cmd: '/init', desc: 'Generate or refresh AGENTS.md' },
      { cmd: '/plan on', desc: 'Plan before broad, risky, or unclear work' },
      { cmd: '/help', desc: 'Discover commands and shortcuts' },
      { cmd: '/compact', desc: 'Free up context when the chat gets long' },
    ],
  },
  {
    title: 'Install',
    items: [
      {
        cmd: 'curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash',
        desc: 'macOS / Linux script (recommended, no Node.js)',
      },
      { cmd: 'brew install kimi-code', desc: 'Homebrew' },
      {
        cmd: 'irm https://code.kimi.com/kimi-code/install.ps1 | iex',
        desc: 'Windows PowerShell',
      },
      {
        cmd: 'npm install -g @moonshot-ai/kimi-code',
        desc: 'npm (requires Node.js)',
      },
      { cmd: 'pnpm add -g @moonshot-ai/kimi-code', desc: 'pnpm' },
      { cmd: 'kimi --version', desc: 'Verify the install in a new terminal' },
    ],
  },
  {
    title: 'Core CLI options',
    items: [
      {
        cmd: 'kimi',
        desc: 'Start an interactive session in the current directory',
      },
      {
        cmd: 'kimi --continue',
        alias: '-C',
        desc: 'Continue the most recent session here',
      },
      {
        cmd: 'kimi --session [id]',
        alias: '-S',
        desc: 'Resume a session by ID, or open the picker',
      },
      {
        cmd: 'kimi -p "..."',
        alias: '--prompt',
        desc: 'Run a single non-interactive prompt',
      },
      {
        cmd: '--output-format stream-json',
        desc: 'Emit JSONL events for scripting (with --prompt)',
      },
      {
        cmd: 'kimi --model <model>',
        alias: '-m',
        desc: 'Start with a specific model alias',
      },
      { cmd: 'kimi --plan', desc: 'Start a new session in Plan Mode' },
      {
        cmd: 'kimi --yolo',
        alias: '-y',
        desc: 'Auto-approve regular tool calls (trusted dirs only)',
      },
      {
        cmd: 'kimi --auto',
        desc: 'Auto permission mode — approvals handled, no questions',
      },
      {
        cmd: '--skills-dir <dir>',
        desc: 'Load Skills from a specific directory',
      },
    ],
  },
  {
    title: 'CLI subcommands',
    items: [
      { cmd: 'kimi login', desc: 'OAuth device-code login without the TUI' },
      {
        cmd: 'kimi acp',
        desc: 'Run as an Agent Client Protocol server for IDEs',
      },
      {
        cmd: 'kimi server',
        desc: 'Run and manage the local REST / WebSocket service',
      },
      { cmd: 'kimi web', desc: "Open Kimi's browser UI" },
      { cmd: 'kimi doctor', desc: 'Validate config.toml and tui.toml' },
      { cmd: 'kimi export [id]', desc: 'Package a session into a ZIP archive' },
      {
        cmd: 'kimi migrate',
        desc: 'Migrate data from a legacy kimi-cli install',
      },
      { cmd: 'kimi upgrade', desc: 'Check for and install the latest version' },
      {
        cmd: 'kimi vis [id]',
        desc: 'Launch the session visualizer in your browser',
      },
      { cmd: 'kimi provider', desc: 'Manage providers from the terminal' },
    ],
  },
  {
    title: 'Slash commands · Account & config',
    items: [
      { cmd: '/login', desc: 'Select an account or platform and log in' },
      { cmd: '/logout', desc: 'Clear credentials for the current account' },
      { cmd: '/provider', desc: 'View, add, and remove configured providers' },
      { cmd: '/model', desc: 'Switch the model used in this session' },
      { cmd: '/settings', alias: '/config', desc: 'Open the settings panel' },
      {
        cmd: '/experiments',
        alias: '/experimental',
        desc: 'Open the experimental feature panel',
      },
      { cmd: '/permission', desc: 'Select a permission mode' },
      { cmd: '/editor', desc: 'Configure the Ctrl-G external editor' },
      { cmd: '/theme', desc: 'Switch the terminal UI color theme' },
    ],
  },
  {
    title: 'Slash commands · Sessions',
    items: [
      {
        cmd: '/new',
        alias: '/clear',
        desc: 'Start a fresh session, discarding context',
      },
      {
        cmd: '/sessions',
        alias: '/resume',
        desc: 'Browse history and switch session',
      },
      {
        cmd: '/tasks',
        alias: '/task',
        desc: 'Browse the background task list',
      },
      { cmd: '/fork', desc: 'Fork a new session from the current one' },
      {
        cmd: '/title [...]',
        alias: '/rename',
        desc: 'Show or set the session title',
      },
      { cmd: '/compact [...]', desc: 'Compact context; hint what to preserve' },
      { cmd: '/undo [n]', desc: 'Undo recent prompts from the active context' },
      { cmd: '/reload', desc: 'Reload the session and apply latest config' },
      { cmd: '/init', desc: 'Analyze the codebase and generate AGENTS.md' },
      {
        cmd: '/export-md [...]',
        alias: '/export',
        desc: 'Export the session as Markdown',
      },
    ],
  },
  {
    title: 'Slash commands · Modes & run control',
    items: [
      {
        cmd: '/yolo [on|off]',
        alias: '/yes',
        desc: 'Toggle YOLO mode (skip approvals)',
      },
      { cmd: '/auto [on|off]', desc: 'Toggle auto permission mode' },
      { cmd: '/plan [on|off]', desc: 'Toggle Plan Mode' },
      { cmd: '/plan clear', desc: 'Clear the current plan' },
      { cmd: '/swarm on|off', desc: 'Turn swarm mode on or off' },
      { cmd: '/goal [...]', desc: 'Start or manage an autonomous goal' },
    ],
  },
  {
    title: 'Slash commands · Info & status',
    items: [
      {
        cmd: '/help',
        alias: '/h · /?',
        desc: 'Show shortcuts and available commands',
      },
      {
        cmd: '/btw [question]',
        desc: 'Open a side chat in a forked sub-Agent',
      },
      { cmd: '/usage', desc: 'Show token usage, context, and quota' },
      { cmd: '/status', desc: 'Show version, model, directory, and mode' },
      { cmd: '/mcp', desc: 'List MCP servers and connection status' },
      { cmd: '/plugins', desc: 'Open the plugin manager' },
      { cmd: '/version', desc: 'Display the CLI version' },
      { cmd: '/feedback', desc: 'Submit product feedback' },
      { cmd: '/exit', alias: '/quit · /q', desc: 'Exit Kimi Code CLI' },
    ],
  },
  {
    title: 'Slash commands · Skills & extensions',
    items: [
      { cmd: '/mcp-config', desc: 'Configure MCP servers and OAuth login' },
      { cmd: '/custom-theme [...]', desc: 'Create or edit a custom TUI theme' },
      {
        cmd: '/update-config',
        desc: 'Inspect or edit config.toml and tui.toml',
      },
      {
        cmd: '/import-from-cc-codex',
        desc: 'Import Claude Code / Codex instructions, Skills, MCP',
      },
      {
        cmd: '/sub-skill',
        desc: 'Discover and reorganize the local Skill inventory',
      },
      { cmd: '/skill:name', desc: 'Invoke an installed external Skill' },
      {
        cmd: '/name',
        desc: 'Shortcut for a Skill with no system-command clash',
      },
    ],
  },
  {
    title: 'Built-in tools · Files, shell & web',
    items: [
      { cmd: 'Read', approval: 'auto', desc: 'Read text files' },
      { cmd: 'Write', approval: 'ask', desc: 'Create or overwrite files' },
      { cmd: 'Edit', approval: 'ask', desc: 'Replace exact file content' },
      {
        cmd: 'Grep',
        approval: 'auto',
        desc: 'Search file contents with ripgrep',
      },
      { cmd: 'Glob', approval: 'auto', desc: 'Find files by glob pattern' },
      {
        cmd: 'ReadMediaFile',
        approval: 'auto',
        desc: 'Read an image or video file',
      },
      { cmd: 'Bash', approval: 'ask', desc: 'Execute shell commands' },
      {
        cmd: 'WebSearch',
        approval: 'auto',
        desc: 'Search the web when available',
      },
      { cmd: 'FetchURL', approval: 'auto', desc: 'Fetch the content of a URL' },
    ],
  },
  {
    title: 'Built-in tools · Planning & collaboration',
    items: [
      { cmd: 'EnterPlanMode', approval: 'auto', desc: 'Enter Plan Mode' },
      {
        cmd: 'ExitPlanMode',
        approval: 'ask',
        desc: 'Exit Plan Mode and submit the plan',
      },
      { cmd: 'TodoList', approval: 'auto', desc: 'Manage a visible task list' },
      {
        cmd: 'Agent',
        approval: 'auto',
        desc: 'Spawn a sub-Agent for a focused subtask',
      },
      {
        cmd: 'AgentSwarm',
        approval: 'auto',
        desc: 'Launch or resume item-based subagents',
      },
      {
        cmd: 'AskUserQuestion',
        approval: 'auto',
        desc: 'Ask structured multiple-choice questions',
      },
      {
        cmd: 'Skill',
        approval: 'auto',
        desc: 'Invoke a registered inline Skill',
      },
    ],
  },
  {
    title: 'Built-in tools · Background & scheduled',
    items: [
      { cmd: 'TaskList', approval: 'auto', desc: 'List background tasks' },
      {
        cmd: 'TaskOutput',
        approval: 'auto',
        desc: "View a background task's output",
      },
      {
        cmd: 'TaskStop',
        approval: 'ask',
        desc: 'Stop a running background task',
      },
      {
        cmd: 'CronCreate',
        approval: 'ask',
        desc: 'Schedule a prompt to fire in the future',
      },
      { cmd: 'CronList', approval: 'auto', desc: 'List scheduled tasks' },
      { cmd: 'CronDelete', approval: 'ask', desc: 'Cancel a scheduled task' },
    ],
  },
  {
    title: 'Keyboard · General input',
    items: [
      { cmd: 'Enter', desc: 'Submit the current input' },
      { cmd: 'Shift-Enter · Ctrl-J', desc: 'Insert a newline' },
      { cmd: '↑ · ↓', desc: 'Browse input history' },
      { cmd: 'Esc', desc: 'Close a popup or interrupt streaming' },
      { cmd: 'Ctrl-C', desc: 'Interrupt output or clear the input' },
      { cmd: 'Ctrl-D', desc: 'Exit when the input box is empty' },
    ],
  },
  {
    title: 'Keyboard · Modes & editing',
    items: [
      { cmd: 'Shift-Tab', desc: 'Toggle Plan Mode' },
      { cmd: 'Ctrl-G', desc: 'Edit the current input in an external editor' },
      { cmd: 'Ctrl-V', desc: 'Paste an image or video (Unix / macOS)' },
      { cmd: 'Alt-V', desc: 'Paste an image or video (Windows)' },
      { cmd: 'Ctrl--', desc: 'Undo input edit' },
    ],
  },
  {
    title: 'Keyboard · Streaming & approvals',
    items: [
      { cmd: 'Ctrl-S', desc: 'Steer: inject input into the running turn' },
      { cmd: 'Ctrl-O', desc: 'Expand or collapse tool output' },
      { cmd: '1 – 9', desc: 'Select an approval option by number' },
      { cmd: 'Ctrl-E', desc: 'Expand / collapse diff or file preview' },
      { cmd: 'PageUp · PageDown', desc: 'Scroll a popup 10 lines at a time' },
    ],
  },
];

function ApprovalPill({ kind }: { kind: Approval }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        kind === 'auto'
          ? 'bg-surface text-muted'
          : 'border border-accent/30 text-accent'
      }`}
    >
      {kind}
    </span>
  );
}

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
              item.desc.toLowerCase().includes(q) ||
              (item.alias?.toLowerCase().includes(q) ?? false)
          );
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [query]);

  function copy(cmd: string) {
    void navigator.clipboard?.writeText(cmd).catch(() => {});
    setCopied(cmd);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.kimiCode.title')}
        desc={t(locale, 'tool.kimiCode.desc')}
      />

      <div className='relative mb-6'>
        <Search
          className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted'
          size={16}
        />
        <input
          className='h-11 w-full rounded-[12px] border border-border bg-surface pl-11 pr-4 text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(locale, 'tool.kimiCode.search')}
          type='text'
          value={query}
        />
      </div>

      <div className='space-y-5'>
        {filtered.map((section) => (
          <Panel key={section.title} label={section.title}>
            <div className='overflow-x-auto'>
              <div className='table w-full'>
                {section.items.map((item, idx) => {
                  const isCopied = copied === item.cmd;
                  const cell = `border-border px-4 py-3 align-middle transition-colors group-hover:bg-surface/50${
                    idx === 0 ? '' : ' border-t'
                  }`;
                  return (
                    <div
                      key={`${section.title}-${idx}`}
                      className='group table-row'
                    >
                      <div className={`table-cell whitespace-nowrap ${cell}`}>
                        <div className='flex items-center gap-2'>
                          <button
                            aria-label={`Copy ${item.cmd}`}
                            className='inline-flex items-center gap-2 rounded-[8px] border border-border bg-bg px-2.5 py-1 font-mono text-[13px] text-foreground transition-colors hover:border-accent/40 hover:bg-surface focus-visible:border-accent focus-visible:outline-none'
                            onClick={() => copy(item.cmd)}
                            type='button'
                          >
                            <span>{item.cmd}</span>
                            {isCopied ? (
                              <Check
                                className='shrink-0 text-accent'
                                size={13}
                              />
                            ) : (
                              <Copy
                                className='shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-70'
                                size={13}
                              />
                            )}
                          </button>
                          {item.alias ? (
                            <span className='font-mono text-[12px] text-muted'>
                              {item.alias}
                            </span>
                          ) : null}
                          {item.approval ? (
                            <ApprovalPill kind={item.approval} />
                          ) : null}
                        </div>
                      </div>
                      <div className={`table-cell w-full ${cell}`}>
                        <p className='text-[13px] leading-relaxed text-secondary'>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
        ))}

        {filtered.length === 0 && (
          <p className='py-12 text-center text-[13px] text-muted'>
            {locale === 'zh'
              ? '没有找到匹配的命令。'
              : 'No matching commands found.'}
          </p>
        )}
      </div>
    </div>
  );
}
