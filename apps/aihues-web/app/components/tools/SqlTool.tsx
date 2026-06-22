'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

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
  function handleFormat() {
    setResult(formatSql(input));
  }

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.sql.title')}
        desc={t(locale, 'tool.sql.desc')}
      />

      <ToolGrid>
        <Panel
          label={locale === 'zh' ? 'SQL 输入' : 'SQL input'}
          action={
            <button
              type='button'
              onClick={handleFormat}
              className='h-8 rounded-[8px] bg-accent px-3 text-[12px] font-semibold text-white transition-colors hover:bg-accent-light'
            >
              {t(locale, 'tool.sql.format')}
            </button>
          }
        >
          <textarea
            className='min-h-[320px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder='select id, name from users where active = 1 order by name'
            value={input}
            spellCheck={false}
          />
        </Panel>

        <Panel
          label={t(locale, 'tool.sql.result')}
          action={result ? <CopyButton text={result} /> : null}
        >
          <div className='min-h-[320px] flex-1 overflow-auto p-4'>
            {result ? (
              <pre className='whitespace-pre-wrap font-mono text-[14px] leading-relaxed text-foreground'>
                {result}
              </pre>
            ) : (
              <span className='text-[13px] text-muted'>
                {locale === 'zh'
                  ? '格式化结果将显示在这里'
                  : 'Formatted SQL appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
