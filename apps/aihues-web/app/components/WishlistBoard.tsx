'use client';

import { useEffect, useMemo, useState } from 'react';
import { Wrench, Gamepad2, ClipboardCheck } from 'lucide-react';

import { useI18n } from '@/lib/i18n';
import {
  addWish,
  loadWishes,
  saveWishes,
  voteWish,
} from '@/lib/wishlist-local';
import { event, GA_EVENTS } from '@/lib/gtag';

import type { Wish, WishStatus, WishType } from '@/lib/wishes';

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

const typeMeta: Record<
  WishType,
  {
    label: string;
    labelZh: string;
    icon: typeof Wrench;
    desc: string;
    descZh: string;
  }
> = {
  tool: {
    label: 'Tool',
    labelZh: '工具',
    icon: Wrench,
    desc: 'Browser utilities, AI helpers, dev productivity tools.',
    descZh: '浏览器小工具、AI 助手、开发者效率工具等。',
  },
  game: {
    label: 'Game',
    labelZh: '游戏',
    icon: Gamepad2,
    desc: 'HTML5 mini-games, puzzles, arcade-style experiments.',
    descZh: 'HTML5 小游戏、益智、街机等。',
  },
  test: {
    label: 'Test',
    labelZh: '测试',
    icon: ClipboardCheck,
    desc: 'Fun quizzes, personality tests, and skill challenges.',
    descZh: '趣味测试、性格测试、能力挑战等。',
  },
};

const categories = ['Developer', 'Writing', 'Growth', 'Other'];

function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('aihues-anon-id');
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('aihues-anon-id', id);
  }
  return id;
}

function validateEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function WishlistBoard() {
  const { locale } = useI18n();
  const filterLabels = locale === 'zh' ? filterLabelsZh : filterLabelsEn;

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeType, setActiveType] = useState<WishType>('tool');
  const [filter, setFilter] = useState<WishFilter>('ALL');
  const [sort, setSort] = useState<'popular' | 'newest' | 'status'>('popular');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formReferenceUrl, setFormReferenceUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Developer');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const anonymousId = useMemo(() => getAnonymousId(), []);

  useEffect(() => {
    queueMicrotask(() => {
      const data = loadWishes();
      setWishes(data);
      setLoading(false);
    });

    syncWithServer();
  }, []);

  async function syncWithServer() {
    try {
      const res = await fetch('/api/wishes');
      if (!res.ok) return;
      const data = (await res.json()) as { wishes?: Wish[] };
      if (data.wishes) {
        saveWishes(data.wishes);
        queueMicrotask(() => setWishes(data.wishes ?? []));
      }
    } catch {
      // API unavailable — localStorage data already loaded
    }
  }

  const visibleWishes = useMemo(() => {
    const typeFiltered = wishes.filter((wish) => wish.type === activeType);
    const filtered =
      filter === 'ALL'
        ? typeFiltered
        : typeFiltered.filter((wish) => wish.status === filter);

    return [...filtered].sort((first, second) => {
      if (sort === 'status') {
        return first.status.localeCompare(second.status);
      }
      if (sort === 'newest') {
        return second.date.localeCompare(first.date);
      }
      return second.votes - first.votes;
    });
  }, [filter, sort, wishes, activeType]);

  const topFiveByType = useMemo(() => {
    const result: Record<WishType, Wish[]> = {
      tool: [],
      game: [],
      test: [],
    };
    (['tool', 'game', 'test'] as WishType[]).forEach((type) => {
      result[type] = [...wishes]
        .filter((w) => w.type === type)
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 5);
    });
    return result;
  }, [wishes]);

  async function handleSubmit() {
    if (!formTitle.trim() || !formDesc.trim()) return;

    const title = formTitle.trim();
    const desc = formDesc.trim();
    const email = formEmail.trim();
    const referenceUrl = formReferenceUrl.trim();

    if (email && !validateEmail(email)) {
      setSubmitError(
        locale === 'zh'
          ? '请输入有效的邮箱地址'
          : 'Please enter a valid email address'
      );
      return;
    }

    if (referenceUrl && !isValidUrl(referenceUrl)) {
      setSubmitError(
        locale === 'zh'
          ? '参考链接格式不正确'
          : 'Please enter a valid reference URL'
      );
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    let optimisticWish: Wish | null = null;
    try {
      optimisticWish = addWish({
        title,
        description: desc,
        type: activeType,
        category: activeType === 'tool' ? formCategory : 'Other',
        email,
        referenceUrl,
      });
    } catch {
      optimisticWish = null;
    }
    if (optimisticWish) {
      setWishes((prev) => [...prev, optimisticWish]);
    }

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: desc,
          type: activeType,
          category: activeType === 'tool' ? formCategory : 'Other',
          email,
          referenceUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('Server rejected the wish');
      }

      await syncWithServer();

      setFormTitle('');
      setFormDesc('');
      setFormEmail('');
      setFormReferenceUrl('');
      setSubmitSuccess(true);
      event(GA_EVENTS.wishlistSubmit, {
        category: activeType,
        has_email: !!email,
      });
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
    const previousWishes = [...wishes];

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
    voteWish(wishId, anonymousId, action);
    event(GA_EVENTS.wishlistVote, { wishId, action });

    try {
      const res = await fetch('/api/wishes/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishId, anonymousId, action }),
      });

      if (!res.ok) {
        throw new Error('Server rejected the vote');
      }

      await syncWithServer();
    } catch {
      setWishes(previousWishes);
      saveWishes(previousWishes);
    }
  }

  const typeLabels = useMemo(
    () => ({
      tool: locale === 'zh' ? typeMeta.tool.labelZh : typeMeta.tool.label,
      game: locale === 'zh' ? typeMeta.game.labelZh : typeMeta.game.label,
      test: locale === 'zh' ? typeMeta.test.labelZh : typeMeta.test.label,
    }),
    [locale]
  );

  return (
    <div className='wishlist-layout'>
      {/* Step 1: choose type */}
      <section className='wish-type-section'>
        <h2 className='wish-section-title'>
          {locale === 'zh'
            ? '你想提交哪类需求？'
            : 'What do you want to request?'}
        </h2>
        <div className='wish-type-cards'>
          {(['tool', 'game', 'test'] as WishType[]).map((type) => {
            const meta = typeMeta[type];
            const Icon = meta.icon;
            const active = activeType === type;
            return (
              <button
                key={type}
                aria-pressed={active}
                className={`wish-type-card ${active ? 'wish-type-card--active' : ''}`}
                onClick={() => setActiveType(type)}
                type='button'
              >
                <span className='wish-type-card__icon'>
                  <Icon size={28} strokeWidth={1.8} />
                </span>
                <strong>{locale === 'zh' ? meta.labelZh : meta.label}</strong>
                <span>{locale === 'zh' ? meta.descZh : meta.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: submit form */}
      <section className='wish-form card-lift'>
        <h3 className='wish-form__title'>
          {locale === 'zh'
            ? `提交 ${typeLabels[activeType]} 需求`
            : `Submit a ${typeLabels[activeType]} request`}
        </h3>

        <div className='wish-form__field'>
          <label htmlFor='wish-title'>
            {locale === 'zh' ? '名称' : 'Name'}
          </label>
          <input
            id='wish-title'
            maxLength={60}
            placeholder={locale === 'zh' ? '给它起个名字' : 'Give it a name'}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>

        <div className='wish-form__field'>
          <label htmlFor='wish-desc'>
            {locale === 'zh' ? '描述' : 'Description'}
          </label>
          <textarea
            id='wish-desc'
            placeholder={
              locale === 'zh'
                ? '简单描述它应该做什么...'
                : 'Describe what it should do...'
            }
            rows={3}
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
        </div>

        {activeType === 'tool' && (
          <div className='wish-form__field'>
            <label>{locale === 'zh' ? '分类' : 'Category'}</label>
            <div className='segmented-control'>
              {categories.map((c) => (
                <button
                  key={c}
                  aria-pressed={formCategory === c}
                  onClick={() => setFormCategory(c)}
                  type='button'
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='wish-form__field'>
          <label htmlFor='wish-url'>
            {locale === 'zh' ? '参考链接（可选）' : 'Reference URL (optional)'}
          </label>
          <input
            id='wish-url'
            maxLength={200}
            placeholder={
              locale === 'zh'
                ? '类似产品、游戏或测试的链接'
                : 'Link to a similar product, game, or test'
            }
            type='url'
            value={formReferenceUrl}
            onChange={(e) => setFormReferenceUrl(e.target.value)}
          />
        </div>

        <div className='wish-form__field'>
          <label htmlFor='wish-email'>
            {locale === 'zh' ? '邮箱（可选）' : 'Email (optional)'}
          </label>
          <input
            id='wish-email'
            maxLength={80}
            placeholder={
              locale === 'zh' ? '上线后通知你' : 'Get notified when it ships'
            }
            type='email'
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />
        </div>

        <div className='wish-form__actions'>
          <button
            className='button button--primary'
            disabled={
              submitting ||
              !formTitle.trim() ||
              !formDesc.trim() ||
              !formEmail.trim()
            }
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
      </section>

      {/* Top 5 leaderboards for all three types */}
      <section className='wish-leaderboards'>
        {(['tool', 'game', 'test'] as WishType[]).map((type) => {
          const meta = typeMeta[type];
          const list = topFiveByType[type];
          return (
            <div className='wish-leaderboard card-lift' key={type}>
              <div className='wish-leaderboard__header'>
                <span aria-hidden='true'>🏆</span>
                <strong>
                  {locale === 'zh'
                    ? `Top 5 ${meta.labelZh} 需求`
                    : `Top 5 ${meta.label} Requests`}
                </strong>
              </div>
              <div className='wish-leaderboard__list'>
                {list.length === 0 ? (
                  <p className='wish-leaderboard__empty'>
                    {locale === 'zh' ? '暂无需求' : 'No requests yet'}
                  </p>
                ) : (
                  list.map((wish, idx) => (
                    <div className='wish-leaderboard__item' key={wish.id}>
                      <strong>{idx + 1}</strong>
                      <span>{wish.title}</span>
                      <small>
                        {wish.votes} {locale === 'zh' ? '票' : 'votes'}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Current type wish list */}
      <section className='wish-list-section'>
        <div className='board-controls'>
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
        </div>

        <p className='wishlist-count'>
          {visibleWishes.length} {locale === 'zh' ? '条' : 'items'}
        </p>

        {loading && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            {locale === 'zh' ? '加载中...' : 'Loading...'}
          </p>
        )}

        {!loading && (
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
                      <span>{typeLabels[wish.type]}</span>
                      {wish.type === 'tool' && <span>{wish.category}</span>}
                      <span>{wish.status}</span>
                    </div>
                    <p>{wish.description}</p>
                    {wish.referenceUrl && (
                      <a
                        className='wish-reference-link'
                        href={wish.referenceUrl}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {locale === 'zh' ? '参考链接' : 'Reference'}
                      </a>
                    )}
                    <small>{wish.date}</small>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
