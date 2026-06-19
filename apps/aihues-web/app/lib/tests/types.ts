/* Shared types for the Tests (personality assessment) module. */

export interface TestQuestion {
  prompt: string;
  options: string[];
  /** Optional one-line helper shown under the prompt. */
  note?: string;
}

/** A single labelled bar shown on the result screen. */
export interface ResultBar {
  label: string;
  leftLabel: string;
  rightLabel: string;
  /** 0–100 position of the fill / marker. */
  pct: number;
  /** Short chip, e.g. an MBTI letter or "H"/"M"/"L". */
  value?: string;
}

export interface TestResult {
  /** Short code, e.g. "INTJ-A" or "GOBLIN". */
  code: string;
  title: string;
  blurb: string;
  /** Accent hex used on the result screen. */
  accent: string;
  /** SBTI-style closeness to the matched archetype (0–100). */
  matchPct?: number;
  tags?: string[];
  bars: ResultBar[];
  /** True for hidden / easter-egg results. */
  hidden?: boolean;
}

export interface TestConfig {
  slug: string;
  name: string;
  tagline: string;
  /** Intro paragraph shown before starting. */
  intro: string;
  /** Bullet rules / "how it works" shown on the intro screen. */
  rules: string[];
  accent: string;
  durationMin: number;
  questions: TestQuestion[];
  /** Pure scoring fn: option index chosen per question → result. */
  score: (answers: number[]) => TestResult;
  /** Tweaks result presentation. */
  resultStyle: 'mbti' | 'sbti';
}

export interface TestMeta {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  durationMin: number;
  questionCount: number;
  badge: string;
}
