'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useI18n } from '@/lib/i18n';
import { rankingHref } from '@/lib/routes';

import type { Wish, WishStatus } from '@/lib/wishes';

type WishFilter = 'ALL' | WishStatus;

const filterLabelsEn: Record<WishFilter, string> = {
  ALL: 'All',
  'IN PROGRESS': 'In Progress',
  DONE: 'Done',
  PLANNED: 'Planned',
};

const filterLabelsZh: Record<WishFilter, string> = {
  ALL: '全部',
  'IN PROGRESS': '进行中',
  DONE: '已完成',
  PLANNED: '计划中',
};

function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('aihues-anon-id');
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('aihues-anon-id', id);
  }
  return id;
}

export function WishlistBoard() {
  const { locale } = useI18n();
  const filterLabels = locale === 'zh' ? filterLabelsZh : filterLabelsEn;

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState<WishFilter>('ALL');
  const [sort, setSort] = useState<'popular' | 'newest' | 'status'>('popular');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Developer');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const anonymousId = useMemo(() => getAnonymousId(), []);

  const fetchWishes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wishes');
      const data = (await res.json()) as { wishes?: Wish[] };
      setWishes(data.wishes ?? []);
      setError('');
    } catch {
      setError(
        locale === 'zh'
          ? '加载失败，请刷新重试'
          : 'Failed to load. Please refresh.'
      );
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchWishes();
    });
  }, [fetchWishes]);

  const visibleWishes = useMemo(() => {
    const filtered =
      filter === 'ALL'
        ? wishes
        : wishes.filter((wish) => wish.status === filter);

    return [...filtered].sort((first, second) => {
      if (sort === 'status') {
        return first.status.localeCompare(second.status);
      }
      if (sort === 'newest') {
        return second.date.localeCompare(first.date);
      }
      return second.votes - first.votes;
    });
  }, [filter, sort, wishes]);

  const topFive = useMemo(() => {
    return [...wishes].sort((a, b) => b.votes - a.votes).slice(0, 5);
  }, [wishes]);

  async function handleSubmit() {
    if (!formTitle.trim() || !formDesc.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDesc.trim(),
          category: formCategory,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || 'Submit failed');
      }

      setFormTitle('');
      setFormDesc('');
      setSubmitSuccess(true);
      await fetchWishes();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : locale === 'zh'
            ? '提交失败'
            : 'Submit failed'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleVote(wishId: string) {
    const wish = wishes.find((w) => w.id === wishId);
    if (!wish) return;

    const hasVoted = wish.voters.includes(anonymousId);
    const action = hasVoted ? 'down' : 'up';

    // Optimistic UI update
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id !== wishId) return w;
        const voted = w.voters.includes(anonymousId);
        return {
          ...w,
          votes: voted ? Math.max(0, w.votes - 1) : w.votes + 1,
          voters: voted
            ? w.voters.filter((v) => v !== anonymousId)
            : [...w.voters, anonymousId],
        };
      })
    );

    try {
      const res = await fetch('/api/wishes/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishId, anonymousId, action }),
      });

      if (!res.ok) {
        // Rollback on failure
        setWishes((prev) =>
          prev.map((w) => {
            if (w.id !== wishId) return w;
            const voted = w.voters.includes(anonymousId);
            return {
              ...w,
              votes: voted ? Math.max(0, w.votes - 1) : w.votes + 1,
              voters: voted
                ? w.voters.filter((v) => v !== anonymousId)
                : [...w.voters, anonymousId],
            };
          })
        );
      }
    } catch {
      // Rollback on network error
      setWishes((prev) =>
        prev.map((w) => {
          if (w.id !== wishId) return w;
          const voted = w.voters.includes(anonymousId);
          return {
            ...w,
            votes: voted ? Math.max(0, w.votes - 1) : w.votes + 1,
            voters: voted
              ? w.voters.filter((v) => v !== anonymousId)
              : [...w.voters, anonymousId],
          };
        })
      );
    }
  }

  return (
    <>
      <div className='wish-form'>
        <input
          maxLength={60}
          placeholder={locale === 'zh' ? '工具名称...' : 'Tool name...'}
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <textarea
          placeholder={
            locale === 'zh' ? '描述它的功能...' : 'Describe what it does...'
          }
          rows={3}
          value={formDesc}
          onChange={(e) => setFormDesc(e.target.value)}
        />
        <div className='wish-form__row'>
          <select
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
          >
            <option>Developer</option>
            <option>Writing</option>
            <option>Growth</option>
            <option>Other</option>
          </select>
          <button
            className='button button--primary'
            disabled={submitting || !formTitle.trim() || !formDesc.trim()}
            onClick={handleSubmit}
            type='button'
          >
            {submitting
              ? locale === 'zh'
                ? '提交中...'
                : 'Submitting...'
              : locale === 'zh'
                ? '提交'
                : 'Submit'}
          </button>
        </div>
        {submitSuccess && (
          <p className='wish-hint' style={{ color: '#22c55e' }}>
            {locale === 'zh' ? '提交成功！' : 'Submitted successfully!'}
          </p>
        )}
        {submitError && (
          <p className='wish-hint' style={{ color: '#ef4444' }}>
            {submitError}
          </p>
        )}
        {!submitSuccess && !submitError && (
          <p className='wish-hint'>
            {locale === 'zh'
              ? '所有人都可以看到并投票'
              : 'Everyone can see and vote after submission'}
          </p>
        )}
      </div>

      <section className='wishlist-top'>
        <div className='wishlist-top__header'>
          <div>
            <span>🏆</span>
            <strong>{locale === 'zh' ? 'Top 5 需求' : 'Top 5 Requests'}</strong>
          </div>
          <Link href={rankingHref}>
            {locale === 'zh' ? '完整排行榜 →' : 'Full Leaderboard →'}
          </Link>
        </div>
        <div className='wishlist-top__list'>
          {topFive.map((wish, idx) => (
            <div className='wishlist-top__item' key={wish.id}>
              <strong>{idx + 1}</strong>
              <span>{wish.title}</span>
              <small>
                {wish.votes} {locale === 'zh' ? '票' : 'votes'}
              </small>
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
            <option value='popular'>
              {locale === 'zh' ? '最热（按票数）' : 'Popular (by votes)'}
            </option>
            <option value='newest'>
              {locale === 'zh' ? '最新（按时间）' : 'Newest (by time)'}
            </option>
            <option value='status'>
              {locale === 'zh' ? '按状态' : 'By Status'}
            </option>
          </select>
        </label>
      </section>

      <p className='wishlist-count'>
        {visibleWishes.length} {locale === 'zh' ? '条' : 'items'}
      </p>

      {loading && (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          {locale === 'zh' ? '加载中...' : 'Loading...'}
        </p>
      )}

      {error && !loading && (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className='wish-list'>
          {visibleWishes.map((wish) => {
            const hasVoted = wish.voters.includes(anonymousId);

            return (
              <article className='wish-card' key={wish.id}>
                <button
                  aria-pressed={hasVoted}
                  className='vote-button'
                  onClick={() => toggleVote(wish.id)}
                  type='button'
                >
                  <span aria-hidden='true'>👍</span>
                  <strong>{wish.votes}</strong>
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
      )}
    </>
  );
}
