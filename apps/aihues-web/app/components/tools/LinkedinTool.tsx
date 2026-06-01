'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface LinkedinToolProps {
  locale: Locale;
}

const TEMPLATES: Record<string, string[]> = {
  thoughtful: [
    "I've been thinking a lot about {topic} lately.\n\nHere's what I've learned: the biggest breakthroughs often come from the smallest shifts in perspective.\n\nWhat's one thing about {topic} that changed your mind recently?",
    "Three years ago, I didn't understand {topic}.\n\nToday, it's central to everything I do.\n\nThe lesson? Don't underestimate how much you can learn in a short time if you stay curious.",
    'The most underrated skill in {topic}?\n\nPatience. Everyone wants results yesterday. The ones who win are those who show up consistently.',
  ],
  success: [
    "Last year, we set out to solve {topic}.\n\nToday, I'm proud to share that we've helped 1,000+ teams streamline their workflow.\n\nGrateful for the team, the customers, and the lessons learned along the way. 🙏",
    'When we started working on {topic}, everyone said it was too competitive.\n\nWe did it anyway.\n\nSometimes the best opportunities are hiding in plain sight.',
    'A client just told me our work on {topic} saved them 20 hours per week.\n\nMoments like these remind me why I do what I do.',
  ],
  opinion: [
    "Unpopular opinion: {topic} is overrated.\n\nHere's why I think we need to rethink our approach 👇\n\n(Agree or disagree? Let me know in the comments.)",
    "Hot take: Most people are doing {topic} wrong.\n\nThe real opportunity isn't where everyone's looking. It's in the gaps they're ignoring.",
    "I'll say it: {topic} isn't the future.\n\nThe future is what comes after {topic}, and the sooner we prepare for it, the better.",
  ],
};

export default function LinkedinTool({ locale }: LinkedinToolProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'thoughtful' | 'success' | 'opinion'>(
    'thoughtful'
  );
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const templates = TEMPLATES[tone];
    const generated = templates.map((tmpl) =>
      tmpl.replace(
        /\{topic\}/g,
        topic || (locale === 'zh' ? '这个主题' : 'this topic')
      )
    );
    setResults(generated);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tones: { key: typeof tone; label: string }[] = [
    { key: 'thoughtful', label: t(locale, 'tool.linkedin.toneThoughtful') },
    { key: 'success', label: t(locale, 'tool.linkedin.toneSuccess') },
    { key: 'opinion', label: t(locale, 'tool.linkedin.toneOpinion') },
  ];

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.linkedin.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.linkedin.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.linkedin.topic')}
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
              {t(locale, 'tool.linkedin.tone')}
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
            {t(locale, 'tool.linkedin.generate')}
          </button>

          {results.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.linkedin.result')}
              </p>
              {results.map((r, i) => (
                <div
                  key={i}
                  className='rounded-[14px] border border-border bg-surface p-4'
                >
                  <p className='whitespace-pre-wrap text-sm text-foreground'>
                    {r}
                  </p>
                  <button
                    className='mt-3 rounded-[8px] border border-border bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
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
