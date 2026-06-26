'use client';

import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

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

const RATIOS: { key: string; label: string; value: number | undefined }[] = [
  { key: 'free', label: 'Free', value: undefined },
  { key: '1', label: '1:1', value: 1 },
  { key: '43', label: '4:3', value: 4 / 3 },
  { key: '169', label: '16:9', value: 16 / 9 },
];

export default function ImageCropTool({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [src, setSrc] = useState<string | null>(null);
  const [name, setName] = useState('image');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [ratio, setRatio] = useState<number | undefined>(undefined);
  const [areaPx, setAreaPx] = useState<Area | null>(null);
  const [out, setOut] = useState<{ url: string; blob: Blob } | null>(null);

  const pick = (f: File) => {
    setSrc(URL.createObjectURL(f));
    setName(baseName(f.name));
    setOut(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const onComplete = useCallback((_: Area, px: Area) => setAreaPx(px), []);

  const run = async () => {
    if (!src || !areaPx) return;
    const img = await loadImage(src);
    const rad = (rotation * Math.PI) / 180;
    // Render rotated source onto a safe canvas, then cut the crop rect.
    const safe = Math.max(img.naturalWidth, img.naturalHeight) * 2;
    const tmp = document.createElement('canvas');
    tmp.width = safe;
    tmp.height = safe;
    const tctx = tmp.getContext('2d');
    if (!tctx) return;
    tctx.translate(safe / 2, safe / 2);
    tctx.rotate(rad);
    tctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    const data = tctx.getImageData(0, 0, safe, safe);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = areaPx.width;
    outCanvas.height = areaPx.height;
    const octx = outCanvas.getContext('2d');
    if (!octx) return;
    octx.putImageData(
      data,
      Math.round(-safe / 2 + img.naturalWidth / 2 - areaPx.x),
      Math.round(-safe / 2 + img.naturalHeight / 2 - areaPx.y)
    );
    const blob = await new Promise<Blob | null>((resolve) =>
      outCanvas.toBlob(resolve, 'image/png')
    );
    if (blob) setOut({ url: URL.createObjectURL(blob), blob });
  };

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '图片工具' : 'Image Tools'}
        title={zh ? '图片裁剪' : 'Image Cropper'}
        desc={
          zh
            ? '拖拽、缩放、旋转后裁剪图片，支持固定比例，本地导出 PNG。'
            : 'Pan, zoom, rotate and crop — with fixed ratios — and export a PNG locally.'
        }
      />
      <ToolGrid>
        <Panel label={zh ? '裁剪' : 'Crop'}>
          <div className='p-4'>
            {src ? (
              <>
                <div className='relative h-[300px] w-full overflow-hidden rounded-[12px] bg-black/80'>
                  <Cropper
                    image={src}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={ratio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onComplete}
                  />
                </div>
                <div className='mt-4 space-y-3'>
                  <Field label={zh ? '比例' : 'Ratio'}>
                    <div className='flex gap-1.5'>
                      {RATIOS.map((r) => (
                        <button
                          key={r.key}
                          type='button'
                          onClick={() => setRatio(r.value)}
                          className={`h-8 rounded-[8px] px-2.5 text-[12px] font-semibold transition-colors ${
                            ratio === r.value
                              ? 'bg-accent text-white'
                              : 'border border-border bg-bg text-secondary hover:border-accent'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={`${zh ? '缩放' : 'Zoom'}`}>
                    <input
                      type='range'
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className='w-40 accent-[color:var(--accent)]'
                    />
                  </Field>
                  <Field label={`${zh ? '旋转' : 'Rotation'} ${rotation}°`}>
                    <input
                      type='range'
                      min={0}
                      max={360}
                      step={1}
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className='w-40 accent-[color:var(--accent)]'
                    />
                  </Field>
                  <button
                    type='button'
                    onClick={run}
                    className={`${imgBtn} w-full bg-accent text-white hover:bg-accent-light`}
                  >
                    {zh ? '裁剪' : 'Crop'}
                  </button>
                </div>
              </>
            ) : (
              <ImageDropzone onFile={pick} zh={zh} />
            )}
          </div>
        </Panel>

        <Panel label={zh ? '结果' : 'Result'}>
          <div className='flex min-h-[260px] flex-col items-center justify-center gap-4 p-4'>
            {out ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt='cropped'
                  src={out.url}
                  className='max-h-[280px] max-w-full rounded-[10px] object-contain'
                />
                <button
                  type='button'
                  onClick={() => downloadBlob(out.blob, `${name}-cropped.png`)}
                  className={`${imgBtn} border border-border bg-bg text-secondary hover:border-accent hover:text-accent`}
                >
                  {zh ? '下载' : 'Download'}
                </button>
              </>
            ) : (
              <span className='text-[13px] text-muted'>
                {zh ? '裁剪结果将显示在这里' : 'Cropped image appears here'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
