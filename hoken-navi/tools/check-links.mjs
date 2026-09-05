// データに入っている各社URLが生きているかを確かめる。
// リンク切れのまま公開すると事故になるので、公開前と、月1くらいで実行する。
//   node tools/check-links.mjs
//   node tools/check-links.mjs --json > report.json
import { loadData, allUrls } from './data.mjs';

const CONCURRENCY = 6;
const TIMEOUT_MS = 15000;

async function probe(entry) {
  const started = Date.now();
  try {
    // HEADを弾くサイトがあるので、駄目ならGETで確かめ直す
    let res = await fetchWithTimeout(entry.url, 'HEAD');
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetchWithTimeout(entry.url, 'GET');
    }
    return { ...entry, status: res.status, ok: res.ok, ms: Date.now() - started };
  } catch (e) {
    return { ...entry, status: 0, ok: false, error: e.message, ms: Date.now() - started };
  }
}

function fetchWithTimeout(url, method) {
  return fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'User-Agent': 'hoken-navi-link-check/1.0' },
  });
}

async function main() {
  const data = loadData();
  const entries = allUrls(data);
  const results = [];

  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < entries.length) results.push(await probe(entries[i++]));
    }),
  );

  results.sort((a, b) => Number(a.ok) - Number(b.ok) || a.company.localeCompare(b.company, 'ja'));

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  const bad = results.filter((r) => !r.ok);
  for (const r of bad) {
    console.log(`NG  ${r.status || r.error}  ${r.company} / ${r.kind}\n    ${r.url}`);
  }
  console.log(`\n${results.length}件中 ${results.length - bad.length}件OK / ${bad.length}件NG`);
  if (bad.length === results.length) {
    // 全滅は「全部リンク切れ」よりネットワーク側を疑うほうが早い
    console.log('全件NGです。プロキシや社内ネットワークで外部サイトが塞がれていないか先に確認してください。');
  } else if (bad.length) {
    console.log('NGのURLは各社サイトで探し直して data.js を直してください。');
  }
  if (bad.length) process.exitCode = 1;
}

main();
