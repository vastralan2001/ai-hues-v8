'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface BlogOutlineToolProps {
  locale: Locale;
}

function generateOutline(topic: string, sections: number, locale: Locale): string {
  const isZh = locale === 'zh';
  const t = topic || (isZh ? '这个主题' : 'this topic');
  const lines: string[] = [];

  lines.push(isZh ? `# ${t}` : `# ${t}`);
  lines.push('');
  lines.push(isZh ? '## 引言' : '## Introduction');
  lines.push(isZh ? `- 引入 ${t} 的背景和重要性` : `- Hook: Why ${t} matters now`);
  lines.push(isZh ? `- 说明本文将要涵盖的内容` : `- What this post will cover`);
  lines.push('');

  for (let i = 1; i <= sections; i++) {
    lines.push(isZh ? `## 第 ${i} 部分：${t} 的关键方面 ${i}` : `## Part ${i}: Key Aspect ${i} of ${t}`);
    lines.push(isZh ? `- 核心观点` : `- Core concept`);
    lines.push(isZh ? `- 具体例子或数据` : `- Specific example or data`);
    lines.push(isZh ? `- 可操作的建议` : `- Actionable takeaway`);
    lines.push('');
  }

  lines.push(isZh ? '## 结论' : '## Conclusion');
  lines.push(isZh ? `- 总结要点` : `- Recap key points`);
  lines.push(isZh ? `- 行动号召` : `- Call to action`);

  return lines.join('\n');
}

export default function BlogOutlineTool({ locale }: BlogOutlineToolProps) {
  const [topic, setTopic] = useState('');
  const [sections, setSections] = useState('5');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setResult(generateOutline(topic, parseInt(sections) || 5, locale));
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.blogOutline.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.blogOutline.desc')}
        </p>

        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.blogOutline.topic')}
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
                {t(locale, 'tool.blogOutline.sections')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                min='2'
                max='10'
                onChange={(e) => setSections(e.target.value)}
                type='number'
                value={sections}
              />
            </div>
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.blogOutline.generate')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.blogOutline.result')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={copy}
                  type='button'
                >
                  {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                </button>
              </div>
              <div className='min-h-[200px] w-full rounded-[14px] border border-border bg-surface p-5'>
                <pre className='whitespace-pre-wrap font-mono text-sm text-foreground'>
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
