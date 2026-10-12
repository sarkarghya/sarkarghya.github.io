/*
 * Chand Baori by lamplight: the great stepwell at Abhaneri on a festival
 * night. A diya burns on every ledge of the zig-zagging stairs, the arcaded
 * pavilion glows from inside, the side walls run off toward us, and a moon
 * hangs over the rim. Down at the bottom, the pool holds all of it, broken up
 * by a slow ripple.
 *
 * The stone is laid out once from a handful of rules, and how much lamplight
 * reaches each cell is worked out then too. Each frame only flickers the
 * lamps, lets the light breathe a little, twinkles the stars and redraws the
 * water.
 */

export const W = 96;
export const H = 26;

export interface Swatch {
  color: string;
  glow?: string;
}

export const PALETTE: Swatch[] = [
  { color: "transparent" },
  // 1–8: sandstone, from barely touched to full in the lamplight
  { color: "#2c1d16" }, { color: "#3e281c" }, { color: "#563520" }, { color: "#734623" },
  { color: "#955a28" }, { color: "#b9702e" }, { color: "#dc8f3e" }, { color: "#f6b363" },
  // 9–11: diya flames, guttering to bright
  { color: "#e07a26", glow: "#ff7a14" }, { color: "#ffbd5c", glow: "#ff9226" }, { color: "#fff0cc", glow: "#ffab3d" },
  // 12–13: stars
  { color: "#3a4d85" }, { color: "#c6d2f6" },
  // 14–16: the moon
  { color: "#fdf6e0", glow: "#fdf6e0" }, { color: "#d9cfb3", glow: "#efe6c8" }, { color: "#b3a98c" },
  // 17–19: water
  { color: "#1a2a4e" }, { color: "#2a416f" }, { color: "#5672a6" },
  // 20–22: lamplight on the water
  { color: "#5e3a1f" }, { color: "#a9692d" }, { color: "#ffc570", glow: "#ff9226" },
  // 23: moonlight on the water
  { color: "#e6ebf7", glow: "#9fb0de" },
  // 24–26: the lamplit insides of the arches
  { color: "#a75f27", glow: "#8a4316" }, { color: "#dc8b3d", glow: "#b85a1c" }, { color: "#ffc477", glow: "#e0782a" },
  // 27–28: clouds, in shadow and catching the moon
  { color: "#3d4a75" }, { color: "#8190bb" },
];

const STONE = 1, FLAME = 9, STAR = 12, MOON_TONE = 14, WATER = 17, WARM = 20, MOONLIT = 23, ARCH = 24, CLOUD = 27;

// What each cell is made of.
const SKY = 0, ROCK = 1, LAMP = 2, MOON = 3, STARS = 4, POOL_WATER = 5, OPENING = 6;

const PARAPET = 6; // the far rim, lined with lamps
const RIM = 7; // the first row of stairs
const TIER = 4; // three rows of stairs, then a landing
const TIERS = 3;
const POOL = RIM + TIER * TIERS; // the pool's edge
const CX = (W - 1) / 2;
const VY = 13; // eye height: where the side walls' ledges converge
const PAV = [35, 60]; // the pavilion
const STOREY = 6;

// The far wall narrows a little as it goes down, and the pool widens toward us.
const farLeft = (y: number) => 8 + (y - RIM) * 0.35;
const poolLeft = (y: number) => Math.round(farLeft(POOL)) - (y - POOL);

// where the moon sits, in cells, and its radius in em
const MOON_AT = { x: 72, y: 2.1, r: 2.4 };

// A few clouds drifting across the sky. Each sits on a flat underside (the
// row `base`) and is built up from rounded bumps: [offset, half-width, height].
const CLOUDS = [
  { x: 12, base: 3, speed: 0.35, bumps: [[0, 5, 2.2], [-5.5, 3.5, 1.2], [6, 4.5, 1.4]] },
  { x: 40, base: 2, speed: 0.22, bumps: [[0, 4, 1.6], [-4.5, 3, 1], [4.5, 3.5, 1.1]] },
  { x: 90, base: 4, speed: 0.28, bumps: [[0, 5, 2.1], [-5.5, 3.5, 1.2], [5.5, 4, 1.4]] },
];

function hash(x: number, y: number): number {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const mod = (a: number, n: number) => ((a % n) + n) % n;
// distance from the centre line, so patterns come out symmetric: 0, 1, 2 … either side
const fromCentre = (x: number) => Math.abs(x - CX) - 0.5;

// --- the scene, laid out once ---------------------------------------------------

const N = W * H;
const ch: string[] = new Array(N).fill(" ");
const mat = new Uint8Array(N);
const take = new Float32Array(N).fill(1); // how much of the lamplight a stone cell catches
const inner = new Float32Array(N); // light of its own, for the glowing arches
const light = new Float32Array(N);
const lampAt = new Int16Array(N).fill(-1);
const lamps: { x: number; y: number; power: number }[] = [];
const moonShade = new Float32Array(N);

const inside = (x: number, y: number) => x >= 0 && x < W && y >= 0 && y < H;
const stone = (x: number, y: number, c: string, catches = 1) => {
  if (!inside(x, y)) return;
  const k = y * W + x;
  ch[k] = c;
  mat[k] = ROCK;
  take[k] = catches;
  inner[k] = 0;
  lampAt[k] = -1;
};
const lamp = (x: number, y: number, power = 1) => {
  if (!inside(x, y)) return;
  const k = y * W + x;
  ch[k] = "•";
  mat[k] = LAMP;
  lampAt[k] = lamps.length;
  lamps.push({ x, y, power });
};

// The side walls, seen at an angle. Each cell is traced back toward the eye
// line to find which tier of the far wall it lines up with.
function sideWalls() {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const left = x < CX;
      const sx = left ? x : W - 1 - x; // work on the left wall, mirror for the right
      const edge = y < POOL ? Math.round(farLeft(y)) : poolLeft(y) - 1;
      if (sx >= edge) continue;
      const u = (8 + 0.35 * (VY - RIM) - CX) / (sx - CX - 0.35 * (y - VY));
      const yc = VY + u * (y - VY); // the far-wall row this cell lines up with
      if (yc < PARAPET) continue; // above the rim: sky
      if (yc >= POOL) {
        // the paved floor running round the pool
        stone(x, y, hash(x, y) > 0.6 ? "." : "_", 0.6);
        continue;
      }
      const r = mod(yc - RIM, TIER);
      const across = (sx - CX) / (farLeft(yc) - CX); // grows as the wall comes toward us
      const riser = mod(Math.floor(across * 14), 3) === 0;
      stone(x, y, riser ? "|" : r < 1 ? "-" : "_", riser ? 0.55 : 0.8);
    }
  }
  // the ledges, each a straight line from the far wall's corner toward us
  const ledges = [PARAPET, POOL];
  for (let k = 0; k < TIERS; k++) ledges.push(RIM + k * TIER + TIER - 1);
  for (const yk of ledges) {
    const xc = farLeft(yk);
    const slope = (yk - VY) / (xc - CX); // rows per column
    const steep = Math.abs(slope) / 0.6;
    for (let sx = Math.round(xc) - 1; sx >= 0; sx--) {
      const y = Math.round(VY + slope * (sx - CX));
      if (y < 0 || y >= H) continue;
      const lit = mod(Math.round(xc) - sx, 3) === 1;
      for (const x of [sx, W - 1 - sx]) {
        if (y >= POOL + 1 && x >= poolLeft(y) - 1 && x <= W - poolLeft(y)) continue;
        const mirrored = x !== sx;
        const c = steep < 0.35 ? "=" : (yk > VY) !== mirrored ? "/" : "\\";
        if (lit) lamp(x, y, 0.9);
        else stone(x, y, c, 1);
      }
    }
  }
}

// The far wall: tier on tier of little stair pyramids, a landing between each.
function farWall() {
  for (let y = PARAPET - 1; y < POOL; y++) {
    const l = Math.round(farLeft(y)), r = W - 1 - l;
    for (let x = l; x <= r; x++) {
      const d = fromCentre(x);
      if (y === PARAPET - 1) {
        if (mod(d, 3) === 0) stone(x, y, "n", 0.7);
        continue;
      }
      if (y === PARAPET) {
        if (mod(d, 3) === 1) lamp(x, y);
        else stone(x, y, "=");
        continue;
      }
      if (x === l || x === r) {
        const stepped = Math.round(farLeft(y - 1)) !== l;
        stone(x, y, stepped ? (x === l ? "\\" : "/") : "|", 0.6);
        continue;
      }
      const tier = Math.floor((y - RIM) / TIER), ry = (y - RIM) % TIER;
      if (ry === TIER - 1) {
        if (mod(d + tier, 3) === 0) lamp(x, y);
        else stone(x, y, "=");
        continue;
      }
      const lx = mod(x - 45 - 3 * (tier & 1), 6); // pyramids centred on the middle
      const a = 2 - ry, b = 3 + ry;
      if (lx === a) stone(x, y, "/", 0.95);
      else if (lx === b) stone(x, y, "\\", 0.75);
      else if (lx > a && lx < b) stone(x, y, "_", 1);
      else stone(x, y, ry === 0 ? "." : ":", 0.45);
    }
  }
}

// The pavilion: a crown above the rim, then two storeys of arches, lit from
// inside.
function pavilion() {
  const [p0, p1] = PAV;
  for (let x = 41; x <= 54; x++) {
    stone(x, PARAPET - 3, "_", 0.8);
    if (x === 41 || x === 54) stone(x, PARAPET - 2, "|", 0.7);
    else glowing(x, PARAPET - 2, 0.35);
    if (mod(fromCentre(x), 2) === 1) lamp(x, PARAPET - 1);
    else stone(x, PARAPET - 1, "=");
  }
  for (let s = 0; s < 2; s++) {
    const top = RIM + s * STOREY;
    for (let r = 0; r < STOREY; r++) {
      const y = top + r;
      for (let x = p0; x <= p1; x++) {
        const lx = x - p0;
        if (r === 0) {
          if (mod(fromCentre(x), 2) === 0) lamp(x, y);
          else stone(x, y, "=");
          continue;
        }
        if (x === p0 || x === p1) {
          stone(x, y, "|", 0.7);
          continue;
        }
        if (mod(lx, 8) <= 1) {
          stone(x, y, "|", mod(lx, 8) === 0 ? 0.85 : 0.6);
          continue;
        }
        const ax = mod(lx - 2, 8); // 0..5 across an arch
        if (r === 1) stone(x, y, ax === 0 || ax === 5 ? "." : "_", 0.85);
        else if (r === 2 && ax === 0) stone(x, y, "/", 0.85);
        else if (r === 2 && ax === 5) stone(x, y, "\\", 0.65);
        else glowing(x, y, 0.4 + (0.3 * (r - 2)) / 3); // brighter toward the floor
      }
    }
  }
}

// the warm, lamp-filled inside of an arch
function glowing(x: number, y: number, amount: number) {
  const h = hash(x, y);
  stone(x, y, h > 0.55 ? ":" : h > 0.2 ? "." : " ", 0.9);
  const k = y * W + x;
  mat[k] = OPENING;
  inner[k] = amount;
}

function poolRim() {
  const l = Math.round(farLeft(POOL));
  for (let x = l; x <= W - 1 - l; x++) {
    if (mod(fromCentre(x), 2) === 0) lamp(x, POOL);
    else stone(x, POOL, "=");
  }
  for (let y = POOL + 1; y < H; y++) {
    const pl = poolLeft(y);
    for (let x = pl; x <= W - 1 - pl; x++) {
      const k = y * W + x;
      ch[k] = " ";
      mat[k] = POOL_WATER;
    }
    stone(pl - 1, y, "/", 0.7);
    stone(W - pl, y, "\\", 0.7);
  }
}

// How much of a cell a shape covers, sampled on a 5×5 grid.
function coverage(x: number, y: number, inShape: (px: number, py: number) => boolean) {
  let n = 0;
  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 5; i++) if (inShape(x + (i + 0.5) / 5 - 0.5, y + (j + 0.5) / 5 - 0.5)) n++;
  }
  return { cover: n / 25 };
}

// The moon, drawn in characters. Row by row, the cells the disc touches are
// found; the outline runs "_" across the top, "/", "(" or "\\" down each side
// depending on whether the edge is moving out or in, and "'---'" along the
// bottom, with a cratered face in between.
function moonAndStars() {
  const { x: mx, y: my, r } = MOON_AT;
  const inMoon = (px: number, py: number) => ((px - mx) * 0.6) ** 2 + (py - my) ** 2 < r * r;
  const rows: [number, number, number][] = []; // [y, leftmost x, rightmost x]
  for (let y = Math.max(0, Math.floor(my - r)); y <= Math.ceil(my + r) && y < PARAPET - 1; y++) {
    let xl = Infinity, xr = -Infinity;
    for (let x = Math.floor(mx - r / 0.6 - 1); x <= Math.ceil(mx + r / 0.6 + 1); x++) {
      if (coverage(x, y, inMoon).cover > 0.05) (xl = Math.min(xl, x)), (xr = Math.max(xr, x));
    }
    if (xl <= xr) rows.push([y, xl, xr]);
  }
  rows.forEach(([y, xl, xr], i) => {
    const above = rows[i - 1], below = rows[i + 1];
    for (let x = xl; x <= xr; x++) {
      const k = y * W + x;
      if (mat[k] !== SKY) continue;
      mat[k] = MOON;
      moonShade[k] = 1;
      if (!above) ch[k] = "_";
      else if (!below) ch[k] = x === xl || x === xr ? "'" : "-";
      else if (x === xl) ch[k] = xl < above[1] ? "/" : xl > above[1] || below[1] > xl ? "\\" : "(";
      else if (x === xr) ch[k] = xr > above[2] ? "\\" : xr < above[2] || below[2] < xr ? "/" : ")";
      else {
        const crater = noise(x * 0.8, y * 1.3 + 3);
        ch[k] = crater > 0.66 ? "o" : crater > 0.56 ? "." : ":";
        moonShade[k] = crater > 0.56 ? 0.3 : 0.6;
      }
    }
  });
  for (let y = 0; y < PARAPET - 1; y++) {
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      if (mat[k] !== SKY) continue;
      const d = Math.hypot((x - mx) * 0.6, y - my);
      if (d > r + 1.2 && hash(x, y + 50) > 0.965) mat[k] = STARS;
    }
  }
}

// How much lamplight reaches each stone cell. Light spreads further up the
// wall above a lamp than down past the ledge it sits on.
function lamplight() {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      if (mat[k] !== ROCK && mat[k] !== OPENING) continue;
      let L = 0.12;
      for (const l of lamps) {
        const dx = (x - l.x) * 0.6, dy = y - l.y;
        if (Math.abs(dx) > 5 || dy > 3 || dy < -6) continue;
        const ey = dy < 0 ? dy * 0.75 : dy * 1.8;
        L += l.power * 0.6 * Math.exp(-Math.sqrt(dx * dx + ey * ey) / 1.4);
      }
      light[k] = Math.min(1.2, L * take[k] + inner[k]);
    }
  }
}

sideWalls();
farWall();
pavilion();
poolRim();
moonAndStars();
lamplight();

// --- each frame ------------------------------------------------------------------

export interface Frame {
  chars: string[];
  tones: Uint8Array;
}

const flicker = (i: number, t: number) => noise(t * 3.1 + i * 7.3, i * 1.7);

/** One frame of the scene at time t, in seconds. */
export function frame(t: number): Frame {
  const chars = ch.slice();
  const tones = new Uint8Array(N);
  const breath = 0.96 + 0.04 * Math.sin(t * 0.7);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      switch (mat[k]) {
        case ROCK: {
          const sway = 0.86 + 0.28 * noise(x * 0.11 + t * 0.6, y * 0.23 - t * 0.3);
          tones[k] = STONE + Math.min(7, Math.floor(Math.pow(light[k] * sway * breath, 0.75) * 8));
          break;
        }
        case LAMP: {
          const f = flicker(lampAt[k], t);
          chars[k] = f < 0.22 ? "·" : "•";
          tones[k] = f > 0.62 ? FLAME + 2 : f > 0.3 ? FLAME + 1 : FLAME;
          break;
        }
        case OPENING: {
          const f = light[k] * (0.85 + 0.3 * noise(x * 0.4 + t * 1.2, y * 0.6));
          tones[k] = ARCH + (f > 1.05 ? 2 : f > 0.8 ? 1 : 0);
          break;
        }
        case MOON:
          tones[k] = moonShade[k] > 0.8 ? MOON_TONE : moonShade[k] > 0.55 ? MOON_TONE + 1 : MOON_TONE + 2;
          break;
        case STARS: {
          const tw = 0.5 + 0.5 * Math.sin(t * (0.8 + 2 * hash(x, y)) + 6.28 * hash(y, x));
          const big = hash(x, y + 9) > 0.8;
          chars[k] = big && tw > 0.75 ? "+" : tw > 0.35 ? "·" : ".";
          tones[k] = tw > 0.55 ? STAR + 1 : STAR;
          break;
        }
        case POOL_WATER:
          water(x, y, k, t, chars, tones);
          break;
      }
    }
  }
  clouds(t, chars, tones);
  return { chars, tones };
}

// The clouds drift slowly to the right and wrap round. Each column of a
// cloud runs from its bumpy top down to the flat base: "." and "-" along the
// top, "(" and ")" wherever the column beside it doesn't reach as high, and
// "_" along the bottom. They pass behind the moon and the pavilion's crown,
// and in front of the stars.
function clouds(t: number, chars: string[], tones: Uint8Array) {
  for (const c of CLOUDS) {
    const cx = Math.round(mod(c.x + t * c.speed + 16, W + 32) - 16);
    const top = (x: number) => {
      let h = 0;
      for (const [dx, hw, height] of c.bumps) {
        const u = (x - cx - dx) / hw;
        if (u * u < 1) h = Math.max(h, height * Math.sqrt(1 - u * u));
      }
      return h < 0.5 ? Infinity : c.base - Math.round(h);
    };
    for (let x = cx - 12; x <= cx + 12; x++) {
      if (x < 0 || x >= W) continue;
      const yt = top(x);
      if (yt === Infinity) continue;
      const left = top(x - 1), right = top(x + 1);
      for (let y = Math.max(0, yt); y <= c.base; y++) {
        const k = y * W + x;
        if (mat[k] !== SKY && mat[k] !== STARS) continue;
        let glyph = " ";
        if (y < left && y > yt) glyph = "(";
        else if (y < right && y > yt) glyph = ")";
        else if (y === c.base) glyph = "_";
        else if (y === yt) glyph = left > yt || right > yt ? "." : "-";
        if (y === c.base && left === Infinity) glyph = "(";
        if (y === c.base && right === Infinity) glyph = ")";
        chars[k] = glyph;
        tones[k] = y === yt ? CLOUD + 1 : CLOUD;
      }
    }
  }
}

// The pool: the well above mirrored and squashed into a few rows, the rim's
// lamps drawn down into streaks, a path of moonlight, and ripples over it all.
function water(x: number, y: number, k: number, t: number, chars: string[], tones: Uint8Array) {
  const dy = y - POOL;
  const wobble = noise(x * 0.07 + t * 0.12, y * 0.5 - t * 0.25);
  const sx = Math.min(W - 1, Math.max(0, Math.round(x + (0.4 + 0.15 * dy) * Math.sin(y * 1.9 + t * 1.3 + wobble * 4))));
  const ripple = noise(x * 0.22 - t * 0.5, y * 0.9 + t * 0.2);
  const fade = 1 - dy / (H - POOL + 3);

  // moonlight laid on the water below the moon
  if (Math.abs(x - MOON_AT.x) <= 1.5 + dy * 0.35 && ripple > 0.32) {
    chars[k] = ripple > 0.6 ? "=" : ripple > 0.45 ? "~" : "-";
    tones[k] = MOONLIT;
    return;
  }
  // the lamps along the rim, drawn down into the water
  const rim = lampAt[POOL * W + sx];
  if (rim >= 0 && dy <= 3 && ripple > 0.3 + dy * 0.08 && mod(sx, 4) === 1) {
    const f = flicker(rim, t - dy * 0.15) * fade;
    chars[k] = dy < 3 ? "|" : "'";
    tones[k] = f > 0.4 ? WARM + 2 : WARM + 1;
    return;
  }
  // the rest of the well, as warm smears of light
  const sy = Math.max(0, Math.round(POOL - dy * 2));
  const L = (mat[sy * W + sx] === LAMP ? 1 : light[sy * W + sx]) * fade;
  if (L > 0.32 && ripple > 0.28) {
    chars[k] = ripple > 0.62 ? "~" : "-";
    tones[k] = L > 0.7 ? WARM + 1 : WARM;
    return;
  }
  if (ripple > 0.7) {
    chars[k] = "~";
    tones[k] = WATER + 2;
  } else if (ripple > 0.5) {
    chars[k] = "-";
    tones[k] = ripple > 0.6 ? WATER + 1 : WATER;
  } else {
    chars[k] = " ";
  }
}

const ESCAPE: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;" };

/** A frame as one HTML string per row, runs of a tone wrapped in a span. */
export function toLines({ chars, tones }: Frame): string[] {
  const lines: string[] = [];
  for (let y = 0; y < H; y++) {
    let html = "";
    let run = "";
    let tone = -1;
    for (let x = 0; x <= W; x++) {
      const k = y * W + x;
      const c = x < W ? chars[k] : "";
      const t = x < W ? (c === " " ? 0 : tones[k]) : -1;
      if (t !== tone && run) {
        html += tone === 0 ? run : `<span class="c${tone}">${run}</span>`;
        run = "";
      }
      tone = t;
      run += ESCAPE[c] ?? c;
    }
    lines.push(html);
  }
  return lines;
}

/** A frame as plain text, for looking at in a terminal. */
export function toText({ chars }: Frame): string {
  const rows: string[] = [];
  for (let y = 0; y < H; y++) rows.push(chars.slice(y * W, (y + 1) * W).join(""));
  return rows.join("\n");
}
