'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface TitleCaseToolProps {
  locale: Locale;
}

type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'snake'
  | 'kebab';

const CASE_BUTTONS: { key: CaseType; labelKey: string }[] = [
  { key: 'upper', labelKey: 'tool.titleCase.uppercase' },
  { key: 'lower', labelKey: 'tool.titleCase.lowercase' },
  { key: 'title', labelKey: 'tool.titleCase.titleCase' },
  { key: 'sentence', labelKey: 'tool.titleCase.sentenceCase' },
  { key: 'camel', labelKey: 'tool.titleCase.camelCase' },
  { key: 'snake', labelKey: 'tool.titleCase.snakeCase' },
  { key: 'kebab', labelKey: 'tool.titleCase.kebabCase' },
];

function toTitleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\n?\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase());
}

function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

function toSnakeCase(text: string): string {
  return text
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function toKebabCase(text: string): string {
  return text
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return toTitleCase(text);
    case 'sentence':
      return toSentenceCase(text);
    case 'camel':
      return toCamelCase(text);
    case 'snake':
      return toSnakeCase(text);
    case 'kebab':
      return toKebabCase(text);
    default:
      return text;
  }
}

export default function TitleCaseTool({ locale }: TitleCaseToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = (type: CaseType) => {
    setOutput(convertCase(input, type));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-4xl px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.titleCase.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.titleCase.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-2xl border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.titleCase.placeholder')}
        value={input}
      />

      <div className='mt-4 flex flex-wrap gap-2'>
        {CASE_BUTTONS.map((btn) => (
          <button
            className='rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            key={btn.key}
            onClick={() => handleConvert(btn.key)}
            type='button'
          >
            {t(locale, btn.labelKey)}
          </button>
        ))}
      </div>

      {output && (
        <div className='mt-5'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.titleCase.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <div className='min-h-[120px] w-full rounded-2xl border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground'>
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
