import { readFileSync } from 'node:fs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { getAllPosts } from '@/lib/resources-data';
import CoverImage from '@/components/CoverImage';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import RelatedArticles from '@/components/RelatedArticles';
import ArticleToc, { type TocItem } from '@/components/ArticleToc';
import ShareButtons from '@/components/ShareButtons';
import ResourceToolRecommend from '@/components/reviews/ResourceToolRecommend';
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
    title: `${post.title} | AIHues Resources`,
    description: `${post.tag} · ${post.date} · ${post.readTime}`,
    alternates: {
      canonical: `${BASE_URL}/resources/${slug}`,
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
  // Normalise CRLF so the server HTML and the RSC payload match (the static
  // files are CRLF on Windows, which otherwise trips React hydration).
  const norm = html.replace(/\r\n/g, '\n');
  // The body lives in <div class="article-content">…</div>; React renders its
  // own header from JSON metadata, so we take just the content div's inner HTML.
  const content = norm.match(
    /<div class="article-content">([\s\S]*)<\/div>\s*<\/article>/
  );
  if (content) return content[1];
  const article = norm.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (article) return article[1];
  const body = norm.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return body ? body[1] : norm;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// Inject stable ids onto h2/h3 and collect a table of contents from them.
function buildToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (full, level: string, attrs: string, inner: string) => {
      const text = inner
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!text) return full;
      const existing = attrs.match(/\sid="([^"]+)"/);
      let id = existing ? existing[1] : slugify(text);
      if (!id) return full;
      let unique = id;
      let n = 2;
      while (used.has(unique)) unique = `${id}-${n++}`;
      used.add(unique);
      id = unique;
      toc.push({ id, text, level: Number(level) });
      const nextAttrs = existing ? attrs : `${attrs} id="${id}"`;
      return `<h${level}${nextAttrs}>${inner}</h${level}>`;
    }
  );
  return { html: out, toc };
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

  let rawBody: string;
  try {
    const raw = readFileSync(
      process.cwd() + `/public/resources/${slug}.html`,
      'utf-8'
    );
    rawBody = extractBody(raw);
  } catch {
    notFound();
  }

  const { html: htmlContent, toc } = buildToc(rawBody);

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
      '@id': `${BASE_URL}/resources/${slug}`,
    },
  };

  return (
    <PageShell>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type='application/ld+json'
      />
      <div className='mx-auto max-w-[1080px] px-6 py-12 md:px-8'>
        {/* Breadcrumb */}
        <nav className='mb-8 flex min-w-0 items-center gap-1.5 text-[13px] text-muted'>
          <Link
            className='shrink-0 transition-colors hover:text-accent'
            href='/'
          >
            Home
          </Link>
          <span aria-hidden='true'>/</span>
          <Link
            className='shrink-0 transition-colors hover:text-accent'
            href='/resources'
          >
            Resources
          </Link>
          <span aria-hidden='true'>/</span>
          <span className='truncate text-secondary'>{meta.title}</span>
        </nav>

        <div className='lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-x-14'>
          {/* Hero — spans both columns */}
          <header className='lg:col-span-2'>
            <span className='inline-block rounded-full bg-accent-bg px-3 py-1 text-xs font-bold text-accent'>
              {meta.tag}
            </span>
            <h1 className='mt-4 text-[clamp(30px,5vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground'>
              {meta.title}
            </h1>
            <div className='mt-4 flex flex-wrap items-center gap-3 text-sm text-muted'>
              <span>{meta.date}</span>
              <span className='h-1 w-1 rounded-full bg-border-strong' />
              <span>{meta.readTime} read</span>
              <span className='h-1 w-1 rounded-full bg-border-strong' />
              <span>AIHues Team</span>
            </div>
            <div className='mt-8 aspect-[16/7] overflow-hidden rounded-[18px] border border-border'>
              <CoverImage
                src={meta.coverImage}
                alt={meta.title}
                className='h-full w-full'
              />
            </div>
          </header>

          {/* Article body — left column */}
          <article
            className='article-content mt-10 min-w-0 max-w-none lg:col-start-1 lg:row-start-2'
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Sticky table of contents — right column, desktop only */}
          <aside className='hidden lg:col-start-2 lg:row-start-2 lg:block'>
            <div className='sticky top-24 mt-10'>
              <ArticleToc items={toc} />
              <div className='mt-6 border-t border-border pt-5'>
                <p className='mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted'>
                  Share
                </p>
                <ShareButtons title={meta.title} />
              </div>
              <Link
                className='mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary transition-colors hover:text-accent'
                href='/resources'
              >
                ← All articles
              </Link>
            </div>
          </aside>
        </div>

        <ResourceToolRecommend tag={meta.tag} />
        <NewsletterSubscribe />
        <RelatedArticles currentSlug={slug} locale='en' />
      </div>
    </PageShell>
  );
}
