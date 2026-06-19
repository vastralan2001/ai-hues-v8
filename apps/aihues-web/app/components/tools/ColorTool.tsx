'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface ColorToolProps {
  locale: Locale;
}

type Format = 'hex' | 'rgb' | 'hsl' | 'hsv' | 'cmyk';

type Rgb = { r: number; g: number; b: number };

interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
}

const FORMATS: Format[] = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk'];

const PLACEHOLDERS: Record<Format, string> = {
  hex: '#c2502e or #c52',
  rgb: 'rgb(194, 80, 46) or 194, 80, 46',
  hsl: 'hsl(14, 62%, 47%)',
  hsv: 'hsv(14, 76%, 76%)',
  cmyk: 'cmyk(0%, 59%, 76%, 24%)',
};

function hexToRgb(hex: string): Rgb | null {
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

function rgbToHsv(
  r: number,
  g: number,
  b: number
): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return {
    h: Math.round(h),
    s: Math.round((max === 0 ? 0 : d / max) * 100),
    v: Math.round(max * 100),
  };
}

function rgbToCmyk(
  r: number,
  g: number,
  b: number
): { c: number; m: number; y: number; k: number } {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function fromHueChroma(h: number, c: number, x: number, m: number): Rgb {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  return fromHueChroma(h, c, x, l - c / 2);
}

function hsvToRgb(h: number, s: number, v: number): Rgb {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  return fromHueChroma(h, c, x, v - c);
}

function cmykToRgb(c: number, m: number, y: number, k: number): Rgb {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

function numbers(s: string): number[] {
  return (s.match(/-?\d*\.?\d+/g) ?? []).map(Number);
}

const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n));

function inputToRgb(format: Format, value: string): Rgb | null {
  const v = value.trim();
  if (!v) return null;
  if (format === 'hex') return hexToRgb(v);
  const n = numbers(v);
  if (format === 'cmyk') {
    if (n.length < 4) return null;
    return cmykToRgb(
      clamp(n[0], 100),
      clamp(n[1], 100),
      clamp(n[2], 100),
      clamp(n[3], 100)
    );
  }
  if (n.length < 3) return null;
  if (format === 'rgb') {
    return {
      r: Math.round(clamp(n[0], 255)),
      g: Math.round(clamp(n[1], 255)),
      b: Math.round(clamp(n[2], 255)),
    };
  }
  if (format === 'hsl')
    return hslToRgb(n[0], clamp(n[1], 100), clamp(n[2], 100));
  if (format === 'hsv')
    return hsvToRgb(n[0], clamp(n[1], 100), clamp(n[2], 100));
  return null;
}

function rgbToResult(rgb: Rgb): ColorResult {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
  return {
    hex,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
  };
}

function readableOn(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#1c1917';
  const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return lum > 0.6 ? '#1c1917' : '#ffffff';
}

const SAMPLES = [
  '#c2502e',
  '#2563eb',
  '#16a34a',
  '#7c3aed',
  '#0891b2',
  '#1c1917',
];

export default function ColorTool({ locale }: ColorToolProps) {
  const zh = locale === 'zh';
  const [format, setFormat] = useState<Format>('hex');
  const [input, setInput] = useState('#c2502e');

  const result = useMemo(() => {
    const rgb = inputToRgb(format, input);
    return rgb ? rgbToResult(rgb) : null;
  }, [format, input]);

  const invalid = input.trim().length > 0 && result === null;
  const pickerValue = result?.hex ?? '#000000';

  function selectFormat(f: Format) {
    if (f === format) return;
    const rgb = inputToRgb(format, input);
    if (rgb) setInput(rgbToResult(rgb)[f]);
    setFormat(f);
  }

  function setFromHex(hex: string) {
    const rgb = hexToRgb(hex);
    if (rgb) setInput(rgbToResult(rgb)[format]);
  }

  const rows: { label: string; key: Format; value: string }[] = result
    ? [
        { label: 'HEX', key: 'hex', value: result.hex },
        { label: 'RGB', key: 'rgb', value: result.rgb },
        { label: 'HSL', key: 'hsl', value: result.hsl },
        { label: 'HSV', key: 'hsv', value: result.hsv },
        { label: 'CMYK', key: 'cmyk', value: result.cmyk },
      ]
    : [];

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.color.title')}
        desc={t(locale, 'tool.color.desc')}
      />

      <ToolGrid>
        <Panel label={zh ? '输入' : 'Input'}>
          <div className='space-y-4 p-4'>
            <label className='relative block h-[176px] w-full cursor-pointer overflow-hidden rounded-[12px] border border-border'>
              <span
                className='absolute inset-0'
                style={{
                  background: result ? result.hex : 'var(--color-surface)',
                }}
              />
              {result ? (
                <span
                  className='absolute bottom-3 left-4 right-4 truncate font-mono text-[15px] font-semibold'
                  style={{ color: readableOn(result.hex) }}
                >
                  {result[format]}
                </span>
              ) : null}
              <input
                aria-label={zh ? '拾色器' : 'Color picker'}
                className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                onChange={(e) => setFromHex(e.target.value)}
                type='color'
                value={pickerValue}
              />
            </label>

            <div
              className='flex gap-1 rounded-[10px] border border-border bg-bg p-1'
              role='group'
              aria-label={zh ? '输入格式' : 'Input format'}
            >
              {FORMATS.map((f) => (
                <button
                  aria-pressed={format === f}
                  className={`flex-1 rounded-[7px] px-2 py-1.5 text-[12px] font-semibold uppercase tracking-wide transition-colors ${
                    format === f
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-secondary hover:bg-surface hover:text-foreground'
                  }`}
                  key={f}
                  onClick={() => selectFormat(f)}
                  type='button'
                >
                  {f}
                </button>
              ))}
            </div>

            <input
              className='h-12 w-full rounded-[12px] border border-border bg-bg px-4 font-mono text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDERS[format]}
              type='text'
              value={input}
            />

            <div className='flex flex-wrap gap-2'>
              {SAMPLES.map((c) => (
                <button
                  aria-label={c}
                  className='h-7 w-7 rounded-full border border-border transition-transform hover:scale-110'
                  key={c}
                  onClick={() => setFromHex(c)}
                  style={{ background: c }}
                  type='button'
                />
              ))}
            </div>
          </div>
        </Panel>

        <Panel label={zh ? '结果' : 'Result'}>
          {invalid ? (
            <div className='p-4'>
              <div className='rounded-[12px] border border-[rgba(255,56,73,0.3)] bg-[rgba(255,56,73,0.06)] px-4 py-3 text-[13px] font-medium text-[#d12a3a]'>
                {zh ? '无效的颜色格式' : 'Invalid color format'}
              </div>
            </div>
          ) : rows.length > 0 ? (
            <div className='flex flex-col divide-y divide-[color:var(--border)]'>
              {rows.map((row) => (
                <div
                  className='flex items-center justify-between gap-4 px-4 py-4'
                  key={row.key}
                >
                  <div className='min-w-0'>
                    <div
                      className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                        row.key === format ? 'text-accent' : 'text-secondary'
                      }`}
                    >
                      {row.label}
                      {row.key === format ? ` · ${zh ? '输入' : 'input'}` : ''}
                    </div>
                    <div className='mt-1 break-all font-mono text-[15px] text-foreground'>
                      {row.value}
                    </div>
                  </div>
                  <CopyButton text={row.value} />
                </div>
              ))}
            </div>
          ) : (
            <div className='p-4'>
              <div className='rounded-[12px] border border-dashed border-border px-4 py-12 text-center text-[14px] text-muted'>
                {zh ? '输入一个颜色值' : 'Enter a color value'}
              </div>
            </div>
          )}
        </Panel>
      </ToolGrid>
    </div>
  );
}
