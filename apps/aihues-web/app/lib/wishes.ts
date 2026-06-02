import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export type WishStatus = 'PLANNED' | 'IN PROGRESS' | 'DONE';

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: string;
  status: WishStatus;
  votes: number;
  date: string;
  voters: string[];
}

// Use /tmp for containers (guaranteed writable) with fallback to cwd for local dev
const DATA_PATH =
  process.env.NODE_ENV === 'production'
    ? '/tmp/aihues-wishes.json'
    : join(process.cwd(), 'data', 'wishes.json');

// Memory fallback when filesystem is read-only (e.g. some container runtimes)
let memoryWishes: Wish[] | null = null;

const INITIAL_WISHES: Wish[] = [
  {
    id: 'wish-001',
    title: 'AI PDF Summarizer',
    description:
      'Upload long PDFs and get a concise outline, key quotes, and action items.',
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
    category: 'Utility',
    status: 'PLANNED',
    votes: 4,
    date: '2026-05-08',
    voters: [],
  },
  {
    id: 'wish-007',
    title: 'Prompt Version Diff',
    description:
      'Compare two prompt versions and highlight instruction, tone, and output changes.',
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
    category: 'Growth',
    status: 'DONE',
    votes: 3,
    date: '2026-05-03',
    voters: [],
  },
  {
    id: 'wish-009',
    title: 'Invoice OCR Checker',
    description:
      'Extract invoice fields and flag missing tax IDs, totals, and dates.',
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
    category: 'Developer',
    status: 'DONE',
    votes: 1,
    date: '2026-04-29',
    voters: [],
  },
];

function ensureDataFile(): boolean {
  if (memoryWishes !== null) return false; // already using memory fallback

  try {
    const dir =
      process.env.NODE_ENV === 'production'
        ? '/tmp'
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
  wish: Omit<Wish, 'id' | 'votes' | 'date' | 'voters' | 'status'>
): Wish {
  const wishes = readWishes();
  const newWish: Wish = {
    ...wish,
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
