'use client';

import { useRef, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface Sha256ToolProps {
  locale: Locale;
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function Sha256Tool({ locale }: Sha256ToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const seqRef = useRef(0);

  const handleInput = (value: string) => {
    setInput(value);
    const seq = ++seqRef.current;
    if (!value) {
      setOutput('');
      return;
    }
    sha256(value).then((h) => {
      if (seq === seqRef.current) setOutput(h);
    });
  };

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.sha256.title')}
        desc={t(locale, 'tool.sha256.desc')}
      />

      <ToolGrid>
        <Panel label={locale === 'zh' ? '输入' : 'Input'}>
          <textarea
            className='min-h-[280px] w-full flex-1 resize-y border-0 bg-transparent p-4 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => handleInput(e.target.value)}
            placeholder={t(locale, 'tool.sha256.placeholder')}
            value={input}
            spellCheck={false}
          />
        </Panel>

        <Panel
          label='SHA-256'
          hint={output ? '256-bit · hex' : undefined}
          action={output ? <CopyButton text={output} /> : null}
        >
          <div className='flex min-h-[280px] flex-1 flex-col p-4'>
            {output ? (
              <code className='break-all font-mono text-[15px] leading-relaxed text-accent'>
                {output}
              </code>
            ) : (
              <span className='text-[13px] text-muted'>
                {locale === 'zh'
                  ? '哈希将实时计算并显示在这里'
                  : 'Hash is computed live as you type'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
