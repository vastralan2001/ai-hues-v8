'use client';

import { useMemo, useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      // ignore
    }
  };

  const strengthColors = [
    'bg-red-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-emerald-500',
  ];

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.password.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.password.desc')}
        </p>

        {/* Options */}
        <div className='mb-6 grid gap-4 rounded-[14px] border border-border bg-surface p-5 sm:grid-cols-2'>
          <label className='flex items-center gap-3 text-sm text-foreground'>
            <span>{t(locale, 'tool.password.length')}</span>
            <input
              className='h-9 w-20 rounded-[8px] border border-border bg-bg px-3 text-center focus:border-accent focus:outline-none'
              max={64}
              min={4}
              onChange={(e) => setLength(Number(e.target.value))}
              type='number'
              value={length}
            />
          </label>
          <label className='flex cursor-pointer items-center gap-2 text-sm text-foreground'>
            <input
              checked={useUpper}
              className='h-4 w-4 accent-accent'
              onChange={(e) => setUseUpper(e.target.checked)}
              type='checkbox'
            />
            {t(locale, 'tool.password.uppercase')}
          </label>
          <label className='flex cursor-pointer items-center gap-2 text-sm text-foreground'>
            <input
              checked={useLower}
              className='h-4 w-4 accent-accent'
              onChange={(e) => setUseLower(e.target.checked)}
              type='checkbox'
            />
            {t(locale, 'tool.password.lowercase')}
          </label>
          <label className='flex cursor-pointer items-center gap-2 text-sm text-foreground'>
            <input
              checked={useNumbers}
              className='h-4 w-4 accent-accent'
              onChange={(e) => setUseNumbers(e.target.checked)}
              type='checkbox'
            />
            {t(locale, 'tool.password.numbers')}
          </label>
          <label className='flex cursor-pointer items-center gap-2 text-sm text-foreground'>
            <input
              checked={useSymbols}
              className='h-4 w-4 accent-accent'
              onChange={(e) => setUseSymbols(e.target.checked)}
              type='checkbox'
            />
            {t(locale, 'tool.password.symbols')}
          </label>
        </div>

        <button
          className='rounded-[10px] bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleGenerate}
          type='button'
        >
          {t(locale, 'tool.password.generate')}
        </button>

        {password && (
          <div className='mt-6'>
            <div className='flex items-center gap-3 rounded-[14px] border border-border bg-surface px-5 py-4'>
              <code className='flex-1 break-all font-mono text-lg text-foreground'>
                {password}
              </code>
              <button
                className='rounded-[8px] border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={handleCopy}
                type='button'
              >
                {t(locale, 'tool.password.copy')}
              </button>
            </div>

            {/* Strength bar */}
            <div className='mt-3'>
              <div className='mb-1 flex items-center justify-between text-xs'>
                <span className='font-semibold text-secondary'>
                  {t(locale, 'tool.password.strength')}
                </span>
                <span className='font-bold text-foreground'>
                  {strength.label}
                </span>
              </div>
              <div className='h-2 w-full overflow-hidden rounded-full bg-border'>
                <div
                  className={`h-full transition-all duration-300 ${strengthColors[strength.score]}`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
