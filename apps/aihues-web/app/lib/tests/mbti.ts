import type { TestConfig, TestResult } from './types';

/* MBTI-style assessment, inspired by the 16personalities format:
   five axes (Mind, Energy, Nature, Tactics, Identity) measured with
   agree/disagree statements, scored into a 4-letter type plus an
   Assertive/Turbulent identity suffix. All copy is original. */

type Axis = 'EI' | 'SN' | 'TF' | 'JP' | 'AT';

interface Statement {
  axis: Axis;
  /** Letter that AGREEING with the statement supports. */
  agree: string;
  text: string;
}

// Right-hand (positive) pole per axis.
const POS: Record<Axis, string> = {
  EI: 'E',
  SN: 'N',
  TF: 'T',
  JP: 'J',
  AT: 'A',
};
const NEG: Record<Axis, string> = {
  EI: 'I',
  SN: 'S',
  TF: 'F',
  JP: 'P',
  AT: 'T',
};

const AXIS_LABELS: Record<
  Axis,
  { label: string; left: string; right: string }
> = {
  EI: { label: 'Mind', left: 'Introverted', right: 'Extraverted' },
  SN: { label: 'Energy', left: 'Observant', right: 'Intuitive' },
  TF: { label: 'Nature', left: 'Feeling', right: 'Thinking' },
  JP: { label: 'Tactics', left: 'Prospecting', right: 'Judging' },
  AT: { label: 'Identity', left: 'Turbulent', right: 'Assertive' },
};

// 20 statements (4 per axis), interleaved so the intent isn't obvious.
const STATEMENTS: Statement[] = [
  {
    axis: 'EI',
    agree: 'E',
    text: 'You feel recharged after a night out with a big group of people.',
  },
  {
    axis: 'SN',
    agree: 'N',
    text: "You're more drawn to what could be than to what already is.",
  },
  {
    axis: 'TF',
    agree: 'T',
    text: 'When you decide, cold logic matters more to you than how people will feel.',
  },
  {
    axis: 'JP',
    agree: 'J',
    text: 'You like having your day mapped out before it begins.',
  },
  {
    axis: 'AT',
    agree: 'A',
    text: "Once you've made a decision, you rarely lie awake second-guessing it.",
  },

  {
    axis: 'EI',
    agree: 'I',
    text: "You'd usually rather text someone than call them out of the blue.",
  },
  {
    axis: 'SN',
    agree: 'S',
    text: 'You trust hands-on experience and proven facts over hunches.',
  },
  {
    axis: 'TF',
    agree: 'F',
    text: "You'd rather be kind than brutally honest.",
  },
  {
    axis: 'JP',
    agree: 'P',
    text: 'You often leave things to the last minute and improvise.',
  },
  {
    axis: 'AT',
    agree: 'T',
    text: 'You frequently worry about whether you measure up.',
  },

  {
    axis: 'EI',
    agree: 'E',
    text: 'At a party, you tend to walk up and introduce yourself to strangers.',
  },
  {
    axis: 'SN',
    agree: 'N',
    text: 'You catch yourself daydreaming about abstract ideas and patterns.',
  },
  {
    axis: 'TF',
    agree: 'T',
    text: 'You can stay objective and detached even in a heated argument.',
  },
  {
    axis: 'JP',
    agree: 'J',
    text: 'Checking every box off a to-do list genuinely makes your day.',
  },
  {
    axis: 'AT',
    agree: 'A',
    text: 'You stay calm and confident even when plans fall apart.',
  },

  {
    axis: 'EI',
    agree: 'I',
    text: 'After a packed social weekend, you crave a quiet night completely alone.',
  },
  {
    axis: 'SN',
    agree: 'S',
    text: 'You prefer clear step-by-step instructions to figuring it out as you go.',
  },
  {
    axis: 'TF',
    agree: 'F',
    text: "A friend's emotional reaction sways you more than the raw facts.",
  },
  {
    axis: 'JP',
    agree: 'P',
    text: 'You like keeping your options open rather than locking in a plan.',
  },
  {
    axis: 'AT',
    agree: 'T',
    text: 'Criticism tends to stick with you long after it was given.',
  },
];

const VALUES = [-2, -1, 0, 1, 2];
const OPTIONS = [
  'Strongly disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly agree',
];

const GROUP = {
  analyst: { name: 'Analyst', accent: '#7e5aa6' },
  diplomat: { name: 'Diplomat', accent: '#33a474' },
  sentinel: { name: 'Sentinel', accent: '#4191a8' },
  explorer: { name: 'Explorer', accent: '#d99a2b' },
} as const;

interface TypeDef {
  name: string;
  group: keyof typeof GROUP;
  blurb: string;
}

const TYPES: Record<string, TypeDef> = {
  INTJ: {
    name: 'Architect',
    group: 'analyst',
    blurb:
      'A strategist who lives three moves ahead. You see the system behind the noise and quietly build a better one.',
  },
  INTP: {
    name: 'Logician',
    group: 'analyst',
    blurb:
      'A relentless tinkerer of ideas. You collect theories, poke holes in them, and chase the one question everyone else skipped.',
  },
  ENTJ: {
    name: 'Commander',
    group: 'analyst',
    blurb:
      'A natural organizer of people and plans. You spot the goal, rally the room, and refuse to settle for "good enough".',
  },
  ENTP: {
    name: 'Debater',
    group: 'analyst',
    blurb:
      'A fast-talking idea machine who loves a good argument. You turn every assumption over just to see what falls out.',
  },
  INFJ: {
    name: 'Advocate',
    group: 'diplomat',
    blurb:
      'A quiet idealist with a long memory and a longer vision. You feel deeply and act on principle, not applause.',
  },
  INFP: {
    name: 'Mediator',
    group: 'diplomat',
    blurb:
      'A dreamer guided by values. You look for meaning everywhere and want the world — and yourself — to live up to it.',
  },
  ENFJ: {
    name: 'Protagonist',
    group: 'diplomat',
    blurb:
      'A warm, magnetic encourager. You read people instinctively and bring out the best version of everyone around you.',
  },
  ENFP: {
    name: 'Campaigner',
    group: 'diplomat',
    blurb:
      'A spark of curiosity and enthusiasm. You see possibility in people and can talk anyone into a wild new plan.',
  },
  ISTJ: {
    name: 'Logistician',
    group: 'sentinel',
    blurb:
      'A dependable backbone. You keep your word, sweat the details, and quietly hold things together when others flake.',
  },
  ISFJ: {
    name: 'Defender',
    group: 'sentinel',
    blurb:
      'A loyal protector who notices what people need before they ask. You give a lot and rarely take credit.',
  },
  ESTJ: {
    name: 'Executive',
    group: 'sentinel',
    blurb:
      'A no-nonsense leader who gets things done. You like clear rules, real results, and people who show up.',
  },
  ESFJ: {
    name: 'Consul',
    group: 'sentinel',
    blurb:
      'The social glue of any group. You remember birthdays, smooth over conflict, and keep everyone fed and included.',
  },
  ISTP: {
    name: 'Virtuoso',
    group: 'explorer',
    blurb:
      'A hands-on problem-solver. You learn by taking things apart, stay calm under pressure, and trust what works.',
  },
  ISFP: {
    name: 'Adventurer',
    group: 'explorer',
    blurb:
      'A quiet free spirit with great taste. You live in the moment and express yourself through what you make and do.',
  },
  ESTP: {
    name: 'Entrepreneur',
    group: 'explorer',
    blurb:
      'A bold improviser who thrives on action. You read the room, take the shot, and figure out the rest on the fly.',
  },
  ESFP: {
    name: 'Entertainer',
    group: 'explorer',
    blurb:
      'A spontaneous crowd-pleaser. You bring the energy, live out loud, and turn an ordinary night into a story.',
  },
};

function score(answers: number[]): TestResult {
  const dim: Record<Axis, number> = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };
  STATEMENTS.forEach((s, i) => {
    const v = VALUES[answers[i] ?? 2];
    dim[s.axis] += s.agree === POS[s.axis] ? v : -v;
  });

  const letter = (a: Axis) => (dim[a] >= 0 ? POS[a] : NEG[a]);
  const type4 = letter('EI') + letter('SN') + letter('TF') + letter('JP');
  const identity = letter('AT');
  const def = TYPES[type4] ?? TYPES.INTJ;
  const group = GROUP[def.group];
  const idWord = identity === 'A' ? 'Assertive' : 'Turbulent';

  const order: Axis[] = ['EI', 'SN', 'TF', 'JP', 'AT'];
  const bars = order.map((a) => {
    const max = 8; // 4 statements × 2
    const pct = Math.round(((dim[a] + max) / (2 * max)) * 100);
    return {
      label: AXIS_LABELS[a].label,
      leftLabel: AXIS_LABELS[a].left,
      rightLabel: AXIS_LABELS[a].right,
      pct,
      value: letter(a),
    };
  });

  return {
    code: `${type4}-${identity}`,
    title: def.name,
    blurb: `${def.blurb} As ${identity === 'A' ? 'an Assertive' : 'a Turbulent'} ${def.name}, you ${
      identity === 'A'
        ? 'lean on self-belief and shrug off setbacks.'
        : 'hold yourself to a high bar and feel every wobble.'
    }`,
    accent: group.accent,
    tags: [group.name, idWord, type4],
    bars,
  };
}

export interface MbtiSummary {
  code: string;
  type4: string;
  identity: string;
  name: string;
  blurb: string;
  group: string;
  accent: string;
  tags: string[];
}

export function getMbtiSummary(code: string): MbtiSummary | null {
  const bare = code.match(/^([A-Z]{4})$/i);
  const full = code.match(/^([A-Z]{4})-([AT])$/i);
  const match = full ?? bare;
  if (!match) return null;
  const type4 = match[1].toUpperCase();
  const identity = full ? match[2].toUpperCase() : 'A';
  const def = TYPES[type4] ?? TYPES.INTJ;
  const group = GROUP[def.group];
  const idWord = identity === 'A' ? 'Assertive' : 'Turbulent';
  return {
    code,
    type4,
    identity,
    name: def.name,
    blurb: `${def.blurb} As ${identity === 'A' ? 'an Assertive' : 'a Turbulent'} ${def.name}, you ${
      identity === 'A'
        ? 'lean on self-belief and shrug off setbacks.'
        : 'hold yourself to a high bar and feel every wobble.'
    }`,
    group: group.name,
    accent: group.accent,
    tags: [group.name, idWord, type4],
  };
}

export const mbtiConfig: TestConfig = {
  slug: 'mbti',
  name: 'MBTI Personality Test',
  tagline: 'Find your four-letter type',
  intro:
    'Twenty quick statements across five dimensions — Mind, Energy, Nature, Tactics and Identity. Answer honestly (first instinct beats overthinking) and get your type, from Architect to Entertainer.',
  rules: [
    '20 agree/disagree statements, about 3 minutes.',
    'There are no right answers — go with your gut.',
    'You get a 4-letter type plus an Assertive (-A) or Turbulent (-T) identity.',
    'For fun and self-reflection, not a clinical diagnosis.',
  ],
  accent: '#7e5aa6',
  durationMin: 3,
  resultStyle: 'mbti',
  questions: STATEMENTS.map((s) => ({ prompt: s.text, options: OPTIONS })),
  score,
};
