'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface MetaTagToolProps {
  locale: Locale;
}

export default function MetaTagTool({ locale }: MetaTagToolProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const lines: string[] = [];
    lines.push(`<title>${escapeHtml(title.trim())}</title>`);
    if (description.trim()) {
      lines.push(`<meta name="description" content="${escapeHtml(description.trim())}" />`);
    }
    if (keywords.trim()) {
      lines.push(`<meta name="keywords" content="${escapeHtml(keywords.trim())}" />`);
    }
    if (author.trim()) {
      lines.push(`<meta name="author" content="${escapeHtml(author.trim())}" />`);
    }
    lines.push('<meta charset="UTF-8" />');
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    if (title.trim()) {
      lines.push(`<meta property="og:title" content="${escapeHtml(title.trim())}" />`);
    }
    if (description.trim()) {
      lines.push(`<meta property="og:description" content="${escapeHtml(description.trim())}" />`);
    }
    if (image.trim()) {
      lines.push(`<meta property="og:image" content="${escapeHtml(image.trim())}" />`);
    }
    lines.push('<meta property="og:type" content="website" />');
    setOutput(lines.join('\n'));
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
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.meta.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.meta.desc')}
        </p>

        <div className='flex flex-col gap-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.meta.pageTitle')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setTitle(e.target.value)}
              type='text'
              value={title}
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.meta.description')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setDescription(e.target.value)}
              type='text'
              value={description}
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.meta.keywords')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setKeywords(e.target.value)}
              type='text'
              value={keywords}
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.meta.author')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setAuthor(e.target.value)}
              type='text'
              value={author}
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.meta.image')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setImage(e.target.value)}
              type='text'
              value={image}
            />
          </div>
        </div>

        <button
          className='mt-5 rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleGenerate}
          type='button'
        >
          {t(locale, 'tool.meta.generate')}
        </button>

        {output && (
          <div className='mt-6'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.meta.result')}
              </span>
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={handleCopy}
                type='button'
              >
                {t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
            <pre className='min-h-[120px] overflow-auto rounded-[14px] border border-border bg-surface p-5 font-mono text-sm text-foreground'>
              {output}
            </pre>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
