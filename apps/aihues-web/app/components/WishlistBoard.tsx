'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { rankingHref } from '@/lib/routes';

type WishStatus = 'PLANNED' | 'IN PROGRESS' | 'DONE';
type WishFilter = 'ALL' | WishStatus;

// TODO(上线前): 以下为假数据，需从后端 API 获取真实投票数据
const WISHLIST_ITEMS = [
  {
    rank: 1,
    title: 'AI PDF Summarizer',
    description:
      'Upload long PDFs and get a concise outline, key quotes, and action items.',
    category: 'AI Writing',
    status: 'IN PROGRESS',
    votes: 248,
    date: '2026-05-20',
  },
  {
    rank: 2,
    title: 'Image Background Remover',
    description:
      'Remove backgrounds from product images and avatars with one click.',
    category: 'Utility',
    status: 'PLANNED',
    votes: 197,
    date: '2026-05-18',
  },
  {
    rank: 3,
    title: 'API Mock Server',
    description:
      'Paste OpenAPI or JSON examples and generate a temporary mock endpoint.',
    category: 'Developer',
    status: 'PLANNED',
    votes: 176,
    date: '2026-05-16',
  },
  {
    rank: 4,
    title: 'Resume Bullet Rewriter',
    description:
      'Turn rough work notes into quantified resume bullets in multiple tones.',
    category: 'AI Writing',
    status: 'DONE',
    votes: 142,
    date: '2026-05-12',
  },
  {
    rank: 5,
    title: 'SQL Schema Visualizer',
    description:
      'Convert CREATE TABLE statements into a clean relationship diagram.',
    category: 'Developer',
    status: 'IN PROGRESS',
    votes: 121,
    date: '2026-05-10',
  },
  {
    rank: 6,
    title: 'Meeting Notes Cleaner',
    description:
      'Paste messy meeting notes and receive decisions, owners, and next steps.',
    category: 'Utility',
    status: 'PLANNED',
    votes: 108,
    date: '2026-05-08',
  },
  {
    rank: 7,
    title: 'Prompt Version Diff',
    description:
      'Compare two prompt versions and highlight instruction, tone, and output changes.',
    category: 'Developer',
    status: 'PLANNED',
    votes: 96,
    date: '2026-05-06',
  },
  {
    rank: 8,
    title: 'Product Hunt Launch Kit',
    description:
      'Generate tagline, maker comment, launch checklist, and social copy.',
    category: 'Growth',
    status: 'DONE',
    votes: 83,
    date: '2026-05-03',
  },
  {
    rank: 9,
    title: 'Invoice OCR Checker',
    description:
      'Extract invoice fields and flag missing tax IDs, totals, and dates.',
    category: 'Utility',
    status: 'PLANNED',
    votes: 71,
    date: '2026-05-01',
  },
  {
    rank: 10,
    title: 'CSS Clamp Generator',
    description:
      'Generate responsive clamp() font sizes and spacing scales from min/max values.',
    category: 'Developer',
    status: 'DONE',
    votes: 64,
    date: '2026-04-29',
  },
] satisfies Array<{
  rank: number;
  title: string;
  description: string;
  category: string;
  status: WishStatus;
  votes: number;
  date: string;
}>;

const filterLabels: Record<WishFilter, string> = {
  ALL: 'All',
  'IN PROGRESS': 'In Progress',
  DONE: 'Done',
  PLANNED: 'Planned',
};

export function WishlistBoard() {
  const [filter, setFilter] = useState<WishFilter>('ALL');
  const [sort, setSort] = useState<'popular' | 'newest' | 'status'>('popular');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const visibleWishes = useMemo(() => {
    const filtered =
      filter === 'ALL'
        ? WISHLIST_ITEMS
        : WISHLIST_ITEMS.filter((wish) => wish.status === filter);

    return [...filtered].sort((first, second) => {
      if (sort === 'status') {
        return first.status.localeCompare(second.status);
      }
      if (sort === 'newest') {
        return second.date.localeCompare(first.date);
      }
      return second.votes - first.votes;
    });
  }, [filter, sort]);

  function toggleVote(title: string) {
    setVotedIds((current) => {
      const next = new Set(current);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }

  return (
    <>
      <div className='wish-form'>
        <input maxLength={60} placeholder='Tool name...' />
        <textarea placeholder='Describe what it does...' />
        <div className='wish-form__row'>
          <select defaultValue='Developer'>
            <option>Developer</option>
            <option>Writing</option>
            <option>Growth</option>
            <option>Other</option>
          </select>
          <button className='button button--primary' type='button'>
            Submit
          </button>
        </div>
        <p className='wish-hint'>Everyone can see and vote after submission</p>
      </div>

      <section className='wishlist-top'>
        <div className='wishlist-top__header'>
          <div>
            <span>🏆</span>
            <strong>Top 5 Requests</strong>
          </div>
          <Link href={rankingHref}>Full Leaderboard →</Link>
        </div>
        <div className='wishlist-top__list'>
          {WISHLIST_ITEMS.slice(0, 5).map((wish) => (
            <div className='wishlist-top__item' key={wish.title}>
              <strong>{wish.rank}</strong>
              <span>{wish.title}</span>
              <small>{wish.votes} votes</small>
            </div>
          ))}
        </div>
      </section>

      <section className='board-controls'>
        <div className='segmented-control' aria-label='Wishlist status'>
          {(Object.keys(filterLabels) as WishFilter[]).map((status) => (
            <button
              aria-pressed={filter === status}
              key={status}
              onClick={() => setFilter(status)}
              type='button'
            >
              {filterLabels[status]}
            </button>
          ))}
        </div>
        <label className='select-label'>
          <select
            onChange={(event) => setSort(event.target.value as typeof sort)}
            value={sort}
          >
            <option value='popular'>Popular (by votes)</option>
            <option value='newest'>Newest (by time)</option>
            <option value='status'>By Status</option>
          </select>
        </label>
      </section>

      <p className='wishlist-count'>{visibleWishes.length} items</p>

      <div className='wish-list'>
        {visibleWishes.map((wish) => {
          const hasVoted = votedIds.has(wish.title);
          const votes = wish.votes + (hasVoted ? 1 : 0);

          return (
            <article className='wish-card' key={wish.title}>
              <button
                aria-pressed={hasVoted}
                className='vote-button'
                onClick={() => toggleVote(wish.title)}
                type='button'
              >
                <span aria-hidden='true'>👍</span>
                <strong>{votes}</strong>
              </button>
              <div>
                <h2>{wish.title}</h2>
                <div className='tag-row'>
                  <span>{wish.category}</span>
                  <span>{wish.status}</span>
                </div>
                <p>{wish.description}</p>
                <small>{wish.date}</small>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
