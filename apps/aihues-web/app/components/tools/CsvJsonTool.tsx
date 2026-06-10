'use client';

import { useState } from 'react';
import { event, GA_EVENTS } from '@/lib/gtag';

import { t, type Locale } from '@/lib/dict';

interface CsvJsonToolProps {
  locale: Locale;
}

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0]
    .split(',')
    .map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? '';
    });
    return obj;
  });
}

function toCSV(data: unknown[]): string {
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = Object.keys(data[0] as object);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = String((row as Record<string, unknown>)?.[h] ?? '');
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    })
  );
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function isJSON(text: string): boolean {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
}

export default function CsvJsonTool({ locale }: CsvJsonToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setError('');
      if (isJSON(input)) {
        const data = JSON.parse(input);
        setOutput(toCSV(data));
      } else {
        const data = parseCSV(input);
        setOutput(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    try {
      await event(GA_EVENTS.toolCopy, { tool: 'csv-json' });
      navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.csvJson.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.csvJson.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.csvJson.placeholder')}
        value={input}
      />

      <div className='mt-4 flex gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleConvert}
          type='button'
        >
          {t(locale, 'tool.csvJson.convert')}
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
              {t(locale, 'tool.csvJson.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <pre className='min-h-[120px] overflow-auto rounded-[14px] border border-border bg-surface p-5 font-mono text-sm text-foreground'>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
