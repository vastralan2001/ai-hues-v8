import 'server-only';

import { env, pipeline } from '@huggingface/transformers';

import { PUBLISHED_TOOL_SLUGS } from '@/lib/published-tools';
import { ALL_TOOLS } from '@/lib/tool-data';

/* ──────────────────────────────────────────────────────────────
   Semantic search over the full catalog (all tools + games).

   Real BERT sentence embeddings (all-MiniLM-L6-v2) drive a flat
   inner-product index (== FAISS IndexFlatIP for L2-normalised
   vectors). Each doc's text is enriched with domain keywords, and a
   lexical-overlap boost is blended into the cosine score so short
   domain queries ("network", "qr code") rank the right tools first.
   ────────────────────────────────────────────────────────────── */

// huggingface.co is unreachable here; the mirror serves the same files.
env.remoteHost = 'https://hf-mirror.com';
env.allowRemoteModels = true;

const MODEL = 'Xenova/all-MiniLM-L6-v2';

export interface SearchHit {
  slug: string;
  title: string;
  subtitle: string;
  href: string;
  type: 'tool' | 'game' | 'test';
  score: number;
}

interface Doc {
  slug: string;
  title: string;
  subtitle: string;
  href: string;
  type: 'tool' | 'game' | 'test';
  text: string;
  searchText: string; // lowercased text used for the lexical boost
}

// category → generic descriptive terms (specific domains live in TOOL_KEYWORDS)
const CATEGORY_KEYWORDS: Record<string, string> = {
  developer: 'developer engineering programming code software',
  utility: 'utility helper everyday tool',
  'ai-writing': 'ai writing content generate',
  content: 'content writing copy',
  seo: 'seo search keyword',
  growth: 'growth marketing',
};

// per-tool domain synonyms for terms a user is likely to type
const TOOL_KEYWORDS: Record<string, string> = {
  'ip-lookup': 'network ip address dns geolocation host whois',
  'curl-to-code':
    'network http request api curl convert code python javascript',
  'curl-gen': 'network http request api curl command builder',
  'http-status': 'network http web status code error response',
  qrcode: 'qr code barcode scan link generator',
  'color-convert': 'color colour hex rgb hsl palette picker',
  timestamp: 'time date unix epoch timestamp clock convert',
  'password-gen': 'password passphrase secure random strong generator',
  base64: 'base64 encode decode binary data',
  jwt: 'jwt json web token auth authentication decode',
  json: 'json format validate prettify minify data',
  regex: 'regex regular expression pattern match test',
  sha256: 'hash sha256 checksum crypto digest',
  'cn-convert': 'chinese simplified traditional convert 简体 繁体 中文',
  'table-convert': 'csv excel markdown table convert spreadsheet',
  markdown: 'markdown preview md html render',
  diff: 'diff compare text changes difference',
  'unit-convert': 'unit convert length weight temperature measure metric',
  'image-to-base64': 'image picture base64 data uri encode',
  'css-gradient': 'css gradient colour background design',
  'word-count': 'word count character text length counter',
  humanize: 'humanize ai text natural rewrite undetectable',
  'url-encode': 'url encode decode percent uri escape',
  'html-entity': 'html entity encode decode escape',
  'lorem-ipsum': 'lorem ipsum placeholder dummy text filler',
  uuid: 'uuid guid unique id identifier generate',
  sql: 'sql query format database',
  'base-convert': 'binary hex decimal octal base number convert',
  fullwidth: 'fullwidth halfwidth character convert',
  'cron-parser': 'cron schedule crontab expression',
};

const GAMES: { slug: string; title: string; desc: string }[] = [
  {
    slug: 'doodle-jump',
    title: 'Doodle Jump',
    desc: 'endless arcade jumping platformer, hop ledge to ledge, climb high score',
  },
  {
    slug: 'daily-luck',
    title: 'Daily Fortune',
    desc: 'draw a daily fortune stick, omikuji, luck wisdom and credit rewards',
  },
  {
    slug: 'slot-machine',
    title: 'Lucky Slots',
    desc: 'spin the slot machine reels, match symbols, casino luck jackpot',
  },
  {
    slug: 'basketball',
    title: 'Basketball Shootout',
    desc: 'flick the ball into the hoop, timed shooting arcade sports game',
  },
];

const TESTS: { slug: string; title: string; desc: string }[] = [
  {
    slug: 'sbti',
    title: 'SBTI',
    desc: 'satirical personality test, soul scan quiz, internet archetype — goblin doomer gigachad, sb type indicator, mbti parody, who are you',
  },
  {
    slug: 'mbti',
    title: 'MBTI',
    desc: 'personality test, 16 personalities, myers briggs type indicator, four letter type, introvert extrovert intuitive thinking, intj enfp quiz assessment',
  },
];

function buildCorpus(): Doc[] {
  const published = new Set(PUBLISHED_TOOL_SLUGS);
  const tools: Doc[] = ALL_TOOLS.filter((t) => published.has(t.slug)).map(
    (t) => {
      const kw = `${CATEGORY_KEYWORDS[t.category] ?? ''} ${TOOL_KEYWORDS[t.slug] ?? ''}`;
      const text = `${t.name}. ${t.nameZh}. ${t.description}. ${t.descriptionZh}. ${t.category}. ${kw}`;
      return {
        slug: t.slug,
        title: t.name,
        subtitle: t.category,
        href: t.url,
        type: 'tool' as const,
        text,
        searchText: text.toLowerCase(),
      };
    }
  );
  const games: Doc[] = GAMES.map((g) => {
    const text = `${g.title}. ${g.desc}. mini game play arcade fun`;
    return {
      slug: g.slug,
      title: g.title,
      subtitle: 'game',
      href: `/games/${g.slug}`,
      type: 'game' as const,
      text,
      searchText: text.toLowerCase(),
    };
  });
  const tests: Doc[] = TESTS.map((t) => {
    const text = `${t.title}. ${t.desc}. personality test quiz assessment`;
    return {
      slug: t.slug,
      title: t.title,
      subtitle: 'test',
      href: `/tests/${t.slug}`,
      type: 'test' as const,
      text,
      searchText: text.toLowerCase(),
    };
  });
  return [...tools, ...games, ...tests];
}

interface Index {
  extract: (text: string) => Promise<Float32Array>;
  vecs: Float32Array[];
  docs: Doc[];
}

let indexPromise: Promise<Index> | null = null;

async function buildIndex(): Promise<Index> {
  const t0 = Date.now();
  console.log('[search] building embedding index…');
  const extractor = await pipeline('feature-extraction', MODEL);
  const extract = async (text: string): Promise<Float32Array> => {
    const out = await extractor(text, { pooling: 'mean', normalize: true });
    return out.data as Float32Array;
  };
  const docs = buildCorpus();
  const vecs: Float32Array[] = [];
  for (const d of docs) vecs.push(await extract(d.text));
  console.log(
    `[search] index ready: ${docs.length} docs in ${Date.now() - t0}ms`
  );
  return { extract, vecs, docs };
}

function getIndex(): Promise<Index> {
  if (!indexPromise) indexPromise = buildIndex();
  return indexPromise;
}

/** Build the embedding index now (called on server startup). */
export function warmIndex(): Promise<unknown> {
  return getIndex();
}

function dot(a: Float32Array, b: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function lexicalOverlap(query: string, searchText: string): number {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9一-鿿]+/)
    .filter((t) => t.length >= 2);
  if (terms.length === 0) return 0;
  let hit = 0;
  for (const t of terms) if (searchText.includes(t)) hit++;
  return hit / terms.length;
}

export async function semanticSearch(
  query: string,
  k = 8,
  minScore = 0.25
): Promise<SearchHit[]> {
  const { extract, vecs, docs } = await getIndex();
  const q = await extract(query);
  const scored = docs.map((d, i) => {
    const cosine = dot(q, vecs[i]);
    const lex = lexicalOverlap(query, d.searchText);
    return { d, score: cosine + lex * 0.3 };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((s) => s.score >= minScore)
    .slice(0, k)
    .map((s) => ({
      slug: s.d.slug,
      title: s.d.title,
      subtitle: s.d.subtitle,
      href: s.d.href,
      type: s.d.type,
      score: Math.round(Math.min(1, s.score) * 1000) / 1000,
    }));
}
