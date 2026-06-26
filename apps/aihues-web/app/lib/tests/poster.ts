/* High-resolution, shareable result poster for a test result. Drawn on a
   canvas so it needs no fonts or libraries beyond the browser. */
import type { TestConfig, TestResult } from '@/lib/tests/types';

const SANS =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const BG = '#faf9f5';
const FG = '#1a1a19';
const SECONDARY = '#57534e';
const MUTED = '#8f8b82';
const BORDER = '#e7e5e4';

function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  weight: number,
  startPx: number
): number {
  let px = startPx;
  ctx.font = `${weight} ${px}px ${SANS}`;
  while (ctx.measureText(text).width > maxW && px > 24) {
    px -= 4;
    ctx.font = `${weight} ${px}px ${SANS}`;
  }
  return px;
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  max: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
      if (lines.length === max - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < max) lines.push(line);
  const used = lines.join(' ').split(/\s+/).length;
  if (used < words.length && lines.length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:]?$/, '…');
  }
  return lines;
}

export async function buildResultPoster(
  config: TestConfig,
  result: TestResult
): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const S = 2;
  const PAD = 84;
  const innerW = W - PAD * 2;

  const canvas = document.createElement('canvas');
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  ctx.scale(S, S);
  ctx.textBaseline = 'alphabetic';

  const acc = result.accent || config.accent || '#c2502e';

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const bandH = 472;
  ctx.fillStyle = hexA(acc, 0.1);
  ctx.fillRect(0, 0, W, bandH);
  ctx.fillStyle = acc;
  ctx.fillRect(0, bandH - 5, 132, 5);

  ctx.textAlign = 'left';

  ctx.fillStyle = acc;
  ctx.font = `800 26px ${SANS}`;
  ctx.fillText(config.name.toUpperCase(), PAD, 132);

  const codePx = fitFont(ctx, result.code, innerW, 900, 132);
  ctx.fillStyle = acc;
  ctx.font = `900 ${codePx}px ${SANS}`;
  ctx.fillText(result.code, PAD, 132 + 36 + codePx * 0.78);

  let y = 132 + 36 + codePx * 0.78 + 64;
  ctx.fillStyle = FG;
  ctx.font = `800 48px ${SANS}`;
  for (const line of wrap(ctx, result.title, innerW, 2)) {
    ctx.fillText(line, PAD, y);
    y += 58;
  }

  if (result.matchPct != null) {
    const label = `${result.matchPct}% match`;
    ctx.font = `700 24px ${SANS}`;
    const tw = ctx.measureText(label).width;
    const pillW = tw + 56;
    const pillH = 46;
    const py = bandH - 46 - pillH;
    ctx.fillStyle = BG;
    roundRect(ctx, PAD, py, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.fillStyle = acc;
    ctx.beginPath();
    ctx.arc(PAD + 26, py + pillH / 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = SECONDARY;
    ctx.fillText(label, PAD + 44, py + pillH / 2 + 8);
  }

  y = bandH + 70;
  ctx.fillStyle = SECONDARY;
  ctx.font = `400 28px ${SANS}`;
  for (const line of wrap(ctx, result.blurb, innerW, 5)) {
    ctx.fillText(line, PAD, y);
    y += 42;
  }

  y += 30;
  ctx.fillStyle = MUTED;
  ctx.font = `800 20px ${SANS}`;
  ctx.fillText(
    (
      config.breakdownLabel ??
      (config.resultStyle === 'sbti' ? 'Soul dimensions' : 'Your breakdown')
    ).toUpperCase(),
    PAD,
    y
  );
  y += 34;

  const bars = result.bars.slice(0, 6);
  for (const b of bars) {
    ctx.fillStyle = FG;
    ctx.font = `600 24px ${SANS}`;
    ctx.textAlign = 'left';
    ctx.fillText(b.label, PAD, y);
    if (b.value) {
      ctx.fillStyle = acc;
      ctx.font = `800 24px ${SANS}`;
      ctx.textAlign = 'right';
      ctx.fillText(b.value, W - PAD, y);
    }
    ctx.textAlign = 'left';
    const trackY = y + 16;
    ctx.fillStyle = BORDER;
    roundRect(ctx, PAD, trackY, innerW, 12, 6);
    ctx.fill();
    const fillW = Math.max(
      12,
      (innerW * Math.min(100, Math.max(0, b.pct))) / 100
    );
    ctx.fillStyle = acc;
    roundRect(ctx, PAD, trackY, fillW, 12, 6);
    ctx.fill();
    y += 64;
  }

  if (result.tags && result.tags.length) {
    y += 8;
    let x = PAD;
    ctx.font = `600 22px ${SANS}`;
    for (const tag of result.tags.slice(0, 6)) {
      const tw = ctx.measureText(tag).width;
      const pillW = tw + 40;
      if (x + pillW > W - PAD) {
        x = PAD;
        y += 52;
      }
      ctx.strokeStyle = BORDER;
      ctx.lineWidth = 2;
      roundRect(ctx, x, y, pillW, 40, 20);
      ctx.stroke();
      ctx.fillStyle = SECONDARY;
      ctx.fillText(tag, x + 20, y + 27);
      x += pillW + 14;
    }
  }

  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, H - 122);
  ctx.lineTo(W - PAD, H - 122);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = acc;
  ctx.beginPath();
  ctx.arc(PAD + 10, H - 74, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = FG;
  ctx.font = `800 30px ${SANS}`;
  ctx.fillText('AIHues', PAD + 30, H - 64);

  ctx.textAlign = 'right';
  ctx.fillStyle = MUTED;
  ctx.font = `500 22px ${SANS}`;
  ctx.fillText(`aihues.com/tests/${config.slug}`, W - PAD, H - 64);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/png'
    );
  });
}

export async function shareOrDownloadPoster(
  blob: Blob,
  filename: string,
  shareText: string
): Promise<void> {
  const file = new File([blob], filename, { type: 'image/png' });
  const nav = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
  };
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], text: shareText });
      return;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
