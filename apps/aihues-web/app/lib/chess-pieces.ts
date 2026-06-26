/* Shared chess piece rendering — the geometric silhouettes and 3D shading used
   by BOTH the real ChessGame board and the home auto-play demo, so the pieces
   are pixel-identical. Drawn in a 100×100 box (centred at x=50, base at y≈88). */

const cache: Record<string, Path2D> = {};

export function buildPiece(type: string): Path2D {
  if (cache[type]) return cache[type];
  const p = new Path2D();
  const ball = (x: number, y: number, r: number) => {
    p.moveTo(x + r, y);
    p.arc(x, y, r, 0, Math.PI * 2);
  };
  // shared base — a rounded, lightly flared plinth + a neck ring
  p.moveTo(30, 88);
  p.bezierCurveTo(26, 88, 26, 84, 31, 82);
  p.lineTo(69, 82);
  p.bezierCurveTo(74, 84, 74, 88, 70, 88);
  p.closePath();
  p.moveTo(36, 82);
  p.bezierCurveTo(34, 79, 35, 77, 38, 76);
  p.lineTo(62, 76);
  p.bezierCurveTo(65, 77, 66, 79, 64, 82);
  p.closePath();

  if (type === 'p') {
    p.moveTo(39, 76);
    p.bezierCurveTo(41, 68, 35, 62, 43, 56);
    p.lineTo(57, 56);
    p.bezierCurveTo(65, 62, 59, 68, 61, 76);
    p.closePath();
    p.moveTo(42, 57);
    p.bezierCurveTo(43, 53, 57, 53, 58, 57);
    p.bezierCurveTo(57, 59, 43, 59, 42, 57);
    p.closePath();
    ball(50, 43, 11.5);
  } else if (type === 'r') {
    p.moveTo(39, 76);
    p.bezierCurveTo(37, 62, 37, 54, 40, 49);
    p.lineTo(60, 49);
    p.bezierCurveTo(63, 54, 63, 62, 61, 76);
    p.closePath();
    p.moveTo(36, 49);
    p.quadraticCurveTo(35, 45, 38, 43);
    p.lineTo(62, 43);
    p.quadraticCurveTo(65, 45, 64, 49);
    p.closePath();
    p.moveTo(35, 43);
    p.lineTo(65, 43);
    p.lineTo(65, 37);
    p.lineTo(35, 37);
    p.closePath();
    p.rect(35, 28, 8, 10);
    p.rect(46, 28, 8, 10);
    p.rect(57, 28, 8, 10);
  } else if (type === 'b') {
    p.moveTo(40, 76);
    p.bezierCurveTo(42, 66, 36, 60, 44, 54);
    p.lineTo(56, 54);
    p.bezierCurveTo(64, 60, 58, 66, 60, 76);
    p.closePath();
    p.moveTo(43, 55);
    p.bezierCurveTo(44, 51, 56, 51, 57, 55);
    p.bezierCurveTo(56, 57, 44, 57, 43, 55);
    p.closePath();
    p.moveTo(50, 22);
    p.bezierCurveTo(59, 30, 61, 42, 50, 50);
    p.bezierCurveTo(39, 42, 41, 30, 50, 22);
    p.closePath();
    ball(50, 19, 3.6);
  } else if (type === 'q') {
    p.moveTo(38, 76);
    p.bezierCurveTo(41, 63, 35, 55, 43, 49);
    p.lineTo(57, 49);
    p.bezierCurveTo(65, 55, 59, 63, 62, 76);
    p.closePath();
    p.moveTo(42, 50);
    p.bezierCurveTo(43, 46, 57, 46, 58, 50);
    p.bezierCurveTo(57, 52, 43, 52, 42, 50);
    p.closePath();
    p.moveTo(40, 49);
    p.quadraticCurveTo(34, 40, 33, 33);
    p.lineTo(67, 33);
    p.quadraticCurveTo(66, 40, 60, 49);
    p.closePath();
    ball(32, 30, 4.4);
    ball(41, 27, 4.4);
    ball(50, 26, 4.4);
    ball(59, 27, 4.4);
    ball(68, 30, 4.4);
  } else if (type === 'k') {
    p.moveTo(38, 76);
    p.bezierCurveTo(41, 63, 35, 55, 43, 49);
    p.lineTo(57, 49);
    p.bezierCurveTo(65, 55, 59, 63, 62, 76);
    p.closePath();
    p.moveTo(42, 50);
    p.bezierCurveTo(43, 46, 57, 46, 58, 50);
    p.bezierCurveTo(57, 52, 43, 52, 42, 50);
    p.closePath();
    p.moveTo(40, 49);
    p.quadraticCurveTo(38, 41, 41, 35);
    p.lineTo(59, 35);
    p.quadraticCurveTo(62, 41, 60, 49);
    p.closePath();
    p.rect(46.5, 13, 7, 23);
    p.rect(40, 19, 20, 6.5);
  } else if (type === 'n') {
    // horse head facing left, smooth profile
    p.moveTo(40, 76);
    p.bezierCurveTo(44, 66, 42, 58, 39, 52);
    p.bezierCurveTo(34, 51, 28, 51, 24, 50);
    p.bezierCurveTo(19, 49, 18, 44, 21, 41);
    p.bezierCurveTo(24, 40, 30, 41, 33, 39);
    p.bezierCurveTo(33, 35, 31, 32, 33, 29);
    p.bezierCurveTo(31, 26, 31, 23, 33, 22);
    p.lineTo(38, 29);
    p.bezierCurveTo(39, 24, 42, 20, 46, 19);
    p.bezierCurveTo(53, 20, 58, 28, 61, 38);
    p.bezierCurveTo(63, 49, 63, 59, 62, 68);
    p.bezierCurveTo(62, 72, 62, 75, 60, 76);
    p.closePath();
  }
  cache[type] = p;
  return p;
}

/* Draw a fully-shaded piece centred at (cx, cy); `cell` is the board square
   size, `s` an optional scale and `alpha` an optional opacity. */
export function drawPieceSilhouette(
  ctx: CanvasRenderingContext2D,
  type: string,
  white: boolean,
  cx: number,
  cy: number,
  cell: number,
  s = 1,
  alpha = 1
) {
  const path = buildPiece(type);
  const k = (cell * 1.08 * s) / 100;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(k, k);
  ctx.translate(-50, -52);

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5.5;
  ctx.strokeStyle = white ? 'rgba(52,59,72,0.95)' : 'rgba(3,5,9,0.98)';
  ctx.stroke(path);

  const grad = ctx.createLinearGradient(0, 16, 0, 90);
  if (white) {
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#c4ccd7');
  } else {
    grad.addColorStop(0, '#5a6273');
    grad.addColorStop(1, '#12151c');
  }
  ctx.fillStyle = grad;
  ctx.fill(path);

  ctx.save();
  ctx.beginPath();
  ctx.rect(6, 8, 88, 36);
  ctx.clip();
  ctx.fillStyle = white ? 'rgba(255,255,255,0.5)' : 'rgba(205,214,228,0.14)';
  ctx.fill(path);
  ctx.restore();

  if (type === 'b') {
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = white ? 'rgba(52,59,72,0.8)' : 'rgba(3,5,9,0.85)';
    ctx.beginPath();
    ctx.moveTo(46, 32);
    ctx.lineTo(54, 40);
    ctx.stroke();
  } else if (type === 'n') {
    ctx.fillStyle = white ? 'rgba(52,59,72,0.9)' : 'rgba(214,222,234,0.85)';
    ctx.beginPath();
    ctx.arc(33, 33, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
