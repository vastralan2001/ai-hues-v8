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
}

export function getAllPosts(): ResourcePost[] {
  const filePath = join(process.cwd(), 'content', 'resources', 'posts.json');
  const json = readFileSync(filePath, 'utf-8');
  const posts: ResourcePost[] = JSON.parse(json);
  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
