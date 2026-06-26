import type { SpotlightSlide } from '@/components/SpotlightCarousel';
import type { BrandCategory } from '@/lib/category-brand';

/* Hero scene metadata — one per HUES family. The actual slide DATA is built on
   the server in page.tsx from the SAME catalog/posts the home bands use, so a
   given id always renders identical content + badges in both places. */
export interface CategoryPick {
  key: string;
  cat: BrandCategory;
  label: string;
  /** Representative catalog slug ('' = use the first story post). */
  slug: string;
  /** Hero <h1> typewriter word, synced to this slide. */
  typeword: { en: string; zh: string };
  /** Hero fade-in slogan, synced to this slide. */
  slogan: { en: string; zh: string };
  /** Example search phrase for the rotating Ask-AI placeholder. */
  query: string;
}

/* A fully-built hero scene: family metadata + the SSR-built spotlight slide. */
export interface HeroScene {
  cat: BrandCategory;
  typeword: { en: string; zh: string };
  slogan: { en: string; zh: string };
  /** Search-box placeholder hint for this family. */
  query: string;
  slide: SpotlightSlide;
}

export const CATEGORY_PICKS: CategoryPick[] = [
  {
    key: 'tools',
    cat: 'tools',
    label: 'Helpers',
    slug: 'json',
    typeword: { en: 'AI toolkit.', zh: 'AI 工具箱' },
    slogan: {
      en: "Helpers that do the grunt work so you don't have to.",
      zh: '帮你扛下杂活，你不必亲自动手。',
    },
    query: 'format this JSON',
  },
  {
    key: 'games',
    cat: 'games',
    label: 'Unwinds',
    slug: 'chess',
    typeword: { en: 'game arcade.', zh: '游戏厅' },
    slogan: {
      en: 'Unwinds for when your brain feels like a fried egg.',
      zh: '当大脑像煎糊的蛋时，来放松一下。',
    },
    query: 'play a quick game',
  },
  {
    key: 'tests',
    cat: 'tests',
    label: 'Evaluations',
    slug: 'mbti',
    typeword: { en: 'test lab.', zh: '测验厅' },
    slogan: {
      en: "Evaluations that remind you you're more than your salary.",
      zh: '评估提醒你：你远不止一份薪水。',
    },
    query: 'find my MBTI type',
  },
  {
    key: 'stories',
    cat: 'stories',
    label: 'Stories',
    slug: '',
    typeword: { en: 'story feed.', zh: '解读专栏' },
    slogan: {
      en: 'Stories that cut through the noise and the nonsense.',
      zh: '拆穿噪声与胡话的解读。',
    },
    query: 'how to launch on Product Hunt',
  },
];
