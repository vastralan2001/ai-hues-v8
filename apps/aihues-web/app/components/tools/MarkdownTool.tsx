'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface MarkdownToolProps {
  locale: Locale;
}

function markdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(
    /```([\s\S]*?)```/gim,
    '<pre class="rounded-[8px] bg-bg p-3 overflow-auto my-3"><code>$1</code></pre>'
  );

  // Headings
  html = html.replace(
    /^###### (.*$)/gim,
    '<h6 class="text-sm font-bold mt-4 mb-2">$1</h6>'
  );
  html = html.replace(
    /^##### (.*$)/gim,
    '<h5 class="text-base font-bold mt-4 mb-2">$1</h5>'
  );
  html = html.replace(
    /^#### (.*$)/gim,
    '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>'
  );
  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>'
  );
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-3xl font-extrabold mt-6 mb-4">$1</h1>'
  );

  // Bold, italic, code
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(
    /`([^`]+)`/gim,
    '<code class="bg-bg px-1 py-0.5 rounded text-sm">$1</code>'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    '<a href="$2" class="text-accent hover:underline">$1</a>'
  );

  // Blockquote
  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote class="border-l-4 border-accent pl-4 italic text-secondary my-3">$1</blockquote>'
  );

  // Lists
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>');
  html = html.replace(
    /(<li[^>]*>.*<\/li>\n?)+/gim,
    '<ul class="list-disc my-3">$&</ul>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr class="my-4 border-border" />');

  // Paragraphs (simple)
  html = html.replace(/\n\n/gim, '</p><p class="my-2 leading-relaxed">');
  html = '<p class="my-2 leading-relaxed">' + html + '</p>';

  return html;
}

export default function MarkdownTool({ locale }: MarkdownToolProps) {
  const [input, setInput] = useState('');

  const preview = useMemo(() => markdownToHtml(input), [input]);

  return (
    <div className='mx-auto max-w-[1100px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.markdown.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.markdown.desc')}
      </p>

      <div className='grid gap-4 lg:grid-cols-2'>
        {/* Input */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            Markdown
          </label>
          <textarea
            className='h-[500px] w-full resize-none rounded-2xl border border-border bg-surface p-5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.markdown.placeholder')}
            value={input}
          />
        </div>

        {/* Preview */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.markdown.preview')}
          </label>
          <div
            className='h-[500px] overflow-auto rounded-2xl border border-border bg-surface p-5 text-foreground'
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>
    </div>
  );
}
