'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface Base64ToolProps {
  locale: Locale;
}

export default function Base64Tool({ locale }: Base64ToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      let encoded = btoa(unescape(encodeURIComponent(input)));
      if (urlSafe) {
        encoded = encoded
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      }
      setOutput(encoded);
    } catch {
      setError('Invalid input for encoding');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      let decoded = input;
      if (urlSafe) {
        decoded = decoded.replace(/-/g, '+').replace(/_/g, '/');
        while (decoded.length % 4) decoded += '=';
      }
      setOutput(decodeURIComponent(escape(atob(decoded))));
    } catch {
      setError('Invalid Base64 input');
    }
  };

  const btn =
    'h-8 rounded-[8px] px-3 text-[12px] font-semibold transition-colors';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.base64.title')}
        desc={t(locale, 'tool.base64.desc')}
      />

      <ToolGrid>
        <Panel
          label={locale === 'zh' ? '输入' : 'Input'}
          action={
            <div className='flex items-center gap-2'>
              <button
                type='button'
                data-testid='base64-encode'
                onClick={handleEncode}
                className={`${btn} bg-accent text-white hover:bg-accent-light`}
              >
                {t(locale, 'tool.base64.encode')}
              </button>
              <button
                type='button'
                onClick={handleDecode}
                className={`${btn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
              >
                {t(locale, 'tool.base64.decode')}
              </button>
            </div>
          }
        >
          <textarea
            className='min-h-[300px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            data-testid='base64-input'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.base64.placeholder')}
            value={input}
            spellCheck={false}
          />
          <label className='flex cursor-pointer items-center gap-2 border-t border-border px-4 py-3 text-[13px] text-secondary'>
            <input
              checked={urlSafe}
              className='h-4 w-4 accent-[color:var(--accent)]'
              onChange={(e) => setUrlSafe(e.target.checked)}
              type='checkbox'
            />
            {t(locale, 'tool.base64.urlSafe')}
          </label>
          {error ? (
            <div className='border-t border-border px-4 py-3 text-[13px] font-medium text-[#ff3849]'>
              {error}
            </div>
          ) : null}
        </Panel>

        <Panel
          label={t(locale, 'tool.base64.result')}
          action={output ? <CopyButton text={output} /> : null}
        >
          <div
            className='min-h-[300px] flex-1 overflow-auto p-4'
            data-testid='base64-output'
          >
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
