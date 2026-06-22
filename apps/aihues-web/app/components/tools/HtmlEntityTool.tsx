'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface HtmlEntityToolProps {
  locale: Locale;
}

function encodeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeHtml(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export default function HtmlEntityTool({ locale }: HtmlEntityToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const btn =
    'h-8 rounded-[8px] px-3 text-[12px] font-semibold transition-colors';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.htmlEntity.title')}
        desc={t(locale, 'tool.htmlEntity.desc')}
      />

      <ToolGrid>
        <Panel
          label={locale === 'zh' ? '输入' : 'Input'}
          action={
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => setOutput(encodeHtml(input))}
                className={`${btn} bg-accent text-white hover:bg-accent-light`}
              >
                {t(locale, 'tool.htmlEntity.encode')}
              </button>
              <button
                type='button'
                onClick={() => setOutput(decodeHtml(input))}
                className={`${btn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
              >
                {t(locale, 'tool.htmlEntity.decode')}
              </button>
            </div>
          }
        >
          <textarea
            className='min-h-[300px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.htmlEntity.placeholder')}
            value={input}
            spellCheck={false}
          />
        </Panel>

        <Panel
          label={t(locale, 'tool.htmlEntity.result')}
          action={output ? <CopyButton text={output} /> : null}
        >
          <div className='min-h-[300px] flex-1 overflow-auto p-4'>
            {output ? (
              <pre className='whitespace-pre-wrap break-all font-mono text-[14px] leading-relaxed text-foreground'>
                {output}
              </pre>
            ) : (
              <span className='text-[13px] text-muted'>
                {locale === 'zh' ? '结果将显示在这里' : 'Output appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
