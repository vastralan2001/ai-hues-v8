'use client';

import { useEffect, useRef } from 'react';

import { GameStage } from '@/components/demos/DemoKit';
import {
  bestPlacement,
  COLORS,
  COLS,
  fits,
  rotateCW,
  ROWS,
  SHAPES,
} from '@/lib/tetris';

/* Tetris — a self-playing demo built on the SAME shared core as the real
   TetrisGame (@/lib/tetris): identical tetromino set, colours, rotation and
   collision. A heuristic AI picks each piece's rotation + column, then the
   piece rotates at the top, slides over and drops. Glowing rounded blocks match
   the real game. */
export function TetrisDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let board: number[][] = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(0)
    );

    type Piece = {
      shape: number[][];
      id: number;
      x: number;
      y: number;
      rot: number;
      targetRot: number;
      targetX: number;
      planned: boolean;
    };

    const spawn = (): Piece => {
      const id = Math.floor(Math.random() * SHAPES.length);
      const shape = SHAPES[id];
      return {
        shape,
        id: id + 1,
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: -shape.length,
        rot: 0,
        targetRot: 0,
        targetX: 0,
        planned: false,
      };
    };

    let cur = spawn();
    let flash = 0;

    const plan = () => {
      const best = bestPlacement(board, SHAPES[cur.id - 1], cur.id);
      cur.targetRot = best.rot;
      cur.targetX = best.x;
      cur.planned = true;
    };

    const lockAndClear = () => {
      const s = cur.shape;
      for (let y = 0; y < s.length; y++)
        for (let x = 0; x < s[y].length; x++)
          if (s[y][x] && cur.y + y >= 0) board[cur.y + y][cur.x + x] = cur.id;
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every((v) => v !== 0)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(0));
          cleared++;
          r++;
        }
      }
      if (cleared) flash = 1;
      cur = spawn();
      if (!fits(board, cur.shape, cur.x, 0)) {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      }
    };

    const cell = () => Math.min(W / COLS, H / ROWS);
    const roundR = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };
    const block = (
      px: number,
      py: number,
      cs: number,
      color: string,
      glow: boolean
    ) => {
      const pad = Math.max(1, cs * 0.06);
      const x = px + pad;
      const y = py + pad;
      const sz = cs - pad * 2;
      ctx.save();
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = Math.max(5, cs * 0.4);
      }
      ctx.fillStyle = color;
      roundR(x, y, sz, sz, cs * 0.18);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      roundR(x + sz * 0.12, y + sz * 0.1, sz * 0.76, sz * 0.32, cs * 0.12);
      ctx.fill();
    };

    const draw = () => {
      const cs = cell();
      const ox = (W - cs * COLS) / 2;
      const oy = (H - cs * ROWS) / 2;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, oy, 0, oy + cs * ROWS);
      bg.addColorStop(0, 'rgba(255,255,255,0.05)');
      bg.addColorStop(1, 'rgba(255,255,255,0.02)');
      ctx.fillStyle = bg;
      roundR(ox, oy, cs * COLS, cs * ROWS, 12);
      ctx.fill();
      ctx.save();
      roundR(ox, oy, cs * COLS, cs * ROWS, 12);
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 1; i < COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(ox + i * cs, oy);
        ctx.lineTo(ox + i * cs, oy + cs * ROWS);
        ctx.stroke();
      }
      for (let i = 1; i < ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(ox, oy + i * cs);
        ctx.lineTo(ox + cs * COLS, oy + i * cs);
        ctx.stroke();
      }
      ctx.restore();
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (board[r][c])
            block(ox + c * cs, oy + r * cs, cs, COLORS[board[r][c] - 1], false);
      const s = cur.shape;
      for (let y = 0; y < s.length; y++)
        for (let x = 0; x < s[y].length; x++) {
          if (!s[y][x]) continue;
          const by = cur.y + y;
          if (by < 0) continue;
          block(
            ox + (cur.x + x) * cs,
            oy + by * cs,
            cs,
            COLORS[cur.id - 1],
            true
          );
        }
      if (flash > 0) {
        ctx.save();
        roundR(ox, oy, cs * COLS, cs * ROWS, 12);
        ctx.clip();
        ctx.fillStyle = `rgba(255,255,255,${(flash * 0.4).toFixed(3)})`;
        ctx.fillRect(ox, oy, cs * COLS, cs * ROWS);
        ctx.restore();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.5;
      roundR(ox, oy, cs * COLS, cs * ROWS, 12);
      ctx.stroke();
    };

    let raf = 0;
    let acc = 0;
    let last = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(cv);
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!last) last = ts;
      const dt = Math.min(60, ts - last);
      last = ts;
      if (!visible) return;
      if (flash > 0) flash = Math.max(0, flash - 0.06);
      if (!cur.planned) plan();
      acc += dt;
      if (acc >= 90) {
        acc = 0;
        if (cur.rot !== cur.targetRot) {
          // rotate at the top where there's room; snap if a kick isn't free
          const r = rotateCW(cur.shape);
          if (fits(board, r, cur.x, cur.y)) {
            cur.shape = r;
            cur.rot = (cur.rot + 1) % 4;
          } else {
            cur.rot = cur.targetRot;
            cur.shape = r;
          }
        } else if (
          cur.x < cur.targetX &&
          fits(board, cur.shape, cur.x + 1, cur.y)
        ) {
          cur.x++;
        } else if (
          cur.x > cur.targetX &&
          fits(board, cur.shape, cur.x - 1, cur.y)
        ) {
          cur.x--;
        } else if (fits(board, cur.shape, cur.x, cur.y + 1)) {
          cur.y++;
        } else {
          lockAndClear();
        }
      }
      draw();
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [active]);
  return (
    <GameStage bg='radial-gradient(125% 95% at 50% 42%, #18211c 0%, #121815 46%, #0a0e0c 100%)'>
      <canvas className='absolute inset-0 h-full w-full' ref={ref} />
    </GameStage>
  );
}
