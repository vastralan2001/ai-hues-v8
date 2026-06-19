'use client';

import { useState, type ReactNode } from 'react';

/** Escape + syntax-highlight a JSON string using Kimi color.syntax.* classes. */
export function highlightJsonHtml(json: string): string {
  const esc = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.replace(
    /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        cls = /:\s*$/.test(match) ? 'json-key' : 'json-string';
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

/** Highlighted, scrollable JSON code block. */
export function JsonBlock({
  json,
  className = '',
}: {
  json: string;
  className?: string;
}) {
  return (
    <pre
      className={`overflow-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightJsonHtml(json) }}
    />
  );
}

/** Copy-to-clipboard button with transient confirmation. */
export function CopyButton({
  text,
  label = 'Copy',
  className = '',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type='button'
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* ignore */
        }
      }}
      className={`inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-border bg-bg px-3 text-[12px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {copied ? '✓ Copied' : label}
    </button>
  );
}

/** Tool page header with eyebrow + title + description. */
export function ToolHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <header className='mb-8'>
      {eyebrow ? (
        <div className='mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent'>
          {eyebrow}
        </div>
      ) : null}
      <h1 className='text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-foreground'>
        {title}
      </h1>
      {desc ? (
        <p className='mt-3 max-w-[680px] text-[15px] leading-relaxed text-secondary'>
          {desc}
        </p>
      ) : null}
    </header>
  );
}

/** Labelled surface panel used as a tool input/output region. */
export function Panel({
  label,
  hint,
  action,
  children,
  accent,
  className = '',
}: {
  label?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[16px] border border-border bg-surface ${className}`}
    >
      {label ? (
        <div className='flex min-h-[60px] items-center justify-between gap-3 border-b border-border px-4 py-2'>
          <span className='flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-secondary'>
            {accent ? (
              <span
                className='inline-block h-2.5 w-2.5 rounded-full'
                style={{ background: accent }}
              />
            ) : null}
            {label}
            {hint ? (
              <span className='font-medium normal-case tracking-normal text-muted'>
                {hint}
              </span>
            ) : null}
          </span>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Page-level two-column tool layout (stacks on mobile). */
export function ToolGrid({ children }: { children: ReactNode }) {
  return (
    <div className='grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2'>
      {children}
    </div>
  );
}

export const TOOL_WRAP = 'py-10';
