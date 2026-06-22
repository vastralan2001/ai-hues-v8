'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

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
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.regex.title')}
        desc={t(locale, 'tool.regex.desc')}
      />

      {/* Pattern + flags */}
      <div className='mb-5 rounded-[16px] border border-border bg-surface p-4'>
        <div className='flex items-center gap-2 font-mono text-[15px]'>
          <span className='text-muted'>/</span>
          <input
            className='min-w-0 flex-1 border-0 bg-transparent text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t(locale, 'tool.regex.patternPlaceholder')}
            type='text'
            value={pattern}
          />
          <span className='text-muted'>/{flagStr}</span>
        </div>
        <div className='mt-3 flex flex-wrap gap-3 border-t border-border pt-3'>
          {FLAG_OPTIONS.map((f) => (
            <label
              className='flex cursor-pointer items-center gap-1.5 text-[13px] text-secondary'
              key={f.key}
            >
              <input
                checked={flags.has(f.key)}
                className='h-4 w-4 accent-[color:var(--accent)]'
                onChange={() => toggleFlag(f.key)}
                type='checkbox'
              />
              {f.label}
            </label>
          ))}
        </div>
        {error ? (
          <div className='mt-3 border-t border-border pt-3 text-[13px] font-medium text-[#ff3849]'>
            {t(locale, 'tool.regex.error')}: {error}
          </div>
        ) : null}
      </div>

      <ToolGrid>
        <Panel label={t(locale, 'tool.regex.testText')}>
          <textarea
            className='min-h-[340px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setText(e.target.value)}
            placeholder={t(locale, 'tool.regex.testTextPlaceholder')}
            value={text}
            spellCheck={false}
          />
        </Panel>

        <Panel
          label={t(locale, 'tool.regex.matches')}
          hint={pattern && text ? String(matches.length) : undefined}
        >
          <div className='min-h-[340px] flex-1 overflow-auto p-3'>
            {!pattern || !text ? (
              <span className='text-[13px] text-muted'>
                {locale === 'zh'
                  ? '输入正则与测试文本'
                  : 'Enter a pattern and test text'}
              </span>
            ) : matches.length === 0 ? (
              <span className='text-[13px] text-secondary'>
                {t(locale, 'tool.regex.noMatches')}
              </span>
            ) : (
              <div className='flex flex-col gap-2'>
                {matches.map((m, i) => (
                  <div
                    className='rounded-[10px] border border-border bg-bg p-3'
                    key={i}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white'>
                        #{i + 1}
                      </span>
                      <code className='font-mono text-[13px] text-accent'>
                        {m.match}
                      </code>
                      <span className='ml-auto text-[11px] text-muted'>
                        index {m.index}
                      </span>
                    </div>
                    {m.groups.length > 0 ? (
                      <div className='mt-2 flex flex-wrap gap-2 border-t border-border pt-2'>
                        {m.groups.map((g, gi) => (
                          <code
                            className='rounded bg-surface px-2 py-0.5 font-mono text-[11px] text-foreground'
                            key={gi}
                          >
                            ${gi + 1}: {g}
                          </code>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
