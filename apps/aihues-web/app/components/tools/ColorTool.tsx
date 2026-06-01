'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface ColorToolProps {
  locale: Locale;
}

interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (m) {
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    };
  }
  const m3 = hex.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
  if (m3) {
    return {
      r: parseInt(m3[1] + m3[1], 16),
      g: parseInt(m3[2] + m3[2], 16),
      b: parseInt(m3[3] + m3[3], 16),
    };
  }
  return null;
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function parseColor(input: string): ColorResult | null {
  input = input.trim();
  const rgb = hexToRgb(input);
  if (rgb) {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      hex: `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }

  const rgbMatch = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const hsl = rgbToHsl(r, g, b);
    return {
      hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }

  return null;
}

export default function ColorTool({ locale }: ColorToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ColorResult | null>(null);
  const [error, setError] = useState('');

  const handleConvert = () => {
    const parsed = parseColor(input);
    if (!parsed) {
      setError('Invalid color format');
      setResult(null);
      return;
    }
    setError('');
    setResult(parsed);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.color.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.color.desc')}
        </p>

        <input
          className='h-12 w-full rounded-[14px] border border-border bg-surface px-5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(locale, 'tool.color.placeholder')}
          type='text'
          value={input}
        />

        <div className='mt-4 flex gap-3'>
          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleConvert}
            type='button'
          >
            {t(locale, 'tool.color.convert')}
          </button>
        </div>

        {error && (
          <p className='mt-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {error}
          </p>
        )}

        {result && (
          <div className='mt-6 flex flex-col gap-3'>
            {/* Preview */}
            <div className='flex items-center gap-4 rounded-[14px] border border-border bg-surface p-4'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.color.preview')}
              </span>
              <div
                className='h-12 w-12 rounded-[10px] border border-border'
                style={{ backgroundColor: result.hex }}
              />
              <span className='font-mono text-sm text-foreground'>
                {result.hex}
              </span>
            </div>

            {/* HEX */}
            <ResultRow
              label={t(locale, 'tool.color.hex')}
              onCopy={() => handleCopy(result.hex)}
              value={result.hex}
            />

            {/* RGB */}
            <ResultRow
              label={t(locale, 'tool.color.rgb')}
              onCopy={() => handleCopy(result.rgb)}
              value={result.rgb}
            />

            {/* HSL */}
            <ResultRow
              label={t(locale, 'tool.color.hsl')}
              onCopy={() => handleCopy(result.hsl)}
              value={result.hsl}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}

function ResultRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className='flex items-center justify-between rounded-[10px] border border-border bg-surface px-4 py-3'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
          {label}
        </p>
        <p className='mt-0.5 font-mono text-sm text-foreground'>{value}</p>
      </div>
      <button
        className='ml-4 rounded-[8px] border border-border bg-bg px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
        onClick={onCopy}
        type='button'
      >
        Copy
      </button>
    </div>
  );
}
