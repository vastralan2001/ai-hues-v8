'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface FullwidthToolProps {
  locale: Locale;
}

function toFullwidth(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code === 0x20) return '　';
      if (code >= 0x21 && code <= 0x7e) {
        return String.fromCharCode(code + 0xfee0);
      }
      return char;
    })
    .join('');
}

function toHalfwidth(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code === 0x3000) return ' ';
      if (code >= 0xff01 && code <= 0xff5e) {
        return String.fromCharCode(code - 0xfee0);
      }
      return char;
    })
    .join('');
}

export default function FullwidthTool({ locale }: FullwidthToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const btn =
    'h-8 rounded-[8px] px-3 text-[12px] font-semibold transition-colors';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.utility')}
        title={t(locale, 'tool.fullwidth.title')}
        desc={t(locale, 'tool.fullwidth.desc')}
      />

      <ToolGrid>
        <Panel
          label={locale === 'zh' ? '输入' : 'Input'}
          action={
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => setOutput(toFullwidth(input))}
                className={`${btn} bg-accent text-white hover:bg-accent-light`}
              >
                {t(locale, 'tool.fullwidth.toFull')}
              </button>
              <button
                type='button'
                onClick={() => setOutput(toHalfwidth(input))}
                className={`${btn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
              >
                {t(locale, 'tool.fullwidth.toHalf')}
              </button>
            </div>
          }
        >
          <textarea
            className='min-h-[300px] w-full flex-1 resize-y border-0 bg-transparent p-4 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.fullwidth.placeholder')}
            value={input}
          />
        </Panel>

        <Panel
          label={t(locale, 'tool.fullwidth.result')}
          action={output ? <CopyButton text={output} /> : null}
        >
          <div className='min-h-[300px] flex-1 overflow-auto p-4'>
            {output ? (
              <pre className='whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground'>
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
