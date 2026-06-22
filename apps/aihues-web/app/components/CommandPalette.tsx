'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  type: 'tool' | 'blog' | 'page';
}

let globalItems: Item[] | null = null;
let globalLoading = false;
const loadCallbacks: Array<(items: Item[]) => void> = [];

function notifyAll(items: Item[]) {
  for (const cb of loadCallbacks) cb(items);
}

function loadSearchIndex(): Promise<Item[]> {
  if (globalItems) return Promise.resolve(globalItems);
  if (globalLoading) {
    return new Promise((resolve) => {
      loadCallbacks.push(resolve);
    });
  }

  globalLoading = true;

  // Try sessionStorage first
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('aihues-search-index');
      if (raw) {
        globalItems = JSON.parse(raw) as Item[];
        globalLoading = false;
        return Promise.resolve(globalItems);
      }
    } catch {
      // ignore
    }
  }

  return fetch('/api/search-index')
    .then((res) => res.json())
    .then((data: Item[]) => {
      globalItems = data;
      globalLoading = false;
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('aihues-search-index', JSON.stringify(data));
        } catch {
          // ignore
        }
      }
      notifyAll(data);
      return data;
    })
    .catch(() => {
      globalLoading = false;
      return [];
    });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState<Item[]>(globalItems ?? []);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const ensureLoaded = useCallback(() => {
    if (items.length > 0) return;
    setLoading(true);
    loadSearchIndex().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [items.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase() ?? '').includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [query, items]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSelectedIndex(0));
    return () => cancelAnimationFrame(id);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) ensureLoaded();
          return next;
        });
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [ensureLoaded]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const onSelect = useCallback(
    (item: Item) => {
      setOpen(false);
      setQuery('');
      router.push(item.href);
    },
    [router]
  );

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelect(filtered[selectedIndex]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[300] flex items-start justify-center bg-black/40 pt-[15vh] backdrop-blur-sm'
      onClick={() => setOpen(false)}
    >
      <div
        className='w-full max-w-[560px] overflow-hidden rounded-[16px] border border-[#e8e2d9] bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className='flex items-center gap-3 border-b border-[#e8e2d9] px-4 py-3'>
          <svg
            className='h-5 w-5 text-[#a8a29e]'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>
          <input
            ref={inputRef}
            className='flex-1 bg-transparent text-[15px] text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none'
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder='Search tools, resources, pages...'
            type='text'
            value={query}
          />
          {loading && (
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-[#e8e2d9] border-t-[#b45309]' />
          )}
          <kbd className='hidden rounded-[6px] border border-[#e8e2d9] bg-[#f5f0e8] px-2 py-0.5 text-[11px] font-medium text-[#78716c] sm:block'>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className='max-h-[400px] overflow-y-auto py-2'>
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-[#b45309]/8'
                    : 'hover:bg-[#f5f0e8]'
                }`}
                onClick={() => onSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                type='button'
              >
                <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f5f0e8] text-sm'>
                  {item.type === 'tool'
                    ? '🔧'
                    : item.type === 'blog'
                      ? '📝'
                      : '📄'}
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-[#1c1917]'>
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className='text-xs text-[#a8a29e]'>{item.subtitle}</p>
                  )}
                </div>
                {index === selectedIndex && (
                  <kbd className='rounded-[4px] bg-[#f5f0e8] px-1.5 py-0.5 text-[10px] text-[#78716c]'>
                    ↵
                  </kbd>
                )}
              </button>
            ))
          ) : (
            <p className='px-4 py-8 text-center text-sm text-[#a8a29e]'>
              No results found for &quot;{query}&quot;
            </p>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center gap-4 border-t border-[#e8e2d9] px-4 py-2 text-[11px] text-[#a8a29e]'>
          <span className='flex items-center gap-1'>
            <kbd className='rounded-[4px] border border-[#e8e2d9] bg-[#f5f0e8] px-1 py-0.5'>
              ↑↓
            </kbd>
            Navigate
          </span>
          <span className='flex items-center gap-1'>
            <kbd className='rounded-[4px] border border-[#e8e2d9] bg-[#f5f0e8] px-1 py-0.5'>
              ↵
            </kbd>
            Select
          </span>
          <span className='ml-auto'>{items.length} items indexed</span>
        </div>
      </div>
    </div>
  );
}
