import { readFileSync } from 'fs';
import { join } from 'path';

export interface BlogPost {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverImage: string;
}

const POSTS_PER_PAGE = 12;

export function getAllPosts(): BlogPost[] {
  const filePath = join(process.cwd(), 'content', 'blog', 'posts.json');
  const json = readFileSync(filePath, 'utf-8');
  const posts: BlogPost[] = JSON.parse(json);
  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostsByPage(page: number): {
  posts: BlogPost[];
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

export function searchPosts(query: string): BlogPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllPosts();
  return getAllPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tag.toLowerCase().includes(q)
  );
}
