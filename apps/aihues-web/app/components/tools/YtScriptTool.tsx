'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface YtScriptToolProps {
  locale: Locale;
}

function generateScript(
  topic: string,
  duration: number,
  locale: Locale
): string {
  const isZh = locale === 'zh';
  const t = topic || (isZh ? '这个主题' : 'this topic');
  const segments = Math.max(3, Math.floor(duration / 3));

  const hook = isZh
    ? `开场：用一个问题或惊人的事实抓住观众注意力——"你知道吗？关于${t}，90%的人都做错了！"`
    : `HOOK: Grab attention with a question or shocking fact — "Did you know? 90% of people are doing ${t} wrong!"`;

  const intro = isZh
    ? `介绍：简要介绍自己，说明本期视频关于${t}的内容，以及观众能学到什么。`
    : `INTRO: Briefly introduce yourself, what this video covers about ${t}, and what viewers will learn.`;

  const bodyItems: string[] = [];
  for (let i = 1; i <= segments; i++) {
    bodyItems.push(
      isZh
        ? `第 ${i} 部分：${t} 的关键点 ${i} —— 解释概念、展示示例、提供可操作的建议。`
        : `Part ${i}: Key point ${i} about ${t} — explain the concept, show examples, and provide actionable advice.`
    );
  }

  const cta = isZh
    ? `行动号召：如果你喜欢这期关于${t}的视频，请点赞、订阅并打开通知！在评论区分享你的想法。`
    : `CTA: If you enjoyed this video about ${t}, like, subscribe, and hit the bell! Share your thoughts in the comments.`;

  return [hook, '', intro, '', ...bodyItems, '', cta].join('\n');
}

export default function YtScriptTool({ locale }: YtScriptToolProps) {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('10');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setResult(generateScript(topic, parseInt(duration) || 10, locale));
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
          {t(locale, 'tool.ytScript.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.ytScript.desc')}
        </p>

        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.ytScript.topic')}
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
                {t(locale, 'tool.ytScript.duration')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                min='1'
                onChange={(e) => setDuration(e.target.value)}
                type='number'
                value={duration}
              />
            </div>
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.ytScript.generate')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.ytScript.result')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={copy}
                  type='button'
                >
                  {copied
                    ? t(locale, 'tool.copy.copied')
                    : t(locale, 'tool.wordCount.copy')}
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
