'use client';

import { useEffect, useRef, useState } from 'react';

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
        setSvg(out);
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
            className='min-h-[440px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
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
          <div className='flex min-h-[440px] flex-1 items-center justify-center overflow-auto p-4'>
            {svg ? (
              <div
                className='mermaid-preview flex w-full items-center justify-center [&_svg]:h-auto [&_svg]:max-w-full'
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
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
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
