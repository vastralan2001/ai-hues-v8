'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface ImageToBase64ToolProps {
  locale: Locale;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function ImageToBase64Tool({ locale }: ImageToBase64ToolProps) {
  const [output, setOutput] = useState('');
  const [preview, setPreview] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOutput(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.imageBase64.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.imageBase64.desc')}
        </p>

        <label className='inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'>
          <input
            accept='image/*'
            className='hidden'
            onChange={handleFileChange}
            type='file'
          />
          {t(locale, 'tool.imageBase64.select')}
        </label>

        {preview && (
          <div className='mt-6'>
            <div className='mb-4 flex items-center gap-6'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                  {t(locale, 'tool.imageBase64.preview')}
                </p>
                <img
                  alt='preview'
                  className='mt-2 max-h-[200px] rounded-[10px] border border-border'
                  src={preview}
                />
              </div>
              <div className='flex flex-col gap-2 text-sm'>
                <span className='text-secondary'>
                  {t(locale, 'tool.imageBase64.fileSize')}: {formatBytes(fileSize)}
                </span>
                <span className='text-secondary'>
                  {t(locale, 'tool.imageBase64.base64Size')}: {formatBytes(output.length)}
                </span>
              </div>
            </div>

            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.imageBase64.result')}
              </span>
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={handleCopy}
                type='button'
              >
                {t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
            <pre className='max-h-[300px] overflow-auto rounded-[14px] border border-border bg-surface p-4 font-mono text-xs text-foreground'>
              {output}
            </pre>
          </div>
        )}
      </div>
    </PageShell>
  );
}
