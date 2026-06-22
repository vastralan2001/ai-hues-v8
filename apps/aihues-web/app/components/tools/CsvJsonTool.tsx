'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

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
    return Array.isArray(JSON.parse(text));
  } catch {
    return false;
  }
}

export default function CsvJsonTool({ locale }: CsvJsonToolProps) {
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      if (isJSON(input)) {
        return { output: toCSV(JSON.parse(input)), error: '' };
      }
      return { output: JSON.stringify(parseCSV(input), null, 2), error: '' };
    } catch (e) {
      return {
        output: '',
        error: e instanceof Error ? e.message : 'Conversion failed',
      };
    }
  }, [input]);

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.csvJson.title')}
        desc={t(locale, 'tool.csvJson.desc')}
      />

      <ToolGrid>
        <Panel
          label={locale === 'zh' ? 'CSV 或 JSON' : 'CSV or JSON'}
          hint={
            input.trim()
              ? isJSON(input)
                ? 'JSON → CSV'
                : 'CSV → JSON'
              : undefined
          }
        >
          <textarea
            className='min-h-[340px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.csvJson.placeholder')}
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
          label={t(locale, 'tool.csvJson.result')}
          action={output ? <CopyButton text={output} /> : null}
        >
          <pre className='min-h-[340px] flex-1 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed text-foreground'>
            {output || (
              <span className='text-muted'>
                {locale === 'zh' ? '结果将显示在这里' : 'Output appears here'}
              </span>
            )}
          </pre>
        </Panel>
      </ToolGrid>
    </div>
  );
}
