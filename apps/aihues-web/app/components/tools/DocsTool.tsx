'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface DocsToolProps {
  locale: Locale;
}

function generateDocs(signature: string, language: string, locale: Locale): string {
  const isZh = locale === 'zh';

  // Extract function name
  const nameMatch = signature.match(/(?:function\s+|def\s+)?(\w+)\s*\(/);
  const name = nameMatch ? nameMatch[1] : 'function';

  // Extract parameters
  const paramsMatch = signature.match(/\(([^)]*)\)/);
  const params = paramsMatch
    ? paramsMatch[1]
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p)
    : [];

  if (language === 'python') {
    const paramLines = params
      .map((p) => {
        const [paramName] = p.split(/[=:]/);
        return `    ${paramName.trim()} -- description`;
      })
      .join('\n');

    return isZh
      ? `def ${name}(${paramsMatch ? paramsMatch[1] : ''}):
    """
    简要描述 ${name} 的功能。

    参数:
${paramLines || '    无'}

    返回:
        返回值描述
    """`
      : `def ${name}(${paramsMatch ? paramsMatch[1] : ''}):
    """
    Brief description of ${name}.

    Args:
${paramLines || '    None'}

    Returns:
        Description of return value
    """`;
  }

  const paramLines = params
    .map((p) => {
      const [paramName] = p.split(/[=:]/);
      return ` * @param {paramName.trim()} - description`;
    })
    .join('\n');

  return isZh
    ? `/**
 * 简要描述 ${name} 的功能。
 *
${paramLines || ' * 无参数'}
 * @returns 返回值描述
 */
${signature}`
    : `/**
 * Brief description of ${name}.
 *
${paramLines || ' * No parameters'}
 * @returns Description of return value
 */
${signature}`;
}

export default function DocsTool({ locale }: DocsToolProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setResult(generateDocs(input, language, locale));
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.docs.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.docs.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.docs.language')}
            </label>
            <select
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
              onChange={(e) => setLanguage(e.target.value)}
              value={language}
            >
              <option value='javascript'>JavaScript / TypeScript</option>
              <option value='python'>Python</option>
            </select>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.docs.input')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              placeholder="function calculateTotal(price, quantity, tax = 0.1)"
              type='text'
              value={input}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.docs.generate')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.docs.result')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={copy}
                  type='button'
                >
                  {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                </button>
              </div>
              <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5'>
                <pre className='whitespace-pre-wrap font-mono text-sm text-foreground'>
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
