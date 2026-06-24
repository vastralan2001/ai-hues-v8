'use client';

import { useState } from 'react';
import exifr from 'exifr';

import type { Locale } from '@/lib/dict';

import { Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';
import {
  baseName,
  downloadBlob,
  imgBtn,
  ImageDropzone,
  loadImage,
} from './_image';

type Row = { key: string; value: string };

function toRows(data: Record<string, unknown>): Row[] {
  const rows: Row[] = [];
  for (const [key, raw] of Object.entries(data)) {
    if (raw == null) continue;
    let value: string;
    if (raw instanceof Date) value = raw.toISOString();
    else if (Array.isArray(raw)) value = raw.join(', ');
    else if (typeof raw === 'object') continue;
    else value = String(raw);
    if (value.length > 80) value = `${value.slice(0, 80)}…`;
    rows.push({ key, value });
  }
  return rows.sort((a, b) => a.key.localeCompare(b.key));
}

export default function ExifViewerTool({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setBusy(true);
    setGps(null);
    try {
      const data = await exifr.parse(f, true).catch(() => null);
      setRows(data ? toRows(data as Record<string, unknown>) : []);
      const g = await exifr.gps(f).catch(() => null);
      if (g && typeof g.latitude === 'number')
        setGps({ lat: g.latitude, lng: g.longitude });
    } finally {
      setBusy(false);
    }
  };

  const downloadStripped = async () => {
    if (!preview || !file) return;
    const img = await loadImage(preview);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, 0.95)
    );
    if (blob)
      downloadBlob(blob, `${baseName(file.name)}-clean.${type.split('/')[1]}`);
  };

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '图片工具' : 'Image Tools'}
        title={zh ? 'EXIF 查看器' : 'EXIF Viewer'}
        desc={
          zh
            ? '读取图片的拍摄参数、设备与 GPS 等元数据，并可下载去除所有元数据的副本。'
            : 'Inspect a photo’s camera, device and GPS metadata — and download a copy with all metadata stripped.'
        }
      />
      <ToolGrid>
        <Panel label={zh ? '图片' : 'Image'}>
          <div className='p-4'>
            <ImageDropzone onFile={pick} zh={zh} preview={preview} />
            {file ? (
              <div className='mt-4 flex items-center justify-between gap-3'>
                {gps ? (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${gps.lat}&mlon=${gps.lng}#map=15/${gps.lat}/${gps.lng}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[12px] font-semibold text-accent underline'
                  >
                    📍 {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
                  </a>
                ) : (
                  <span className='text-[12px] text-muted'>
                    {zh ? '无 GPS 信息' : 'No GPS data'}
                  </span>
                )}
                <button
                  type='button'
                  onClick={downloadStripped}
                  className={`${imgBtn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
                >
                  {zh ? '下载无元数据副本' : 'Download stripped'}
                </button>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel label={zh ? '元数据' : 'Metadata'}>
          <div className='max-h-[420px] min-h-[260px] overflow-auto p-4'>
            {busy ? (
              <span className='text-[13px] text-muted'>
                {zh ? '读取中…' : 'Reading…'}
              </span>
            ) : rows == null ? (
              <span className='text-[13px] text-muted'>
                {zh ? '元数据将显示在这里' : 'Metadata appears here'}
              </span>
            ) : rows.length === 0 ? (
              <span className='text-[13px] text-muted'>
                {zh ? '该图片没有可读的元数据' : 'No readable metadata found'}
              </span>
            ) : (
              <table className='w-full text-[12px]'>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.key} className='border-b border-border/60'>
                      <td className='py-1.5 pr-3 font-semibold text-secondary'>
                        {r.key}
                      </td>
                      <td className='py-1.5 font-mono text-foreground'>
                        {r.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
