/**
 * generate-icons.js — Community Forum branded app icons
 * Generates all 4 PNG assets using only Node.js built-ins (no npm install needed).
 * Design: orange (#F97316) speech bubble on white, representing community discussion.
 * Run with: node generate-icons.js
 */
const zlib = require('zlib');
const fs   = require('fs');

// ── CRC32 ──────────────────────────────────────────────────────────────────────
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = (crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)) >>> 0;
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ── PNG encoding ───────────────────────────────────────────────────────────────
function pngChunk(type, data) {
  const lb = Buffer.allocUnsafe(4); lb.writeUInt32BE(data.length, 0);
  const tb = Buffer.from(type, 'ascii');
  const cb = Buffer.allocUnsafe(4); cb.writeUInt32BE(crc32(Buffer.concat([tb, data])), 0);
  return Buffer.concat([lb, tb, data, cb]);
}
function encodePNG(w, h, raw, hasAlpha) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = hasAlpha ? 6 : 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const sig  = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const idat = zlib.deflateSync(raw, { level: 6 });
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}

// ── Canvas ─────────────────────────────────────────────────────────────────────
function mkCanvas(w, h, hasAlpha, bgR = 255, bgG = 255, bgB = 255, bgA = 255) {
  const ch = hasAlpha ? 4 : 3;
  const rs = 1 + w * ch;
  const d  = Buffer.allocUnsafe(h * rs);
  for (let y = 0; y < h; y++) {
    d[y * rs] = 0; // filter: None
    for (let x = 0; x < w; x++) {
      const i = y * rs + 1 + x * ch;
      d[i] = bgR; d[i + 1] = bgG; d[i + 2] = bgB;
      if (hasAlpha) d[i + 3] = bgA;
    }
  }
  return { w, h, ch, rs, d, hasAlpha };
}

function setpx(cv, x, y, r, g, b, a = 255) {
  x = x | 0; y = y | 0;
  if (x < 0 || x >= cv.w || y < 0 || y >= cv.h) return;
  const i = y * cv.rs + 1 + x * cv.ch;
  cv.d[i] = r; cv.d[i + 1] = g; cv.d[i + 2] = b;
  if (cv.hasAlpha) cv.d[i + 3] = a;
}

function fillRect(cv, x, y, w, h, r, g, b, a = 255) {
  const x0 = Math.max(0, x | 0), x1 = Math.min(cv.w - 1, (x + w - 1) | 0);
  const y0 = Math.max(0, y | 0), y1 = Math.min(cv.h - 1, (y + h - 1) | 0);
  for (let ry = y0; ry <= y1; ry++)
    for (let rx = x0; rx <= x1; rx++)
      setpx(cv, rx, ry, r, g, b, a);
}

function fillCircle(cv, cx, cy, rad, r, g, b, a = 255) {
  const r2 = rad * rad;
  const y0 = Math.max(0, Math.ceil(cy - rad));
  const y1 = Math.min(cv.h - 1, Math.floor(cy + rad));
  for (let y = y0; y <= y1; y++) {
    const dy   = y - cy;
    const half = Math.sqrt(Math.max(0, r2 - dy * dy));
    const x0   = Math.max(0, Math.ceil(cx - half));
    const x1   = Math.min(cv.w - 1, Math.floor(cx + half));
    for (let x = x0; x <= x1; x++) setpx(cv, x, y, r, g, b, a);
  }
}

function fillRRect(cv, x, y, w, h, rad, r, g, b, a = 255) {
  // Fill the three overlapping rectangles that form the body
  fillRect(cv, x + rad, y, w - 2 * rad, h, r, g, b, a);
  fillRect(cv, x, y + rad, w, h - 2 * rad, r, g, b, a);
  // Four corner quarter-circles
  fillCircle(cv, x + rad,     y + rad,     rad, r, g, b, a);
  fillCircle(cv, x + w - rad, y + rad,     rad, r, g, b, a);
  fillCircle(cv, x + rad,     y + h - rad, rad, r, g, b, a);
  fillCircle(cv, x + w - rad, y + h - rad, rad, r, g, b, a);
}

// Triangle rasteriser (scanline)
function fillTri(cv, x0, y0, x1, y1, x2, y2, r, g, b, a = 255) {
  const pts = [[x0, y0], [x1, y1], [x2, y2]].sort((pa, pb) => pa[1] - pb[1]);
  function edgeX(ax, ay, bx, by, y) {
    return ay === by ? (ax + bx) / 2 : ax + (bx - ax) * (y - ay) / (by - ay);
  }
  const y_lo = Math.max(0, Math.ceil(pts[0][1]));
  const y_hi = Math.min(cv.h - 1, Math.floor(pts[2][1]));
  for (let y = y_lo; y <= y_hi; y++) {
    const xLong  = edgeX(pts[0][0], pts[0][1], pts[2][0], pts[2][1], y);
    const xShort = y <= pts[1][1]
      ? edgeX(pts[0][0], pts[0][1], pts[1][0], pts[1][1], y)
      : edgeX(pts[1][0], pts[1][1], pts[2][0], pts[2][1], y);
    const xl = Math.max(0, Math.ceil(Math.min(xLong, xShort)));
    const xr = Math.min(cv.w - 1, Math.floor(Math.max(xLong, xShort)));
    for (let x = xl; x <= xr; x++) setpx(cv, x, y, r, g, b, a);
  }
}

// Speech bubble: rounded rect body + triangular tail at bottom-left
function fillBubble(cv, cx, cy, w, h, rad, tailSz, r, g, b, a = 255) {
  const bx = cx - w / 2, by = cy - h / 2;
  fillRRect(cv, bx, by, w, h, rad, r, g, b, a);
  const tx = bx + rad * 0.4, ty = by + h;
  fillTri(cv, tx, ty, tx + tailSz, ty, tx, ty + tailSz, r, g, b, a);
}

function savePNG(cv, file) {
  const png = encodePNG(cv.w, cv.h, cv.d, cv.hasAlpha);
  fs.writeFileSync(file, png);
  console.log(`✓ ${file}  ${cv.w}×${cv.h}  ${(png.length / 1024).toFixed(1)} KB`);
}

// ── Brand colors ───────────────────────────────────────────────────────────────
const [OR, OG, OB] = [249, 115, 22];   // #F97316 — primary orange
const [WR, WG, WB] = [255, 255, 255];  // white

// ── icon.png  1024×1024  RGB (no transparency) ────────────────────────────────
{
  const S  = 1024;
  const cv = mkCanvas(S, S, false, OR, OG, OB); // orange background

  // Large white speech bubble centred in icon
  fillBubble(cv, 512, 490, 640, 475, 94, 118, WR, WG, WB);

  // Three orange rounded bars inside bubble (represent forum threads)
  const bx = 210, bh = 58, br = 29;
  fillRRect(cv, bx, 336, 464, bh, br, OR, OG, OB);
  fillRRect(cv, bx, 426, 402, bh, br, OR, OG, OB);
  fillRRect(cv, bx, 516, 300, bh, br, OR, OG, OB);

  savePNG(cv, 'assets/icon.png');
}

// ── adaptive-icon.png  1024×1024  RGBA (transparency OK) ─────────────────────
// Android uses the full 1024×1024 and clips to a shape; fill solid orange.
{
  const S  = 1024;
  const cv = mkCanvas(S, S, true, 0, 0, 0, 0); // transparent background

  // Solid orange fill — Android will apply its own shape mask
  fillRect(cv, 0, 0, S, S, OR, OG, OB, 255);

  // Same speech-bubble design as icon.png
  fillBubble(cv, 512, 490, 640, 475, 94, 118, WR, WG, WB, 255);

  const bx = 210, bh = 58, br = 29;
  fillRRect(cv, bx, 336, 464, bh, br, OR, OG, OB, 255);
  fillRRect(cv, bx, 426, 402, bh, br, OR, OG, OB, 255);
  fillRRect(cv, bx, 516, 300, bh, br, OR, OG, OB, 255);

  savePNG(cv, 'assets/adaptive-icon.png');
}

// ── favicon.png  64×64  RGB ───────────────────────────────────────────────────
{
  const cv = mkCanvas(64, 64, false, OR, OG, OB); // orange background

  // White speech bubble (simplified — no interior bars at this size)
  fillBubble(cv, 32, 30, 50, 35, 7, 10, WR, WG, WB);

  // Two small orange bars inside bubble
  fillRRect(cv, 10, 19, 36, 5, 2, OR, OG, OB);
  fillRRect(cv, 10, 28, 28, 5, 2, OR, OG, OB);

  savePNG(cv, 'assets/favicon.png');
}

// ── splash.png  1284×2778  RGB ────────────────────────────────────────────────
{
  const SW = 1284, SH = 2778;
  const cv = mkCanvas(SW, SH, false, WR, WG, WB); // white background

  const cx = SW / 2, cy = SH * 0.38;

  // Orange circle — the logo badge
  fillCircle(cv, cx, cy, 292, OR, OG, OB);

  // White speech bubble inside the circle
  fillBubble(cv, cx, cy - 10, 375, 282, 54, 68, WR, WG, WB);

  // Three orange bars inside the bubble
  const bx = cx - 158, bh = 33, br = 16;
  fillRRect(cv, bx, cy - 74, 278, bh, br, OR, OG, OB);
  fillRRect(cv, bx, cy - 23, 234, bh, br, OR, OG, OB);
  fillRRect(cv, bx, cy + 28, 178, bh, br, OR, OG, OB);

  // Thin orange accent strip at top and bottom
  fillRect(cv, 0, 0, SW, 14, OR, OG, OB);
  fillRect(cv, 0, SH - 14, SW, 14, OR, OG, OB);

  // Page-indicator dots at lower third
  const dotCy = SH * 0.72;
  for (let i = -2; i <= 2; i++) {
    const dotR = i === 0 ? 11 : 7;
    fillCircle(cv, cx + i * 32, dotCy, dotR, OR, OG, OB);
  }

  savePNG(cv, 'assets/splash.png');
}

console.log('\nDone. All 4 Community Forum assets generated.');
