'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import {
  CopyButton,
  JsonBlock,
  Panel,
  ToolGrid,
  ToolHeader,
  TOOL_WRAP,
} from './_kit';

interface JwtToolProps {
  locale: Locale;
}

const SEG = {
  header: '#c2502e',
  payload: '#7c5cbf',
  signature: '#0991b6',
};

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggQ2hlbiIsImFkbWluIjp0cnVlLCJpYXQiOjE3MTYyMzkwMjIsImV4cCI6MjA2MTU4ODYyMn0.lJ8mF3kK0c0wYy7m6P0r3qj2nQ0xq8r0Zs9vL4kK1mA';

function base64UrlDecode(str: string): string {
  const padding = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding;
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return atob(base64);
  }
}

interface JwtParts {
  header: unknown;
  payload: unknown;
  signature: string;
}

function parseJWT(token: string): JwtParts | null {
  const parts = token.trim().split('.');
  if (parts.length !== 3 || !parts[0] || !parts[1]) return null;
  try {
    return {
      header: JSON.parse(base64UrlDecode(parts[0])),
      payload: JSON.parse(base64UrlDecode(parts[1])),
      signature: parts[2],
    };
  } catch {
    return null;
  }
}

function fmt(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

function getExpiry(payload: unknown): {
  exp?: Date;
  iat?: Date;
  expired?: boolean;
} {
  const out: { exp?: Date; iat?: Date; expired?: boolean } = {};
  if (payload && typeof payload === 'object') {
    const p = payload as Record<string, unknown>;
    if (typeof p.exp === 'number') {
      out.exp = new Date(p.exp * 1000);
      out.expired = out.exp.getTime() < Date.now();
    }
    if (typeof p.iat === 'number') out.iat = new Date(p.iat * 1000);
  }
  return out;
}

export default function JwtTool({ locale }: JwtToolProps) {
  const [input, setInput] = useState(SAMPLE);

  const segments = input.trim().split('.');
  const result = useMemo(() => parseJWT(input), [input]);
  const invalid = input.trim().length > 0 && !result;
  const expiry = result ? getExpiry(result.payload) : {};

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.jwt.title')}
        desc={t(locale, 'tool.jwt.desc')}
      />

      <ToolGrid>
        {/* LEFT — encoded */}
        <Panel
          label={locale === 'zh' ? '编码 JWT' : 'Encoded'}
          action={
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => setInput(SAMPLE)}
                className='h-8 rounded-[8px] border border-border bg-bg px-3 text-[12px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
              >
                {locale === 'zh' ? '示例' : 'Sample'}
              </button>
              <CopyButton text={input} />
            </div>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={t(locale, 'tool.jwt.placeholder')}
            className='min-h-[200px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
          />
          {/* Colored segment breakdown */}
          {segments.length === 3 && input.trim() ? (
            <div className='border-t border-border p-4'>
              <div className='mb-2 break-all font-mono text-[13px] leading-relaxed'>
                <span style={{ color: SEG.header }}>{segments[0]}</span>
                <span className='text-muted'>.</span>
                <span style={{ color: SEG.payload }}>{segments[1]}</span>
                <span className='text-muted'>.</span>
                <span style={{ color: SEG.signature }}>{segments[2]}</span>
              </div>
              <div className='flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.1em]'>
                <span style={{ color: SEG.header }}>
                  ● {locale === 'zh' ? '头部' : 'Header'}
                </span>
                <span style={{ color: SEG.payload }}>
                  ● {locale === 'zh' ? '载荷' : 'Payload'}
                </span>
                <span style={{ color: SEG.signature }}>
                  ● {locale === 'zh' ? '签名' : 'Signature'}
                </span>
              </div>
            </div>
          ) : null}
          {invalid ? (
            <div className='border-t border-border px-4 py-3 text-[13px] font-medium text-[#ff3849]'>
              {locale === 'zh'
                ? '无效的 JWT 格式（应为 3 段，以 . 分隔）'
                : 'Invalid JWT — expected 3 dot-separated segments'}
            </div>
          ) : null}
        </Panel>

        {/* RIGHT — decoded */}
        <div className='flex flex-col gap-5'>
          {expiry.exp ? (
            <div
              className='flex items-center gap-2 rounded-[12px] border px-4 py-3 text-[13px] font-semibold'
              style={{
                borderColor: expiry.expired
                  ? 'rgba(255,56,73,0.3)'
                  : 'rgba(22,196,86,0.3)',
                background: expiry.expired
                  ? 'rgba(255,56,73,0.08)'
                  : 'rgba(22,196,86,0.08)',
                color: expiry.expired ? '#d12a3a' : '#138a3e',
              }}
            >
              {expiry.expired
                ? `${t(locale, 'tool.jwt.expired')} · ${t(locale, 'tool.jwt.expiresAt')}: ${expiry.exp.toLocaleString()}`
                : `${t(locale, 'tool.jwt.valid')} · ${t(locale, 'tool.jwt.expiresAt')}: ${expiry.exp.toLocaleString()}`}
            </div>
          ) : null}

          <Panel
            label={t(locale, 'tool.jwt.header')}
            accent={SEG.header}
            action={result ? <CopyButton text={fmt(result.header)} /> : null}
          >
            <div className='p-4'>
              {result ? (
                <JsonBlock json={fmt(result.header)} />
              ) : (
                <p className='font-mono text-[13px] text-muted'>—</p>
              )}
            </div>
          </Panel>

          <Panel
            label={t(locale, 'tool.jwt.payload')}
            accent={SEG.payload}
            action={result ? <CopyButton text={fmt(result.payload)} /> : null}
          >
            <div className='p-4'>
              {result ? (
                <JsonBlock json={fmt(result.payload)} />
              ) : (
                <p className='font-mono text-[13px] text-muted'>—</p>
              )}
            </div>
          </Panel>

          <Panel label={t(locale, 'tool.jwt.signature')} accent={SEG.signature}>
            <div className='p-4'>
              <code className='block break-all font-mono text-[13px] text-secondary'>
                {result ? result.signature || '(empty)' : '—'}
              </code>
            </div>
          </Panel>
        </div>
      </ToolGrid>
    </div>
  );
}
