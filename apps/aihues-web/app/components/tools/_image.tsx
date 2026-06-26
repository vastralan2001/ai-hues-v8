'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function baseName(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
}

/** Drag / click / paste dropzone that hands back the picked image File. */
export function ImageDropzone({
  onFile,
  zh,
  preview,
}: {
  onFile: (file: File) => void;
  zh: boolean;
  preview?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [over, setOver] = useState(false);

  const take = useCallback(
    (file: File | undefined | null) => {
      if (file && file.type.startsWith('image/')) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files?.[0]);
      }}
      onPaste={(e) => {
        const item = Array.from(e.clipboardData.items).find((i) =>
          i.type.startsWith('image/')
        );
        if (item) take(item.getAsFile());
      }}
      className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[16px] border-2 border-dashed p-6 text-center transition-colors ${
        over
          ? 'border-accent bg-accent-bg'
          : 'border-border bg-surface hover:border-accent/50'
      }`}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt='preview'
          src={preview}
          className='max-h-[260px] max-w-full rounded-[10px] object-contain'
        />
      ) : (
        <>
          <span className='text-[28px]'>🖼️</span>
          <span className='text-[14px] font-semibold text-foreground'>
            {zh ? '点击、拖拽或粘贴图片' : 'Click, drop, or paste an image'}
          </span>
          <span className='text-[12px] text-muted'>
            {zh
              ? '所有处理都在你的浏览器本地完成'
              : 'Everything runs locally in your browser'}
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={(e) => take(e.target.files?.[0])}
      />
    </div>
  );
}

/** A labelled control row used across the image tools. */
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className='flex items-center justify-between gap-3 text-[13px] text-secondary'>
      <span className='font-medium'>{label}</span>
      {children}
    </label>
  );
}

export const imgBtn =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-[9px] px-4 text-[13px] font-semibold transition-colors';
