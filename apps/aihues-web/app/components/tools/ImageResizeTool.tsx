'use client';

import { useState } from 'react';

import type { Locale } from '@/lib/dict';

import { Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';
import {
  baseName,
  downloadBlob,
  Field,
  imgBtn,
  ImageDropzone,
  loadImage,
} from './_image';

export default function ImageResizeTool({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dim, setDim] = useState<{ w: number; h: number } | null>(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [out, setOut] = useState<{ url: string; blob: Blob } | null>(null);

  const pick = async (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setOut(null);
    const img = await loadImage(url);
    setDim({ w: img.naturalWidth, h: img.naturalHeight });
    setW(img.naturalWidth);
    setH(img.naturalHeight);
  };

  const onW = (val: number) => {
    setW(val);
    if (lock && dim) setH(Math.round((val / dim.w) * dim.h));
  };
  const onH = (val: number) => {
    setH(val);
    if (lock && dim) setW(Math.round((val / dim.h) * dim.w));
  };
  const scale = (pct: number) => {
    if (!dim) return;
    setW(Math.round((dim.w * pct) / 100));
    setH(Math.round((dim.h * pct) / 100));
  };

  const run = async () => {
    if (!preview || w < 1 || h < 1) return;
    const img = await loadImage(preview);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    const type = file?.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, 0.92)
    );
    if (blob) setOut({ url: URL.createObjectURL(blob), blob });
  };

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '图片工具' : 'Image Tools'}
        title={zh ? '图片尺寸调整' : 'Image Resizer'}
        desc={
          zh
            ? '按像素或百分比缩放图片，可锁定宽高比，全部在浏览器本地完成。'
            : 'Resize images by pixels or percentage, optionally locking aspect ratio — all in your browser.'
        }
      />
      <ToolGrid>
        <Panel label={zh ? '原图' : 'Source'}>
          <div className='p-4'>
            <ImageDropzone onFile={pick} zh={zh} preview={preview} />
            {dim ? (
              <div className='mt-4 space-y-3'>
                <div className='text-[12px] text-muted'>
                  {zh ? '原始尺寸' : 'Original'}: {dim.w}×{dim.h}
                </div>
                <Field label={zh ? '宽度 (px)' : 'Width (px)'}>
                  <input
                    type='number'
                    min={1}
                    value={w}
                    onChange={(e) => onW(Number(e.target.value) || 0)}
                    className='h-9 w-28 rounded-[9px] border border-border bg-bg px-3 text-right text-foreground outline-none focus:border-accent'
                  />
                </Field>
                <Field label={zh ? '高度 (px)' : 'Height (px)'}>
                  <input
                    type='number'
                    min={1}
                    value={h}
                    onChange={(e) => onH(Number(e.target.value) || 0)}
                    className='h-9 w-28 rounded-[9px] border border-border bg-bg px-3 text-right text-foreground outline-none focus:border-accent'
                  />
                </Field>
                <label className='flex cursor-pointer items-center gap-2 text-[13px] text-secondary'>
                  <input
                    type='checkbox'
                    checked={lock}
                    onChange={(e) => setLock(e.target.checked)}
                    className='h-4 w-4 accent-[color:var(--accent)]'
                  />
                  {zh ? '锁定宽高比' : 'Lock aspect ratio'}
                </label>
                <div className='flex items-center gap-1.5'>
                  {[25, 50, 75].map((p) => (
                    <button
                      key={p}
                      type='button'
                      onClick={() => scale(p)}
                      className='h-8 rounded-[8px] border border-border bg-bg px-3 text-[12px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
                    >
                      {p}%
                    </button>
                  ))}
                  <button
                    type='button'
                    onClick={run}
                    className={`${imgBtn} ml-auto bg-accent text-white hover:bg-accent-light`}
                  >
                    {zh ? '调整' : 'Resize'}
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
                  alt='resized'
                  src={out.url}
                  className='max-h-[280px] max-w-full rounded-[10px] object-contain'
                />
                <div className='text-[13px] text-secondary'>
                  {w}×{h}
                </div>
                <button
                  type='button'
                  onClick={() =>
                    downloadBlob(
                      out.blob,
                      `${baseName(file?.name ?? 'image')}-${w}x${h}.${
                        out.blob.type.split('/')[1] ?? 'png'
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
                {zh ? '调整结果将显示在这里' : 'Resized image appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
