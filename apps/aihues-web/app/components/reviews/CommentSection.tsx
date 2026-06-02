'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  rating?: number;
}

const PLACEHOLDER_COMMENTS: Comment[] = [
  {
    id: '1',
    author: '产品体验官',
    content: '这个工具帮我省了不少时间，但输出质量确实需要人工二次打磨。',
    date: '2026-05-20',
    rating: 4,
  },
  {
    id: '2',
    author: '独立开发者小李',
    content: '对比了三个同类产品，这个在易用性上确实做得最好，上手零门槛。',
    date: '2026-05-18',
    rating: 5,
  },
];

export default function CommentSection() {
  const [comments] = useState<Comment[]>(PLACEHOLDER_COMMENTS);
  const [input, setInput] = useState('');

  return (
    <div className='space-y-4'>
      <h3 className='text-[16px] font-bold text-[#1c1917]'>
        用户评论 ({comments.length})
      </h3>

      {/* Input */}
      <div className='rounded-xl border border-[#e7e5e4] bg-white p-3'>
        <textarea
          className='w-full resize-none border-0 bg-transparent text-[14px] text-[#1c1917] outline-none placeholder:text-[#a8a29e]'
          placeholder='用过这个工具？分享你的体验...（后端接入后可提交）'
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className='mt-2 flex items-center justify-between'>
          <span className='text-[11px] text-[#a8a29e]'>
            后端接入后即可提交评论
          </span>
          <button
            className='rounded-lg bg-[#e7e5e4] px-4 py-1.5 text-[13px] font-semibold text-[#a8a29e]'
            disabled
            type='button'
          >
            提交
          </button>
        </div>
      </div>

      {/* List */}
      <div className='space-y-3'>
        {comments.map((c) => (
          <div
            className='rounded-lg border border-[#f5f5f4] bg-[#fafaf9] p-3'
            key={c.id}
          >
            <div className='mb-1 flex items-center gap-2'>
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-[#b45309] text-[10px] font-bold text-white'>
                {c.author[0]}
              </span>
              <span className='text-[13px] font-semibold text-[#1c1917]'>
                {c.author}
              </span>
              <span className='text-[11px] text-[#a8a29e]'>{c.date}</span>
              {c.rating && (
                <span className='ml-auto text-[12px] text-[#b45309]'>
                  {'★'.repeat(c.rating)}
                  {'☆'.repeat(5 - c.rating)}
                </span>
              )}
            </div>
            <p className='pl-8 text-[13px] text-[#57534e]'>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
