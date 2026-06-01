'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface XPostToolProps {
  locale: Locale;
}

const TEMPLATES: Record<string, string[]> = {
  casual: [
    "Just discovered {topic} and I'm blown away 🤯 What do you think?",
    'Hot take: {topic} is the most underrated thing right now.',
    "Can't stop thinking about {topic}. Anyone else?",
    '{topic} thread incoming 🧵',
    'Unpopular opinion: {topic} deserves more hype.',
  ],
  professional: [
    "Here's what I've learned about {topic} after 5 years in the industry.",
    'A quick breakdown of {topic} for anyone getting started.',
    'The state of {topic} in 2026: a thread.',
    '3 things you need to know about {topic} this week.',
    'Why {topic} matters more than ever right now.',
  ],
  witty: [
    '{topic} is like a relationship — everyone talks about it, few understand it.',
    'Me reading about {topic} at 2am: this is fine.',
    'They said {topic} was a fad. They were wrong.',
    'POV: you just understood {topic} after months of confusion.',
    '{topic}: exists. Me: I must write a thread.',
  ],
};

export default function XPostTool({ locale }: XPostToolProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'casual' | 'professional' | 'witty'>(
    'casual'
  );
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const templates = TEMPLATES[tone];
    const generated = templates.map((tmpl) =>
      tmpl.replace(/\{topic\}/g, topic || 'this topic')
    );
    setResults(generated);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tones: { key: typeof tone; label: string }[] = [
    { key: 'casual', label: t(locale, 'tool.xPost.toneCasual') },
    { key: 'professional', label: t(locale, 'tool.xPost.toneProfessional') },
    { key: 'witty', label: t(locale, 'tool.xPost.toneWitty') },
  ];

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.xPost.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.xPost.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.xPost.topic')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setTopic(e.target.value)}
              type='text'
              value={topic}
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.xPost.tone')}
            </label>
            <div className='flex flex-wrap gap-2'>
              {tones.map((t) => (
                <button
                  key={t.key}
                  className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-all ${
                    tone === t.key
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface text-foreground hover:border-accent'
                  }`}
                  onClick={() => setTone(t.key)}
                  type='button'
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={generate}
            type='button'
          >
            {t(locale, 'tool.xPost.generate')}
          </button>

          {results.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.xPost.result')}
              </p>
              {results.map((r, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-[14px] border border-border bg-surface p-4'
                >
                  <div>
                    <p className='text-sm text-foreground'>{r}</p>
                    <p className='mt-1 text-xs text-muted'>
                      {r.length} {t(locale, 'tool.xPost.chars')}
                    </p>
                  </div>
                  <button
                    className='ml-4 shrink-0 rounded-[8px] border border-border bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                    onClick={() => copy(r)}
                    type='button'
                  >
                    {copied
                      ? t(locale, 'tool.copy.copied')
                      : t(locale, 'tool.wordCount.copy')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
