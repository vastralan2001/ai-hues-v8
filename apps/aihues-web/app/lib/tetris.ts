/* Shared Tetris core — the tetromino set, colours, rotation and collision used
   by BOTH the real TetrisGame and its auto-play demo, so the two never drift.
   Board cells are 0 (empty) or a piece id 1..7 → COLORS[id-1]. */

export const COLS = 10;
export const ROWS = 20;

// 7 tetromino shapes (I, O, T, S, Z, J, L).
export const SHAPES: number[][][] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
];

// Per-tetromino colours (index 1..7 stored on the board).
export const COLORS = [
  '#22d3ee', // I — cyan
  '#facc15', // O — amber
  '#c084fc', // T — violet
  '#4ade80', // S — green
  '#fb7185', // Z — rose
  '#60a5fa', // J — blue
  '#fb923c', // L — orange
];

// Rotate a shape clockwise — transpose + reverse (exactly the real game's).
export function rotateCW(shape: number[][]): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < shape[0].length; i++) {
    out[i] = [];
    for (let j = shape.length - 1; j >= 0; j--)
      out[i][shape.length - 1 - j] = shape[j][i];
  }
  return out;
}

// Bounds + collision check of `shape` placed at (px, py) on `board`.
export function fits(
  board: number[][],
  shape: number[][],
  px: number,
  py: number
): boolean {
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;
      const bx = px + x;
      const by = py + y;
      if (bx < 0 || bx >= COLS || by >= ROWS) return false;
      if (by >= 0 && board[by][bx]) return false;
    }
  return true;
}

// Lowest row `shape` can rest at in column `px`.
export function dropRow(
  board: number[][],
  shape: number[][],
  px: number
): number {
  let y = -shape.length;
  while (fits(board, shape, px, y + 1)) y++;
  return y;
}

/* Heuristic placement AI (classic Pierre Dellacherie-ish weights) — returns the
   best rotation (0..3) and column for `shape` on `board`. Used by the demo's
   auto-player. */
export function bestPlacement(
  board: number[][],
  shape: number[][],
  id: number
): { rot: number; x: number; shape: number[][] } {
  const score = (b: number[][], cleared: number) => {
    const heights: number[] = Array(COLS).fill(0);
    let holes = 0;
    for (let c = 0; c < COLS; c++) {
      let seen = false;
      for (let r = 0; r < ROWS; r++) {
        if (b[r][c]) {
          if (!seen) {
            seen = true;
            heights[c] = ROWS - r;
          }
        } else if (seen) holes++;
      }
    }
    const agg = heights.reduce((a, h) => a + h, 0);
    let bump = 0;
    for (let c = 0; c < COLS - 1; c++)
      bump += Math.abs(heights[c] - heights[c + 1]);
    return -0.51 * agg + 0.76 * cleared - 0.36 * holes - 0.18 * bump;
  };

  let best = { rot: 0, x: 0, shape, score: -Infinity };
  let s = shape;
  for (let rot = 0; rot < 4; rot++) {
    for (let x = -2; x < COLS; x++) {
      const y = dropRow(board, s, x);
      if (y < 0 || !fits(board, s, x, y)) continue;
      const sim = board.map((row) => row.slice());
      for (let yy = 0; yy < s.length; yy++)
        for (let xx = 0; xx < s[yy].length; xx++)
          if (s[yy][xx] && y + yy >= 0) sim[y + yy][x + xx] = id;
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--)
        if (sim[r].every((v) => v !== 0)) cleared++;
      const sc = score(sim, cleared) + Math.random() * 0.02;
      if (sc > best.score) best = { rot, x, shape: s, score: sc };
    }
    s = rotateCW(s);
  }
  return { rot: best.rot, x: best.x, shape: best.shape };
}
