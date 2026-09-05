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


// 日本語フォントが無い環境だと、文字が全部「□」になった画像が
// エラーも出さずに出来上がってしまう。撮る前に必ず確かめる。
//
// 幅の比較では判定できない（全角の□と日本語の字は同じ幅になる）ので、
// 実際に描いたピクセルを、確実に存在しない文字のそれと見比べる。
async function assertJapaneseRenders(page) {
  const ok = await page.evaluate(() => {
    const family = getComputedStyle(document.body).fontFamily;
    const signature = (ch) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 120;
      const ctx = canvas.getContext('2d');
      ctx.font = `100px ${family}`;
      ctx.textBaseline = 'top';
      ctx.fillText(ch, 5, 5);
      const { data } = ctx.getImageData(0, 0, 120, 120);
      let filled = 0;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) filled++;
        sum += data[i];
      }
      return `${filled}:${sum}`;
    };
    // U+FFFE はどのフォントにも無いので、必ず .notdef（□）で描かれる。
    // 日本語の字がそれと同じ絵になっているなら、日本語も□になっている。
    const notdef = signature('\uFFFE');
    return ['予', '続', 'ア'].some((ch) => signature(ch) !== notdef);
  });
  if (!ok) {
    throw new Error(
      '日本語フォントが見つからず、文字が□になります。\n' +
        '  Linux: sudo apt-get install -y fonts-noto-cjk\n' +
        '  その後もう一度 npm run build を実行してください。',
    );
  }
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
    await assertJapaneseRenders(page);
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
