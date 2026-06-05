'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface ReadabilityToolProps {
  locale: Locale;
}

interface ReadabilityResult {
  words: number;
  sentences: number;
  syllables: number;
  avgSentenceLength: number;
  fleschEase: number;
  fleschGrade: number;
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function analyzeReadability(text: string): ReadabilityResult {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = words.length || 1;

  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const avgSentenceLength = wordCount / sentenceCount;
  const fleschEase =
    206.835 - 1.015 * avgSentenceLength - 84.6 * (syllableCount / wordCount);
  const fleschGrade =
    0.39 * avgSentenceLength + 11.8 * (syllableCount / wordCount) - 15.59;

  return {
    words: wordCount,
    sentences: sentenceCount,
    syllables: syllableCount,
    avgSentenceLength,
    fleschEase,
    fleschGrade,
  };
}

function getRating(score: number, locale: Locale): string {
  if (score >= 90) return t(locale, 'tool.readability.veryEasy');
  if (score >= 80) return t(locale, 'tool.readability.easy');
  if (score >= 70) return t(locale, 'tool.readability.fairlyEasy');
  if (score >= 60) return t(locale, 'tool.readability.standard');
  if (score >= 50) return t(locale, 'tool.readability.fairlyDifficult');
  if (score >= 30) return t(locale, 'tool.readability.difficult');
  return t(locale, 'tool.readability.veryDifficult');
}

export default function ReadabilityTool({ locale }: ReadabilityToolProps) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReadabilityResult | null>(null);

  const handleAnalyze = () => {
    setResult(analyzeReadability(text));
  };

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.readability.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.readability.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setText(e.target.value)}
        placeholder={t(locale, 'tool.readability.placeholder')}
        value={text}
      />

      <button
        className='mt-4 rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
        onClick={handleAnalyze}
        type='button'
      >
        {t(locale, 'tool.readability.analyze')}
      </button>

      {result && (
        <div className='mt-6 grid gap-3 sm:grid-cols-2'>
          <StatCard
            label={t(locale, 'tool.readability.words')}
            value={result.words}
          />
          <StatCard
            label={t(locale, 'tool.readability.sentences')}
            value={result.sentences}
          />
          <StatCard
            label={t(locale, 'tool.readability.avgSentenceLength')}
            value={result.avgSentenceLength.toFixed(1)}
          />
          <StatCard
            label={t(locale, 'tool.readability.syllables')}
            value={result.syllables}
          />
          <StatCard
            label={t(locale, 'tool.readability.fleschEase')}
            value={result.fleschEase.toFixed(1)}
          />
          <StatCard
            label={t(locale, 'tool.readability.fleschGrade')}
            value={result.fleschGrade.toFixed(1)}
          />

          {/* Rating */}
          <div className='sm:col-span-2 rounded-[14px] border border-border bg-surface p-4 text-center'>
            <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
              {t(locale, 'tool.readability.rating')}
            </p>
            <p className='mt-1 text-xl font-extrabold text-accent'>
              {getRating(result.fleschEase, locale)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
      <div className='text-[22px] font-extrabold text-accent'>{value}</div>
      <div className='mt-1 text-[11px] font-semibold uppercase tracking-wider text-secondary'>
        {label}
      </div>
    </div>
  );
}
