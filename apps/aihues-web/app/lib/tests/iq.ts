/* Shared scoring for the right/wrong cognitive tests (Mensa, Stanford-Binet).
   Each question carries a correct option index and a factor key; the score is
   the count of correct answers mapped to an estimated band, plus a per-factor
   profile rendered with the sbti bar style. */
import type { ResultBar, TestResult } from './types';

export interface IqBand {
  /** Minimum correct count (inclusive) for this band; checked high → low. */
  min: number;
  code: string;
  title: string;
  percentile: string;
  blurb: string;
}

export interface IqFactor {
  key: string;
  label: string;
}

export function scoreIq(
  answers: number[],
  correct: number[],
  questionFactor: string[],
  factors: IqFactor[],
  bands: IqBand[],
  accent: string
): TestResult {
  const totalCorrect = answers.reduce(
    (n, a, i) => n + (a === correct[i] ? 1 : 0),
    0
  );

  const band =
    bands.find((b) => totalCorrect >= b.min) ?? bands[bands.length - 1];

  const bars: ResultBar[] = factors.map((factor) => {
    let got = 0;
    let tot = 0;
    questionFactor.forEach((f, i) => {
      if (f !== factor.key) return;
      tot += 1;
      if (answers[i] === correct[i]) got += 1;
    });
    return {
      label: factor.label,
      leftLabel: '',
      rightLabel: '',
      pct: tot ? Math.round((got / tot) * 100) : 0,
      value: String(got),
    };
  });

  return {
    code: band.code,
    title: band.title,
    blurb: band.blurb,
    accent,
    tags: [
      `${band.percentile} percentile`,
      `${totalCorrect} / ${answers.length} correct`,
    ],
    bars,
  };
}
