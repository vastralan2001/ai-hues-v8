'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface PrDescToolProps {
  locale: Locale;
}

export default function PrDescTool({ locale }: PrDescToolProps) {
  const [title, setTitle] = useState('');
  const [changes, setChanges] = useState<string[]>(['']);
  const [unitTests, setUnitTests] = useState(true);
  const [integrationTests, setIntegrationTests] = useState(false);
  const [manualTesting, setManualTesting] = useState(false);
  const [issues, setIssues] = useState('');
  const [output, setOutput] = useState('');

  const addChange = () => setChanges([...changes, '']);
  const updateChange = (index: number, value: string) => {
    const next = [...changes];
    next[index] = value;
    setChanges(next);
  };
  const removeChange = (index: number) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    const lines: string[] = [];
    lines.push('## Summary');
    lines.push(title.trim() || 'Brief summary of changes');
    lines.push('');
    lines.push('## Changes');
    for (const change of changes) {
      if (change.trim()) lines.push(`- ${change.trim()}`);
    }
    lines.push('');
    lines.push('## Testing');
    lines.push(
      `- [${unitTests ? 'x' : ' '}] ${t(locale, 'tool.prDesc.unitTests')}`
    );
    lines.push(
      `- [${integrationTests ? 'x' : ' '}] ${t(locale, 'tool.prDesc.integrationTests')}`
    );
    lines.push(
      `- [${manualTesting ? 'x' : ' '}] ${t(locale, 'tool.prDesc.manualTesting')}`
    );
    if (issues.trim()) {
      lines.push('');
      lines.push('## Related Issues');
      lines.push(issues.trim());
    }
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
          {t(locale, 'tool.prDesc.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.prDesc.desc')}
        </p>

        {/* PR Title */}
        <div className='mb-4'>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.prDesc.prTitle')}
          </label>
          <input
            className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setTitle(e.target.value)}
            type='text'
            value={title}
          />
        </div>

        {/* Changes */}
        <div className='mb-4'>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.prDesc.changes')}
          </label>
          {changes.map((c, i) => (
            <div className='mb-2 flex gap-2' key={i}>
              <input
                className='h-10 flex-1 rounded-[8px] border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => updateChange(i, e.target.value)}
                placeholder={t(locale, 'tool.prDesc.changePlaceholder')}
                type='text'
                value={c}
              />
              {changes.length > 1 && (
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 text-sm text-secondary transition-colors hover:border-red-300 hover:text-red-500'
                  onClick={() => removeChange(i)}
                  type='button'
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            className='rounded-[8px] border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            onClick={addChange}
            type='button'
          >
            {t(locale, 'tool.prDesc.addChange')}
          </button>
        </div>

        {/* Testing */}
        <div className='mb-4 rounded-[10px] border border-border bg-surface p-4'>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.prDesc.testing')}
          </label>
          <div className='flex flex-col gap-2'>
            <label className='flex cursor-pointer items-center gap-2 text-sm text-foreground'>
              <input
                checked={unitTests}
                className='h-4 w-4 accent-accent'
                onChange={(e) => setUnitTests(e.target.checked)}
                type='checkbox'
              />
              {t(locale, 'tool.prDesc.unitTests')}
            </label>
            <label className='flex cursor-pointer items-center gap-2 text-sm text-foreground'>
              <input
                checked={integrationTests}
                className='h-4 w-4 accent-accent'
                onChange={(e) => setIntegrationTests(e.target.checked)}
                type='checkbox'
              />
              {t(locale, 'tool.prDesc.integrationTests')}
            </label>
            <label className='flex cursor-pointer items-center gap-2 text-sm text-foreground'>
              <input
                checked={manualTesting}
                className='h-4 w-4 accent-accent'
                onChange={(e) => setManualTesting(e.target.checked)}
                type='checkbox'
              />
              {t(locale, 'tool.prDesc.manualTesting')}
            </label>
          </div>
        </div>

        {/* Related Issues */}
        <div className='mb-4'>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.prDesc.relatedIssues')}
          </label>
          <input
            className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setIssues(e.target.value)}
            placeholder='Closes #123, Fixes #456'
            type='text'
            value={issues}
          />
        </div>

        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleGenerate}
          type='button'
        >
          {t(locale, 'tool.prDesc.generate')}
        </button>

        {output && (
          <div className='mt-6'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.prDesc.result')}
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
