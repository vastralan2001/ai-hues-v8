'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Brain,
  Gamepad2,
  Loader2,
  Search,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import { ToolIcon } from '@/components/ToolIcon';
import type { CatalogSearchHit } from '@/lib/catalog-api';
import { type BrandCategory, categoryThemeStyle } from '@/lib/category-brand';

type HitType = CatalogSearchHit['type'];

const TYPE_META: Record<
  HitType,
  { cat: BrandCategory; label: string; plural: string; icon: LucideIcon }
> = {
  tool: { cat: 'tools', label: 'Tool', plural: 'Tools', icon: Wrench },
  game: { cat: 'games', label: 'Game', plural: 'Games', icon: Gamepad2 },
  test: { cat: 'tests', label: 'Test', plural: 'Tests', icon: Brain },
  story: { cat: 'stories', label: 'Story', plural: 'Stories', icon: BookOpen },
};

const TABS: { key: 'all' | HitType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'tool', label: 'Tools' },
  { key: 'game', label: 'Games' },
  { key: 'test', label: 'Tests' },
  { key: 'story', label: 'Stories' },
];

function ResultCard({ hit }: { hit: CatalogSearchHit }) {
  const meta = TYPE_META[hit.type];
  const Icon = meta.icon;
  const useToolIcon = hit.type === 'tool' || hit.type === 'test';
  return (
    <Link
      href={hit.href}
      style={categoryThemeStyle(meta.cat)}
      className='card-lift group flex items-start gap-3.5 rounded-[16px] border border-border bg-surface p-4 text-inherit no-underline'
    >
      <span
        className='flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-white'
        style={{ background: 'var(--color-accent)' }}
      >
        {useToolIcon ? (
          <ToolIcon slug={hit.slug} size={20} className='text-white' />
        ) : (
          <Icon size={20} strokeWidth={2} />
        )}
      </span>
      <span className='min-w-0 flex-1'>
        <span className='mb-1 inline-flex items-center rounded-full bg-accent-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent'>
          {meta.label}
        </span>
        <span className='block truncate text-[15px] font-bold text-foreground'>
          {hit.title}
        </span>
        <span className='block truncate text-[13px] capitalize text-secondary'>
          {hit.subtitle}
        </span>
      </span>
    </Link>
  );
}

export default function SearchContent({
  initialQuery,
  initialResults,
}: {
  initialQuery: string;
  initialResults: CatalogSearchHit[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<CatalogSearchHit[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'all' | HitType>('all');
  // Track the last query we already hold results for, so the SSR payload isn't
  // re-fetched on mount.
  const lastFetched = useRef(initialQuery.trim());

  useEffect(() => {
    const q = query.trim();
    const id = setTimeout(() => {
      if (q === lastFetched.current) return;
      lastFetched.current = q;
      // keep the address bar shareable without re-running the server component
      window.history.replaceState(
        null,
        '',
        q ? `/search?q=${encodeURIComponent(q)}` : '/search'
      );
      if (q.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d: { results?: CatalogSearchHit[] }) =>
          setResults(d.results ?? [])
        )
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 320);
    return () => clearTimeout(id);
  }, [query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: results.length };
    for (const h of results) c[h.type] = (c[h.type] ?? 0) + 1;
    return c;
  }, [results]);

  const grouped = useMemo(() => {
    const g: Record<HitType, CatalogSearchHit[]> = {
      tool: [],
      game: [],
      test: [],
      story: [],
    };
    for (const h of results) g[h.type].push(h);
    return g;
  }, [results]);

  const hasQuery = query.trim().length >= 2;
  const filtered = tab === 'all' ? results : grouped[tab];

  return (
    <section className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)] pb-24 pt-10'>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />

      <div className='mt-7 max-w-[680px]'>
        <h1 className='text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-foreground'>
          Search
        </h1>
        <p className='mt-3 text-[16px] leading-relaxed text-secondary'>
          One box for every tool, game, test and story.
        </p>
      </div>

      {/* search box */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className='mt-6 flex items-center gap-2 rounded-[18px] border border-border bg-white px-2 py-2 shadow-[0_2px_24px_rgba(26,26,25,0.06)] focus-within:border-border-strong'
      >
        <span className='pl-3 text-muted'>
          {loading ? (
            <Loader2 size={18} className='animate-spin' />
          ) : (
            <Search size={18} strokeWidth={2} />
          )}
        </span>
        <input
          autoFocus
          className='min-w-0 flex-1 border-0 bg-transparent px-2 text-[16px] text-foreground outline-none'
          placeholder='Describe what you need…'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {/* tabs */}
      {hasQuery ? (
        <div className='mt-6 flex flex-wrap gap-2'>
          {TABS.map((t) => {
            const n = counts[t.key] ?? 0;
            const active = tab === t.key;
            if (t.key !== 'all' && n === 0) return null;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  active
                    ? 'border-foreground bg-foreground text-white'
                    : 'border-border bg-surface text-secondary hover:border-border-strong'
                }`}
              >
                {t.label}
                <span
                  className={`tabular-nums ${active ? 'text-white/70' : 'text-muted'}`}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* results */}
      <div className='mt-8'>
        {!hasQuery ? (
          <p className='text-[15px] text-muted'>
            Start typing to search across everything on AIHues.
          </p>
        ) : results.length === 0 ? (
          <p className='text-[15px] text-muted'>
            {loading
              ? 'Searching…'
              : `No matches for “${query.trim()}” — try describing what you need.`}
          </p>
        ) : tab === 'all' ? (
          <div className='flex flex-col gap-10'>
            {(['tool', 'game', 'test', 'story'] as HitType[])
              .filter((t) => grouped[t].length > 0)
              .map((t) => (
                <div key={t}>
                  <div className='mb-4 flex items-center justify-between'>
                    <h2 className='text-[18px] font-extrabold tracking-tight text-foreground'>
                      {TYPE_META[t].plural}
                    </h2>
                    {grouped[t].length > 6 ? (
                      <button
                        onClick={() => setTab(t)}
                        className='text-[13px] font-semibold text-accent hover:underline'
                      >
                        View all {grouped[t].length}
                      </button>
                    ) : null}
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {grouped[t].slice(0, 6).map((h) => (
                      <ResultCard key={`${h.type}-${h.slug}`} hit={h} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filtered.map((h) => (
              <ResultCard key={`${h.type}-${h.slug}`} hit={h} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
