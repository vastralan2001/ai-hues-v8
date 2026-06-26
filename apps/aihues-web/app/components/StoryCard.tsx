import Link from 'next/link';

import type { ResourcePost } from '@/lib/resources-data';
import { StoryArt } from '@/components/StoryArt';

/* The canonical Stories card — one component shared by the Stories listing grid
   and the Related Articles rail, so both stay identical in size and layout. */
export default function StoryCard({ post }: { post: ResourcePost }) {
  return (
    <Link
      href={`/stories/${post.slug}`}
      className='card-lift group flex flex-col overflow-hidden rounded-[16px] border border-border bg-surface text-inherit no-underline'
    >
      <div className='relative aspect-[16/9] overflow-hidden'>
        <StoryArt
          slug={post.slug}
          tag={post.tag}
          alt={`${post.title} — illustration`}
          playOnHover
          className='h-full w-full transition-transform duration-500 group-hover:scale-105'
        />
        <span className='absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white'>
          {post.tag}
        </span>
      </div>

      <div className='flex flex-1 flex-col p-5'>
        <h2 className='mb-2 line-clamp-2 text-[18px] font-bold leading-snug text-foreground'>
          {post.title}
        </h2>
        <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-secondary'>
          {post.excerpt}
        </p>
        <div className='mt-auto flex items-center gap-3 text-xs text-muted'>
          <span>{post.date}</span>
          <span className='h-1 w-1 rounded-full bg-border-strong' />
          <span>{post.readTime} read</span>
        </div>
      </div>
    </Link>
  );
}
