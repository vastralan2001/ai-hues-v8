import { readFileSync } from 'node:fs';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { getAllPosts } from '@/lib/blog-data';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import RelatedArticles from '@/components/RelatedArticles';
import '../article.css';

const BASE_URL = 'https://aihues.com';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return { title: 'Not Found | AIHues' };
  }
  return {
    title: `${post.title} | AIHues Blog`,
    description: `${post.tag} · ${post.date} · ${post.readTime}`,
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: `${post.tag} · ${post.date} · ${post.readTime}`,
      type: 'article',
      publishedTime: post.date,
      tags: [post.tag],
    },
  };
}

function extractBody(html: string): string {
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (match) {
    // Strip the inner article-header (React already renders its own)
    return match[1].replace(/<div class="article-header">[\s\S]*?<\/div>/, '');
  }
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return bodyMatch ? bodyMatch[1] : html;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getAllPosts();
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) notFound();

  let htmlContent: string;
  try {
    const raw = readFileSync(
      process.cwd() + `/public/blog/${slug}.html`,
      'utf-8'
    );
    htmlContent = extractBody(raw);
  } catch {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
    image: meta.coverImage,
    datePublished: meta.date,
    dateModified: meta.date,
    author: {
      '@type': 'Organization',
      name: 'AIHues Team',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIHues',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`,
    },
  };

  return (
    <PageShell>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type='application/ld+json'
      />
      <main className='mx-auto max-w-[800px] px-6 py-20 md:px-7'>
        {/* Article header */}
        <div className='mb-10 text-center'>
          <span className='mb-4 inline-block rounded-full bg-[rgba(180,83,9,0.08)] px-3 py-1 text-xs font-bold text-[#b45309]'>
            {meta.tag}
          </span>
          <h1 className='text-[48px] font-extrabold leading-[1.08] tracking-[-2px] text-[#1c1917]'>
            {meta.title}
          </h1>
          <div className='mt-4 flex justify-center gap-4 text-sm text-[#a8a29e]'>
            <span>{meta.date}</span>
            <span>{meta.readTime}</span>
            <span>AIHues Team</span>
          </div>
        </div>

        {/* Article content */}
        <article
          className='article-content max-w-none'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <NewsletterSubscribe />
        <RelatedArticles currentSlug={slug} locale='en' />
      </main>
    </PageShell>
  );
}
