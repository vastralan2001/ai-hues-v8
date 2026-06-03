'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface QrcodeToolProps {
  locale: Locale;
}

export default function QrcodeTool({ locale }: QrcodeToolProps) {
  const [input, setInput] = useState('');
  const [size, setSize] = useState(300);
  const [imageUrl, setImageUrl] = useState('');

  function generate() {
    if (!input.trim()) return;
    const encoded = encodeURIComponent(input);
    setImageUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`
    );
  }

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
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[700px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.qrcode.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.qrcode.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.qrcode.input')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
              placeholder='https://example.com'
              type='text'
              value={input}
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.qrcode.size')}: {size}px
            </label>
            <input
              className='w-full accent-accent'
              max='1000'
              min='100'
              onChange={(e) => setSize(parseInt(e.target.value))}
              step='50'
              type='range'
              value={size}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={generate}
            type='button'
          >
            {t(locale, 'tool.qrcode.generate')}
          </button>

          {imageUrl && (
            <div className='mt-4 space-y-4 text-center'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt='QR Code'
                className='mx-auto rounded-[14px] border border-border bg-white p-4'
                src={imageUrl}
              />
              <button
                className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={download}
                type='button'
              >
                {t(locale, 'tool.qrcode.download')}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
