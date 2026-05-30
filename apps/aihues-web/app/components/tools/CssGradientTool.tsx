'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface CssGradientToolProps {
  locale: Locale;
}

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

export default function CssGradientTool({ locale }: CssGradientToolProps) {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [colors, setColors] = useState<ColorStop[]>([
    { id: 1, color: '#FF6B35', position: 0 },
    { id: 2, color: '#004E89', position: 100 },
  ]);
  const [css, setCss] = useState('');
  const [copied, setCopied] = useState(false);
  let nextId = 3;

  function addColor() {
    setColors([...colors, { id: nextId++, color: '#059669', position: 50 }]);
  }

  function removeColor(id: number) {
    if (colors.length <= 2) return;
    setColors(colors.filter((c) => c.id !== id));
  }

  function updateColor(id: number, field: 'color' | 'position', value: string | number) {
    setColors(colors.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function generate() {
    const stops = colors
      .sort((a, b) => a.position - b.position)
      .map((c) => `${c.color} ${c.position}%`)
      .join(', ');
    const gradient =
      type === 'linear'
        ? `linear-gradient(${angle}deg, ${stops})`
        : `radial-gradient(circle, ${stops})`;
    setCss(`background: ${gradient};`);
  }

  function copy() {
    if (!css) return;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const previewStyle = css
    ? { background: css.replace('background: ', '').replace(';', '') }
    : {};

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.cssGradient.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.cssGradient.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.cssGradient.type')}
            </label>
            <div className='flex flex-wrap gap-2'>
              {(['linear', 'radial'] as const).map((gradType) => (
                <button
                  key={gradType}
                  className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-all ${
                    type === gradType
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface text-foreground hover:border-accent'
                  }`}
                  onClick={() => setType(gradType)}
                  type='button'
                >
                  {gradType === 'linear' ? t(locale, 'tool.cssGradient.linear') : t(locale, 'tool.cssGradient.radial')}
                </button>
              ))}
            </div>
          </div>

          {type === 'linear' && (
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.cssGradient.angle')}: {angle}°
              </label>
              <input
                className='w-full accent-accent'
                max='360'
                min='0'
                onChange={(e) => setAngle(parseInt(e.target.value))}
                type='range'
                value={angle}
              />
            </div>
          )}

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.cssGradient.colors')}
            </label>
            <div className='space-y-2'>
              {colors.map((c) => (
                <div key={c.id} className='flex items-center gap-3'>
                  <input
                    className='h-10 w-16 rounded-[8px] border border-border bg-transparent'
                    onChange={(e) => updateColor(c.id, 'color', e.target.value)}
                    type='color'
                    value={c.color}
                  />
                  <span className='font-mono text-sm text-foreground'>{c.color}</span>
                  <input
                    className='w-24 accent-accent'
                    max='100'
                    min='0'
                    onChange={(e) => updateColor(c.id, 'position', parseInt(e.target.value))}
                    type='range'
                    value={c.position}
                  />
                  <span className='w-10 text-sm text-muted'>{c.position}%</span>
                  {colors.length > 2 && (
                    <button
                      className='text-xs text-red-500 hover:text-red-600'
                      onClick={() => removeColor(c.id)}
                      type='button'
                    >
                      {t(locale, 'tool.cssGradient.remove')}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              className='mt-2 rounded-[10px] border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={addColor}
              type='button'
            >
              {t(locale, 'tool.cssGradient.addColor')}
            </button>
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={generate}
            type='button'
          >
            {t(locale, 'tool.cssGradient.generate')}
          </button>

          {css && (
            <div className='space-y-4'>
              <div>
                <p className='mb-2 text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.cssGradient.preview')}
                </p>
                <div
                  className='h-[150px] w-full rounded-[14px] border border-border'
                  style={previewStyle}
                />
              </div>
              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm font-semibold text-foreground'>
                    {t(locale, 'tool.cssGradient.result')}
                  </span>
                  <button
                    className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                    onClick={copy}
                    type='button'
                  >
                    {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                  </button>
                </div>
                <div className='min-h-[60px] w-full rounded-[14px] border border-border bg-surface p-5'>
                  <pre className='whitespace-pre-wrap font-mono text-sm text-foreground'>
                    {css}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
