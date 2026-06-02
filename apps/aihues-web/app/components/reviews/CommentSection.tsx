'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface Reply {
  id: string;
  author: string;
  content: string;
  date: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  rating?: number;
  likes: number;
  liked: boolean;
  replies: Reply[];
  isPlaceholder?: boolean;
}

const AVATAR_COLORS = [
  'bg-[#b45309]',
  'bg-[#15803d]',
  'bg-[#0369a1]',
  'bg-[#7c3aed]',
  'bg-[#be123c]',
  'bg-[#0f766e]',
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(dateStr: string, locale: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 30) return dateStr;
  if (days > 0) return locale === 'zh' ? `${days}天前` : `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return locale === 'zh' ? `${hours}小时前` : `${hours}h ago`;
  const mins = Math.floor(diff / 60000);
  if (mins > 0) return locale === 'zh' ? `${mins}分钟前` : `${mins}m ago`;
  return locale === 'zh' ? '刚刚' : 'Just now';
}

function getDefaultComments(locale: string): Comment[] {
  if (locale === 'zh') {
    return [
      {
        id: '1',
        author: '产品体验官',
        content:
          '这个工具帮我省了不少时间，但输出质量确实需要人工二次打磨。总体来说性价比不错，适合快速产出初稿。',
        date: '2026-05-28',
        rating: 4,
        likes: 12,
        liked: false,
        isPlaceholder: true,
        replies: [
          {
            id: 'r1',
            author: 'AIHues Team',
            content: '感谢反馈！我们正在优化输出质量，预计下版本会有明显提升。',
            date: '2026-05-29',
          },
        ],
      },
      {
        id: '2',
        author: '独立开发者小李',
        content:
          '对比了三个同类产品，这个在易用性上确实做得最好，上手零门槛。界面清爽，没有乱七八糟的广告。',
        date: '2026-05-26',
        rating: 5,
        likes: 8,
        liked: false,
        isPlaceholder: true,
        replies: [],
      },
      {
        id: '3',
        author: 'SEO小王',
        content:
          '作为SEO从业者，这个工具的关键词建议功能给了我不少灵感。不过希望能增加竞品分析模块。',
        date: '2026-05-24',
        rating: 4,
        likes: 5,
        liked: false,
        isPlaceholder: true,
        replies: [],
      },
      {
        id: '4',
        author: '前端阿伟',
        content:
          '纯前端运行，不用担心数据泄露，这点很赞。但复杂场景下处理能力还是有限。',
        date: '2026-05-22',
        rating: 3,
        likes: 3,
        liked: false,
        isPlaceholder: true,
        replies: [],
      },
      {
        id: '5',
        author: '出海创业者Amy',
        content:
          '冷邮件模板帮我在一周内拿到了3个回复！虽然需要微调，但比自己从零写效率高太多了。',
        date: '2026-05-20',
        rating: 5,
        likes: 15,
        liked: false,
        isPlaceholder: true,
        replies: [
          {
            id: 'r2',
            author: 'BD老兵',
            content: '同感同感！建议结合LinkedIn一起用，转化率更高。',
            date: '2026-05-21',
          },
        ],
      },
      {
        id: '6',
        author: '技术写作者',
        content:
          '希望能支持导出功能，以及保存历史记录。现在每次生成都得手动复制粘贴，有点麻烦。',
        date: '2026-05-18',
        rating: 3,
        likes: 2,
        liked: false,
        isPlaceholder: true,
        replies: [],
      },
    ];
  }
  return [
    {
      id: '1',
      author: 'Product Reviewer',
      content:
        'This tool saved me a lot of time, but the output quality still needs manual refinement. Overall good value for money, great for quick drafts.',
      date: '2026-05-28',
      rating: 4,
      likes: 12,
      liked: false,
      isPlaceholder: true,
      replies: [
        {
          id: 'r1',
          author: 'AIHues Team',
          content:
            "Thanks for the feedback! We're optimizing output quality and expect significant improvements in the next release.",
          date: '2026-05-29',
        },
      ],
    },
    {
      id: '2',
      author: 'Indie Dev Alex',
      content:
        'Compared three similar tools — this one has the best UX with zero learning curve. Clean interface, no annoying ads.',
      date: '2026-05-26',
      rating: 5,
      likes: 8,
      liked: false,
      isPlaceholder: true,
      replies: [],
    },
    {
      id: '3',
      author: 'SEO Pro Mike',
      content:
        'As an SEO practitioner, the keyword suggestion feature gave me lots of inspiration. Would love to see a competitor analysis module added.',
      date: '2026-05-24',
      rating: 4,
      likes: 5,
      liked: false,
      isPlaceholder: true,
      replies: [],
    },
    {
      id: '4',
      author: 'Frontend Dev Wei',
      content:
        'Runs entirely client-side, no data privacy concerns — love that. But processing power is limited for complex scenarios.',
      date: '2026-05-22',
      rating: 3,
      likes: 3,
      liked: false,
      isPlaceholder: true,
      replies: [],
    },
    {
      id: '5',
      author: 'Startup Founder Amy',
      content:
        'The cold email templates got me 3 replies in one week! Needs some tweaking, but way more efficient than writing from scratch.',
      date: '2026-05-20',
      rating: 5,
      likes: 15,
      liked: false,
      isPlaceholder: true,
      replies: [
        {
          id: 'r2',
          author: 'BD Veteran',
          content:
            'Totally agree! Try combining it with LinkedIn for even better conversion rates.',
          date: '2026-05-21',
        },
      ],
    },
    {
      id: '6',
      author: 'Tech Writer',
      content:
        'Would love export functionality and history saving. Having to manually copy-paste every time is a bit tedious.',
      date: '2026-05-18',
      rating: 3,
      likes: 2,
      liked: false,
      isPlaceholder: true,
      replies: [],
    },
  ];
}

type SortMode = 'newest' | 'top';

export default function CommentSection({ slug }: { slug?: string }) {
  const { locale, t } = useI18n();
  const storageKey = slug
    ? `aihues-comments-${slug}`
    : 'aihues-comments-global';

  const [comments, setComments] = useState<Comment[]>(() => {
    if (typeof window === 'undefined') return getDefaultComments(locale);
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : getDefaultComments(locale);
    } catch {
      return getDefaultComments(locale);
    }
  });

  // Switch placeholder comments when locale changes (preserve user comments)
  useEffect(() => {
    queueMicrotask(() => {
      setComments((prev) => {
        const userComments = prev.filter((c) => !c.isPlaceholder);
        const newPlaceholders = getDefaultComments(locale).map((c) => ({
          ...c,
          likes: c.likes,
          liked: false,
        }));
        return [...newPlaceholders, ...userComments];
      });
    });
  }, [locale]);
  const [input, setInput] = useState('');
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState<SortMode>('top');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [authorName, setAuthorName] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  }, [comments, storageKey]);

  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sort === 'newest') {
      list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      list.sort((a, b) => b.likes - a.likes);
    }
    return list;
  }, [comments, sort]);

  const avgRating = useMemo(() => {
    const rated = comments.filter((c) => c.rating);
    if (!rated.length) return 0;
    return +(
      rated.reduce((s, c) => s + (c.rating || 0), 0) / rated.length
    ).toFixed(1);
  }, [comments]);

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    const name = authorName.trim() || t('comment.anonymous');
    const newComment: Comment = {
      id: Date.now().toString(),
      author: name,
      content: input.trim(),
      date: new Date().toISOString().split('T')[0],
      rating: rating || undefined,
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    setInput('');
    setRating(0);
  }, [input, rating, authorName, t]);

  const handleLike = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
              liked: !c.liked,
            }
          : c
      )
    );
  }, []);

  const handleReply = useCallback(
    (commentId: string) => {
      if (!replyInput.trim()) return;
      const name = authorName.trim() || t('comment.anonymous');
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: `r-${Date.now()}`,
                    author: name,
                    content: replyInput.trim(),
                    date: new Date().toISOString().split('T')[0],
                  },
                ],
              }
            : c
        )
      );
      setReplyInput('');
      setReplyTo(null);
    },
    [replyInput, authorName, t]
  );

  return (
    <div className='space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='text-[16px] font-bold text-[#1c1917]'>
            {t('comment.userComments')}
          </h3>
          <span className='rounded-full bg-[#f5f5f4] px-2 py-0.5 text-[12px] font-semibold text-[#57534e]'>
            {comments.length}
          </span>
          {avgRating > 0 && (
            <span className='text-[13px] text-[#b45309]'>
              {'★'.repeat(Math.round(avgRating))}
              {'☆'.repeat(5 - Math.round(avgRating))} {avgRating}
            </span>
          )}
        </div>
        <div className='flex items-center gap-1 rounded-lg border border-[#e7e5e4] p-0.5'>
          {(['top', 'newest'] as SortMode[]).map((m) => (
            <button
              key={m}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                sort === m
                  ? 'bg-[#1c1917] text-white'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
              onClick={() => setSort(m)}
              type='button'
            >
              {m === 'top' ? t('comment.hot') : t('comment.newest')}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className='rounded-xl border border-[#e7e5e4] bg-white p-4'>
        <div className='mb-3 flex items-center gap-2'>
          <input
            className='flex-1 rounded-lg border border-[#e7e5e4] bg-[#fafaf9] px-3 py-1.5 text-[13px] outline-none placeholder:text-[#a8a29e] focus:border-[#b45309]'
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder={t('comment.nickname')}
            type='text'
            value={authorName}
          />
          <div className='flex items-center gap-1'>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                className={`text-[16px] transition-colors ${
                  s <= rating
                    ? 'text-[#b45309]'
                    : 'text-[#d6d3d1] hover:text-[#b45309]'
                }`}
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => {}}
                type='button'
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <textarea
          className='w-full resize-none rounded-lg border border-[#e7e5e4] bg-[#fafaf9] p-3 text-[14px] text-[#1c1917] outline-none placeholder:text-[#a8a29e] focus:border-[#b45309]'
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('comment.placeholder')}
          rows={3}
          value={input}
        />
        <div className='mt-3 flex items-center justify-between'>
          <span className='text-[11px] text-[#a8a29e]'>
            {t('comment.localStorage')}
          </span>
          <button
            className={`rounded-lg px-5 py-2 text-[13px] font-semibold transition-colors ${
              input.trim()
                ? 'bg-[#b45309] text-white hover:bg-[#92400e]'
                : 'bg-[#e7e5e4] text-[#a8a29e]'
            }`}
            disabled={!input.trim()}
            onClick={handleSubmit}
            type='button'
          >
            {t('comment.submit')}
          </button>
        </div>
      </div>

      {/* List */}
      <div className='space-y-4'>
        {sortedComments.map((c) => (
          <div
            className='rounded-xl border border-[#f5f5f4] bg-[#fafaf9] p-4'
            key={c.id}
          >
            <div className='mb-2 flex items-center gap-2.5'>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${avatarColor(c.author)}`}
              >
                {c.author[0]}
              </span>
              <span className='text-[13px] font-semibold text-[#1c1917]'>
                {c.author}
              </span>
              <span className='text-[11px] text-[#a8a29e]'>
                {timeAgo(c.date, locale)}
              </span>
              {c.rating && (
                <span className='ml-auto text-[12px] text-[#b45309]'>
                  {'★'.repeat(c.rating)}
                  {'☆'.repeat(5 - c.rating)}
                </span>
              )}
            </div>
            <p className='pl-9 text-[13px] leading-relaxed text-[#57534e]'>
              {c.content}
            </p>

            {/* Actions */}
            <div className='mt-2 flex items-center gap-4 pl-9'>
              <button
                className={`flex items-center gap-1 text-[12px] transition-colors ${
                  c.liked
                    ? 'text-[#b45309]'
                    : 'text-[#a8a29e] hover:text-[#b45309]'
                }`}
                onClick={() => handleLike(c.id)}
                type='button'
              >
                <span>{c.liked ? '❤️' : '🤍'}</span>
                <span>{c.likes}</span>
              </button>
              <button
                className='text-[12px] text-[#a8a29e] hover:text-[#1c1917]'
                onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                type='button'
              >
                {t('comment.reply')}
              </button>
            </div>

            {/* Reply input */}
            {replyTo === c.id && (
              <div className='mt-3 flex gap-2 pl-9'>
                <input
                  className='flex-1 rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-[13px] outline-none placeholder:text-[#a8a29e] focus:border-[#b45309]'
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply(c.id)}
                  placeholder={t('comment.writeReply')}
                  type='text'
                  value={replyInput}
                />
                <button
                  className='rounded-lg bg-[#1c1917] px-4 py-2 text-[12px] font-semibold text-white hover:opacity-80'
                  onClick={() => handleReply(c.id)}
                  type='button'
                >
                  {t('comment.reply')}
                </button>
              </div>
            )}

            {/* Replies */}
            {c.replies.length > 0 && (
              <div className='mt-3 space-y-2 border-l-2 border-[#e7e5e4] pl-6'>
                {c.replies.map((r) => (
                  <div className='rounded-lg bg-white p-3' key={r.id}>
                    <div className='mb-1 flex items-center gap-2'>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${avatarColor(r.author)}`}
                      >
                        {r.author[0]}
                      </span>
                      <span className='text-[12px] font-semibold text-[#1c1917]'>
                        {r.author}
                      </span>
                      <span className='text-[10px] text-[#a8a29e]'>
                        {timeAgo(r.date, locale)}
                      </span>
                    </div>
                    <p className='pl-7 text-[12px] text-[#57534e]'>
                      {r.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
