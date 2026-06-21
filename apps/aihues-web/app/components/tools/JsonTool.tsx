'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import {
  CopyButton,
  highlightJsonHtml,
  Panel,
  ToolGrid,
  ToolHeader,
  TOOL_WRAP,
} from './_kit';

interface JsonToolProps {
  locale: Locale;
}

export default function JsonTool({ locale }: JsonToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [plain, setPlain] = useState('');
  const [error, setError] = useState('');

  const run = (mode: 'format' | 'minify' | 'validate') => {
    try {
      setError('');
      const obj = JSON.parse(input);
      if (mode === 'validate') {
        setPlain('true');
        setOutput('<span class="json-boolean">true</span> /* Valid JSON */');
        return;
      }
      const text =
        mode === 'minify' ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
      setPlain(text);
      setOutput(highlightJsonHtml(text));
    } catch (e) {
      setError(
        `${t(locale, 'tool.json.invalid')}: ${e instanceof Error ? e.message : ''}`
      );
      setOutput('');
      setPlain('');
    }
  };

  const btn =
    'h-8 rounded-[8px] px-3 text-[12px] font-semibold transition-colors';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.json.title')}
        desc={t(locale, 'tool.json.desc')}
      />

      <ToolGrid>
        {/* Input */}
        <Panel
          label={locale === 'zh' ? '输入' : 'Input'}
          action={
            <div className='flex gap-2'>
              <button
                type='button'
                data-testid='json-format'
                onClick={() => run('format')}
                className={`${btn} bg-accent text-white hover:bg-accent-light`}
              >
                {t(locale, 'tool.json.format')}
              </button>
              <button
                type='button'
                onClick={() => run('minify')}
                className={`${btn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
              >
                {t(locale, 'tool.json.minify')}
              </button>
              <button
                type='button'
                onClick={() => run('validate')}
                className={`${btn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
              >
                {t(locale, 'tool.json.validate')}
              </button>
            </div>
          }
        >
          <textarea
            className='min-h-[340px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            data-testid='json-input'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.json.placeholder')}
            value={input}
            spellCheck={false}
          />
          {error ? (
            <div className='border-t border-border px-4 py-3 text-[13px] font-medium text-[#ff3849]'>
              {error}
            </div>
          ) : null}
        </Panel>

        {/* Output */}
        <Panel
          label={t(locale, 'tool.json.result')}
          action={plain ? <CopyButton text={plain} /> : null}
        >
          {output ? (
            <pre
              className='min-h-[340px] flex-1 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed'
              data-testid='json-output'
              dangerouslySetInnerHTML={{ __html: output }}
            />
          ) : (
            <div
              className='flex min-h-[340px] flex-1 items-center justify-center p-4 text-[13px] text-muted'
              data-testid='json-output'
            >
              {locale === 'zh'
                ? '格式化结果将显示在这里'
                : 'Formatted output appears here'}
            </div>
          )}
        </Panel>
      </ToolGrid>
    </div>
  );
}
