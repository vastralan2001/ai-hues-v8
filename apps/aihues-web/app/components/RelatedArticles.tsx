import { getAllPosts } from '@/lib/resources-data';
import StoryCard from '@/components/StoryCard';

export default function RelatedArticles({
  currentSlug,
  locale,
}: {
  currentSlug: string;
  locale: string;
}) {
  const posts = getAllPosts();
  // Pick 3 posts that are not the current one, prefer same tag
  const current = posts.find((p) => p.slug === currentSlug);
  let related = posts.filter((p) => p.slug !== currentSlug);

  if (current) {
    const sameTag = related.filter((p) => p.tag === current.tag);
    const otherTag = related.filter((p) => p.tag !== current.tag);
    related = [...sameTag, ...otherTag];
  }

  related = related.slice(0, 3);
  if (related.length === 0) return null;

  return (
    <div className='pt-12'>
      <h3 className='mb-4 text-lg font-bold text-foreground'>
        {locale === 'zh' ? '相关文章' : 'Related Articles'}
      </h3>
      {/* Same card + grid as the Stories listing; fewer than three leaves the
          right columns empty rather than stretching the cards. */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {related.map((article) => (
          <StoryCard key={article.slug} post={article} />
        ))}
      </div>
    </div>
  );
}
