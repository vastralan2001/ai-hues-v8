'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface GitCommitToolProps {
  locale: Locale;
}

const COMMIT_TYPES = [
  { key: 'feat', labelKey: 'gitCommit.feat' },
  { key: 'fix', labelKey: 'gitCommit.fix' },
  { key: 'docs', labelKey: 'gitCommit.docs' },
  { key: 'style', labelKey: 'gitCommit.style' },
  { key: 'refactor', labelKey: 'gitCommit.refactor' },
  { key: 'perf', labelKey: 'gitCommit.perf' },
  { key: 'test', labelKey: 'gitCommit.test' },
  { key: 'chore', labelKey: 'gitCommit.chore' },
];

export default function GitCommitTool({ locale }: GitCommitToolProps) {
  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    let result = type;
    if (scope.trim()) {
      result += `(${scope.trim()})`;
    }
    result += `: ${description.trim()}`;
    if (body.trim()) {
      result += `\n\n${body.trim()}`;
    }
    if (footer.trim()) {
      result += `\n\n${footer.trim()}`;
    }
    setOutput(result);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='max-w-[800px] py-10'>
      <h1 className='mb-2 text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-foreground'>
        {t(locale, 'tool.gitCommit.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.gitCommit.desc')}
      </p>

      <div className='flex flex-col gap-4'>
        {/* Type */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.gitCommit.type')}
          </label>
          <select
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            {COMMIT_TYPES.map((ct) => (
              <option key={ct.key} value={ct.key}>
                {t(locale, ct.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {/* Scope */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.gitCommit.scope')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setScope(e.target.value)}
            placeholder='e.g. auth, api, ui'
            type='text'
            value={scope}
          />
        </div>

        {/* Description */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.gitCommit.description')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Short description of the change'
            type='text'
            value={description}
          />
        </div>

        {/* Body */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.gitCommit.body')}
          </label>
          <textarea
            className='h-[100px] w-full resize-none rounded-lg border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setBody(e.target.value)}
            placeholder='Detailed explanation of the change'
            value={body}
          />
        </div>

        {/* Footer */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.gitCommit.footer')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setFooter(e.target.value)}
            placeholder='Closes #123, BREAKING CHANGE: ...'
            type='text'
            value={footer}
          />
        </div>
      </div>

      <button
        className='mt-5 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light'
        onClick={handleGenerate}
        type='button'
      >
        {t(locale, 'tool.gitCommit.generate')}
      </button>

      {output && (
        <div className='mt-6'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.gitCommit.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.gitCommit.copy')}
            </button>
          </div>
          <pre className='min-h-[80px] w-full whitespace-pre-wrap rounded-2xl border border-border bg-surface p-5 font-mono text-sm text-foreground'>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
