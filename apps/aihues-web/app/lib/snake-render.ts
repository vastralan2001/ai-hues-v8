/* Shared Snake renderer — the board (light pool, grid, glowing edge), the
   glossy gradient snake body with head + eyes, and the pulsing food orb. Used
   by BOTH the real SnakeGame and its auto-play demo so the two share one look.
   Callers set up their own transform; everything draws in the local space whose
   board top-left is (0,0) and span is w × h. */

export type SnakeCell = { x: number; y: number };

export const SNAKE_C = {
  pool: 'rgba(127,216,171,0.06)',
  headA: '#46e89a',
  headB: '#27bd76',
  tail: '#1b7a4c',
  gloss: 'rgba(255,255,255,0.34)',
  glow: 'rgba(62,224,143,0.5)',
  eye: '#0a0f0c',
  eyeWhite: 'rgba(255,255,255,0.95)',
  foodCore: '#ffe7b3',
  foodMid: '#ffb24a',
  foodEdge: '#ff8a1f',
  foodGlow: 'rgba(255,178,74,0.55)',
  fx: '#ffd24a',
  fxGlow: 'rgba(255,205,80,0.85)',
};

export function strokeSpine(
  ctx: CanvasRenderingContext2D,
  pts: SnakeCell[],
  width: number,
  style: string | CanvasGradient
) {
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = style;
  if (pts.length === 1) {
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, width / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

export function drawSnakeBody(
  ctx: CanvasRenderingContext2D,
  pts: SnakeCell[],
  cell: number,
  dir: SnakeCell
) {
  if (!pts.length) return;
  const head = pts[0];
  const tail = pts[pts.length - 1];

  ctx.save();
  ctx.shadowColor = SNAKE_C.glow;
  ctx.shadowBlur = 16;
  strokeSpine(ctx, pts, cell * 0.8, SNAKE_C.headB);
  ctx.restore();

  const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
  grad.addColorStop(0, SNAKE_C.headA);
  grad.addColorStop(1, SNAKE_C.tail);
  strokeSpine(ctx, pts, cell * 0.8, grad);
  strokeSpine(ctx, pts, cell * 0.3, SNAKE_C.gloss);

  const r = cell * 0.46;
  const hg = ctx.createRadialGradient(
    head.x - r * 0.3,
    head.y - r * 0.3,
    1,
    head.x,
    head.y,
    r
  );
  hg.addColorStop(0, SNAKE_C.headA);
  hg.addColorStop(1, SNAKE_C.headB);
  ctx.fillStyle = hg;
  ctx.beginPath();
  ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
  ctx.fill();
  const d = dir.x === 0 && dir.y === 0 ? { x: 1, y: 0 } : dir;
  const perp = { x: -d.y, y: d.x };
  for (const sgn of [1, -1]) {
    const ex = head.x + d.x * r * 0.32 + perp.x * r * 0.42 * sgn;
    const ey = head.y + d.y * r * 0.32 + perp.y * r * 0.42 * sgn;
    ctx.fillStyle = SNAKE_C.eyeWhite;
    ctx.beginPath();
    ctx.arc(ex, ey, r * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = SNAKE_C.eye;
    ctx.beginPath();
    ctx.arc(ex + d.x * r * 0.09, ey + d.y * r * 0.09, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawFoodOrb(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cell: number,
  foodPhase: number
) {
  const pulse = 1 + Math.sin(foodPhase) * 0.12;
  const R = cell * 0.34 * pulse;
  const ring = Math.sin(foodPhase) * 0.5 + 0.5;
  ctx.globalAlpha = 0.22 * ring;
  ctx.strokeStyle = SNAKE_C.foodMid;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R + 6 + ring * 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.shadowColor = SNAKE_C.foodGlow;
  ctx.shadowBlur = 18;
  const g2 = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 1, cx, cy, R);
  g2.addColorStop(0, SNAKE_C.foodCore);
  g2.addColorStop(0.6, SNAKE_C.foodMid);
  g2.addColorStop(1, SNAKE_C.foodEdge);
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.arc(cx - R * 0.32, cy - R * 0.32, R * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

export function drawSnakeField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cell: number
) {
  const cx = w / 2;
  const cy = h / 2;

  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  ctx.fillRect(0, 0, w, h);

  const pool = ctx.createRadialGradient(
    cx,
    cy,
    0,
    cx,
    cy,
    Math.max(w, h) * 0.72
  );
  pool.addColorStop(0, SNAKE_C.pool);
  pool.addColorStop(1, 'rgba(127,216,171,0)');
  ctx.fillStyle = pool;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#ffffff';
  for (let x = 0; x <= w + 0.5; x += cell) {
    for (let y = 0; y <= h + 0.5; y += cell) {
      const dx = (x - cx) / (w / 2);
      const dy = (y - cy) / (h / 2);
      const fade = 1 - Math.sqrt(dx * dx + dy * dy) * 0.5;
      if (fade <= 0.04) continue;
      ctx.globalAlpha = 0.05 * fade;
      ctx.beginPath();
      ctx.arc(x, y, 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.shadowColor = 'rgba(127,216,171,0.4)';
  ctx.shadowBlur = 9;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
  ctx.restore();
}
