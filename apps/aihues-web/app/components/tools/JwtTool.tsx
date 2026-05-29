'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface JwtToolProps {
  locale: Locale;
}

interface JwtParts {
  header: unknown;
  payload: unknown;
  signature: string;
  rawHeader: string;
  rawPayload: string;
}

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

function parseJWT(token: string): JwtParts | null {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return {
      header,
      payload,
      signature: parts[2],
      rawHeader: parts[0],
      rawPayload: parts[1],
    };
  } catch {
    return null;
  }
}

function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

function getExpiryStatus(payload: unknown): { expired: boolean; date?: Date } {
  if (
    payload &&
    typeof payload === 'object' &&
    'exp' in payload &&
    typeof payload.exp === 'number'
  ) {
    const date = new Date(payload.exp * 1000);
    return { expired: date.getTime() < Date.now(), date };
  }
  return { expired: false };
}

export default function JwtTool({ locale }: JwtToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<JwtParts | null>(null);
  const [error, setError] = useState('');

  const handleParse = () => {
    setError('');
    const parsed = parseJWT(input);
    if (!parsed) {
      setError('Invalid JWT format');
      setResult(null);
      return;
    }
    setResult(parsed);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const expiry = result ? getExpiryStatus(result.payload) : null;

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.jwt.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.jwt.desc')}
        </p>

        <textarea
          className='h-[160px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(locale, 'tool.jwt.placeholder')}
          value={input}
        />

        <div className='mt-4 flex gap-3'>
          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleParse}
            type='button'
          >
            {t(locale, 'tool.jwt.parse')}
          </button>
        </div>

        {error && (
          <p className='mt-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {error}
          </p>
        )}

        {result && (
          <div className='mt-6 flex flex-col gap-4'>
            {/* Expiry badge */}
            {expiry?.date && (
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  expiry.expired
                    ? 'border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'
                    : 'border border-green-200 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-950 dark:text-green-400'
                }`}
              >
                <span>{expiry.expired ? '❌' : '✅'}</span>
                <span>
                  {expiry.expired
                    ? t(locale, 'tool.jwt.expired')
                    : t(locale, 'tool.jwt.valid')}
                  {' · '}
                  {t(locale, 'tool.jwt.expiresAt')}:{' '}
                  {expiry.date.toLocaleString()}
                </span>
              </div>
            )}

            {/* Header */}
            <JwtSection
              label={t(locale, 'tool.jwt.header')}
              onCopy={() => handleCopy(formatJson(result.header))}
              value={formatJson(result.header)}
            />

            {/* Payload */}
            <JwtSection
              label={t(locale, 'tool.jwt.payload')}
              onCopy={() => handleCopy(formatJson(result.payload))}
              value={formatJson(result.payload)}
            />

            {/* Signature */}
            <div className='rounded-[14px] border border-border bg-surface p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.jwt.signature')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-bg px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={() => handleCopy(result.signature)}
                  type='button'
                >
                  {t(locale, 'tool.wordCount.copy')}
                </button>
              </div>
              <code className='block break-all font-mono text-xs text-secondary'>
                {result.signature}
              </code>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function JwtSection({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className='rounded-[14px] border border-border bg-surface'>
      <div className='flex items-center justify-between border-b border-border px-4 py-3'>
        <span className='text-sm font-semibold text-foreground'>{label}</span>
        <button
          className='rounded-[8px] border border-border bg-bg px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={onCopy}
          type='button'
        >
          Copy
        </button>
      </div>
      <pre className='overflow-auto p-4 font-mono text-xs leading-relaxed text-secondary'>
        {value}
      </pre>
    </div>
  );
}
