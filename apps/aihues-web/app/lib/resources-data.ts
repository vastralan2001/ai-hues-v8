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

const POSTS_PER_PAGE = 12;

export function getAllPosts(): ResourcePost[] {
  const filePath = join(process.cwd(), 'content', 'resources', 'posts.json');
  const json = readFileSync(filePath, 'utf-8');
  const posts: ResourcePost[] = JSON.parse(json);
  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostsByPage(page: number): {
  posts: ResourcePost[];
  totalPages: number;
} {
  const all = getAllPosts();
  const totalPages = Math.ceil(all.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const posts = all.slice(start, start + POSTS_PER_PAGE);
  return { posts, totalPages };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.map((p) => p.tag));
  return Array.from(tags).sort();
}

export function searchPosts(query: string): ResourcePost[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllPosts();
  return getAllPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tag.toLowerCase().includes(q)
  );
}
