'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface IpLookupToolProps {
  locale: Locale;
}

function validateIp(ip: string): {
  valid: boolean;
  type: string;
  typeZh: string;
  networkClass: string;
} {
  const parts = ip.split('.');
  if (parts.length !== 4)
    return { valid: false, type: '', typeZh: '', networkClass: '' };

  const nums = parts.map((p) => parseInt(p, 10));
  if (nums.some((n) => isNaN(n) || n < 0 || n > 255)) {
    return { valid: false, type: '', typeZh: '', networkClass: '' };
  }

  const [a, b, c, d] = nums;
  let type = 'public';
  let typeZh = '公网';

  if (a === 127) {
    type = 'loopback';
    typeZh = '回环';
  } else if (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  ) {
    type = 'private';
    typeZh = '私有';
  } else if (a === 255 && b === 255 && c === 255 && d === 255) {
    type = 'broadcast';
    typeZh = '广播';
  }

  let networkClass = 'A';
  if (a >= 128 && a <= 191) networkClass = 'B';
  else if (a >= 192 && a <= 223) networkClass = 'C';
  else if (a >= 224 && a <= 239) networkClass = 'D';
  else if (a >= 240) networkClass = 'E';

  return { valid: true, type, typeZh, networkClass };
}

export default function IpLookupTool({ locale }: IpLookupToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ReturnType<typeof validateIp> | null>(
    null
  );

  function handleValidate() {
    setResult(validateIp(input.trim()));
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[700px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.ipLookup.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.ipLookup.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.ipLookup.input')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
              placeholder='192.168.1.1'
              type='text'
              value={input}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleValidate}
            type='button'
          >
            {t(locale, 'tool.ipLookup.validate')}
          </button>

          {result && (
            <div className='space-y-3'>
              <div
                className={`rounded-[14px] border p-4 text-center ${
                  result.valid
                    ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                    : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
                }`}
              >
                <p className='text-sm font-semibold'>
                  {result.valid
                    ? t(locale, 'tool.ipLookup.valid')
                    : t(locale, 'tool.ipLookup.invalid')}
                </p>
              </div>

              {result.valid && (
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
                    <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                      {t(locale, 'tool.ipLookup.type')}
                    </p>
                    <p className='mt-1 text-xl font-extrabold text-accent'>
                      {locale === 'zh'
                        ? result.typeZh
                        : t(locale, `tool.ipLookup.${result.type}`)}
                    </p>
                  </div>
                  <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
                    <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                      {t(locale, 'tool.ipLookup.networkClass')}
                    </p>
                    <p className='mt-1 text-xl font-extrabold text-accent'>
                      Class {result.networkClass}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
