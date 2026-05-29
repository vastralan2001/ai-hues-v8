'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface LoremIpsumToolProps {
  locale: Locale;
}

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum',
];

function generateSentence(): string {
  const length = 8 + Math.floor(Math.random() * 8);
  const sentenceWords: string[] = [];
  for (let i = 0; i < length; i++) {
    sentenceWords.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return (
    sentenceWords[0].charAt(0).toUpperCase() +
    sentenceWords[0].slice(1) +
    ' ' +
    sentenceWords.slice(1).join(' ') +
    '.'
  );
}

function generateParagraph(sentences: number): string {
  return Array.from({ length: sentences }, generateSentence).join(' ');
}

function generateLorem(paragraphs: number, sentences: number): string {
  return Array.from({ length: paragraphs }, () => generateParagraph(sentences)).join(
    '\n\n'
  );
}

export default function LoremIpsumTool({ locale }: LoremIpsumToolProps) {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentences, setSentences] = useState(5);
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    setOutput(generateLorem(paragraphs, sentences));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.lorem.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.lorem.desc')}
        </p>

        <div className='mb-4 flex flex-wrap items-center gap-6'>
          <label className='flex items-center gap-3 text-sm text-foreground'>
            <span>{t(locale, 'tool.lorem.paragraphs')}</span>
            <input
              className='h-10 w-20 rounded-[10px] border border-border bg-surface px-3 text-center text-sm focus:border-accent focus:outline-none'
              max={20}
              min={1}
              onChange={(e) => setParagraphs(Number(e.target.value))}
              type='number'
              value={paragraphs}
            />
          </label>
          <label className='flex items-center gap-3 text-sm text-foreground'>
            <span>{t(locale, 'tool.lorem.sentences')}</span>
            <input
              className='h-10 w-20 rounded-[10px] border border-border bg-surface px-3 text-center text-sm focus:border-accent focus:outline-none'
              max={20}
              min={1}
              onChange={(e) => setSentences(Number(e.target.value))}
              type='number'
              value={sentences}
            />
          </label>
          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.lorem.generate')}
          </button>
        </div>

        {output && (
          <div className='mt-2'>
            <div className='mb-2 flex items-center justify-end'>
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={handleCopy}
                type='button'
              >
                {t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
            <div className='min-h-[200px] w-full rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground'>
              {output.split('\n\n').map((p, i) => (
                <p className='mb-4 last:mb-0' key={i}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
