'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Maximize2, Minus, Plus } from 'lucide-react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface MermaidToolProps {
  locale: Locale;
}

/* Lazy, cached Mermaid loader — the library (~1MB with d3) is dynamically
   imported client-side so it never enters the main bundle, and initialised once
   with a strict security level since the diagram source is user input. The
   theme is mapped to the Kimi design tokens (calm warm surfaces, terracotta
   accent borders, muted edges) so diagrams match the rest of the site. */
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => {
      m.default.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: 'inherit',
        themeVariables: {
          background: 'transparent',
          primaryColor: '#f3f1ea',
          primaryTextColor: '#1a1a19',
          primaryBorderColor: '#c2502e',
          secondaryColor: '#ece9e0',
          tertiaryColor: '#faf9f5',
          lineColor: '#8f8d85',
          mainBkg: '#f3f1ea',
          nodeBorder: '#c2502e',
          clusterBkg: '#faf9f5',
          clusterBorder: '#dedcd3',
          titleColor: '#1a1a19',
          edgeLabelBackground: '#faf9f5',
          noteBkgColor: '#faf9f5',
          noteTextColor: '#1a1a19',
          noteBorderColor: '#dedcd3',
        },
      });
      return m.default;
    });
  }
  return mermaidPromise;
}

/* Natural size of a rendered diagram in its own user units — from the viewBox,
   falling back to the content bounding box. */
function naturalSize(svgEl: SVGSVGElement): { w: number; h: number } {
  const vb = svgEl.viewBox?.baseVal;
  if (vb && vb.width && vb.height) return { w: vb.width, h: vb.height };
  try {
    const bb = svgEl.getBBox();
    return { w: bb.width, h: bb.height };
  } catch {
    return { w: 0, h: 0 };
  }
}

/* Pin the rendered SVG to its natural (viewBox) pixel size and drop Mermaid's
   max-width cap, so the diagram has a stable intrinsic size that the wrapper's
   CSS transform can scale from — sizing lives in the markup (survives React
   re-renders), zoom lives in the transform. */
function bakeNatural(svgStr: string): string {
  const vb = svgStr.match(/viewBox="([\d.eE+\- ]+)"/);
  if (!vb) return svgStr;
  const parts = vb[1].trim().split(/\s+/).map(Number);
  const w = parts[2];
  const h = parts[3];
  if (!w || !h) return svgStr;
  return svgStr.replace(/<svg\b([^>]*)>/, (_full, attrs: string) => {
    const cleaned = attrs
      .replace(/\swidth="[^"]*"/, '')
      .replace(/\sheight="[^"]*"/, '')
      .replace(/max-width:\s*[^;"]*;?/g, '');
    return `<svg${cleaned} width="${w}" height="${h}">`;
  });
}

const TEMPLATES: {
  key: string;
  label: string;
  labelZh: string;
  code: string;
}[] = [
  {
    key: 'flowchart',
    label: 'Flowchart',
    labelZh: '流程图',
    code: `flowchart TD
  A[Start] --> B{Decision?}
  B -- Yes --> C[Do this]
  B -- No --> D[Do that]
  C --> E[End]
  D --> E`,
  },
  {
    key: 'sequence',
    label: 'Sequence',
    labelZh: '时序图',
    code: `sequenceDiagram
  participant U as User
  participant S as Server
  U->>S: Request
  S-->>U: Response`,
  },
  {
    key: 'class',
    label: 'Class',
    labelZh: '类图',
    code: `classDiagram
  class Animal {
    +String name
    +makeSound()
  }
  Animal <|-- Dog
  Animal <|-- Cat`,
  },
  {
    key: 'state',
    label: 'State',
    labelZh: '状态图',
    code: `stateDiagram-v2
  [*] --> Idle
  Idle --> Running : start
  Running --> Idle : stop
  Running --> [*]`,
  },
  {
    key: 'er',
    label: 'ER',
    labelZh: 'ER 图',
    code: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains`,
  },
  {
    key: 'gantt',
    label: 'Gantt',
    labelZh: '甘特图',
    code: `gantt
  title Project plan
  dateFormat YYYY-MM-DD
  section Phase 1
  Design  :a1, 2026-01-01, 7d
  Build   :after a1, 10d`,
  },
  {
    key: 'pie',
    label: 'Pie',
    labelZh: '饼图',
    code: `pie title Market share
  "Alpha" : 40
  "Beta" : 35
  "Gamma" : 25`,
  },
];

export default function MermaidTool({ locale }: MermaidToolProps) {
  const zh = locale === 'zh';
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [rendering, setRendering] = useState(false);
  const idRef = useRef(0);
  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    const src = code.trim();
    const handle = window.setTimeout(async () => {
      if (!src) {
        if (alive) {
          setSvg('');
          setError('');
        }
        return;
      }
      if (alive) setRendering(true);
      try {
        const mermaid = await loadMermaid();
        await mermaid.parse(src); // throws on invalid syntax (no DOM side effect)
        idRef.current += 1;
        const { svg: out } = await mermaid.render(`mmd-${idRef.current}`, src);
        if (!alive) return;
        setSvg(bakeNatural(out));
        setError('');
      } catch (e) {
        if (!alive) return;
        setSvg('');
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (alive) setRendering(false);
      }
    }, 300);
    return () => {
      alive = false;
      window.clearTimeout(handle);
    };
  }, [code]);

  function downloadSvg() {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Reset to the default view: scale the diagram to fill the viewport and centre
  // it.
  const fitToView = useCallback(() => {
    const cont = viewportRef.current;
    const svgEl = contentRef.current?.querySelector<SVGSVGElement>('svg');
    if (!cont || !svgEl) return;
    const { w: sw, h: sh } = naturalSize(svgEl);
    if (!sw || !sh) return;
    const cw = cont.clientWidth;
    const ch = cont.clientHeight;
    const pad = 32;
    const scale = Math.max(0.05, Math.min((cw - pad) / sw, (ch - pad) / sh, 3));
    setView({ scale, tx: (cw - sw * scale) / 2, ty: (ch - sh * scale) / 2 });
  }, []);

  // Auto-fit whenever a new diagram renders (double rAF so layout has settled).
  useEffect(() => {
    if (!svg) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(fitToView);
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [svg, fitToView]);

  // Re-fit when the viewport is resized.
  useEffect(() => {
    window.addEventListener('resize', fitToView);
    return () => window.removeEventListener('resize', fitToView);
  }, [fitToView]);

  // Wheel zoom toward the cursor (native non-passive listener so it can
  // preventDefault the page scroll).
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      setView((v) => {
        const next = Math.min(
          10,
          Math.max(0.1, v.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12))
        );
        const k = next / v.scale;
        const c = clampTxTy(cx - (cx - v.tx) * k, cy - (cy - v.ty) * k, next);
        return { scale: next, tx: c.tx, ty: c.ty };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Keep at least a sliver of the diagram inside the viewport so it can never
  // be panned/zoomed completely out of sight.
  function clampTxTy(tx: number, ty: number, scale: number) {
    const cont = viewportRef.current;
    const svgEl = contentRef.current?.querySelector<SVGSVGElement>('svg');
    if (!cont || !svgEl) return { tx, ty };
    const { w, h } = naturalSize(svgEl);
    if (!w || !h) return { tx, ty };
    const sw = w * scale;
    const sh = h * scale;
    const m = 64;
    return {
      tx: Math.min(cont.clientWidth - m, Math.max(m - sw, tx)),
      ty: Math.min(cont.clientHeight - m, Math.max(m - sh, ty)),
    };
  }

  function zoomBy(factor: number) {
    const el = viewportRef.current;
    if (!el) return;
    const cx = el.clientWidth / 2;
    const cy = el.clientHeight / 2;
    setView((v) => {
      const next = Math.min(10, Math.max(0.1, v.scale * factor));
      const k = next / v.scale;
      const c = clampTxTy(cx - (cx - v.tx) * k, cy - (cy - v.ty) * k, next);
      return { scale: next, tx: c.tx, ty: c.ty };
    });
  }

  // Drag to pan — handled via window listeners (not pointer capture, which is
  // unreliable) so the gesture survives the pointer leaving the element.
  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
    setDragging(true);
    const move = (ev: PointerEvent) => {
      setView((v) => {
        const c = clampTxTy(
          start.tx + (ev.clientX - start.x),
          start.ty + (ev.clientY - start.y),
          v.scale
        );
        return { ...v, tx: c.tx, ty: c.ty };
      });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      setDragging(false);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.mermaid.title')}
        desc={t(locale, 'tool.mermaid.desc')}
      />

      <div className='mb-4 flex flex-wrap gap-1.5'>
        <span className='mr-1 self-center text-[11px] font-bold uppercase tracking-[0.14em] text-muted'>
          {zh ? '模板' : 'Templates'}
        </span>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.key}
            type='button'
            onClick={() => setCode(tpl.code)}
            className='rounded-full border border-border bg-bg px-3 py-1 text-[12px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
          >
            {zh ? tpl.labelZh : tpl.label}
          </button>
        ))}
      </div>

      <ToolGrid>
        <Panel
          label={zh ? '图表代码' : 'Diagram code'}
          hint={zh ? 'Mermaid 语法' : 'Mermaid syntax'}
          action={<CopyButton text={code} />}
        >
          <textarea
            className='min-h-[560px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={'flowchart TD\n  A --> B'}
            spellCheck={false}
          />
          {error ? (
            <div className='max-h-[120px] overflow-auto border-t border-border px-4 py-3 font-mono text-[12px] leading-relaxed text-[#ff3849]'>
              {error}
            </div>
          ) : null}
        </Panel>

        <Panel
          label={zh ? '预览' : 'Preview'}
          action={
            svg ? (
              <div className='flex gap-2'>
                <CopyButton text={svg} label={zh ? '复制 SVG' : 'Copy SVG'} />
                <button
                  type='button'
                  onClick={downloadSvg}
                  className='inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-border bg-bg px-3 text-[12px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
                >
                  {zh ? '下载' : 'Download'}
                </button>
              </div>
            ) : null
          }
        >
          <div
            ref={viewportRef}
            onPointerDown={svg ? onPointerDown : undefined}
            onDragStart={(e) => e.preventDefault()}
            className={`relative min-h-[560px] flex-1 touch-none select-none overflow-hidden ${
              svg ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
          >
            {svg ? (
              <>
                <div
                  ref={contentRef}
                  className='absolute left-0 top-0 origin-top-left [&_svg]:!max-w-none'
                  style={{
                    transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`,
                  }}
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className='absolute bottom-3 right-3 flex items-center gap-0.5 rounded-full border border-border bg-bg p-1'
                >
                  <button
                    type='button'
                    onClick={() => zoomBy(1 / 1.2)}
                    aria-label={zh ? '缩小' : 'Zoom out'}
                    className='flex h-7 w-7 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface hover:text-accent'
                  >
                    <Minus size={15} />
                  </button>
                  <span className='min-w-[46px] text-center text-[12px] font-semibold tabular-nums text-secondary'>
                    {Math.round(view.scale * 100)}%
                  </span>
                  <button
                    type='button'
                    onClick={() => zoomBy(1.2)}
                    aria-label={zh ? '放大' : 'Zoom in'}
                    className='flex h-7 w-7 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface hover:text-accent'
                  >
                    <Plus size={15} />
                  </button>
                  <span className='mx-0.5 h-4 w-px bg-border' />
                  <button
                    type='button'
                    onClick={fitToView}
                    title={zh ? '重置视图' : 'Reset view'}
                    aria-label={zh ? '重置视图' : 'Reset view'}
                    className='flex h-7 w-7 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface hover:text-accent'
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
              </>
            ) : (
              <div className='flex h-full min-h-[560px] items-center justify-center p-4'>
                <span className='text-[13px] text-muted'>
                  {error
                    ? zh
                      ? '修正语法后即可渲染'
                      : 'Fix the syntax to render'
                    : rendering
                      ? zh
                        ? '渲染中…'
                        : 'Rendering…'
                      : zh
                        ? '图表预览将显示在这里'
                        : 'Your diagram appears here'}
                </span>
              </div>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
