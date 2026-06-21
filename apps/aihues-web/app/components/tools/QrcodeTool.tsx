'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface QrcodeToolProps {
  locale: Locale;
}

export default function QrcodeTool({ locale }: QrcodeToolProps) {
  const [input, setInput] = useState('');
  const [size, setSize] = useState(300);

  const imageUrl = input.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input)}`
    : '';

  function download() {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.qrcode.title')}
        desc={t(locale, 'tool.qrcode.desc')}
      />

      <ToolGrid>
        <Panel label={t(locale, 'tool.qrcode.input')}>
          <div className='space-y-5 p-5'>
            <input
              className='h-12 w-full rounded-[10px] border border-border bg-bg px-4 text-[15px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              placeholder='https://example.com'
              type='text'
              value={input}
            />
            <div>
              <label className='mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-secondary'>
                {t(locale, 'tool.qrcode.size')}: {size}px
              </label>
              <input
                className='w-full accent-[color:var(--accent)]'
                max='1000'
                min='100'
                onChange={(e) => setSize(parseInt(e.target.value))}
                step='50'
                type='range'
                value={size}
              />
            </div>
          </div>
        </Panel>

        <Panel
          label={locale === 'zh' ? '二维码' : 'QR Code'}
          action={
            imageUrl ? (
              <button
                type='button'
                onClick={download}
                className='h-8 rounded-[8px] bg-accent px-3 text-[12px] font-semibold text-white transition-colors hover:bg-accent-light'
              >
                {t(locale, 'tool.qrcode.download')}
              </button>
            ) : null
          }
        >
          <div className='flex min-h-[300px] items-center justify-center p-6'>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt='QR Code'
                className='rounded-[14px] border border-border bg-white p-4'
                src={imageUrl}
                width={Math.min(size, 360)}
                height={Math.min(size, 360)}
              />
            ) : (
              <span className='text-[13px] text-muted'>
                {locale === 'zh'
                  ? '输入内容即时生成二维码'
                  : 'Enter content to generate a QR code'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
