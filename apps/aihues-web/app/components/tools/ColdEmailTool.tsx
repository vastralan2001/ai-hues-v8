'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface ColdEmailToolProps {
  locale: Locale;
}

function generateEmail(
  name: string,
  company: string,
  recipient: string,
  recipientCompany: string,
  purpose: string,
  locale: Locale
): string {
  const isZh = locale === 'zh';
  const n = name || (isZh ? '我' : 'I');
  const c = company || (isZh ? '我们公司' : 'our company');
  const r = recipient || (isZh ? '您好' : 'Hi there');
  const rc = recipientCompany || (isZh ? '贵公司' : 'your company');
  const p =
    purpose || (isZh ? '探讨合作机会' : 'explore a potential partnership');

  if (isZh) {
    return `主题：关于与${rc}的${p}

${r}，

您好！我是${n}，来自${c}。我们注意到${rc}在行业内取得了出色的成绩，特此来信希望能${p}。

我相信我们的解决方案能够为${rc}带来实质性的价值。如果您方便的话，希望能安排一次简短的通话，进一步探讨合作的可能性。

期待您的回复！

${n}
${c}`;
  }

  return `Subject: ${p.charAt(0).toUpperCase() + p.slice(1)} with ${rc}

Hi ${r === 'Hi there' ? 'there' : r},

My name is ${n} and I'm with ${c}. I've been following ${rc} and am impressed by what you're building.

I'd love to ${p} and explore how we might be able to help. Would you be open to a brief call next week?

Looking forward to hearing from you.

Best,\n${n}\n${c}`;
}

export default function ColdEmailTool({ locale }: ColdEmailToolProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientCompany, setRecipientCompany] = useState('');
  const [purpose, setPurpose] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setResult(
      generateEmail(name, company, recipient, recipientCompany, purpose, locale)
    );
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
          {t(locale, 'tool.coldEmail.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.coldEmail.desc')}
        </p>

        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.coldEmail.name')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setName(e.target.value)}
                type='text'
                value={name}
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.coldEmail.company')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setCompany(e.target.value)}
                type='text'
                value={company}
              />
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.coldEmail.recipient')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setRecipient(e.target.value)}
                type='text'
                value={recipient}
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.coldEmail.recipientCompany')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setRecipientCompany(e.target.value)}
                type='text'
                value={recipientCompany}
              />
            </div>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.coldEmail.purpose')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={
                locale === 'zh' ? '探讨合作机会' : 'explore a partnership'
              }
              type='text'
              value={purpose}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.coldEmail.generate')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.coldEmail.result')}
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
              <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5'>
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
