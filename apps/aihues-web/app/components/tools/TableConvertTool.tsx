'use client';

import { useMemo, useState } from 'react';

import { type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface TableConvertToolProps {
  locale: Locale;
}

type Delim = 'auto' | ',' | '\t' | ';';
type Format = 'markdown' | 'html' | 'json';

const SAMPLE = `name,role,city
Ada Lovelace,Engineer,London
Grace Hopper,Admiral,New York
Linus Torvalds,Maintainer,Portland`;

function detectDelim(text: string): ',' | '\t' | ';' {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  if (firstLine.includes('\t')) return '\t';
  if (firstLine.includes(';') && !firstLine.includes(',')) return ';';
  return ',';
}

function parseTable(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch === '\r') {
      // swallow; handled by \n
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || (r[0] ?? '').trim() !== '');
}

function escapeMd(cell: string): string {
  return cell.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function toMarkdown(rows: string[][], header: boolean): string {
  if (rows.length === 0) return '';
  const cols = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]) =>
    Array.from({ length: cols }, (_, i) => escapeMd((r[i] ?? '').trim()));

  const head = header
    ? pad(rows[0])
    : Array.from({ length: cols }, (_, i) => `col${i + 1}`);
  const body = header ? rows.slice(1) : rows;

  const widths = head.map((h, i) =>
    Math.max(
      h.length,
      ...body.map((r) => escapeMd((r[i] ?? '').trim()).length),
      3
    )
  );
  const line = (cells: string[]) =>
    `| ${cells.map((c, i) => c.padEnd(widths[i])).join(' | ')} |`;

  const out = [
    line(head),
    `| ${widths.map((w) => '-'.repeat(w)).join(' | ')} |`,
  ];
  for (const r of body) out.push(line(pad(r)));
  return out.join('\n');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toHtml(rows: string[][], header: boolean): string {
  if (rows.length === 0) return '';
  const cols = Math.max(...rows.map((r) => r.length));
  const cell = (r: string[], tag: 'td' | 'th') =>
    Array.from(
      { length: cols },
      (_, i) => `<${tag}>${escapeHtml((r[i] ?? '').trim())}</${tag}>`
    ).join('');
  const lines = ['<table>'];
  const body = header ? rows.slice(1) : rows;
  if (header)
    lines.push(
      `  <thead>`,
      `    <tr>${cell(rows[0], 'th')}</tr>`,
      `  </thead>`
    );
  lines.push('  <tbody>');
  for (const r of body) lines.push(`    <tr>${cell(r, 'td')}</tr>`);
  lines.push('  </tbody>', '</table>');
  return lines.join('\n');
}

function toJson(rows: string[][], header: boolean): string {
  if (rows.length === 0) return '[]';
  const cols = Math.max(...rows.map((r) => r.length));
  if (header) {
    const keys = Array.from({ length: cols }, (_, i) =>
      (rows[0][i] ?? `col${i + 1}`).trim()
    );
    const out = rows.slice(1).map((r) => {
      const obj: Record<string, string> = {};
      keys.forEach((k, i) => {
        obj[k] = (r[i] ?? '').trim();
      });
      return obj;
    });
    return JSON.stringify(out, null, 2);
  }
  return JSON.stringify(
    rows.map((r) =>
      Array.from({ length: cols }, (_, i) => (r[i] ?? '').trim())
    ),
    null,
    2
  );
}

export default function TableConvertTool({ locale }: TableConvertToolProps) {
  const zh = locale === 'zh';
  const [input, setInput] = useState(SAMPLE);
  const [delim, setDelim] = useState<Delim>('auto');
  const [header, setHeader] = useState(true);
  const [format, setFormat] = useState<Format>('markdown');

  const output = useMemo(() => {
    const d = delim === 'auto' ? detectDelim(input) : delim;
    const rows = parseTable(input, d);
    if (rows.length === 0) return '';
    if (format === 'markdown') return toMarkdown(rows, header);
    if (format === 'html') return toHtml(rows, header);
    return toJson(rows, header);
  }, [input, delim, header, format]);

  const seg =
    'h-8 rounded-[7px] px-3 text-[12px] font-semibold transition-colors';
  const segOn = 'bg-accent text-white';
  const segOff = 'text-secondary hover:text-foreground';

  const delimOpts: { v: Delim; label: string }[] = [
    { v: 'auto', label: zh ? '自动' : 'Auto' },
    { v: ',', label: zh ? '逗号' : 'Comma' },
    { v: '\t', label: 'Tab' },
    { v: ';', label: zh ? '分号' : 'Semicolon' },
  ];
  const formatOpts: { v: Format; label: string }[] = [
    { v: 'markdown', label: 'Markdown' },
    { v: 'html', label: 'HTML' },
    { v: 'json', label: 'JSON' },
  ];

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '常用小工具' : 'Utility'}
        title={zh ? '表格转换' : 'Table Converter'}
        desc={
          zh
            ? '把 CSV 或从 Excel 复制的表格转成 Markdown、HTML 或 JSON，即贴即转。'
            : 'Convert CSV or Excel-pasted data into Markdown, HTML, or JSON — paste and go.'
        }
      />

      <div className='mb-5 flex flex-wrap items-center gap-x-6 gap-y-3'>
        <div className='inline-flex items-center gap-2'>
          <span className='text-[12px] font-semibold uppercase tracking-wider text-muted'>
            {zh ? '分隔符' : 'Delimiter'}
          </span>
          <div className='inline-flex rounded-[9px] border border-border bg-surface p-1'>
            {delimOpts.map((o) => (
              <button
                key={o.v}
                type='button'
                onClick={() => setDelim(o.v)}
                className={`${seg} ${delim === o.v ? segOn : segOff}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <label className='inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-secondary'>
          <input
            type='checkbox'
            checked={header}
            onChange={(e) => setHeader(e.target.checked)}
            className='h-4 w-4 accent-accent'
          />
          {zh ? '首行为表头' : 'First row is header'}
        </label>
      </div>

      <ToolGrid>
        <Panel label={zh ? '输入 · CSV / TSV' : 'Input · CSV / TSV'}>
          <textarea
            className='min-h-[360px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={zh ? '在此粘贴表格数据…' : 'Paste table data here…'}
            value={input}
          />
        </Panel>

        <Panel
          label={zh ? '结果' : 'Output'}
          action={
            <div className='flex items-center gap-2'>
              <div className='inline-flex rounded-[9px] border border-border bg-bg p-1'>
                {formatOpts.map((o) => (
                  <button
                    key={o.v}
                    type='button'
                    onClick={() => setFormat(o.v)}
                    className={`${seg} ${format === o.v ? segOn : segOff}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {output ? <CopyButton text={output} /> : null}
            </div>
          }
        >
          <div className='min-h-[360px] flex-1 overflow-auto p-4'>
            {output ? (
              <pre className='whitespace-pre font-mono text-[13px] leading-relaxed text-foreground'>
                {output}
              </pre>
            ) : (
              <span className='text-[13px] text-muted'>
                {zh ? '转换结果将显示在这里' : 'Converted output appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
