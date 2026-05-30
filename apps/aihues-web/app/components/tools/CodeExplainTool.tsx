'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface CodeExplainToolProps {
  locale: Locale;
}

const PATTERNS: Record<string, { pattern: RegExp; desc: string; descZh: string }[]> = {
  javascript: [
    { pattern: /map\s*\(/, desc: 'Transforms each element of an array using a callback function.', descZh: '使用回调函数转换数组的每个元素。' },
    { pattern: /filter\s*\(/, desc: 'Creates a new array with elements that pass a test.', descZh: '创建一个新数组，包含通过测试的元素。' },
    { pattern: /reduce\s*\(/, desc: 'Reduces an array to a single value by applying a function.', descZh: '通过应用函数将数组缩减为单个值。' },
    { pattern: /fetch\s*\(/, desc: 'Makes an HTTP request to a server.', descZh: '向服务器发起 HTTP 请求。' },
    { pattern: /async\s+function/, desc: 'Defines an asynchronous function that returns a Promise.', descZh: '定义一个返回 Promise 的异步函数。' },
    { pattern: /await\s+/, desc: 'Pauses execution until a Promise resolves.', descZh: '暂停执行，直到 Promise 被解决。' },
    { pattern: /Promise\s*\(/, desc: 'Represents a value that may be available now, later, or never.', descZh: '表示一个可能现在、将来或永远不会可用的值。' },
    { pattern: /setTimeout\s*\(/, desc: 'Executes code after a specified delay.', descZh: '在指定延迟后执行代码。' },
    { pattern: /JSON\.parse\s*\(/, desc: 'Parses a JSON string into a JavaScript object.', descZh: '将 JSON 字符串解析为 JavaScript 对象。' },
    { pattern: /JSON\.stringify\s*\(/, desc: 'Converts a JavaScript object to a JSON string.', descZh: '将 JavaScript 对象转换为 JSON 字符串。' },
  ],
  python: [
    { pattern: /list comprehension/, desc: 'Creates a list using a compact for-loop syntax.', descZh: '使用紧凑的 for 循环语法创建列表。' },
    { pattern: /def\s+\w+\s*\(/, desc: 'Defines a function.', descZh: '定义一个函数。' },
    { pattern: /import\s+/, desc: 'Imports a module or specific items from a module.', descZh: '导入模块或模块中的特定项。' },
    { pattern: /with\s+open\s*\(/, desc: 'Opens a file and ensures it is properly closed.', descZh: '打开文件并确保正确关闭。' },
    { pattern: /try\s*:/, desc: 'Starts a block of code to catch exceptions.', descZh: '开始一个捕获异常的代码块。' },
    { pattern: /class\s+\w+/, desc: 'Defines a new class.', descZh: '定义一个新类。' },
    { pattern: /lambda\s+/, desc: 'Creates an anonymous inline function.', descZh: '创建一个匿名内联函数。' },
    { pattern: /@\w+/, desc: 'Applies a decorator to a function or class.', descZh: '将装饰器应用于函数或类。' },
  ],
  sql: [
    { pattern: /SELECT\s+/i, desc: 'Retrieves data from one or more tables.', descZh: '从一个或多个表中检索数据。' },
    { pattern: /INSERT\s+INTO/i, desc: 'Adds new rows to a table.', descZh: '向表中添加新行。' },
    { pattern: /UPDATE\s+/i, desc: 'Modifies existing data in a table.', descZh: '修改表中的现有数据。' },
    { pattern: /DELETE\s+FROM/i, desc: 'Removes rows from a table.', descZh: '从表中删除行。' },
    { pattern: /JOIN\s+/i, desc: 'Combines rows from two or more tables.', descZh: '合并两个或多个表的行。' },
    { pattern: /GROUP\s+BY/i, desc: 'Groups rows with the same values into summary rows.', descZh: '将具有相同值的行分组为汇总行。' },
    { pattern: /ORDER\s+BY/i, desc: 'Sorts the result set by specified columns.', descZh: '按指定列对结果集进行排序。' },
  ],
};

function explainCode(code: string, language: string, locale: Locale): string {
  const isZh = locale === 'zh';
  const patterns = PATTERNS[language] || PATTERNS.javascript;
  const explanations: string[] = [];
  for (const { pattern, desc, descZh } of patterns) {
    if (pattern.test(code)) {
      explanations.push(isZh ? descZh : desc);
    }
  }
  if (explanations.length === 0) {
    return isZh
      ? '未识别到常见模式。请尝试包含 map、filter、fetch 等常见 API 调用的代码。'
      : 'No common patterns recognized. Try code with common API calls like map, filter, fetch, etc.';
  }
  return explanations.join('\n\n');
}

export default function CodeExplainTool({ locale }: CodeExplainToolProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');

  function handleExplain() {
    setResult(explainCode(input, language, locale));
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.codeExplain.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.codeExplain.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.codeExplain.language')}
            </label>
            <select
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
              onChange={(e) => setLanguage(e.target.value)}
              value={language}
            >
              <option value='javascript'>JavaScript / TypeScript</option>
              <option value='python'>Python</option>
              <option value='sql'>SQL</option>
            </select>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.codeExplain.input')}
            </label>
            <textarea
              className='h-[200px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleExplain}
            type='button'
          >
            {t(locale, 'tool.codeExplain.explain')}
          </button>

          {result && (
            <div className='rounded-[14px] border border-border bg-surface p-5'>
              <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                {t(locale, 'tool.codeExplain.result')}
              </p>
              <div className='mt-2 space-y-3'>
                {result.split('\n\n').map((line, i) => (
                  <p key={i} className='text-[15px] leading-relaxed text-foreground'>
                    • {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
