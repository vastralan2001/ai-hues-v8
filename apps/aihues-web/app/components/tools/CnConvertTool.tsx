'use client';

import { Converter } from 'opencc-js';
import { useMemo, useState } from 'react';

import { type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface CnConvertToolProps {
  locale: Locale;
}

type Dir = 's2t' | 't2s';

const converterCache: Partial<Record<Dir, (input: string) => string>> = {};

function getConverter(dir: Dir): (input: string) => string {
  let fn = converterCache[dir];
  if (!fn) {
    fn =
      dir === 's2t'
        ? Converter({ from: 'cn', to: 'tw' })
        : Converter({ from: 'tw', to: 'cn' });
    converterCache[dir] = fn;
  }
  return fn;
}

const SAMPLE =
  '欢迎使用简繁转换工具，输入中文即可实时转换。无论是软件、网络还是其他常用词组，都能精准对应到繁体写法。';

export default function CnConvertTool({ locale }: CnConvertToolProps) {
  const [input, setInput] = useState(SAMPLE);
  const [dir, setDir] = useState<Dir>('s2t');

  const output = useMemo(() => getConverter(dir)(input), [input, dir]);

  const seg =
    'h-9 rounded-[8px] px-4 text-[13px] font-semibold transition-colors';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={locale === 'zh' ? '常用小工具' : 'Utility'}
        title={locale === 'zh' ? '简繁转换' : 'Chinese Converter'}
        desc={
          locale === 'zh'
            ? '中文简体与繁体实时互转，支持词组级精准转换。'
            : 'Convert between Simplified and Traditional Chinese in real time, with phrase-level accuracy.'
        }
      />

      <div className='mb-5 inline-flex rounded-[10px] border border-border bg-surface p-1'>
        <button
          type='button'
          onClick={() => setDir('s2t')}
          className={`${seg} ${dir === 's2t' ? 'bg-accent text-white' : 'text-secondary hover:text-foreground'}`}
        >
          {locale === 'zh' ? '简 → 繁' : 'Simplified → Traditional'}
        </button>
        <button
          type='button'
          onClick={() => setDir('t2s')}
          className={`${seg} ${dir === 't2s' ? 'bg-accent text-white' : 'text-secondary hover:text-foreground'}`}
        >
          {locale === 'zh' ? '繁 → 简' : 'Traditional → Simplified'}
        </button>
      </div>

      <ToolGrid>
        <Panel label={locale === 'zh' ? '输入' : 'Input'}>
          <textarea
            className='min-h-[340px] w-full flex-1 resize-y border-0 bg-transparent p-4 text-[16px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              locale === 'zh' ? '在此输入中文…' : 'Enter Chinese text…'
            }
            value={input}
          />
        </Panel>

        <Panel
          label={locale === 'zh' ? '结果' : 'Result'}
          action={output ? <CopyButton text={output} /> : null}
        >
          <div className='min-h-[340px] flex-1 overflow-auto p-4'>
            {output ? (
              <p className='whitespace-pre-wrap break-words text-[16px] leading-relaxed text-foreground'>
                {output}
              </p>
            ) : (
              <span className='text-[13px] text-muted'>
                {locale === 'zh'
                  ? '转换结果将显示在这里'
                  : 'Converted text appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
