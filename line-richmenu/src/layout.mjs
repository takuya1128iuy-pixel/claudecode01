import { IMAGE, TAB_HEIGHT } from '../config/menus.mjs';

// 端数を最後のセルに寄せて、合計が必ず画像サイズちょうどになるように割る。
function split(total, count) {
  const base = Math.floor(total / count);
  return Array.from({ length: count }, (_, i) => ({
    offset: base * i,
    size: i === count - 1 ? total - base * i : base,
  }));
}

/**
 * メニュー定義から、タブとタイルの矩形を計算する。
 * 画像のCSSもリッチメニューJSONのboundsも、ここが返す同じ数値を使う。
 */
export function layout(menu) {
  const tabCount = menu.tabs?.length ?? 0;
  const tabHeight = tabCount > 0 ? TAB_HEIGHT : 0;
  const cols = split(IMAGE.width, menu.grid.cols);
  const rows = split(IMAGE.height - tabHeight, menu.grid.rows);

  const tabs = split(IMAGE.width, Math.max(tabCount, 1))
    .slice(0, tabCount)
    .map((c, i) => ({
      tab: menu.tabs[i],
      bounds: { x: c.offset, y: 0, width: c.size, height: tabHeight },
    }));

  const tiles = menu.tiles.map((tile, i) => {
    const col = cols[i % menu.grid.cols];
    const row = rows[Math.floor(i / menu.grid.cols)];
    if (!row) throw new Error(`${menu.key}: タイルが grid ${menu.grid.cols}x${menu.grid.rows} に収まりません`);
    return {
      tile,
      index: i,
      bounds: { x: col.offset, y: tabHeight + row.offset, width: col.size, height: row.size },
    };
  });

  return { image: IMAGE, tabHeight, tabs, tiles };
}
