'use client';

import { useEffect, useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolHeader, TOOL_WRAP } from './_kit';

interface PasswordToolProps {
  locale: Locale;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length: number, chars: string): string {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join('');
}

function calculateStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return { score, label: labels[score] ?? 'Very Weak' };
}

export default function PasswordTool({ locale }: PasswordToolProps) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const chars = useMemo(() => {
    let c = '';
    if (useUpper) c += CHAR_SETS.uppercase;
    if (useLower) c += CHAR_SETS.lowercase;
    if (useNumbers) c += CHAR_SETS.numbers;
    if (useSymbols) c += CHAR_SETS.symbols;
    return c;
  }, [useUpper, useLower, useNumbers, useSymbols]);

  const strength = useMemo(() => calculateStrength(password), [password]);

  const handleGenerate = () => {
    if (chars.length === 0) return;
    setPassword(generatePassword(length, chars));
  };

  useEffect(() => {
    const all =
      CHAR_SETS.uppercase +
      CHAR_SETS.lowercase +
      CHAR_SETS.numbers +
      CHAR_SETS.symbols;
    const raf = requestAnimationFrame(() =>
      setPassword(generatePassword(16, all))
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  const strengthColors = [
    '#ff3849',
    '#ff3849',
    '#ff9500',
    '#f5a623',
    '#16c456',
    '#16c456',
  ];

  const opts: { v: boolean; set: (b: boolean) => void; key: string }[] = [
    { v: useUpper, set: setUseUpper, key: 'tool.password.uppercase' },
    { v: useLower, set: setUseLower, key: 'tool.password.lowercase' },
    { v: useNumbers, set: setUseNumbers, key: 'tool.password.numbers' },
    { v: useSymbols, set: setUseSymbols, key: 'tool.password.symbols' },
  ];

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.password.title')}
        desc={t(locale, 'tool.password.desc')}
      />

      {/* Password output */}
      <div className='mb-5 rounded-[16px] border border-border bg-surface p-5'>
        <div className='flex items-center gap-3'>
          <code className='min-w-0 flex-1 break-all font-mono text-[20px] text-foreground'>
            {password || '—'}
          </code>
          <button
            type='button'
            onClick={handleGenerate}
            aria-label='Regenerate'
            className='shrink-0 rounded-[10px] border border-border bg-bg px-3 py-2 text-[13px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
          >
            ↻
          </button>
          <CopyButton text={password} className='h-9' />
        </div>
        {password ? (
          <div className='mt-4'>
            <div className='mb-1.5 flex items-center justify-between text-[12px]'>
              <span className='font-semibold uppercase tracking-[0.1em] text-secondary'>
                {t(locale, 'tool.password.strength')}
              </span>
              <span className='font-bold text-foreground'>
                {strength.label}
              </span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-[color:var(--border)]'>
              <div
                className='h-full transition-all duration-300'
                style={{
                  width: `${(strength.score / 6) * 100}%`,
                  background: strengthColors[strength.score],
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <Panel label={locale === 'zh' ? '选项' : 'Options'}>
        <div className='grid gap-4 p-5 sm:grid-cols-2'>
          <label className='flex items-center gap-3 text-[14px] text-foreground'>
            <span>{t(locale, 'tool.password.length')}</span>
            <input
              className='h-9 w-20 rounded-[8px] border border-border bg-bg px-3 text-center text-foreground focus:border-accent focus:outline-none'
              max={64}
              min={4}
              onChange={(e) => setLength(Number(e.target.value))}
              type='number'
              value={length}
            />
          </label>
          {opts.map((o) => (
            <label
              key={o.key}
              className='flex cursor-pointer items-center gap-2 text-[14px] text-foreground'
            >
              <input
                checked={o.v}
                className='h-4 w-4 accent-[color:var(--accent)]'
                onChange={(e) => o.set(e.target.checked)}
                type='checkbox'
              />
              {t(locale, o.key)}
            </label>
          ))}
        </div>
        <div className='border-t border-border p-4'>
          <button
            className='h-10 w-full rounded-[10px] bg-accent text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.password.generate')}
          </button>
        </div>
      </Panel>
    </div>
  );
}
