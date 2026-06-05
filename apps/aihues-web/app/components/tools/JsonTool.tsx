'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface JsonToolProps {
  locale: Locale;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightJson(json: string): string {
  const escaped = escapeHtml(json);
  return escaped
    .replace(
      /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"\s*:\s*)/g,
      '<span class="json-key">$1</span>'
    )
    .replace(
      /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")/g,
      '<span class="json-string">$1</span>'
    )
    .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
    .replace(/\b(null)\b/g, '<span class="json-null">$1</span>')
    .replace(
      /\b(\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g,
      '<span class="json-number">$1</span>'
    );
}

export default function JsonTool({ locale }: JsonToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      setError('');
      const obj = JSON.parse(input);
      const formatted = JSON.stringify(obj, null, 2);
      setOutput(highlightJson(formatted));
    } catch (e) {
      setError(
        `${t(locale, 'tool.json.invalid')}: ${e instanceof Error ? e.message : ''}`
      );
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      setError('');
      const obj = JSON.parse(input);
      const minified = JSON.stringify(obj);
      setOutput(highlightJson(minified));
    } catch (e) {
      setError(
        `${t(locale, 'tool.json.invalid')}: ${e instanceof Error ? e.message : ''}`
      );
      setOutput('');
    }
  };

  const handleValidate = () => {
    try {
      setError('');
      JSON.parse(input);
      setOutput('<span class="json-boolean">true</span> /* Valid JSON */');
    } catch (e) {
      setError(
        `${t(locale, 'tool.json.invalid')}: ${e instanceof Error ? e.message : ''}`
      );
      setOutput('');
    }
  };

  const handleCopy = async () => {
    try {
      const text = output.replace(/<[^>]+>/g, '');
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.json.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.json.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.json.placeholder')}
        value={input}
      />

      <div className='mt-4 flex flex-wrap gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleFormat}
          type='button'
        >
          {t(locale, 'tool.json.format')}
        </button>
        <button
          className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={handleMinify}
          type='button'
        >
          {t(locale, 'tool.json.minify')}
        </button>
        <button
          className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={handleValidate}
          type='button'
        >
          {t(locale, 'tool.json.validate')}
        </button>
      </div>

      {error && (
        <p className='mt-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
          {error}
        </p>
      )}

      {output && (
        <div className='mt-5'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.json.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <pre
            className='min-h-[120px] overflow-auto rounded-[14px] border border-border bg-surface p-5 font-mono text-sm leading-relaxed'
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      )}
    </div>
  );
}
