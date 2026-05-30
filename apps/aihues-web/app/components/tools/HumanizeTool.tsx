'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface HumanizeToolProps {
  locale: Locale;
}

function humanize(text: string, locale: Locale): string {
  let result = text;

  // Replace overly formal phrases
  const replacements: [RegExp, string, string][] = [
    [/It is important to note that/gi, 'Keep in mind that', '请注意'],
    [/It should be noted that/gi, 'You should know that', '您应该知道'],
    [/In conclusion/gi, 'So, to wrap this up', '所以，总结一下'],
    [/Furthermore/gi, 'Also', '此外'],
    [/Moreover/gi, 'What\'s more', '更重要的是'],
    [/Nevertheless/gi, 'Even so', '即便如此'],
    [/Consequently/gi, 'As a result', '结果是'],
    [/Therefore/gi, 'So', '所以'],
    [/In order to/gi, 'To', '为了'],
    [/Due to the fact that/gi, 'Because', '因为'],
    [/In the event that/gi, 'If', '如果'],
    [/At this point in time/gi, 'Right now', '现在'],
    [/With regard to/gi, 'About', '关于'],
    [/In accordance with/gi, 'Following', '按照'],
    [/Subsequently/gi, 'After that', '之后'],
    [/Additionally/gi, 'Plus', '另外'],
    [/Utilize/gi, 'Use', '使用'],
    [/Leverage/gi, 'Use', '使用'],
    [/Implement/gi, 'Put in place', '实施'],
    [/Facilitate/gi, 'Help', '帮助'],
  ];

  for (const [pattern, en, zh] of replacements) {
    result = result.replace(pattern, locale === 'zh' ? zh : en);
  }

  // Add contractions if English
  if (locale !== 'zh') {
    result = result
      .replace(/do not/gi, 'don\'t')
      .replace(/does not/gi, 'doesn\'t')
      .replace(/did not/gi, 'didn\'t')
      .replace(/will not/gi, 'won\'t')
      .replace(/cannot/gi, 'can\'t')
      .replace(/is not/gi, 'isn\'t')
      .replace(/are not/gi, 'aren\'t')
      .replace(/was not/gi, 'wasn\'t')
      .replace(/were not/gi, 'weren\'t')
      .replace(/has not/gi, 'hasn\'t')
      .replace(/have not/gi, 'haven\'t')
      .replace(/had not/gi, 'hadn\'t')
      .replace(/would not/gi, 'wouldn\'t')
      .replace(/could not/gi, 'couldn\'t')
      .replace(/should not/gi, 'shouldn\'t')
      .replace(/I am/gi, 'I\'m')
      .replace(/you are/gi, 'you\'re')
      .replace(/they are/gi, 'they\'re')
      .replace(/we are/gi, 'we\'re')
      .replace(/it is/gi, 'it\'s')
      .replace(/that is/gi, 'that\'s')
      .replace(/there is/gi, 'there\'s')
      .replace(/what is/gi, 'what\'s');
  }

  return result;
}

export default function HumanizeTool({ locale }: HumanizeToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleHumanize() {
    setResult(humanize(input, locale));
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.humanize.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.humanize.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.humanize.input')}
            </label>
            <textarea
              className='h-[200px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleHumanize}
            type='button'
          >
            {t(locale, 'tool.humanize.humanize')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.humanize.result')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={copy}
                  type='button'
                >
                  {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                </button>
              </div>
              <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5'>
                <p className='whitespace-pre-wrap text-[15px] leading-relaxed text-foreground'>
                  {result}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
