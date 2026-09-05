// CSS/JS/データを1枚のHTMLにまとめる。
// Netlifyのドラッグ&ドロップや、1ファイルしか置けない場所に出すとき用。
//   node tools/build-single.mjs  →  dist/index.html
//
// ファイルを増やしたときに取り込み漏れが起きないよう、
// index.html に書かれた <script src> と <link href> を機械的に全部たどる。
// たどれないものが1つでも残っていたら、その場で失敗させる。
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');

const original = read('index.html');
let html = original;

// 取り込むべきローカル参照を、先に控えておく
const localRefs = [...original.matchAll(/(?:src|href)="(?!https?:|#|mailto:|tel:)([^"]+)"/g)].map((m) => m[1]);

// ローカルのCSSを取り込む
html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g, (tag, href) => {
  if (/^https?:/.test(href)) return tag; // 外部のものはそのまま
  if (!existsSync(path.join(ROOT, href))) throw new Error(`見つかりません: ${href}`);
  return `<style>\n${read(href)}</style>`;
});

// ローカルのJSを取り込む（読み込み順はそのまま保つ）
html = html.replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g, (tag, src) => {
  if (/^https?:/.test(src)) return tag;
  if (!existsSync(path.join(ROOT, src))) throw new Error(`見つかりません: ${src}`);
  return `<script>\n${read(src)}</script>`;
});

// 取り込み漏れがあれば、公開する前にここで止める。
// （インライン化したJSの中にも href=" という文字列は出てくるので、
//   元のHTMLにあった参照だけを対象に確かめる）
const leftover = localRefs.filter((ref) => html.includes(`="${ref}"`));
if (leftover.length) {
  throw new Error(`1枚にまとめられなかった参照があります:\n  ${leftover.join('\n  ')}`);
}

mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const out = path.join(ROOT, 'dist/index.html');
writeFileSync(out, html);
console.log(`${path.relative(process.cwd(), out)}  ${(Buffer.byteLength(html) / 1024).toFixed(0)}KB`);
