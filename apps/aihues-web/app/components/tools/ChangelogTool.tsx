'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface ChangelogToolProps {
  locale: Locale;
}

type SectionKey =
  | 'added'
  | 'changed'
  | 'deprecated'
  | 'removed'
  | 'fixed'
  | 'security';

const SECTIONS: SectionKey[] = [
  'added',
  'changed',
  'deprecated',
  'removed',
  'fixed',
  'security',
];

export default function ChangelogTool({ locale }: ChangelogToolProps) {
  const [version, setVersion] = useState('1.0.0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sections, setSections] = useState<Record<SectionKey, string[]>>({
    added: [''],
    changed: [],
    deprecated: [],
    removed: [],
    fixed: [],
    security: [],
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = (section: SectionKey) => {
    setSections((prev) => ({ ...prev, [section]: [...prev[section], ''] }));
  };

  const updateItem = (section: SectionKey, index: number, value: string) => {
    const next = { ...sections, [section]: [...sections[section]] };
    next[section][index] = value;
    setSections(next);
  };

  const removeItem = (section: SectionKey, index: number) => {
    const next = {
      ...sections,
      [section]: sections[section].filter((_, i) => i !== index),
    };
    setSections(next);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const changesText = SECTIONS.flatMap((key) =>
        sections[key]
          .filter((i) => i.trim())
          .map((item) => `[${key}] ${item.trim()}`)
      ).join('\n');
      const result = await aiGenerate({
        tool: 'changelog',
        locale,
        inputs: { version, changes: changesText || 'No changes' },
      });
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='max-w-[800px] py-10'>
      <h1 className='mb-2 text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-foreground'>
        {t(locale, 'tool.changelog.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.changelog.desc')}
      </p>

      {/* Version + Date */}
      <div className='mb-6 flex gap-3'>
        <div className='flex-1'>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.changelog.version')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
            onChange={(e) => setVersion(e.target.value)}
            type='text'
            value={version}
          />
        </div>
        <div className='flex-1'>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.changelog.date')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
            onChange={(e) => setDate(e.target.value)}
            type='date'
            value={date}
          />
        </div>
      </div>

      {/* Sections */}
      <div className='flex flex-col gap-4'>
        {SECTIONS.map((key) => (
          <div
            className='rounded-lg border border-border bg-surface p-4'
            key={key}
          >
            <h2 className='mb-2 text-sm font-bold text-foreground'>
              {t(locale, `tool.changelog.${key}`)}
            </h2>
            {sections[key].map((item, i) => (
              <div className='mb-2 flex gap-2' key={i}>
                <input
                  className='h-10 flex-1 rounded-[8px] border border-border bg-bg px-3 text-sm text-foreground focus:border-accent focus:outline-none'
                  onChange={(e) => updateItem(key, i, e.target.value)}
                  type='text'
                  value={item}
                />
                {sections[key].length > 1 && (
                  <button
                    className='rounded-[8px] border border-border bg-bg px-3 text-sm text-secondary transition-colors hover:border-red-300 hover:text-red-500'
                    onClick={() => removeItem(key, i)}
                    type='button'
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              className='rounded-[8px] border border-border bg-bg px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={() => addItem(key)}
              type='button'
            >
              {t(locale, 'tool.changelog.addItem')}
            </button>
          </div>
        ))}
      </div>

      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}

      <button
        className={`mt-6 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
        onClick={handleGenerate}
        type='button'
      >
        {t(locale, 'tool.changelog.generate')}
      </button>

      {output && (
        <div className='mt-6'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.changelog.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <pre className='min-h-[120px] overflow-auto rounded-2xl border border-border bg-surface p-5 font-mono text-sm text-foreground'>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
