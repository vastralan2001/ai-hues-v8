'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';

import type { Locale } from '@/lib/dict';

import { Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';
import {
  baseName,
  downloadBlob,
  Field,
  formatBytes,
  imgBtn,
  ImageDropzone,
} from './_image';

export default function ImageCompressTool({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [out, setOut] = useState<{ blob: Blob; url: string } | null>(null);
  const [maxMB, setMaxMB] = useState(1);
  const [maxPx, setMaxPx] = useState(1920);
  const [busy, setBusy] = useState(false);

  const pick = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOut(null);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const blob = await imageCompression(file, {
        maxSizeMB: maxMB,
        maxWidthOrHeight: maxPx,
        useWebWorker: true,
      });
      setOut({ blob, url: URL.createObjectURL(blob) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '图片工具' : 'Image Tools'}
        title={zh ? '图片压缩' : 'Image Compressor'}
        desc={
          zh
            ? '在浏览器本地压缩图片体积，可限制目标大小与最长边，原图不会上传。'
            : 'Shrink image file size locally — cap the target size and longest edge. Your image never leaves the browser.'
        }
      />
      <ToolGrid>
        <Panel label={zh ? '原图' : 'Original'}>
          <div className='p-4'>
            <ImageDropzone onFile={pick} zh={zh} preview={preview} />
            {file ? (
              <div className='mt-4 space-y-3'>
                <Field label={zh ? '目标大小 (MB)' : 'Target size (MB)'}>
                  <input
                    type='number'
                    min={0.1}
                    step={0.1}
                    value={maxMB}
                    onChange={(e) => setMaxMB(Number(e.target.value) || 1)}
                    className='h-9 w-28 rounded-[9px] border border-border bg-bg px-3 text-right text-foreground outline-none focus:border-accent'
                  />
                </Field>
                <Field label={zh ? '最长边 (px)' : 'Longest edge (px)'}>
                  <input
                    type='number'
                    min={64}
                    step={16}
                    value={maxPx}
                    onChange={(e) => setMaxPx(Number(e.target.value) || 1920)}
                    className='h-9 w-28 rounded-[9px] border border-border bg-bg px-3 text-right text-foreground outline-none focus:border-accent'
                  />
                </Field>
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
                    {busy
                      ? zh
                        ? '压缩中…'
                        : 'Compressing…'
                      : zh
                        ? '压缩'
                        : 'Compress'}
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
                  alt='compressed'
                  src={out.url}
                  className='max-h-[280px] max-w-full rounded-[10px] object-contain'
                />
                <div className='text-center text-[13px] text-secondary'>
                  {formatBytes(out.blob.size)}
                  {file ? (
                    <span className='ml-2 font-semibold text-accent'>
                      −
                      {Math.max(
                        0,
                        Math.round((1 - out.blob.size / file.size) * 100)
                      )}
                      %
                    </span>
                  ) : null}
                </div>
                <button
                  type='button'
                  onClick={() =>
                    downloadBlob(
                      out.blob,
                      `${baseName(file?.name ?? 'image')}-compressed.${
                        out.blob.type.split('/')[1] ?? 'jpg'
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
                {zh ? '压缩结果将显示在这里' : 'Compressed image appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
