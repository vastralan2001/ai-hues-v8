/* Opening book — names a position by its ECO opening. The map (EPD -> "ECO|name")
   is generated from the public-domain lichess-org/chess-openings dataset and
   served as a static asset, fetched once on demand so it never enters the JS
   bundle. Lookups key on the position's EPD (board + side + castling + en
   passant) so transpositions resolve to the same opening. */

export interface OpeningInfo {
  eco: string;
  name: string;
}

export interface OpeningEntry {
  eco: string;
  name: string;
  fen: string;
}

type OpeningMap = Record<string, string>;

let MAP: OpeningMap | null = null;
let LIST: OpeningEntry[] | null = null;
let loadingPromise: Promise<OpeningMap | null> | null = null;

function buildList(map: OpeningMap): OpeningEntry[] {
  const arr: OpeningEntry[] = [];
  for (const epd in map) {
    const v = map[epd];
    const i = v.indexOf('|');
    arr.push({
      eco: i < 0 ? '' : v.slice(0, i),
      name: i < 0 ? v : v.slice(i + 1),
      fen: `${epd} 0 1`,
    });
  }
  arr.sort(
    (a, b) => a.eco.localeCompare(b.eco) || a.name.localeCompare(b.name)
  );
  return arr;
}

export function ensureOpenings(): Promise<OpeningMap | null> {
  if (MAP) return Promise.resolve(MAP);
  if (!loadingPromise) {
    loadingPromise = fetch('/chess-openings.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: OpeningMap | null) => {
        MAP = data;
        LIST = data ? buildList(data) : [];
        return MAP;
      })
      .catch(() => null);
  }
  return loadingPromise;
}

function epdOf(fen: string): string {
  return fen.split(' ').slice(0, 4).join(' ');
}

export function openingForFen(fen: string): OpeningInfo | null {
  if (!MAP) return null;
  const v = MAP[epdOf(fen)];
  if (!v) return null;
  const i = v.indexOf('|');
  return i < 0
    ? { eco: '', name: v }
    : { eco: v.slice(0, i), name: v.slice(i + 1) };
}

export function openingsLoaded(): boolean {
  return LIST != null;
}

/* Filter the full book by a name/ECO substring and an ECO family letter
   ('all' or 'A'..'E'), capped to a sensible number for the browser list. */
export function searchOpenings(
  query: string,
  category: string,
  limit = 120
): OpeningEntry[] {
  if (!LIST) return [];
  const q = query.trim().toLowerCase();
  const cat = category && category !== 'all' ? category.toUpperCase() : '';
  const out: OpeningEntry[] = [];
  for (const e of LIST) {
    if (cat && (e.eco[0] || '').toUpperCase() !== cat) continue;
    if (
      q &&
      !e.name.toLowerCase().includes(q) &&
      !e.eco.toLowerCase().includes(q)
    )
      continue;
    out.push(e);
    if (out.length >= limit) break;
  }
  return out;
}

/* A short, hand-picked list of well-known openings for the "start from an
   opening" picker; moves are SAN and replayed onto the board. The book above
   names whatever position results, so the picker and the live label agree. */
export const POPULAR_OPENINGS: { name: string; moves: string }[] = [
  { name: 'Ruy López', moves: 'e4 e5 Nf3 Nc6 Bb5' },
  { name: 'Italian Game', moves: 'e4 e5 Nf3 Nc6 Bc4' },
  { name: 'Scotch Game', moves: 'e4 e5 Nf3 Nc6 d4' },
  { name: "King's Gambit", moves: 'e4 e5 f4' },
  { name: 'Sicilian Defense', moves: 'e4 c5' },
  { name: 'Sicilian: Najdorf', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6' },
  { name: 'Sicilian: Dragon', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6' },
  { name: 'French Defense', moves: 'e4 e6 d4 d5' },
  { name: 'Caro-Kann Defense', moves: 'e4 c6 d4 d5' },
  { name: 'Scandinavian Defense', moves: 'e4 d5 exd5 Qxd5 Nc3 Qa5' },
  { name: 'Pirc Defense', moves: 'e4 d6 d4 Nf6 Nc3 g6' },
  { name: "Queen's Gambit", moves: 'd4 d5 c4' },
  { name: "Queen's Gambit Declined", moves: 'd4 d5 c4 e6' },
  { name: 'Slav Defense', moves: 'd4 d5 c4 c6' },
  { name: "King's Indian Defense", moves: 'd4 Nf6 c4 g6 Nc3 Bg7' },
  { name: 'Nimzo-Indian Defense', moves: 'd4 Nf6 c4 e6 Nc3 Bb4' },
  { name: 'Grünfeld Defense', moves: 'd4 Nf6 c4 g6 Nc3 d5' },
  { name: 'English Opening', moves: 'c4' },
  { name: 'Réti Opening', moves: 'Nf3 d5 c4' },
  { name: 'London System', moves: 'd4 d5 Bf4' },
  { name: 'Dutch Defense', moves: 'd4 f5' },
];
