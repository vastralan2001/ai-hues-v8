'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface SqlToolProps {
  locale: Locale;
}

const KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE',
  'TABLE',
  'DROP',
  'ALTER',
  'INDEX',
  'VIEW',
  'JOIN',
  'LEFT',
  'RIGHT',
  'INNER',
  'OUTER',
  'ON',
  'AND',
  'OR',
  'NOT',
  'NULL',
  'IS',
  'IN',
  'EXISTS',
  'BETWEEN',
  'LIKE',
  'GROUP',
  'BY',
  'ORDER',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'UNION',
  'ALL',
  'DISTINCT',
  'AS',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'IF',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'VALUES',
  'INTO',
  'SET',
  'PRIMARY',
  'KEY',
  'FOREIGN',
  'REFERENCES',
  'DEFAULT',
  'AUTO_INCREMENT',
  'UNIQUE',
  'CHECK',
  'CONSTRAINT',
];

function formatSql(sql: string): string {
  let formatted = sql.replace(/\s+/g, ' ').trim();

  // Newline after major keywords
  const breakAfter = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'ORDER BY',
    'HAVING',
    'LIMIT',
    'VALUES',
    'SET',
  ];
  for (const kw of breakAfter) {
    const re = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(re, `\n${kw}`);
  }

  // Indent after SELECT
  formatted = formatted.replace(/\nSELECT\s+/i, '\nSELECT\n  ');

  // Indent AND/OR in WHERE
  formatted = formatted.replace(/\bAND\b/gi, '\n  AND');
  formatted = formatted.replace(/\bOR\b/gi, '\n  OR');

  // Comma spacing in SELECT
  formatted = formatted.replace(/,\s*/g, ',\n  ');

  // Trim extra whitespace
  formatted = formatted
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();

  // Uppercase keywords
  for (const kw of KEYWORDS) {
    const re = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(re, kw);
  }

  return formatted;
}

export default function SqlTool({ locale }: SqlToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleFormat() {
    setResult(formatSql(input));
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.sql.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.sql.desc')}
        </p>

        <textarea
          className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
          onChange={(e) => setInput(e.target.value)}
          placeholder='select id, name from users where active = 1 order by name'
          value={input}
        />

        <div className='mt-4 flex gap-3'>
          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleFormat}
            type='button'
          >
            {t(locale, 'tool.sql.format')}
          </button>
        </div>

        {result && (
          <div className='mt-5'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.sql.result')}
              </span>
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={copy}
                type='button'
              >
                {copied
                  ? t(locale, 'tool.copy.copied')
                  : t(locale, 'tool.wordCount.copy')}
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
    </PageShell>
  );
}
