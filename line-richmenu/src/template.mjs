import { layout } from './layout.mjs';

const THEME = {
  bg: '#FFFFFF',
  line: '#E3E9E6',
  tabActiveBg: '#06C755',
  tabActiveFg: '#FFFFFF',
  tabIdleBg: '#F2F5F3',
  tabIdleFg: '#5B6B63',
  label: '#1F2A24',
  sub: '#8A9A91',
};

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const px = (b) => `left:${b.x}px;top:${b.y}px;width:${b.width}px;height:${b.height}px`;

/** メニュー定義 → 撮影用のHTML。座標は layout() と共通なのでタップ領域と必ず一致する。 */
export function toHtml(menu) {
  const { image, tabs, tiles } = layout(menu);

  const tabHtml = tabs.map(({ tab, bounds }) => `
    <div class="tab ${tab.active ? 'active' : 'idle'}" style="${px(bounds)}">
      <span>${esc(tab.label)}</span>
    </div>`).join('');

  const tileHtml = tiles.map(({ tile, bounds }) => `
    <div class="tile" style="${px(bounds)}">
      <div class="emoji">${esc(tile.emoji ?? '')}</div>
      <div class="label">${esc(tile.label)}</div>
      ${tile.sub ? `<div class="sub">${esc(tile.sub)}</div>` : ''}
    </div>`).join('');

  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><title>${esc(menu.name)}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:${image.width}px; height:${image.height}px; }
  body {
    position:relative; background:${THEME.bg}; overflow:hidden;
    font-family:"Hiragino Sans","Noto Sans JP","Noto Sans CJK JP","IPAGothic","Yu Gothic",sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .tab { position:absolute; display:flex; align-items:center; justify-content:center; font-size:82px; font-weight:700; letter-spacing:.04em; }
  .tab.active { background:${THEME.tabActiveBg}; color:${THEME.tabActiveFg}; }
  .tab.idle { background:${THEME.tabIdleBg}; color:${THEME.tabIdleFg}; }
  .tile { position:absolute; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px;
          border-right:3px solid ${THEME.line}; border-bottom:3px solid ${THEME.line}; }
  .emoji { font-size:190px; line-height:1; }
  .label { font-size:86px; font-weight:700; color:${THEME.label}; letter-spacing:.02em; }
  .sub { font-size:46px; color:${THEME.sub}; letter-spacing:.02em; }
</style></head>
<body>${tabHtml}${tileHtml}</body></html>`;
}
