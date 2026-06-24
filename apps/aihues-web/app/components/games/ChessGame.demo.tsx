'use client';

import { useEffect, useRef } from 'react';

import { GameStage } from '@/components/demos/DemoKit';
import { drawPieceSilhouette } from '@/lib/chess-pieces';

/* Chess — a self-playing demo that uses the SAME engine the real ChessGame's
   Spectate mode does (@/lib/chess-engine, Stockfish) at a solid skill level,
   and the SAME piece silhouettes (@/lib/chess-pieces). Engine vs engine, board
   palette + blue last-move highlight mirror the real board. The engine is
   created once and only thinks while the slide is visible + active. */
const LEVEL = { skill: 14, depth: 12, movetime: 600 };

export function ChessDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    let raf = 0;
    let cancelled = false;
    let cleanupExtra = () => {};
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    void Promise.all([import('chess.js'), import('@/lib/chess-engine')]).then(
      ([{ Chess }, { ChessEngine }]) => {
        if (cancelled) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        let W = 0;
        let H = 0;
        let CELL = 0;
        let ox = 0;
        let oy = 0;
        const resize = () => {
          const r = cv.getBoundingClientRect();
          W = r.width;
          H = r.height;
          cv.width = Math.round(W * dpr);
          cv.height = Math.round(H * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          CELL = Math.floor((Math.min(W, H) * 0.92) / 8);
          ox = (W - CELL * 8) / 2;
          oy = (H - CELL * 8) / 2;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cv);

        const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let chess = new Chess();
        let lastFrom: string | null = null;
        let lastTo: string | null = null;
        let anim: {
          fc: number;
          fr: number;
          tc: number;
          tr: number;
          type: string;
          color: 'w' | 'b';
          t: number;
        } | null = null;

        const rc = (sq: string): [number, number] => [
          FILES.indexOf(sq[0]),
          8 - parseInt(sq[1], 10),
        ];

        const engine = new ChessEngine();

        const applyUci = (uci: string) => {
          const from = uci.slice(0, 2);
          const to = uci.slice(2, 4);
          const promotion = uci.length > 4 ? uci[4] : undefined;
          const piece = chess.get(from as never) as
            | { type: string; color: 'w' | 'b' }
            | undefined;
          let mv: unknown = null;
          try {
            mv = chess.move({ from, to, promotion });
          } catch {
            mv = null;
          }
          if (!mv) return;
          lastFrom = from;
          lastTo = to;
          const [fc, fr] = rc(from);
          const [tc, tr] = rc(to);
          anim = {
            fc,
            fr,
            tc,
            tr,
            type: piece?.type ?? 'p',
            color: piece?.color ?? 'w',
            t: 0,
          };
        };

        let visible = true;
        const io = new IntersectionObserver(
          ([e]) => (visible = e.isIntersecting),
          { threshold: 0.1 }
        );
        io.observe(cv);

        // ── think loop: the spectate engine plays both sides ──
        const think = async () => {
          try {
            await engine.init();
          } catch {
            return;
          }
          while (!cancelled) {
            if (!activeRef.current || !visible) {
              await sleep(300);
              continue;
            }
            if (chess.isGameOver() || chess.history().length >= 60) {
              await sleep(1400);
              chess = new Chess();
              lastFrom = null;
              lastTo = null;
              anim = null;
              continue;
            }
            engine.setSkill(LEVEL.skill);
            let res: { bestmove: string | null } | null = null;
            try {
              res = await engine.search(chess.fen(), {
                depth: LEVEL.depth,
                movetime: LEVEL.movetime,
              });
            } catch {
              res = null;
            }
            if (cancelled) break;
            if (res?.bestmove) {
              applyUci(res.bestmove);
              await sleep(750);
            } else {
              await sleep(400);
            }
          }
        };
        void think();

        const draw = () => {
          ctx.clearRect(0, 0, W, H);
          for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++) {
              ctx.fillStyle =
                (r + c) % 2 === 0
                  ? 'rgba(236,240,248,0.21)'
                  : 'rgba(34,42,62,0.55)';
              ctx.fillRect(ox + c * CELL, oy + r * CELL, CELL, CELL);
            }
          for (const sq of [lastFrom, lastTo]) {
            if (!sq) continue;
            const [c, r] = rc(sq);
            ctx.fillStyle = 'rgba(130,170,255,0.26)';
            ctx.fillRect(ox + c * CELL, oy + r * CELL, CELL, CELL);
          }
          const board = chess.board();
          for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++) {
              const pc = board[r][c];
              if (!pc) continue;
              if (anim && anim.t < 1 && c === anim.tc && r === anim.tr)
                continue;
              drawPieceSilhouette(
                ctx,
                pc.type,
                pc.color === 'w',
                ox + c * CELL + CELL / 2,
                oy + r * CELL + CELL / 2,
                CELL
              );
            }
          if (anim && anim.t < 1) {
            const e =
              anim.t < 0.5
                ? 2 * anim.t * anim.t
                : 1 - Math.pow(-2 * anim.t + 2, 2) / 2;
            const cx =
              ox + (anim.fc + (anim.tc - anim.fc) * e) * CELL + CELL / 2;
            const cy =
              oy + (anim.fr + (anim.tr - anim.fr) * e) * CELL + CELL / 2;
            drawPieceSilhouette(
              ctx,
              anim.type,
              anim.color === 'w',
              cx,
              cy,
              CELL
            );
          }
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.strokeRect(ox, oy, CELL * 8, CELL * 8);
        };

        let last = 0;
        const loop = (ts: number) => {
          raf = requestAnimationFrame(loop);
          if (!last) last = ts;
          const dt = Math.min(60, ts - last);
          last = ts;
          if (!visible) return;
          if (anim && anim.t < 1) anim.t = Math.min(1, anim.t + dt / 240);
          draw();
        };
        raf = requestAnimationFrame(loop);

        cleanupExtra = () => {
          ro.disconnect();
          io.disconnect();
          engine.quit();
        };
      }
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanupExtra();
    };
  }, []);

  return (
    <GameStage bg='radial-gradient(125% 95% at 50% 38%, #232233 0%, #16151f 46%, #0b0a10 100%)'>
      <canvas className='absolute inset-0 h-full w-full' ref={ref} />
    </GameStage>
  );
}
