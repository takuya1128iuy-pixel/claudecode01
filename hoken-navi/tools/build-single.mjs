// CSS/JS/データを1枚のHTMLにまとめる。
// Netlifyのドラッグ&ドロップや、1ファイルしか置けない場所に出すとき用。
//   node tools/build-single.mjs  →  dist/index.html
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');

const html = read('index.html')
  .replace('<link rel="stylesheet" href="styles.css">', `<style>\n${read('styles.css')}</style>`)
  .replace('<script src="data.js"></script>', `<script>\n${read('data.js')}</script>`)
  .replace('<script src="app.js"></script>', `<script>\n${read('app.js')}</script>`);

mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const out = path.join(ROOT, 'dist/index.html');
writeFileSync(out, html);
console.log(`${path.relative(process.cwd(), out)}  ${(Buffer.byteLength(html) / 1024).toFixed(0)}KB`);
