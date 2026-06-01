'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface CurlGenToolProps {
  locale: Locale;
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

interface Header {
  key: string;
  value: string;
}

export default function CurlGenTool({ locale }: CurlGenToolProps) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [output, setOutput] = useState('');

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const next = [...headers];
    next[index][field] = value;
    setHeaders(next);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    let cmd = `curl -X ${method}`;
    for (const h of headers) {
      if (h.key.trim() && h.value.trim()) {
        cmd += ` \\\n  -H "${h.key.trim()}: ${h.value.trim()}"`;
      }
    }
    if (body.trim() && method !== 'GET' && method !== 'HEAD') {
      const escaped = body.trim().replace(/'/g, "'\\''");
      cmd += ` \\\n  -d '${escaped}'`;
    }
    cmd += ` \\\n  "${url.trim()}"`;
    setOutput(cmd);
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
          {t(locale, 'tool.curl.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.curl.desc')}
        </p>

        {/* Method + URL */}
        <div className='mb-4 flex gap-3'>
          <select
            className='h-11 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
            onChange={(e) => setMethod(e.target.value)}
            value={method}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            className='h-11 flex-1 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t(locale, 'tool.curl.urlPlaceholder')}
            type='text'
            value={url}
          />
        </div>

        {/* Headers */}
        <div className='mb-4'>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.curl.headers')}
          </label>
          {headers.map((h, i) => (
            <div className='mb-2 flex gap-2' key={i}>
              <input
                className='h-10 flex-1 rounded-[8px] border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => updateHeader(i, 'key', e.target.value)}
                placeholder={t(locale, 'tool.curl.headerKey')}
                type='text'
                value={h.key}
              />
              <input
                className='h-10 flex-1 rounded-[8px] border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => updateHeader(i, 'value', e.target.value)}
                placeholder={t(locale, 'tool.curl.headerValue')}
                type='text'
                value={h.value}
              />
              {headers.length > 1 && (
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 text-sm text-secondary transition-colors hover:border-red-300 hover:text-red-500'
                  onClick={() => removeHeader(i)}
                  type='button'
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            className='rounded-[8px] border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            onClick={addHeader}
            type='button'
          >
            {t(locale, 'tool.curl.addHeader')}
          </button>
        </div>

        {/* Body */}
        {method !== 'GET' && method !== 'HEAD' && (
          <div className='mb-4'>
            <label className='mb-2 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.curl.body')}
            </label>
            <textarea
              className='h-[120px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setBody(e.target.value)}
              placeholder={t(locale, 'tool.curl.bodyPlaceholder')}
              value={body}
            />
          </div>
        )}

        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleGenerate}
          type='button'
        >
          {t(locale, 'tool.curl.generate')}
        </button>

        {output && (
          <div className='mt-5'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.curl.result')}
              </span>
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={handleCopy}
                type='button'
              >
                {t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
            <pre className='min-h-[80px] overflow-auto rounded-[14px] border border-border bg-surface p-5 font-mono text-sm text-foreground'>
              {output}
            </pre>
          </div>
        )}
      </div>
    </PageShell>
  );
}
