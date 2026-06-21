'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Search, Sparkles } from 'lucide-react';

import { ToolIcon } from '@/components/ToolIcon';
import { examplesFromPicks } from '@/lib/spotlight-picks';

const EXAMPLES = examplesFromPicks();

interface HeroSearchProps {
  searchPlaceholder: string;
  askAILabel: string;
}

interface Hit {
  slug: string;
  title: string;
  subtitle: string;
  href: string;
  type: 'tool' | 'game' | 'test';
  score: number;
}

export default function HeroSearch({
  searchPlaceholder,
  askAILabel,
}: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phIdx, setPhIdx] = useState(0);
  const [phShown, setPhShown] = useState(true);

  useEffect(() => {
    if (EXAMPLES.length <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const iv = setInterval(() => {
      setPhShown(false);
      window.setTimeout(() => {
        setPhIdx((i) => (i + 1) % EXAMPLES.length);
        setPhShown(true);
      }, 320);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  async function runSearch(term: string) {
    const q = term.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { results?: Hit[] };
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // debounced live semantic search
  useEffect(() => {
    const id = setTimeout(() => {
      void runSearch(query);
    }, 320);
    return () => clearTimeout(id);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) go(results[0].href);
    else if (query.trim()) router.push(`/tools?q=${encodeURIComponent(query)}`);
  }

  const showPanel = open && query.trim().length >= 2;

  return (
    <div className='relative mx-auto w-full max-w-[620px] lg:mx-0'>
      <form onSubmit={onSubmit}>
        <div className='group flex items-center gap-2 rounded-[20px] border border-border bg-white px-2 py-2 shadow-[0_2px_24px_rgba(26,26,25,0.06)] transition-all duration-300 hover:border-border-strong hover:shadow-[0_8px_32px_rgba(26,26,25,0.1)] focus-within:border-accent/40 focus-within:shadow-[0_8px_32px_rgba(217,119,87,0.14)]'>
          <span className='pl-3 text-muted transition-colors group-focus-within:text-accent'>
            <Search size={18} strokeWidth={2} />
          </span>
          <div className='relative min-w-0 flex-1'>
            <input
              className='w-full border-0 bg-transparent px-2 text-[16px] text-foreground outline-none'
              name='q'
              placeholder=''
              aria-label={searchPlaceholder}
              type='text'
              autoComplete='off'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                blurTimer.current = setTimeout(() => setOpen(false), 160);
              }}
            />
            {query === '' && EXAMPLES.length > 0 ? (
              <span
                aria-hidden='true'
                className='pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center'
              >
                <span
                  className='truncate text-[16px] text-muted'
                  style={{
                    opacity: phShown ? 1 : 0,
                    transition: 'opacity 300ms ease',
                  }}
                >
                  {EXAMPLES[phIdx]}
                </span>
              </span>
            ) : null}
          </div>
          <button
            className='inline-flex items-center gap-1.5 rounded-[14px] bg-accent px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-md active:translate-y-0'
            type='submit'
          >
            <Sparkles size={15} strokeWidth={2.2} />
            {askAILabel}
          </button>
        </div>
      </form>

      {showPanel ? (
        <div
          className='absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[18px] border border-border bg-white text-left shadow-[0_18px_50px_-18px_rgba(26,26,25,0.28)]'
          onMouseDown={(e) => {
            // keep focus so the click registers before blur closes the panel
            e.preventDefault();
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
        >
          {loading && results.length === 0 ? (
            <div className='flex items-center gap-2 px-5 py-4 text-[14px] text-secondary'>
              <Loader2 size={16} className='animate-spin text-accent' />
              {askAILabel}…
            </div>
          ) : results.length === 0 ? (
            <div className='px-5 py-4 text-[14px] text-muted'>
              No matches — try describing what you need.
            </div>
          ) : (
            <ul className='max-h-[360px] overflow-auto py-1'>
              {results.map((r) => (
                <li key={`${r.type}-${r.slug}`}>
                  <Link
                    href={r.href}
                    onClick={() => go(r.href)}
                    className='flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-accent-bg'
                  >
                    <span className='flex min-w-0 items-center gap-3'>
                      <span className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-bg text-accent'>
                        <ToolIcon slug={r.slug} size={14} />
                      </span>
                      <span className='min-w-0'>
                        <span className='block truncate text-[14px] font-semibold text-foreground'>
                          {r.title}
                        </span>
                        <span className='block truncate text-[12px] capitalize text-muted'>
                          {r.subtitle}
                        </span>
                      </span>
                    </span>
                    <span className='shrink-0 text-[11px] font-semibold tabular-nums text-muted'>
                      {Math.round(r.score * 100)}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
