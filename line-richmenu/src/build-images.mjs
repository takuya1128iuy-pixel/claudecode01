// メニュー定義から、リッチメニュー画像(PNG)を書き出す。
// 撮影にはChromiumを使う（HTML/CSSで作るので、デザインの調整はブラウザで確認できる）。
import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { globSync } from 'node:fs';
import path from 'node:path';
import { menus } from '../config/menus.mjs';
import { toHtml } from './template.mjs';
import { IMAGE } from '../config/menus.mjs';

const OUT = path.resolve(import.meta.dirname, '../out');

// LINEの上限は1MB
const MAX_BYTES = 1024 * 1024;

const CANDIDATES = [
  process.env.CHROMIUM_PATH,
  ...globSync('/opt/pw-browsers/chromium-*/chrome-linux/chrome'),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

function findChrome() {
  return CANDIDATES.find((p) => existsSync(p));
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  // HTMLは必ず書き出す。Chromiumが無くても、ブラウザで開いて自分で撮れる。
  for (const menu of menus) {
    writeFileSync(path.join(OUT, `${menu.key}.html`), toHtml(menu));
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright-core'));
  } catch {
    console.error('playwright-core が入っていません。`npm install` を実行してください。');
    console.error(`HTMLは ${OUT} に出力済みなので、ブラウザで開いて自分で撮っても構いません。`);
    process.exit(1);
  }

  const executablePath = findChrome();
  const launchOptions = executablePath ? { executablePath } : { channel: 'chrome' };
  let browser;
  try {
    browser = await chromium.launch(launchOptions);
  } catch (e) {
    console.error('Chromium/Chrome を起動できませんでした。');
    console.error('  - Chrome があるなら CHROMIUM_PATH=<実行ファイルのパス> を指定');
    console.error('  - 無いなら `npx playwright install chromium`');
    console.error(`  - どちらも避けたいなら ${OUT}/*.html をブラウザで開いて ${IMAGE.width}x${IMAGE.height} で撮影`);
    throw e;
  }

  const page = await browser.newPage({
    viewport: { width: IMAGE.width, height: IMAGE.height },
    deviceScaleFactor: 1,
  });

  for (const menu of menus) {
    const file = path.join(OUT, `${menu.key}.png`);
    await page.goto(`file://${path.join(OUT, `${menu.key}.html`)}`);
    await page.screenshot({ path: file, type: 'png' });
    const bytes = statSync(file).size;
    if (bytes > MAX_BYTES) {
      throw new Error(`${file} が ${(bytes / 1024).toFixed(0)}KB あります（LINEの上限は1MB）`);
    }
    console.log(`${path.relative(process.cwd(), file)}  ${IMAGE.width}x${IMAGE.height}  ${(bytes / 1024).toFixed(0)}KB`);
  }

  await browser.close();
}

main();
