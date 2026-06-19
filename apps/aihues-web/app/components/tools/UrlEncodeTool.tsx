'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface UrlEncodeToolProps {
  locale: Locale;
}

export default function UrlEncodeTool({ locale }: UrlEncodeToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      setOutput(encodeURIComponent(input));
    } catch {
      setError('Invalid input for encoding');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      setOutput(decodeURIComponent(input));
    } catch {
      setError('Invalid URL-encoded input');
    }
  };

  const btn =
    'h-8 rounded-[8px] px-3 text-[12px] font-semibold transition-colors';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.urlEncode.title')}
        desc={t(locale, 'tool.urlEncode.desc')}
      />

      <ToolGrid>
        <Panel
          label={locale === 'zh' ? '输入' : 'Input'}
          action={
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={handleEncode}
                className={`${btn} bg-accent text-white hover:bg-accent-light`}
              >
                {t(locale, 'tool.urlEncode.encode')}
              </button>
              <button
                type='button'
                onClick={handleDecode}
                className={`${btn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
              >
                {t(locale, 'tool.urlEncode.decode')}
              </button>
            </div>
          }
        >
          <textarea
            className='min-h-[300px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.urlEncode.placeholder')}
            value={input}
            spellCheck={false}
          />
          {error ? (
            <div className='border-t border-border px-4 py-3 text-[13px] font-medium text-[#ff3849]'>
              {error}
            </div>
          ) : null}
        </Panel>

        <Panel
          label={t(locale, 'tool.urlEncode.result')}
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
