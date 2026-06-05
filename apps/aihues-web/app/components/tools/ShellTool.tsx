'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface ShellToolProps {
  locale: Locale;
}

const COMMAND_PATTERNS: { pattern: RegExp; desc: string; descZh: string }[] = [
  {
    pattern: /^ls\b/,
    desc: 'Lists files and directories in the current location.',
    descZh: '列出当前位置的文件和目录。',
  },
  {
    pattern: /^cd\b/,
    desc: 'Changes the current working directory.',
    descZh: '切换当前工作目录。',
  },
  {
    pattern: /^pwd\b/,
    desc: 'Prints the current working directory path.',
    descZh: '显示当前工作目录路径。',
  },
  {
    pattern: /^mkdir\b/,
    desc: 'Creates a new directory.',
    descZh: '创建一个新目录。',
  },
  {
    pattern: /^rm\b/,
    desc: 'Removes files or directories. Be careful with -rf!',
    descZh: '删除文件或目录。使用 -rf 时请小心！',
  },
  {
    pattern: /^cp\b/,
    desc: 'Copies files or directories from source to destination.',
    descZh: '将文件或目录从源位置复制到目标位置。',
  },
  {
    pattern: /^mv\b/,
    desc: 'Moves or renames files or directories.',
    descZh: '移动或重命名文件或目录。',
  },
  {
    pattern: /^cat\b/,
    desc: 'Displays the contents of a file.',
    descZh: '显示文件内容。',
  },
  {
    pattern: /^grep\b/,
    desc: 'Searches for patterns in text using regular expressions.',
    descZh: '使用正则表达式在文本中搜索模式。',
  },
  {
    pattern: /^find\b/,
    desc: 'Searches for files and directories matching criteria.',
    descZh: '搜索符合条件的文件和目录。',
  },
  {
    pattern: /^chmod\b/,
    desc: 'Changes file permissions (read/write/execute).',
    descZh: '更改文件权限（读/写/执行）。',
  },
  {
    pattern: /^chown\b/,
    desc: 'Changes file owner and group.',
    descZh: '更改文件所有者和组。',
  },
  {
    pattern: /^ps\b/,
    desc: 'Displays currently running processes.',
    descZh: '显示当前正在运行的进程。',
  },
  {
    pattern: /^kill\b/,
    desc: 'Terminates a process by its ID.',
    descZh: '通过进程 ID 终止进程。',
  },
  {
    pattern: /^top\b/,
    desc: 'Displays real-time system processes and resource usage.',
    descZh: '实时显示系统进程和资源使用情况。',
  },
  {
    pattern: /^df\b/,
    desc: 'Shows disk space usage for file systems.',
    descZh: '显示文件系统的磁盘空间使用情况。',
  },
  {
    pattern: /^du\b/,
    desc: 'Estimates file and directory space usage.',
    descZh: '估算文件和目录的磁盘使用情况。',
  },
  {
    pattern: /^curl\b/,
    desc: 'Transfers data from or to a server using URLs.',
    descZh: '使用 URL 从服务器传输数据或向服务器传输数据。',
  },
  {
    pattern: /^wget\b/,
    desc: 'Downloads files from the web.',
    descZh: '从网络下载文件。',
  },
  {
    pattern: /^ssh\b/,
    desc: 'Securely connects to a remote server.',
    descZh: '安全连接到远程服务器。',
  },
  {
    pattern: /^scp\b/,
    desc: 'Securely copies files between hosts over SSH.',
    descZh: '通过 SSH 在主机之间安全复制文件。',
  },
  {
    pattern: /^tar\b/,
    desc: 'Archives and compresses files into a tarball.',
    descZh: '将文件归档并压缩为 tarball。',
  },
  {
    pattern: /^git\b/,
    desc: 'Version control command for managing code repositories.',
    descZh: '用于管理代码仓库的版本控制命令。',
  },
  {
    pattern: /^docker\b/,
    desc: 'Manages containers and container images.',
    descZh: '管理容器和容器镜像。',
  },
  {
    pattern: /^npm\b/,
    desc: 'Node.js package manager for installing dependencies.',
    descZh: 'Node.js 包管理器，用于安装依赖。',
  },
  {
    pattern: /^pip\b/,
    desc: 'Python package installer.',
    descZh: 'Python 包安装器。',
  },
  {
    pattern: /^sudo\b/,
    desc: 'Executes a command with superuser privileges.',
    descZh: '以超级用户权限执行命令。',
  },
  {
    pattern: /^echo\b/,
    desc: 'Prints text to the terminal output.',
    descZh: '将文本输出到终端。',
  },
  {
    pattern: /^man\b/,
    desc: 'Displays the manual page for a command.',
    descZh: '显示命令的手册页。',
  },
  {
    pattern: /^history\b/,
    desc: 'Shows the command history.',
    descZh: '显示命令历史。',
  },
];

function explainCommand(cmd: string, locale: Locale): string {
  const trimmed = cmd.trim();
  if (!trimmed) return '';
  const isZh = locale === 'zh';
  for (const { pattern, desc, descZh } of COMMAND_PATTERNS) {
    if (pattern.test(trimmed)) {
      return isZh ? descZh : desc;
    }
  }
  return isZh
    ? `未找到 "${trimmed.split(/\s+/)[0]}" 的已知解释。请尝试常用命令如 ls、cd、grep、git 等。`
    : `No known explanation for "${trimmed.split(/\s+/)[0]}". Try common commands like ls, cd, grep, git, etc.`;
}

export default function ShellTool({ locale }: ShellToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  function handleExplain() {
    setResult(explainCommand(input, locale));
  }

  return (
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.shell.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.shell.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.shell.input')}
          </label>
          <input
            className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
            placeholder='ls -la'
            type='text'
            value={input}
          />
        </div>

        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleExplain}
          type='button'
        >
          {t(locale, 'tool.shell.explain')}
        </button>

        {result && (
          <div className='rounded-[14px] border border-border bg-surface p-5'>
            <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
              {t(locale, 'tool.shell.result')}
            </p>
            <p className='mt-2 text-[15px] leading-relaxed text-foreground'>
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
