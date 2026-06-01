'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface PushToolProps {
  locale: Locale;
}

export default function PushTool({ locale }: PushToolProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('ios');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [badge, setBadge] = useState('1');
  const [sound, setSound] = useState('default');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function generatePayload() {
    let payload = '';
    if (platform === 'ios') {
      payload = JSON.stringify(
        {
          aps: {
            alert: { title, body },
            badge: parseInt(badge) || 0,
            sound,
          },
        },
        null,
        2
      );
    } else if (platform === 'android') {
      payload = JSON.stringify(
        {
          message: {
            notification: { title, body },
            android: {
              notification: {
                sound,
                notification_count: parseInt(badge) || 0,
              },
            },
          },
        },
        null,
        2
      );
    } else {
      payload = JSON.stringify(
        {
          notification: {
            title,
            body,
            icon: '/icon.png',
            badge: `/badge-${badge}.png`,
          },
        },
        null,
        2
      );
    }
    setResult(payload);
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function clear() {
    setTitle('');
    setBody('');
    setBadge('1');
    setSound('default');
    setResult('');
    setCopied(false);
  }

  const platforms: { key: 'ios' | 'android' | 'web'; label: string }[] = [
    { key: 'ios', label: t(locale, 'tool.push.ios') },
    { key: 'android', label: t(locale, 'tool.push.android') },
    { key: 'web', label: t(locale, 'tool.push.web') },
  ];

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.push.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.push.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.push.platform')}
            </label>
            <div className='flex flex-wrap gap-2'>
              {platforms.map((p) => (
                <button
                  key={p.key}
                  className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-all ${
                    platform === p.key
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface text-foreground hover:border-accent'
                  }`}
                  onClick={() => setPlatform(p.key)}
                  type='button'
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.push.notificationTitle')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setTitle(e.target.value)}
                placeholder='New message'
                type='text'
                value={title}
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.push.body')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setBody(e.target.value)}
                placeholder='You have a new notification'
                type='text'
                value={body}
              />
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.push.badge')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                min='0'
                onChange={(e) => setBadge(e.target.value)}
                type='number'
                value={badge}
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.push.sound')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setSound(e.target.value)}
                type='text'
                value={sound}
              />
            </div>
          </div>

          <div className='flex flex-wrap gap-3'>
            <button
              className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
              disabled={!title.trim() && !body.trim()}
              onClick={generatePayload}
              type='button'
            >
              {t(locale, 'tool.push.generate')}
            </button>
            <button
              className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={clear}
              type='button'
            >
              {t(locale, 'tool.copy.clear')}
            </button>
          </div>
        </div>

        {result && (
          <div className='mt-6'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.push.result')}
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
              <pre className='whitespace-pre-wrap break-all font-mono text-sm text-foreground'>
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
