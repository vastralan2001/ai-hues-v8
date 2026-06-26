import { readFileSync } from 'fs';
import { join } from 'path';

export interface ResourcePost {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverImage: string;
  /** Where the post came from. Manual posts rank first; auto-generated and
   *  Feishu-synced posts are de-prioritized in listings so the front page
   *  stays curated. */
  source?: 'manual' | 'auto' | 'feishu';
}

const SOURCE_PRIORITY: Record<
  NonNullable<ResourcePost['source']> | 'undefined',
  number
> = {
  manual: 0,
  undefined: 1,
  feishu: 2,
  auto: 3,
};

export function getAllPosts(): ResourcePost[] {
  const filePath = join(process.cwd(), 'content', 'resources', 'posts.json');
  const json = readFileSync(filePath, 'utf-8');
  const posts: ResourcePost[] = JSON.parse(json);
  // Sort by source priority (manual first), then by date descending.
  return posts.sort((a, b) => {
    const pa = SOURCE_PRIORITY[a.source ?? 'undefined'];
    const pb = SOURCE_PRIORITY[b.source ?? 'undefined'];
    if (pa !== pb) return pa - pb;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
