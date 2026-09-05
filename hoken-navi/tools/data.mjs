// data.js は <script src> でそのまま読み込めるよう素のJSにしてあるので、
// Node からはファイルを読んで評価して取り出す。
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const DATA = path.resolve(import.meta.dirname, '../data.js');

export function loadData() {
  const ctx = vm.createContext({});
  vm.runInContext(readFileSync(DATA, 'utf8'), ctx);
  return ctx.HOKEN;
}

/** データに入っているURLを、どこ由来かが分かる形で全部並べる */
export function allUrls(data) {
  const out = [];
  for (const c of data.companies) {
    out.push({ company: c.name, kind: 'お手続き一覧', url: c.top });
    if (c.portal?.url) out.push({ company: c.name, kind: c.portal.name, url: c.portal.url });
    for (const [proc, url] of Object.entries(c.links ?? {})) {
      const label = data.procedures.find((p) => p.id === proc)?.label ?? proc;
      out.push({ company: c.name, kind: label, url });
    }
  }
  return out;
}
