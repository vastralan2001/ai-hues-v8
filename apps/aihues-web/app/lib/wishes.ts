import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { isAbsolute, join } from 'path';

export type WishStatus = 'PLANNED' | 'IN PROGRESS' | 'DONE';
export type WishType = 'tool' | 'game' | 'test';

export interface Wish {
  id: string;
  title: string;
  description: string;
  type: WishType;
  category: string;
  email?: string;
  referenceUrl?: string;
  status: WishStatus;
  votes: number;
  date: string;
  voters: string[];
}

// Use /data for containers (PVC-mounted) with fallback to cwd for local dev
// AIHUES_WISHES_PATH can override the local dev path for test isolation
function getLocalDataPath(): string {
  if (process.env.AIHUES_WISHES_PATH) {
    return isAbsolute(process.env.AIHUES_WISHES_PATH)
      ? process.env.AIHUES_WISHES_PATH
      : join(process.cwd(), process.env.AIHUES_WISHES_PATH);
  }
  return join(process.cwd(), 'data', 'wishes.json');
}

const DATA_PATH =
  process.env.NODE_ENV === 'production'
    ? '/data/aihues-wishes.json'
    : getLocalDataPath();

// Memory fallback when filesystem is read-only (e.g. some container runtimes)
let memoryWishes: Wish[] | null = null;

const INITIAL_WISHES: Wish[] = [
  {
    id: 'wish-001',
    title: 'PDF Summarizer',
    description:
      'Upload long PDFs and get a concise outline, key quotes, and action items.',
    type: 'tool',
    referenceUrl: '',
    category: 'AI Writing',
    status: 'IN PROGRESS',
    votes: 12,
    date: '2026-05-20',
    voters: [],
  },
  {
    id: 'wish-002',
    title: 'Image Background Remover',
    description:
      'Remove backgrounds from product images and avatars with one click.',
    type: 'tool',
    referenceUrl: '',
    category: 'Utility',
    status: 'PLANNED',
    votes: 9,
    date: '2026-05-18',
    voters: [],
  },
  {
    id: 'wish-003',
    title: 'API Mock Server',
    description:
      'Paste OpenAPI or JSON examples and generate a temporary mock endpoint.',
    type: 'tool',
    referenceUrl: '',
    category: 'Developer',
    status: 'PLANNED',
    votes: 7,
    date: '2026-05-16',
    voters: [],
  },
  {
    id: 'wish-004',
    title: 'Resume Bullet Rewriter',
    description:
      'Turn rough work notes into quantified resume bullets in multiple tones.',
    type: 'tool',
    referenceUrl: '',
    category: 'AI Writing',
    status: 'DONE',
    votes: 5,
    date: '2026-05-12',
    voters: [],
  },
  {
    id: 'wish-005',
    title: 'SQL Schema Visualizer',
    description:
      'Convert CREATE TABLE statements into a clean relationship diagram.',
    type: 'tool',
    referenceUrl: '',
    category: 'Developer',
    status: 'IN PROGRESS',
    votes: 8,
    date: '2026-05-10',
    voters: [],
  },
  {
    id: 'wish-006',
    title: 'Meeting Notes Cleaner',
    description:
      'Paste messy meeting notes and receive decisions, owners, and next steps.',
    type: 'tool',
    referenceUrl: '',
    category: 'Utility',
    status: 'PLANNED',
    votes: 4,
    date: '2026-05-08',
    voters: [],
  },
  {
    id: 'wish-007',
    title: 'Prompt Diff Tool',
    description:
      'Compare two prompt versions and highlight instruction, tone, and output changes.',
    type: 'tool',
    referenceUrl: '',
    category: 'Developer',
    status: 'PLANNED',
    votes: 6,
    date: '2026-05-06',
    voters: [],
  },
  {
    id: 'wish-008',
    title: 'Product Hunt Launch Kit',
    description:
      'Generate tagline, maker comment, launch checklist, and social copy.',
    type: 'tool',
    referenceUrl: '',
    category: 'Growth',
    status: 'DONE',
    votes: 3,
    date: '2026-05-03',
    voters: [],
  },
  {
    id: 'wish-009',
    title: 'Invoice Checker',
    description:
      'Extract invoice fields and flag missing tax IDs, totals, and dates.',
    type: 'tool',
    referenceUrl: '',
    category: 'Utility',
    status: 'PLANNED',
    votes: 2,
    date: '2026-05-01',
    voters: [],
  },
  {
    id: 'wish-010',
    title: 'CSS Clamp Generator',
    description:
      'Generate responsive clamp() font sizes and spacing scales from min/max values.',
    type: 'tool',
    referenceUrl: '',
    category: 'Developer',
    status: 'DONE',
    votes: 1,
    date: '2026-04-29',
    voters: [],
  },
  {
    id: 'wish-011',
    title: 'Daily Logic Puzzle',
    description:
      'A new grid-based logic puzzle every day with difficulty tiers and hints.',
    type: 'game',
    referenceUrl: 'https://www.nytimes.com/puzzles',
    category: 'Other',
    status: 'PLANNED',
    votes: 15,
    date: '2026-06-10',
    voters: [],
  },
  {
    id: 'wish-012',
    title: 'Typing Speed Challenge',
    description:
      'Race against the clock to type random code snippets and quotes.',
    type: 'game',
    referenceUrl: '',
    category: 'Other',
    status: 'IN PROGRESS',
    votes: 11,
    date: '2026-06-08',
    voters: [],
  },
  {
    id: 'wish-013',
    title: 'Color Memory Game',
    description:
      'A Simon-says style memory game with increasing color sequences.',
    type: 'game',
    referenceUrl: '',
    category: 'Other',
    status: 'PLANNED',
    votes: 6,
    date: '2026-06-05',
    voters: [],
  },
  {
    id: 'wish-014',
    title: 'Startup Idea Evaluator',
    description:
      'Answer 10 questions and get a brutally honest score on your startup idea.',
    type: 'test',
    referenceUrl: '',
    category: 'Other',
    status: 'PLANNED',
    votes: 18,
    date: '2026-06-12',
    voters: [],
  },
  {
    id: 'wish-015',
    title: 'Remote Work Personality Test',
    description:
      'Discover whether you thrive as a remote async worker or need office energy.',
    type: 'test',
    referenceUrl: 'https://www.16personalities.com',
    category: 'Other',
    status: 'IN PROGRESS',
    votes: 13,
    date: '2026-06-09',
    voters: [],
  },
  {
    id: 'wish-016',
    title: 'Vocabulary Level Check',
    description:
      'A 5-minute adaptive test to estimate your CEFR vocabulary level.',
    type: 'test',
    referenceUrl: '',
    category: 'Other',
    status: 'PLANNED',
    votes: 9,
    date: '2026-06-06',
    voters: [],
  },
];

function ensureDataFile(): boolean {
  if (memoryWishes !== null) return false; // already using memory fallback

  try {
    const dir =
      process.env.NODE_ENV === 'production'
        ? '/data'
        : join(process.cwd(), 'data');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    if (!existsSync(DATA_PATH)) {
      writeFileSync(
        DATA_PATH,
        JSON.stringify(INITIAL_WISHES, null, 2),
        'utf-8'
      );
    }
    return true;
  } catch {
    // Filesystem not writable — fall back to memory
    memoryWishes = [...INITIAL_WISHES];
    return false;
  }
}

function readWishes(): Wish[] {
  if (memoryWishes !== null) return memoryWishes;

  const ok = ensureDataFile();
  if (!ok) return memoryWishes ?? [];

  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as Wish[];
  } catch {
    memoryWishes = [...INITIAL_WISHES];
    return memoryWishes;
  }
}

function writeWishes(wishes: Wish[]) {
  if (memoryWishes !== null) {
    memoryWishes = wishes;
    return;
  }

  try {
    writeFileSync(DATA_PATH, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch {
    memoryWishes = wishes;
  }
}

export function listWishes(): Wish[] {
  return readWishes();
}

export function addWish(
  wish: Omit<Wish, 'id' | 'votes' | 'date' | 'voters' | 'status' | 'type'> & {
    type?: WishType;
  }
): Wish {
  const wishes = readWishes();
  const newWish: Wish = {
    ...wish,
    type: wish.type ?? 'tool',
    id: `wish-${Date.now()}`,
    status: 'PLANNED',
    votes: 0,
    date: new Date().toISOString().slice(0, 10),
    voters: [],
  };
  wishes.push(newWish);
  writeWishes(wishes);
  return newWish;
}

export function voteWish(
  wishId: string,
  anonymousId: string,
  action: 'up' | 'down'
): Wish | null {
  const wishes = readWishes();
  const idx = wishes.findIndex((w) => w.id === wishId);
  if (idx === -1) return null;

  const wish = wishes[idx];
  const hasVoted = wish.voters.includes(anonymousId);

  if (action === 'up') {
    if (!hasVoted) {
      wish.votes += 1;
      wish.voters.push(anonymousId);
    }
  } else {
    if (hasVoted) {
      wish.votes = Math.max(0, wish.votes - 1);
      wish.voters = wish.voters.filter((v) => v !== anonymousId);
    }
  }

  writeWishes(wishes);
  return wish;
}
