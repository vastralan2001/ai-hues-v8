/* Shared Snake core — board cell type, food placement and the greedy pathing
   AI. Used by the home auto-play demo (and available to the real SnakeGame). */

export type SnakeCell = { x: number; y: number };

export function placeFood(
  snake: SnakeCell[],
  cols: number,
  rows: number
): SnakeCell {
  let c: SnakeCell;
  do {
    c = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (snake.some((s) => s.x === c.x && s.y === c.y));
  return c;
}

/* Greedy AI — step toward the food, avoiding walls and the body; returns null
   when boxed in (caller should reset). */
export function greedyDir(
  snake: SnakeCell[],
  dir: SnakeCell,
  food: SnakeCell,
  cols: number,
  rows: number
): SnakeCell | null {
  const head = snake[0];
  const cand: SnakeCell[] = [];
  if (food.x !== head.x) cand.push({ x: Math.sign(food.x - head.x), y: 0 });
  if (food.y !== head.y) cand.push({ x: 0, y: Math.sign(food.y - head.y) });
  cand.push({ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 });
  for (const d of cand) {
    if (d.x === -dir.x && d.y === -dir.y) continue;
    const nx = head.x + d.x;
    const ny = head.y + d.y;
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
    if (snake.some((s, i) => i < snake.length - 1 && s.x === nx && s.y === ny))
      continue;
    return d;
  }
  return null;
}
