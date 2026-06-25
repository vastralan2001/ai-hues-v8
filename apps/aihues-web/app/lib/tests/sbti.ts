import type { TestConfig, TestResult, ResultBar } from './types';

/* SBTI — a satirical, internet-culture personality test inspired by the
   viral format: 15 "soul dimensions" across 5 models, each scored Low /
   Mid / High, then matched to the closest archetype by Manhattan distance.
   All questions, archetypes and copy are original. Strictly for laughs. */

// 15 dimensions, in scoring order. Two questions feed each (q0/q1, q2/q3 …).
const DIMS = [
  'Self-Esteem',
  'Self-Clarity',
  'Conviction',
  'Security',
  'Investment',
  'Boundaries',
  'Optimism',
  'Rule-Following',
  'Openness',
  'Ambition',
  'Decisiveness',
  'Discipline',
  'Extraversion',
  'Agreeableness',
  'Spotlight',
];

// 30 dimension questions (option 0 = low → option 2 = high) + 1 egg question.
const QUESTIONS: { prompt: string; options: string[] }[] = [
  // S1 Self-Esteem
  {
    prompt: 'Someone leaves you on read for three days. Your first thought:',
    options: [
      "I've ruined everything, they hate me",
      'Weird, but whatever',
      'Their loss, honestly',
    ],
  },
  {
    prompt: 'Catching yourself in the mirror before heading out:',
    options: [
      'Avoid eye contact with myself',
      'Eh, good enough',
      'Throw myself a little wink',
    ],
  },
  // S2 Self-Clarity
  {
    prompt: 'Someone asks what you’re actually passionate about. You:',
    options: [
      "Panic and say 'travel'",
      'Have a rough idea',
      'Could talk for an hour',
    ],
  },
  {
    prompt: 'Your five-year plan is:',
    options: [
      "Five years? I can't see past lunch",
      'A loose vibe',
      'Color-coded and laminated',
    ],
  },
  // S3 Conviction
  {
    prompt: 'Someone challenges your opinion at dinner. You:',
    options: [
      'Instantly agree to keep the peace',
      'Hold it but stay quiet',
      'Die on that hill',
    ],
  },
  {
    prompt: 'Your moral code is:',
    options: [
      "Negotiable if I'm tired",
      'Mostly consistent',
      'Carved in stone',
    ],
  },
  // E1 Security
  {
    prompt: 'Your partner is quieter than usual. You assume:',
    options: [
      "They're about to dump me",
      'They had a long day',
      "Nothing — I'll just ask",
    ],
  },
  {
    prompt: 'In close relationships you mostly feel:',
    options: ['Constantly on edge', 'Mostly okay', 'Calm and secure'],
  },
  // E2 Investment
  {
    prompt: 'When you catch feelings for someone, you:',
    options: [
      'Keep it casual, zero feelings',
      'Invest but pace yourself',
      'Go all in, playlist already made',
    ],
  },
  {
    prompt: 'A genuinely sad movie ends. You:',
    options: [
      'Felt absolutely nothing',
      'Got a little misty',
      'Sobbed for twenty minutes',
    ],
  },
  // E3 Boundaries
  {
    prompt: 'A friend bails on plans last minute. You:',
    options: [
      'Quietly resent it for a week',
      "Say 'no worries' and mean it",
      'Tell them how it landed, kindly',
    ],
  },
  {
    prompt: 'Doing things solo — dinner, a trip, a movie — is:',
    options: [
      'Genuinely terrifying',
      'Fine now and then',
      'Honestly my favorite',
    ],
  },
  // A1 Optimism
  {
    prompt: 'It starts pouring on your one day off. You think:',
    options: [
      'Of course. Typical.',
      'Meh, indoor day',
      'Cozy! Perfect for tea',
    ],
  },
  {
    prompt: 'The future, broadly speaking, looks:',
    options: ['Bleak', 'Uncertain but fine', 'Full of potential'],
  },
  // A2 Rule-Following
  {
    prompt: 'The sign clearly says "Do Not Enter". You:',
    options: ['Enter immediately', 'Hesitate, then maybe', 'Would never'],
  },
  {
    prompt: 'Returning the shopping cart to the corral is:',
    options: [
      'For other people',
      'If it’s convenient',
      'A genuine test of character',
    ],
  },
  // A3 Openness
  {
    prompt: 'A friend suggests a cuisine you’ve never tried. You:',
    options: [
      'Hard pass, I know what I like',
      "Maybe, if it's not too weird",
      "Yes — let's go right now",
    ],
  },
  {
    prompt: 'Ideas that challenge your worldview feel:',
    options: ['Annoying', 'Interesting sometimes', 'Genuinely exciting'],
  },
  // Ac1 Ambition
  {
    prompt: 'Your relationship with the word "goals":',
    options: [
      "We're not on speaking terms",
      'Casual acquaintances',
      'Married, with a vision board',
    ],
  },
  {
    prompt: 'A totally free Saturday and you:',
    options: [
      'Rot in bed, gloriously',
      'Knock out a couple things',
      'Optimize and grind',
    ],
  },
  // Ac2 Decisiveness
  {
    prompt: 'Picking the restaurant for the group chat:',
    options: [
      "'I don't mind, you choose'",
      'Narrow it down to two',
      'Already booked it',
    ],
  },
  {
    prompt: 'Big decisions make you:',
    options: [
      'Spiral for weeks',
      'Think it over a while',
      'Decide and move on',
    ],
  },
  // Ac3 Discipline
  {
    prompt: 'Your New Year’s resolutions usually last until:',
    options: ['January 3rd', 'A solid month', 'Actually, all year'],
  },
  {
    prompt: 'Your daily habits are:',
    options: ['What habits?', 'Hit or miss', 'Locked in'],
  },
  // So1 Extraversion
  {
    prompt: 'At a party, you can be found:',
    options: [
      'By the snacks or the dog',
      'Chatting in small bursts',
      'Running the entire room',
    ],
  },
  {
    prompt: 'A weekend with zero plans sounds:',
    options: ['Perfect', 'Nice in moderation', "Lonely — let's go out"],
  },
  // So2 Agreeableness
  {
    prompt: 'Someone takes credit for your idea. You:',
    options: [
      'Plot quiet revenge',
      'Let it slide this once',
      'Honestly, glad it helped',
    ],
  },
  {
    prompt: 'Your default setting with strangers is:',
    options: ['Suspicious', 'Polite', 'Warm and trusting'],
  },
  // So3 Spotlight
  {
    prompt: 'When you post online, you mainly want:',
    options: [
      "I don't really post",
      'To share with friends',
      'Reach, likes, algorithmic love',
    ],
  },
  {
    prompt: 'Being the center of attention is:',
    options: [
      'A waking nightmare',
      'Okay in small doses',
      'Exactly where I belong',
    ],
  },
  // Egg
  {
    prompt: 'Last one. Your relationship with alcohol?',
    options: ['Teetotal — water gang', 'Social drinker', 'I am the problem'],
  },
];

const EGG_Q = 30;
const EGG_OPTION = 2;

interface Archetype {
  code: string;
  name: string;
  accent: string;
  pattern: string; // 15 chars of L/M/H, same order as DIMS
  blurb: string;
}

// 14 matchable archetypes (+ DRUNK egg + WILDCARD fallback below).
const ARCHETYPES: Archetype[] = [
  {
    code: 'GOBLIN',
    name: 'The Goblin',
    accent: '#6b8e23',
    pattern: 'MLLLMLMLHLMLMML',
    blurb:
      'Chaos in a hoodie. Low effort, low plans, surprisingly high vibes. You thrive in the mess you create.',
  },
  {
    code: 'NPC',
    name: 'The NPC',
    accent: '#9aa0a6',
    pattern: 'LLLMMLMHLLLMMHL',
    blurb:
      'You follow the script, take the path of least resistance, and never cause a scene. Reliable. Beige. Safe.',
  },
  {
    code: 'DOOMER',
    name: 'The Doomer',
    accent: '#5a6470',
    pattern: 'LMMLMMLMLLLLLML',
    blurb:
      'You already know how it ends, and it ends badly. Pessimism as a personality, served black.',
  },
  {
    code: 'GRINDSET',
    name: 'The Grindset',
    accent: '#c2502e',
    pattern: 'HHHMLHHHMHHHMLH',
    blurb:
      'Sleep is for the weak and rest is a tax. You monetized your hobbies and your trauma. Up at 5am, hydrated, terrifying.',
  },
  {
    code: 'MAINCHAR',
    name: 'The Main Character',
    accent: '#d4459b',
    pattern: 'HMMMHLHLHHHMHLH',
    blurb:
      'Everyone else is an extra in your montage. The lighting follows you. The story is, of course, about you.',
  },
  {
    code: 'GHOST',
    name: 'The Ghost',
    accent: '#8a93a6',
    pattern: 'MMMLLHMLMMMMLLL',
    blurb:
      'Last seen: a while ago. You keep the world at arm’s length and your read receipts off. Independence, possibly to a fault.',
  },
  {
    code: 'SIMP',
    name: 'The Simp',
    accent: '#e0719c',
    pattern: 'LLLLHLHMMMLMMHL',
    blurb:
      'You love hard, give too much, and apologize when someone steps on your foot. A heart of gold and zero boundaries.',
  },
  {
    code: 'KAREN',
    name: 'The Manager-Seeker',
    accent: '#c0392b',
    pattern: 'HLHLMLLHLMHMHLH',
    blurb:
      'You have read the terms of service and you would like a word. Rules matter — especially when they’re on your side.',
  },
  {
    code: 'ZEN',
    name: 'The Zen Master',
    accent: '#2e8b74',
    pattern: 'HHHHMHHMHMMHMHL',
    blurb:
      'Annoyingly well-adjusted. Secure, self-aware, unbothered. You touched grass and it changed you. Namaste.',
  },
  {
    code: 'CLOWN',
    name: 'The Clown',
    accent: '#e0552b',
    pattern: 'LLMMHLHLHMMLHHH',
    blurb:
      'You will do anything for a laugh, including at your own expense. The funniest person at the party, quietly held together with tape.',
  },
  {
    code: 'GIGACHAD',
    name: 'The Gigachad',
    accent: '#b8860b',
    pattern: 'HHHHMHHMMHHHHHM',
    blurb:
      'Confident, driven, weirdly kind about it. You say what you mean and follow through. Suspiciously functional.',
  },
  {
    code: 'BURNOUT',
    name: 'The Burnout',
    accent: '#7a6a55',
    pattern: 'LHMMLMLMMLLLLML',
    blurb:
      'You used to be the Grindset. Now you know exactly who you are and have no energy left to be it. Running on fumes and self-awareness.',
  },
  {
    code: 'YESMAN',
    name: 'The People-Pleaser',
    accent: '#d9a441',
    pattern: 'LLLMHLMHMMLMMHM',
    blurb:
      '"Sure, no problem, happy to!" — said while sobbing internally. You’d rather combust than disappoint anyone.',
  },
  {
    code: 'OVERTHINK',
    name: 'The Overthinker',
    accent: '#6a5acd',
    pattern: 'LMMLHMLHHMLMLML',
    blurb:
      'You’ve already rehearsed this conversation forty times. Analysis paralysis with a side of 3am ceiling-staring.',
  },
];

const DRUNK: Omit<Archetype, 'pattern'> = {
  code: 'DRUNK',
  name: 'The Drunk',
  accent: '#b5651d',
  blurb:
    'The algorithm has nothing left to measure. You answered honestly, and honestly, maybe slow down on the tequila. (Hidden archetype unlocked.)',
};

const WILDCARD: Omit<Archetype, 'pattern'> = {
  code: 'HHHH',
  name: 'The Wildcard',
  accent: '#7e5aa6',
  blurb:
    "You don't match any known archetype closely enough to label. Either you're a beautiful one-of-one, or you lied on at least six questions.",
};

const lvl = (sum: number): 'L' | 'M' | 'H' =>
  sum <= 3 ? 'L' : sum === 4 ? 'M' : 'H';
const num = (c: string): number => (c === 'L' ? 1 : c === 'M' ? 2 : 3);

function score(answers: number[]): TestResult {
  // 15 dimension sums (2 questions each, option index +1 = 1..3 points)
  const sums: number[] = [];
  for (let d = 0; d < 15; d++) {
    const a = (answers[d * 2] ?? 1) + 1;
    const b = (answers[d * 2 + 1] ?? 1) + 1;
    sums.push(a + b);
  }
  const levels = sums.map(lvl);
  const userVec = levels.map(num);

  const bars: ResultBar[] = DIMS.map((label, i) => ({
    label,
    leftLabel: 'L',
    rightLabel: 'H',
    pct: Math.round(((sums[i] - 2) / 4) * 100),
    value: levels[i],
  }));

  // Hidden archetype override
  if (answers[EGG_Q] === EGG_OPTION) {
    return {
      code: DRUNK.code,
      title: DRUNK.name,
      blurb: DRUNK.blurb,
      accent: DRUNK.accent,
      matchPct: 100,
      tags: ['Hidden archetype'],
      bars,
      hidden: true,
    };
  }

  // Nearest archetype by Manhattan distance
  let best = ARCHETYPES[0];
  let bestPct = -1;
  for (const a of ARCHETYPES) {
    let dist = 0;
    for (let i = 0; i < 15; i++)
      dist += Math.abs(num(a.pattern[i]) - userVec[i]);
    const pct = Math.max(0, Math.round((1 - dist / 30) * 100));
    if (pct > bestPct) {
      bestPct = pct;
      best = a;
    }
  }

  if (bestPct < 60) {
    return {
      code: WILDCARD.code,
      title: WILDCARD.name,
      blurb: WILDCARD.blurb,
      accent: WILDCARD.accent,
      matchPct: bestPct,
      tags: ['Unclassifiable'],
      bars,
    };
  }

  return {
    code: best.code,
    title: best.name,
    blurb: best.blurb,
    accent: best.accent,
    matchPct: bestPct,
    bars,
  };
}

export interface SbtiSummary {
  code: string;
  name: string;
  blurb: string;
  accent: string;
  matchPct?: number;
  tags: string[];
  hidden?: boolean;
}

export function getSbtiSummary(code: string): SbtiSummary | null {
  const upper = code.toUpperCase();
  if (upper === DRUNK.code) {
    return {
      code: DRUNK.code,
      name: DRUNK.name,
      blurb: DRUNK.blurb,
      accent: DRUNK.accent,
      matchPct: 100,
      tags: ['Hidden archetype'],
      hidden: true,
    };
  }
  const archetype = ARCHETYPES.find((a) => a.code === upper);
  if (archetype) {
    return {
      code: archetype.code,
      name: archetype.name,
      blurb: archetype.blurb,
      accent: archetype.accent,
      tags: [archetype.code],
    };
  }
  if (upper === WILDCARD.code) {
    return {
      code: WILDCARD.code,
      name: WILDCARD.name,
      blurb: WILDCARD.blurb,
      accent: WILDCARD.accent,
      tags: ['Unclassifiable'],
    };
  }
  return null;
}

export const sbtiConfig: TestConfig = {
  slug: 'sbti',
  name: 'SBTI Personality Test',
  tagline: 'A gloriously unscientific soul-scan',
  intro:
    'Thirty-one absurd questions, fifteen "soul dimensions", and one math formula deciding which internet archetype you are — from Goblin to Gigachad. There may be a hidden one. Pure chaos, zero credentials.',
  rules: [
    '31 questions, about 4 minutes.',
    'Answer on instinct — overthinking is, ironically, a measured trait.',
    'We score 15 dimensions, then match you to the closest archetype by distance.',
    'Strictly for laughs — not therapy, not a diagnosis, not a dating profile.',
  ],
  accent: '#c2502e',
  durationMin: 4,
  resultStyle: 'sbti',
  questions: QUESTIONS,
  score,
};
