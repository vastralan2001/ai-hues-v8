'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolHeader, TOOL_WRAP } from './_kit';

interface LoremIpsumToolProps {
  locale: Locale;
}

const WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'ut',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'dolor',
  'in',
  'reprehenderit',
  'in',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'dolore',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'in',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
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
  return Array.from({ length: paragraphs }, () =>
    generateParagraph(sentences)
  ).join('\n\n');
}

export default function LoremIpsumTool({ locale }: LoremIpsumToolProps) {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentences, setSentences] = useState(5);
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    setOutput(generateLorem(paragraphs, sentences));
  };

  const numInput =
    'h-10 w-20 rounded-[10px] border border-border bg-surface px-3 text-center text-[14px] text-foreground focus:border-accent focus:outline-none';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.lorem.title')}
        desc={t(locale, 'tool.lorem.desc')}
      />

      <div className='mb-5 flex flex-wrap items-center gap-5'>
        <label className='flex items-center gap-3 text-[14px] text-secondary'>
          <span>{t(locale, 'tool.lorem.paragraphs')}</span>
          <input
            className={numInput}
            max={20}
            min={1}
            onChange={(e) => setParagraphs(Number(e.target.value))}
            type='number'
            value={paragraphs}
          />
        </label>
        <label className='flex items-center gap-3 text-[14px] text-secondary'>
          <span>{t(locale, 'tool.lorem.sentences')}</span>
          <input
            className={numInput}
            max={20}
            min={1}
            onChange={(e) => setSentences(Number(e.target.value))}
            type='number'
            value={sentences}
          />
        </label>
        <button
          className='h-10 rounded-[10px] bg-accent px-5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-accent-light'
          onClick={handleGenerate}
          type='button'
        >
          {t(locale, 'tool.lorem.generate')}
        </button>
      </div>

      <Panel
        label={locale === 'zh' ? '生成结果' : 'Output'}
        action={output ? <CopyButton text={output} /> : null}
      >
        <div className='min-h-[260px] p-5 text-[15px] leading-relaxed text-foreground'>
          {output ? (
            output.split('\n\n').map((p, i) => (
              <p className='mb-4 last:mb-0' key={i}>
                {p}
              </p>
            ))
          ) : (
            <span className='text-[13px] text-muted'>
              {locale === 'zh'
                ? '点击生成按钮创建占位文本'
                : 'Click generate to create placeholder text'}
            </span>
          )}
        </div>
      </Panel>
    </div>
  );
}
