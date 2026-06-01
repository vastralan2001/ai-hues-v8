'use client';

import { useMemo, useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface RegexToolProps {
  locale: Locale;
}

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

const FLAG_OPTIONS = [
  { key: 'g', label: 'g (global)' },
  { key: 'i', label: 'i (ignore case)' },
  { key: 'm', label: 'm (multiline)' },
  { key: 's', label: 's (dotAll)' },
  { key: 'u', label: 'u (unicode)' },
  { key: 'y', label: 'y (sticky)' },
];

function testRegex(
  pattern: string,
  flags: string,
  text: string
): { matches: MatchResult[]; error: string } {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: MatchResult[] = [];
    let match;

    if (flags.includes('g')) {
      while ((match = regex.exec(text)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    } else {
      match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    }

    return { matches, error: '' };
  } catch (e) {
    return {
      matches: [],
      error: e instanceof Error ? e.message : 'Invalid regex',
    };
  }
}

export default function RegexTool({ locale }: RegexToolProps) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']));
  const [text, setText] = useState('');

  const flagStr = useMemo(() => Array.from(flags).join(''), [flags]);
  const { matches, error } = useMemo(
    () =>
      pattern ? testRegex(pattern, flagStr, text) : { matches: [], error: '' },
    [pattern, flagStr, text]
  );

  const toggleFlag = (flag: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  };

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.regex.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.regex.desc')}
        </p>

        {/* Pattern */}
        <div className='mb-4'>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.regex.pattern')}
          </label>
          <input
            className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t(locale, 'tool.regex.patternPlaceholder')}
            type='text'
            value={pattern}
          />
        </div>

        {/* Flags */}
        <div className='mb-4'>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.regex.flags')}
          </label>
          <div className='flex flex-wrap gap-3'>
            {FLAG_OPTIONS.map((f) => (
              <label
                className='flex cursor-pointer items-center gap-1.5 text-sm text-secondary'
                key={f.key}
              >
                <input
                  checked={flags.has(f.key)}
                  className='h-4 w-4 accent-accent'
                  onChange={() => toggleFlag(f.key)}
                  type='checkbox'
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>

        {/* Test text */}
        <div className='mb-4'>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.regex.testText')}
          </label>
          <textarea
            className='h-[160px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setText(e.target.value)}
            placeholder={t(locale, 'tool.regex.testTextPlaceholder')}
            value={text}
          />
        </div>

        {error && (
          <p className='mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {t(locale, 'tool.regex.error')}: {error}
          </p>
        )}

        {/* Matches */}
        {pattern && text && !error && (
          <div className='mt-2'>
            <h2 className='mb-3 text-sm font-semibold text-foreground'>
              {t(locale, 'tool.regex.matches')}
              {matches.length > 0 && (
                <span className='ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white'>
                  {matches.length}
                </span>
              )}
            </h2>

            {matches.length === 0 ? (
              <p className='text-sm text-secondary'>
                {t(locale, 'tool.regex.noMatches')}
              </p>
            ) : (
              <div className='flex flex-col gap-2'>
                {matches.map((m, i) => (
                  <div
                    className='rounded-[10px] border border-border bg-surface p-3'
                    key={i}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white'>
                        #{i + 1}
                      </span>
                      <code className='font-mono text-sm text-accent'>
                        {m.match}
                      </code>
                      <span className='ml-auto text-xs text-muted'>
                        index {m.index}
                      </span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className='mt-2 border-t border-border pt-2'>
                        <span className='text-xs font-semibold text-secondary'>
                          {t(locale, 'tool.regex.groups')}:
                        </span>
                        <div className='mt-1 flex flex-wrap gap-2'>
                          {m.groups.map((g, gi) => (
                            <code
                              className='rounded bg-bg px-2 py-0.5 font-mono text-xs text-foreground'
                              key={gi}
                            >
                              ${gi + 1}: {g}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
