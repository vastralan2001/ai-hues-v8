/* Mensa-style reasoning test. Questions are modeled on Mensa's own public
   Online Workout (mensa.org.uk/online-workout) — number series, verbal
   analogies, logic and lateral-thinking puzzles. A few are long-circulated
   Workout/practice items (the typists puzzle, the 4-digit puzzle, Tabitha).
   It is an entertainment estimate, not the supervised admission test. */
import { scoreIq, type IqBand, type IqFactor } from './iq';
import type { TestConfig, TestQuestion } from './types';

const ACCENT = '#785aa6';

const FACTORS: IqFactor[] = [
  { key: 'num', label: 'Numerical' },
  { key: 'verbal', label: 'Verbal' },
  { key: 'logic', label: 'Logic' },
  { key: 'pattern', label: 'Pattern' },
];

interface Item extends TestQuestion {
  factor: string;
  answer: number;
}

const ITEMS: Item[] = [
  {
    factor: 'num',
    prompt: 'What number continues the series? 2, 6, 12, 20, 30, …',
    options: ['36', '40', '42', '44'],
    answer: 2,
    note: 'Look at how the gap between terms grows.',
  },
  {
    factor: 'verbal',
    prompt: 'Which word is the opposite of BENEVOLENT?',
    options: ['Generous', 'Malevolent', 'Gracious', 'Kindly'],
    answer: 1,
  },
  {
    factor: 'logic',
    prompt:
      'Tabitha likes cookies but not cake, mutton but not lamb, and okra but not squash. Following the same rule, will she like cherries or pears?',
    options: ['Cherries', 'Pears', 'Both', 'Neither'],
    answer: 0,
    note: 'There is a hidden rule in the words she likes.',
  },
  {
    factor: 'pattern',
    prompt: 'Which letter comes next? A, C, E, G, …',
    options: ['H', 'I', 'J', 'K'],
    answer: 1,
  },
  {
    factor: 'num',
    prompt: 'What number continues the series? 1, 1, 2, 3, 5, 8, 13, …',
    options: ['19', '20', '21', '22'],
    answer: 2,
  },
  {
    factor: 'verbal',
    prompt: 'Which word does NOT belong with the others?',
    options: ['Rose', 'Oak', 'Daisy', 'Lily'],
    answer: 1,
  },
  {
    factor: 'logic',
    prompt: "Mary's father has five daughters: Nana, Nene, Nini, Nono and … ?",
    options: ['Nunu', 'Mary', 'Lulu', 'None of these'],
    answer: 1,
  },
  {
    factor: 'pattern',
    prompt:
      'If FRIEND is written in code as GSJFOE, how is CANDY written in the same code?',
    options: ['DBOEZ', 'DBOFZ', 'EBOEZ', 'DCOEZ'],
    answer: 0,
    note: 'Every letter shifts by the same step.',
  },
  {
    factor: 'num',
    prompt:
      'A drawer holds 45 pens. There are twice as many red pens as blue pens. How many red pens are there?',
    options: ['15', '20', '30', '35'],
    answer: 2,
  },
  {
    factor: 'verbal',
    prompt: 'Doctor is to Hospital as Teacher is to … ?',
    options: ['Student', 'School', 'Lesson', 'Book'],
    answer: 1,
  },
  {
    factor: 'logic',
    prompt:
      'A clock reads 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '30°', '90°'],
    answer: 1,
  },
  {
    factor: 'pattern',
    prompt: 'What letter comes next? B, D, G, K, …',
    options: ['N', 'O', 'P', 'Q'],
    answer: 2,
  },
  {
    factor: 'num',
    prompt:
      'If two typists can type two pages in two minutes, how many typists are needed to type 18 pages in six minutes?',
    options: ['3', '6', '9', '18'],
    answer: 1,
  },
  {
    factor: 'verbal',
    prompt: 'Bird is to Fly as Fish is to … ?',
    options: ['Water', 'Swim', 'Scale', 'Gill'],
    answer: 1,
  },
  {
    factor: 'logic',
    prompt:
      'In a race, you overtake the person in second place. What position are you in now?',
    options: ['First', 'Second', 'Third', 'Last'],
    answer: 1,
  },
  {
    factor: 'pattern',
    prompt: 'What letter comes next? Z, X, V, T, …',
    options: ['S', 'R', 'Q', 'P'],
    answer: 1,
  },
  {
    factor: 'num',
    prompt: 'Which number is the odd one out? 3, 5, 7, 11, 13, 15',
    options: ['7', '11', '13', '15'],
    answer: 3,
  },
  {
    factor: 'verbal',
    prompt: 'Which is the odd one out?',
    options: ['Cello', 'Violin', 'Flute', 'Viola'],
    answer: 2,
  },
  {
    factor: 'logic',
    prompt:
      'Some months have 31 days, others have 30. How many months have 28 days?',
    options: ['1', '2', '7', '12'],
    answer: 3,
  },
  {
    factor: 'pattern',
    prompt: 'What number continues the series? 1, 4, 9, 16, 25, …',
    options: ['30', '35', '36', '49'],
    answer: 2,
  },
  {
    factor: 'num',
    prompt: 'What number continues the series? 729, 243, 81, 27, …',
    options: ['9', '12', '3', '18'],
    answer: 0,
  },
  {
    factor: 'verbal',
    prompt: 'The words FAINT and INDISTINCT have … meanings.',
    options: ['opposite', 'similar', 'unrelated', 'identical'],
    answer: 1,
  },
  {
    factor: 'logic',
    prompt:
      'All Bloops are Razzies. All Razzies are Lazzies. Which statement must be true?',
    options: [
      'All Bloops are Lazzies',
      'All Lazzies are Bloops',
      'Some Lazzies are not Bloops',
      'No Bloops are Lazzies',
    ],
    answer: 0,
  },
  {
    factor: 'pattern',
    prompt: 'Which number is the odd one out? 64, 36, 49, 81, 50',
    options: ['36', '49', '50', '81'],
    answer: 2,
  },
  {
    factor: 'num',
    prompt:
      'Find the four-digit number in which the first digit is one-fifth of the last, and the second and third digits are the last digit multiplied by three.',
    options: ['1155', '5115', '1515', '3155'],
    answer: 0,
    note: 'The digits add up to 12.',
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
      'Near-flawless. You spotted the rule in almost every item — the kind of pattern-fluency that sits at the very top of the distribution. Treat the number as a ceiling estimate, not a verdict.',
  },
  {
    min: 21,
    code: 'IQ 132',
    title: 'Top 2% range',
    percentile: '98th',
    blurb:
      'This is the Mensa zone — roughly the top 2% of test-takers. Strong, fast reasoning across formats. Only a supervised, standardized test can confirm where you truly land.',
  },
  {
    min: 18,
    code: 'IQ 122',
    title: 'Superior',
    percentile: '93rd',
    blurb:
      'Comfortably above average. You handle novel patterns and word problems well; the misses were most likely the lateral-thinking traps that are built to catch fast readers.',
  },
  {
    min: 14,
    code: 'IQ 112',
    title: 'High average',
    percentile: '79th',
    blurb:
      'Solid all-round reasoning. A few of the trick questions slipped past — they are designed to. Speed and pattern drills sharpen this kind of score quickly.',
  },
  {
    min: 10,
    code: 'IQ 102',
    title: 'Average',
    percentile: '55th',
    blurb:
      'Right around the middle of the pack, which is exactly where most people land. Your breakdown below shows which kind of thinking to lean on.',
  },
  {
    min: 6,
    code: 'IQ 92',
    title: 'Low average',
    percentile: '30th',
    blurb:
      'A tougher run. Some categories clearly outperformed others — check the breakdown to see where to focus next time.',
  },
  {
    min: 0,
    code: 'IQ 82',
    title: 'Keep practicing',
    percentile: '12th',
    blurb:
      'Short of the mark this round, but these puzzles are deliberately slippery. Pattern recognition improves with exposure — retake it and watch the score move.',
  },
];

export const mensaConfig: TestConfig = {
  slug: 'mensa',
  name: 'Mensa',
  tagline: 'Are you top 2%?',
  intro:
    "A 25-question reasoning sprint modeled on Mensa's own Online Workout — number series, verbal analogies, logic and lateral-thinking puzzles. It won't qualify you for membership (that needs a supervised exam), but it gives a real sense of how you'd fare.",
  rules: [
    '25 questions across numerical, verbal, logic and pattern reasoning',
    'One best answer each — no timer, but trust your first instinct',
    'Your score maps to an estimated IQ band and percentile',
    'For fun only — not the official, supervised Mensa admission test',
  ],
  accent: ACCENT,
  durationMin: 12,
  questions: QUESTIONS,
  resultStyle: 'sbti',
  breakdownLabel: 'Category profile',
  score: (answers) =>
    scoreIq(answers, CORRECT, QUESTION_FACTOR, FACTORS, BANDS, ACCENT),
};
