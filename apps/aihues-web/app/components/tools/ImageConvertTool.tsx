'use client';

import { useState } from 'react';

import type { Locale } from '@/lib/dict';

import { Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';
import {
  baseName,
  downloadBlob,
  Field,
  formatBytes,
  imgBtn,
  ImageDropzone,
  loadImage,
} from './_image';

type Fmt = 'image/png' | 'image/jpeg' | 'image/webp';
const FORMATS: { key: Fmt; label: string; ext: string }[] = [
  { key: 'image/png', label: 'PNG', ext: 'png' },
  { key: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { key: 'image/webp', label: 'WebP', ext: 'webp' },
];

export default function ImageConvertTool({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fmt, setFmt] = useState<Fmt>('image/webp');
  const [quality, setQuality] = useState(0.9);
  const [out, setOut] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOut(null);
  };

  const run = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      const img = await loadImage(preview);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (fmt === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, fmt, fmt === 'image/png' ? undefined : quality)
      );
      if (blob) setOut({ blob, url: URL.createObjectURL(blob) });
    } finally {
      setBusy(false);
    }
  };

  const lossy = fmt !== 'image/png';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '图片工具' : 'Image Tools'}
        title={zh ? '图片格式转换' : 'Image Converter'}
        desc={
          zh
            ? '在 PNG / JPEG / WebP 之间转换图片格式，本地完成，可调质量。'
            : 'Convert between PNG, JPEG and WebP locally with adjustable quality.'
        }
      />
      <ToolGrid>
        <Panel label={zh ? '原图' : 'Source'}>
          <div className='p-4'>
            <ImageDropzone onFile={pick} zh={zh} preview={preview} />
            {file ? (
              <div className='mt-4 space-y-3'>
                <Field label={zh ? '目标格式' : 'Target format'}>
                  <div className='flex gap-1.5'>
                    {FORMATS.map((f) => (
                      <button
                        key={f.key}
                        type='button'
                        onClick={() => setFmt(f.key)}
                        className={`h-9 rounded-[9px] px-3 text-[12px] font-semibold transition-colors ${
                          fmt === f.key
                            ? 'bg-accent text-white'
                            : 'border border-border bg-bg text-secondary hover:border-accent'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </Field>
                {lossy ? (
                  <Field
                    label={`${zh ? '质量' : 'Quality'} ${Math.round(quality * 100)}%`}
                  >
                    <input
                      type='range'
                      min={0.3}
                      max={1}
                      step={0.05}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className='w-40 accent-[color:var(--accent)]'
                    />
                  </Field>
                ) : null}
                <div className='flex items-center justify-between pt-1'>
                  <span className='text-[12px] text-muted'>
                    {formatBytes(file.size)}
                  </span>
                  <button
                    type='button'
                    onClick={run}
                    disabled={busy}
                    className={`${imgBtn} bg-accent text-white hover:bg-accent-light disabled:opacity-50`}
                  >
                    {zh ? '转换' : 'Convert'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel label={zh ? '结果' : 'Result'}>
          <div className='flex min-h-[260px] flex-col items-center justify-center gap-4 p-4'>
            {out ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt='converted'
                  src={out.url}
                  className='max-h-[280px] max-w-full rounded-[10px] object-contain'
                />
                <div className='text-[13px] text-secondary'>
                  {formatBytes(out.blob.size)}
                </div>
                <button
                  type='button'
                  onClick={() =>
                    downloadBlob(
                      out.blob,
                      `${baseName(file?.name ?? 'image')}.${
                        FORMATS.find((f) => f.key === fmt)?.ext ?? 'png'
                      }`
                    )
                  }
                  className={`${imgBtn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
                >
                  {zh ? '下载' : 'Download'}
                </button>
              </>
            ) : (
              <span className='text-[13px] text-muted'>
                {zh ? '转换结果将显示在这里' : 'Converted image appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
