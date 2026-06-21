'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

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

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.utility')}
        title={t(locale, 'tool.titleCase.title')}
        desc={t(locale, 'tool.titleCase.desc')}
      />

      <div className='mb-5 flex flex-wrap gap-2'>
        {CASE_BUTTONS.map((btn) => (
          <button
            className='rounded-[10px] border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
            key={btn.key}
            onClick={() => handleConvert(btn.key)}
            type='button'
          >
            {t(locale, btn.labelKey)}
          </button>
        ))}
      </div>

      <ToolGrid>
        <Panel label={locale === 'zh' ? '输入' : 'Input'}>
          <textarea
            className='min-h-[300px] w-full flex-1 resize-y border-0 bg-transparent p-4 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.titleCase.placeholder')}
            value={input}
          />
        </Panel>

        <Panel
          label={t(locale, 'tool.titleCase.result')}
          action={output ? <CopyButton text={output} /> : null}
        >
          <div className='min-h-[300px] flex-1 overflow-auto p-4'>
            {output ? (
              <pre className='whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground'>
                {output}
              </pre>
            ) : (
              <span className='text-[13px] text-muted'>
                {locale === 'zh'
                  ? '选择上方格式转换'
                  : 'Pick a case format above'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
