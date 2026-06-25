'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { renderToStaticMarkup } from 'react-dom/server';

import { getStoryScene, type Anim, type El } from '@/lib/story-scenes';
import { STORY_SVG } from '@/components/story-svg';
import { ScenePaused } from '@/components/story-scenes/_kit';

/* StoryArt — renders a hand-authored, content-specific scene for a story (no
   templates, no randomness): each article has its own scene in story-scenes.ts,
   a list of vector primitives + simple time-based motion. This file is just the
   generic interpreter that draws those primitives and animates them. */

function animXf(a: Anim | undefined, t: number) {
  const xf = { tx: 0, ty: 0, sc: 1, rot: 0, op: 1, dash: 0 };
  if (!a) return xf;
  const ph = ('ph' in a && a.ph) || 0;
  const spd = ('spd' in a && a.spd) || 1;
  const p = t * 0.001 * spd + ph;
  switch (a.k) {
    case 'pulse':
      xf.sc = 1 + (a.amp ?? 0.12) * Math.sin(p);
      break;
    case 'drift':
      xf.tx = (a.dx ?? 0.03) * Math.sin(p);
      xf.ty = (a.dy ?? 0.03) * Math.cos(p);
      break;
    case 'bob':
      xf.ty = (a.amp ?? 0.04) * Math.sin(p);
      break;
    case 'rot':
      xf.rot = p;
      break;
    case 'blink':
      xf.op = Math.sin(p) > 0 ? 1 : 0.15;
      break;
    case 'dash':
      xf.dash = -p * 30;
      break;
  }
  return xf;
}

function draw(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  el: El,
  t: number
) {
  const S = Math.min(W, H);
  const X = (v: number) => v * W;
  const Y = (v: number) => v * H;
  const L = (v: number) => v * S; // length scaled to the short side

  // anchor (centre) for transforms
  let cx = 0;
  let cy = 0;
  if (el.t === 'r') {
    cx = X(el.x + el.w / 2);
    cy = Y(el.y + el.h / 2);
  } else if (el.t === 'c' || el.t === 'ar') {
    cx = X(el.x);
    cy = Y(el.y);
  } else if (el.t === 'tx') {
    cx = X(el.x);
    cy = Y(el.y);
  } else if (el.t === 'ln') {
    cx = X((el.a[0] + el.b[0]) / 2);
    cy = Y((el.a[1] + el.b[1]) / 2);
  } else if (el.t === 'pl') {
    cx = X(el.pts.reduce((s, p) => s + p[0], 0) / el.pts.length);
    cy = Y(el.pts.reduce((s, p) => s + p[1], 0) / el.pts.length);
  }

  const xf = animXf(el.anim, t);
  ctx.save();
  ctx.globalAlpha = (el.op ?? 1) * xf.op;
  ctx.translate(cx + xf.tx * W, cy + xf.ty * H);
  ctx.rotate((el.rot ?? 0) + xf.rot);
  ctx.scale(xf.sc, xf.sc);
  ctx.translate(-cx, -cy);
  if (el.glow) {
    ctx.shadowBlur = 16;
    ctx.shadowColor = el.glow;
  }

  const stroke = () => {
    if (!el.stroke) return;
    ctx.strokeStyle = el.stroke;
    ctx.lineWidth = L((el.lw ?? 1) / 100);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  };
  const fill = () => {
    if (!el.fill) return;
    ctx.fillStyle = el.fill;
    ctx.fill();
  };

  if (el.t === 'r') {
    const x = X(el.x);
    const y = Y(el.y);
    const w = X(el.w);
    const h = Y(el.h);
    const r = L((el.rad ?? 0) / 100);
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
    fill();
    stroke();
  } else if (el.t === 'c') {
    ctx.beginPath();
    ctx.arc(X(el.x), Y(el.y), L(el.rad), 0, Math.PI * 2);
    fill();
    stroke();
  } else if (el.t === 'ar') {
    ctx.beginPath();
    ctx.arc(X(el.x), Y(el.y), L(el.rad), el.a0, el.a1);
    stroke();
  } else if (el.t === 'ln') {
    if (el.dash) ctx.setLineDash([L(el.dash[0] / 100), L(el.dash[1] / 100)]);
    ctx.lineDashOffset = L(xf.dash / 100);
    ctx.beginPath();
    ctx.moveTo(X(el.a[0]), Y(el.a[1]));
    ctx.lineTo(X(el.b[0]), Y(el.b[1]));
    stroke();
    ctx.setLineDash([]);
  } else if (el.t === 'pl') {
    if (el.dash) ctx.setLineDash([L(el.dash[0] / 100), L(el.dash[1] / 100)]);
    ctx.lineDashOffset = L(xf.dash / 100);
    ctx.beginPath();
    el.pts.forEach((p, i) =>
      i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))
    );
    if (el.close) ctx.closePath();
    fill();
    stroke();
    ctx.setLineDash([]);
  } else if (el.t === 'tx') {
    ctx.fillStyle = el.fill;
    ctx.font = `${el.w ?? 800} ${Math.round(el.size * H)}px "Radiance", "Noto Sans", ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = el.align ?? 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(el.s, X(el.x), Y(el.y));
  }
  ctx.restore();
}

export function StoryArt({
  slug,
  tag,
  alt,
  className = '',
  animated = false,
  playOnHover = false,
}: {
  slug: string;
  tag: string;
  /** Accessible/SEO description — crawlers + screen readers treat the scene as
   *  a described image rather than a decorative blob. */
  alt?: string;
  className?: string;
  animated?: boolean;
  /** Render the scene static (no running animation) until hovered — used on the
   *  listing grid so a dozen scenes don't all animate at once. */
  playOnHover?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const Svg = STORY_SVG[slug];
  // Rough.js path data isn't byte-identical between the Node (SSR) and browser
  // renders, so the vector scenes render client-only after mount to avoid a
  // hydration mismatch. The wrapper keeps role="img" + aria-label in the server
  // HTML, so the SEO/a11y signal is unaffected.
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState(false);
  // A frozen (paused) snapshot of the scene — shown on the listing grid until a
  // card is hovered, so a dozen scenes don't all animate at once. Also serves as
  // the self-contained SVG that right-click → download rasterises.
  const [staticHTML, setStaticHTML] = useState('');
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
      if (Svg) {
        setStaticHTML(
          renderToStaticMarkup(
            <ScenePaused.Provider value={true}>
              <MotionConfig reducedMotion='always'>
                <Svg />
              </MotionConfig>
            </ScenePaused.Provider>
          )
        );
      }
    });
    return () => cancelAnimationFrame(id);
  }, [Svg]);

  // The frozen scene as a standalone SVG data URL. Rendered as a real <img> so
  // (a) it's an isolated SVG document — gradient ids never collide between cards
  // — and (b) right-click shows the browser's native image menu (save / copy /
  // open), like any image.
  const imgSrc = useMemo(() => {
    if (!staticHTML) return '';
    const m = staticHTML.match(/<svg[\s\S]*<\/svg>/);
    if (!m) return '';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(m[0]);
  }, [staticHTML]);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const scene = getStoryScene(slug, tag);

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.max(1, Math.round(W * dpr));
      cv.height = Math.max(1, Math.round(H * dpr));
    };
    resize();

    const render = (t: number) => {
      if (W === 0 || H === 0) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, scene.bg[0]);
      bg.addColorStop(1, scene.bg[1]);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      for (const el of scene.el) draw(ctx, W, H, el, t);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!animated) render(0);
    });
    ro.observe(cv);

    if (!animated) {
      render(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(cv);
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) render(ts);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [slug, tag, animated]);

  const live = !playOnHover || hover;
  return (
    <div
      role='img'
      aria-label={alt ?? `${tag} story illustration`}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={playOnHover ? () => setHover(true) : undefined}
      onMouseLeave={playOnHover ? () => setHover(false) : undefined}
    >
      {Svg ? (
        !mounted ? null : (
          <>
            {/* Base layer: the frozen scene as a real <img>. It's always present
                so a right-click (which requires hovering, i.e. the live state)
                lands on an image element → the browser's native image menu. */}
            {imgSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgSrc}
                alt={alt ?? `${tag} story illustration`}
                className='absolute inset-0 h-full w-full object-cover'
              />
            ) : null}
            {/* Live animated scene overlays on hover; pointer-events:none lets
                clicks/right-clicks fall through to the <img> beneath. */}
            {live ? (
              <div className='pointer-events-none absolute inset-0'>
                <Svg />
              </div>
            ) : null}
          </>
        )
      ) : (
        <canvas ref={ref} className='absolute inset-0 h-full w-full' />
      )}
    </div>
  );
}
