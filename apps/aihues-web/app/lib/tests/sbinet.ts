/* Stanford-Binet-style cognitive test. Structured after the published five
   factors of the Stanford-Binet Intelligence Scales, Fifth Edition (SB5):
   Fluid Reasoning, Knowledge, Quantitative Reasoning, Visual-Spatial
   Processing and Working Memory. The real SB5 is a proprietary instrument
   administered one-on-one by a psychologist; these are original items written
   in the style of each factor, for self-reflection only. */
import { scoreIq, type IqBand, type IqFactor } from './iq';
import type { TestConfig, TestQuestion } from './types';

const ACCENT = '#2f6f7a';

const FACTORS: IqFactor[] = [
  { key: 'fr', label: 'Fluid' },
  { key: 'kn', label: 'Knowledge' },
  { key: 'qr', label: 'Quantitative' },
  { key: 'vs', label: 'Spatial' },
  { key: 'wm', label: 'Memory' },
];

interface Item extends TestQuestion {
  factor: string;
  answer: number;
}

const ITEMS: Item[] = [
  {
    factor: 'fr',
    prompt: 'What number continues the series? 2, 3, 5, 9, 17, …',
    options: ['31', '32', '33', '34'],
    answer: 2,
    note: 'Each term is built from the one before it.',
  },
  {
    factor: 'kn',
    prompt: 'What does EPHEMERAL most nearly mean?',
    options: [
      'Lasting a very short time',
      'Extremely large',
      'Deeply hidden',
      'Highly poisonous',
    ],
    answer: 0,
  },
  {
    factor: 'qr',
    prompt: 'What is 15% of 200?',
    options: ['15', '30', '45', '20'],
    answer: 1,
  },
  {
    factor: 'vs',
    prompt: 'How many faces does a cube have?',
    options: ['4', '6', '8', '12'],
    answer: 1,
  },
  {
    factor: 'wm',
    prompt: 'Read these numbers, then pick them in REVERSE order: 4, 9, 2, 7',
    options: ['7, 2, 9, 4', '4, 9, 2, 7', '2, 7, 4, 9', '9, 4, 7, 2'],
    answer: 0,
  },
  {
    factor: 'fr',
    prompt: 'What letter continues the series? O, T, T, F, F, S, S, E, …',
    options: ['N', 'T', 'E', 'O'],
    answer: 0,
    note: 'Try saying the sequence out loud.',
  },
  {
    factor: 'kn',
    prompt: 'A philatelist collects … ?',
    options: ['Coins', 'Stamps', 'Butterflies', 'Maps'],
    answer: 1,
  },
  {
    factor: 'qr',
    prompt: 'If 3 apples cost $1.20, how much do 7 apples cost?',
    options: ['$2.40', '$2.80', '$3.20', '$2.10'],
    answer: 1,
  },
  {
    factor: 'vs',
    prompt: 'The hands of a clock at 6:00 form what angle?',
    options: ['90°', '120°', '180°', '360°'],
    answer: 2,
  },
  {
    factor: 'wm',
    prompt: 'If you spell the word STRESSED backwards, what word do you get?',
    options: ['DESSERTS', 'DESERTS', 'STRESSED', 'REDESSST'],
    answer: 0,
  },
  {
    factor: 'fr',
    prompt: 'If ◯ means add and △ means subtract, what is 8 ◯ 4 △ 3?',
    options: ['9', '7', '15', '1'],
    answer: 0,
  },
  {
    factor: 'kn',
    prompt: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Earth', 'Mercury', 'Mars'],
    answer: 2,
  },
  {
    factor: 'qr',
    prompt:
      'A shirt costs $40 after a 20% discount. What was the original price?',
    options: ['$48', '$50', '$52', '$60'],
    answer: 1,
  },
  {
    factor: 'vs',
    prompt: 'Which shape has the most sides?',
    options: ['Pentagon', 'Hexagon', 'Square', 'Triangle'],
    answer: 1,
  },
  {
    factor: 'wm',
    prompt:
      'Start at 7. Add 5, then subtract 3, then double the result. What is it?',
    options: ['18', '16', '20', '14'],
    answer: 0,
    note: 'Hold the running total in your head.',
  },
  {
    factor: 'fr',
    prompt: 'Tree is to Forest as Star is to … ?',
    options: ['Sky', 'Galaxy', 'Planet', 'Moon'],
    answer: 1,
  },
  {
    factor: 'kn',
    prompt: 'FRUGAL most nearly means … ?',
    options: ['Wasteful', 'Thrifty', 'Generous', 'Reckless'],
    answer: 1,
  },
  {
    factor: 'qr',
    prompt: 'What number continues the series? 3, 6, 11, 18, 27, …',
    options: ['35', '36', '38', '40'],
    answer: 2,
  },
  {
    factor: 'vs',
    prompt:
      'If you rotate the lowercase letter "b" by 180°, which letter does it resemble?',
    options: ['d', 'p', 'q', 'h'],
    answer: 2,
  },
  {
    factor: 'wm',
    prompt:
      'Recall the LAST word of each sentence, in order: "The dog ran fast." "I like blue."',
    options: ['Fast, blue', 'Blue, fast', 'Dog, like', 'Ran, blue'],
    answer: 0,
  },
  {
    factor: 'fr',
    prompt: 'Which one does NOT belong with the others?',
    options: ['Square', 'Circle', 'Triangle', 'Cube'],
    answer: 3,
  },
  {
    factor: 'kn',
    prompt: 'The chemical symbol "Au" stands for which element?',
    options: ['Silver', 'Aluminium', 'Gold', 'Copper'],
    answer: 2,
  },
  {
    factor: 'qr',
    prompt:
      'A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much is the ball?',
    options: ['$0.10', '$0.05', '$0.01', '$0.15'],
    answer: 1,
    note: 'It is not 10 cents.',
  },
  {
    factor: 'vs',
    prompt: 'How many edges does a triangular prism have?',
    options: ['6', '9', '12', '5'],
    answer: 1,
  },
  {
    factor: 'wm',
    prompt: 'Sort these words from shortest to longest: apple, kiwi, banana',
    options: [
      'Kiwi, apple, banana',
      'Apple, kiwi, banana',
      'Banana, apple, kiwi',
      'Kiwi, banana, apple',
    ],
    answer: 0,
  },
];

const QUESTIONS: TestQuestion[] = ITEMS.map(({ prompt, options, note }) => ({
  prompt,
  options,
  ...(note ? { note } : {}),
}));

const CORRECT = ITEMS.map((q) => q.answer);
const QUESTION_FACTOR = ITEMS.map((q) => q.factor);

const BANDS: IqBand[] = [
  {
    min: 24,
    code: 'IQ 140',
    title: 'Exceptional',
    percentile: '99.7th',
    blurb:
      'An exceptional five-factor profile — you stayed sharp across reasoning, knowledge, numbers, space and memory. Read the breakdown to find the factor that carried you.',
  },
  {
    min: 21,
    code: 'IQ 132',
    title: 'Very superior',
    percentile: '98th',
    blurb:
      'A high composite, with strong and fairly even factors — the hallmark of broad cognitive ability. The real SB5 would refine this with adaptive, individually administered items.',
  },
  {
    min: 18,
    code: 'IQ 122',
    title: 'Superior',
    percentile: '93rd',
    blurb:
      'Above average overall. One or two factors likely carried the rest — the profile below shows the shape of your thinking more than the single number does.',
  },
  {
    min: 14,
    code: 'IQ 112',
    title: 'High average',
    percentile: '79th',
    blurb:
      'A balanced, solid result. Notice the spread between factors; that contrast is often more telling than the composite estimate itself.',
  },
  {
    min: 10,
    code: 'IQ 102',
    title: 'Average',
    percentile: '55th',
    blurb:
      'A middle-of-the-range composite, where most people sit. Your factor bars reveal where you are strongest and where there is room to grow.',
  },
  {
    min: 6,
    code: 'IQ 92',
    title: 'Low average',
    percentile: '30th',
    blurb:
      'A lower composite this round. Cognitive factors vary a lot by day and format — the breakdown points to your anchor factor.',
  },
  {
    min: 0,
    code: 'IQ 82',
    title: 'Developing',
    percentile: '12th',
    blurb:
      'Below the midpoint here, but a single short quiz cannot capture much. The factor view is the useful part — see which areas held up best.',
  },
];

export const sbinetConfig: TestConfig = {
  slug: 'sbinet',
  name: 'Stanford–Binet',
  tagline: 'Five-factor cognitive profile',
  intro:
    'A 25-item run structured after the Stanford-Binet (Fifth Edition) and its five cognitive factors — Fluid Reasoning, Knowledge, Quantitative Reasoning, Visual-Spatial Processing and Working Memory. The clinical SB5 is administered one-on-one by a psychologist; this is an original, at-home approximation.',
  rules: [
    '25 questions — five for each of the five cognitive factors',
    'Builds a factor profile plus an estimated full-scale band',
    'Answer in one sitting for the truest profile',
    'A self-reflection tool — not the proctored, clinical SB5',
  ],
  accent: ACCENT,
  durationMin: 12,
  questions: QUESTIONS,
  resultStyle: 'sbti',
  breakdownLabel: 'Factor profile',
  score: (answers) =>
    scoreIq(answers, CORRECT, QUESTION_FACTOR, FACTORS, BANDS, ACCENT),
};
