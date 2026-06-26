'use client';

import { useEffect, useRef } from 'react';

import { GameStage } from '@/components/demos/DemoKit';
import { greedyDir, placeFood, type SnakeCell } from '@/lib/snake';
import { drawFoodOrb, drawSnakeBody, drawSnakeField } from '@/lib/snake-render';

/* Snake — greedy AI walks the grid toward the food, eats → grows + turns. The
   board, snake body and food orb are drawn with the SAME shared renderer as the
   real SnakeGame (@/lib/snake-render), so the demo mirrors the detail page. */
export function SnakeDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let cell = 16;
    let cols = 20;
    let rows = 12;
    let W = 0;
    let H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.max(13, Math.floor(Math.min(W, H) / 11));
      cols = Math.max(6, Math.floor(W / cell));
      rows = Math.max(5, Math.floor(H / cell));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    type Cell = SnakeCell;
    let snake: Cell[] = [];
    let dir: Cell = { x: 1, y: 0 };
    let food: Cell = { x: 0, y: 0 };
    let grow = 0;
    let phase = 0;
    const newFood = () => {
      food = placeFood(snake, cols, rows);
    };
    const reset = () => {
      const cy = Math.floor(rows / 2);
      snake = [
        { x: 3, y: cy },
        { x: 2, y: cy },
        { x: 1, y: cy },
      ];
      dir = { x: 1, y: 0 };
      grow = 0;
      newFood();
    };
    reset();

    const step = () => {
      const d = greedyDir(snake, dir, food, cols, rows);
      if (!d) return reset();
      dir = d;
      const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        grow += 1;
        newFood();
      }
      if (grow > 0) grow--;
      else snake.pop();
    };

    const center = (c: Cell) => ({
      x: c.x * cell + cell / 2,
      y: c.y * cell + cell / 2,
    });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0f1512';
      ctx.fillRect(0, 0, W, H);
      const bw = cols * cell;
      const bh = rows * cell;
      const ox = (W - bw) / 2;
      const oy = (H - bh) / 2;
      ctx.save();
      ctx.translate(ox, oy);
      drawSnakeField(ctx, bw, bh, cell);
      const fc = center(food);
      drawFoodOrb(ctx, fc.x, fc.y, cell, phase);
      drawSnakeBody(ctx, snake.map(center), cell, dir);
      ctx.restore();
    };

    let raf = 0;
    let acc = 0;
    let last = 0;
    let visible = true;
    const STEP = 150;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(cv);
    const loop = (t: number) => {
      if (visible) {
        if (last) {
          acc += t - last;
          phase += (t - last) * 0.005;
        }
        while (acc >= STEP) {
          step();
          acc -= STEP;
        }
        draw();
      }
      last = t;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [active]);
  return (
    <GameStage bg='#0f1512'>
      <canvas className='absolute inset-0 h-full w-full' ref={ref} />
    </GameStage>
  );
}
