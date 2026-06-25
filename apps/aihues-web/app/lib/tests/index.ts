import { mbtiConfig } from './mbti';
import { mensaConfig } from './mensa';
import { sbinetConfig } from './sbinet';
import { sbtiConfig } from './sbti';
import type { TestConfig, TestMeta } from './types';

const CONFIGS: TestConfig[] = [
  sbtiConfig,
  mbtiConfig,
  mensaConfig,
  sbinetConfig,
];

export const TESTS: Record<string, TestConfig> = Object.fromEntries(
  CONFIGS.map((c) => [c.slug, c])
);

export function getTest(slug: string): TestConfig | undefined {
  return TESTS[slug];
}

export const TEST_META: TestMeta[] = [
  {
    slug: 'sbti',
    name: 'SBTI',
    tagline: 'A gloriously unscientific soul-scan',
    description:
      '31 absurd questions map 15 “soul dimensions” to your internet archetype — Goblin, Doomer, Gigachad… plus one hidden type.',
    accent: 'var(--color-accent)',
    durationMin: 4,
    questionCount: sbtiConfig.questions.length,
    badge: 'Satirical',
    cta: 'Scan my soul →',
    ctaZh: '扫描灵魂 →',
  },
  {
    slug: 'mbti',
    name: 'MBTI',
    tagline: 'Find your four-letter type',
    description:
      '20 quick statements across five dimensions reveal your type and Assertive / Turbulent identity — Architect to Entertainer.',
    accent: 'var(--color-accent)',
    durationMin: 3,
    questionCount: mbtiConfig.questions.length,
    badge: 'Classic',
    cta: 'Find my type →',
    ctaZh: '测我的类型 →',
  },
  {
    slug: 'mensa',
    name: 'Mensa',
    tagline: 'Are you top 2%?',
    description:
      "25 reasoning puzzles modeled on Mensa's own Online Workout — series, analogies and lateral-thinking traps. Get an estimated IQ band and percentile.",
    accent: 'var(--color-accent)',
    durationMin: 12,
    questionCount: mensaConfig.questions.length,
    badge: 'IQ',
    cta: 'Test my IQ →',
    ctaZh: '测我的智商 →',
  },
  {
    slug: 'sbinet',
    name: 'Stanford–Binet',
    tagline: 'Five-factor cognitive profile',
    description:
      "A 25-item run structured after the Stanford-Binet's five cognitive factors — fluid reasoning, knowledge, quantitative, visual-spatial and working memory.",
    accent: 'var(--color-accent)',
    durationMin: 12,
    questionCount: sbinetConfig.questions.length,
    badge: 'Cognitive',
    cta: 'Profile my mind →',
    ctaZh: '测我的认知 →',
  },
];
