import { mbtiConfig } from './mbti';
import { sbtiConfig } from './sbti';
import type { TestConfig, TestMeta } from './types';

const CONFIGS: TestConfig[] = [sbtiConfig, mbtiConfig];

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
  },
];
