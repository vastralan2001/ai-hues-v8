'use client';

/* Thin UCI wrapper around the vendored Stockfish 17.1 (lite, single-threaded)
   WebAssembly build, run in a plain Web Worker — no cross-origin isolation
   required. One instance drives both human-vs-engine and engine-vs-engine play
   as well as the eval bar; skill level is reconfigured per search. */

export const ENGINE_URL = '/engine/stockfish-17.1-lite-single-03e3232.js';

export interface EngineInfo {
  depth: number;
  scoreCp: number | null;
  scoreMate: number | null;
  pv: string[];
  multipv: number;
}

export interface SearchResult {
  bestmove: string | null;
  ponder: string | null;
  info: EngineInfo | null;
}

export interface SearchLimits {
  depth?: number;
  movetime?: number;
  nodes?: number;
}

type Listener = (line: string) => void;

function parseInfo(line: string): EngineInfo | null {
  const toks = line.split(/\s+/);
  const info: EngineInfo = {
    depth: 0,
    scoreCp: null,
    scoreMate: null,
    pv: [],
    multipv: 1,
  };
  let hasScore = false;
  for (let i = 1; i < toks.length; i++) {
    const t = toks[i];
    if (t === 'depth') info.depth = parseInt(toks[++i], 10) || 0;
    else if (t === 'multipv') info.multipv = parseInt(toks[++i], 10) || 1;
    else if (t === 'score') {
      const kind = toks[++i];
      const val = parseInt(toks[++i], 10);
      if (kind === 'cp') {
        info.scoreCp = val;
        hasScore = true;
      } else if (kind === 'mate') {
        info.scoreMate = val;
        hasScore = true;
      }
    } else if (t === 'pv') {
      info.pv = toks.slice(i + 1);
      break;
    }
  }
  if (info.depth === 0 && !hasScore) return null;
  return info;
}

export class StockfishEngine {
  private worker: Worker | null = null;
  private listeners = new Set<Listener>();
  private url: string;
  ready = false;

  constructor(url: string = ENGINE_URL) {
    this.url = url;
  }

  async init(): Promise<void> {
    if (this.worker) return;
    const w = new Worker(this.url);
    this.worker = w;
    w.onmessage = (e: MessageEvent) => {
      const data = e.data;
      const line =
        typeof data === 'string'
          ? data
          : data && typeof data.data === 'string'
            ? data.data
            : '';
      if (!line) return;
      for (const fn of Array.from(this.listeners)) fn(line);
    };
    await this.waitFor('uciok', () => this.send('uci'), 20000);
    this.send('setoption name Threads value 1');
    this.send('setoption name Hash value 48');
    this.send('setoption name UCI_LimitStrength value false');
    await this.isReady();
    this.ready = true;
  }

  private send(cmd: string) {
    this.worker?.postMessage(cmd);
  }

  command(cmd: string) {
    this.send(cmd);
  }

  private waitFor(
    token: string,
    trigger: () => void,
    timeout = 10000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const fn: Listener = (line) => {
        if (line.indexOf(token) === 0) {
          clearTimeout(to);
          this.listeners.delete(fn);
          resolve();
        }
      };
      const to = setTimeout(() => {
        this.listeners.delete(fn);
        reject(new Error('Stockfish timeout waiting for ' + token));
      }, timeout);
      this.listeners.add(fn);
      trigger();
    });
  }

  isReady(): Promise<void> {
    return this.waitFor('readyok', () => this.send('isready'), 12000);
  }

  newGame() {
    this.send('ucinewgame');
  }

  setSkill(level: number) {
    const v = Math.max(0, Math.min(20, Math.round(level)));
    this.send(`setoption name Skill Level value ${v}`);
  }

  setOption(name: string, value: string | number) {
    this.send(`setoption name ${name} value ${value}`);
  }

  search(
    fen: string,
    limits: SearchLimits,
    onInfo?: (info: EngineInfo) => void
  ): Promise<SearchResult> {
    return new Promise((resolve) => {
      let last: EngineInfo | null = null;
      const fn: Listener = (line) => {
        if (line.indexOf('info') === 0) {
          const info = parseInfo(line);
          if (info) {
            last = info;
            onInfo?.(info);
          }
        } else if (line.indexOf('bestmove') === 0) {
          const parts = line.split(/\s+/);
          this.listeners.delete(fn);
          const bm = parts[1] && parts[1] !== '(none)' ? parts[1] : null;
          const ponder = parts[3] && parts[3] !== '(none)' ? parts[3] : null;
          resolve({ bestmove: bm, ponder, info: last });
        }
      };
      this.listeners.add(fn);
      this.send('position fen ' + fen);
      let go = 'go';
      if (limits.depth) go += ' depth ' + limits.depth;
      if (limits.movetime) go += ' movetime ' + limits.movetime;
      if (limits.nodes) go += ' nodes ' + limits.nodes;
      this.send(go);
    });
  }

  stop() {
    this.send('stop');
  }

  quit() {
    try {
      this.send('quit');
    } catch {
      /* ignore */
    }
    this.worker?.terminate();
    this.worker = null;
    this.listeners.clear();
    this.ready = false;
  }
}
