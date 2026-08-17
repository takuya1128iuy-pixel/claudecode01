// PWA 用アイコンを外部ライブラリなしで生成する。
// 漢字練習のマス（点線の十字）に「十」を書いた図をそのままピクセルで描く。
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 3 + 1);
    raw[rowStart] = 0; // filter: none
    pixels.copy(raw, rowStart + 1, y * size * 3, (y + 1) * size * 3);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const BG = [29, 78, 216]; // blue-700
const WHITE = [255, 255, 255];
const MARK = [251, 191, 36]; // amber-400

function draw(size) {
  const pixels = Buffer.alloc(size * size * 3);
  const set = (x, y, color) => {
    const offset = (y * size + x) * 3;
    pixels[offset] = color[0];
    pixels[offset + 1] = color[1];
    pixels[offset + 2] = color[2];
  };

  const u = (value) => Math.round(value * size);
  const boxStart = u(0.16);
  const boxEnd = u(0.84);
  const border = Math.max(2, u(0.035));
  const dash = Math.max(2, u(0.03));
  const barThickness = Math.max(3, u(0.055));
  const hStart = u(0.26);
  const hEnd = u(0.74);
  const vStart = u(0.22);
  const vEnd = u(0.78);
  const center = u(0.5);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let color = BG;
      const inBox = x >= boxStart && x < boxEnd && y >= boxStart && y < boxEnd;
      const onFrame =
        inBox &&
        (x < boxStart + border ||
          x >= boxEnd - border ||
          y < boxStart + border ||
          y >= boxEnd - border);

      if (inBox) color = [255, 255, 255];
      if (onFrame) color = WHITE;

      // マスの中は白、そこに点線の十字を薄い青で入れる
      if (inBox && !onFrame) {
        const onCrossV = Math.abs(x - center) < Math.max(1, u(0.008));
        const onCrossH = Math.abs(y - center) < Math.max(1, u(0.008));
        const dashOn = (value) => Math.floor(value / dash) % 2 === 0;
        if ((onCrossV && dashOn(y)) || (onCrossH && dashOn(x))) color = [191, 219, 254];
      }

      // 「十」を書く
      const inHorizontalBar =
        x >= hStart && x < hEnd && Math.abs(y - center) < barThickness / 2;
      const inVerticalBar =
        y >= vStart && y < vEnd && Math.abs(x - center) < barThickness / 2;
      if (inBox && (inHorizontalBar || inVerticalBar)) color = MARK;

      set(x, y, color);
    }
  }
  return pixels;
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  writeFileSync(join(OUT_DIR, name), encodePng(size, draw(size)));
  console.log(`wrote ${name} (${size}x${size})`);
}
