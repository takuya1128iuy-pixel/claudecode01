import { layout } from './layout.mjs';
import { IMAGE, menus } from '../config/menus.mjs';

// LINEが受け付けるリッチメニュー画像のサイズ（幅x高さ）
const ALLOWED_SIZES = ['2500x1686', '2500x843', '1200x810', '1200x405', '800x540', '800x270'];
const ALIAS_RE = /^[a-z0-9_-]{1,32}$/;

/** メニュー定義 → Messaging API に POST するリッチメニューオブジェクト */
export function toRichMenu(menu) {
  const { tabs, tiles } = layout(menu);
  const areas = [];

  for (const { tab, bounds } of tabs) {
    // アクティブなタブは押しても何も起きなくてよいので、領域自体を作らない
    if (!tab.switchTo) continue;
    areas.push({
      bounds,
      action: {
        type: 'richmenuswitch',
        richMenuAliasId: tab.switchTo,
        data: tab.data ?? `switch=${tab.switchTo}`,
      },
    });
  }
  for (const { tile, bounds } of tiles) {
    areas.push({ bounds, action: { label: tile.label, ...tile.action } });
  }

  return {
    size: { width: IMAGE.width, height: IMAGE.height },
    selected: Boolean(menu.selected),
    name: menu.name,
    chatBarText: menu.chatBarText,
    areas,
  };
}

/** APIに投げる前に、こちら側で分かる違反を落としておく */
export function validate(menu, richMenu) {
  const errors = [];
  const where = `[${menu.key}]`;

  if (!ALLOWED_SIZES.includes(`${richMenu.size.width}x${richMenu.size.height}`)) {
    errors.push(`${where} 画像サイズ ${richMenu.size.width}x${richMenu.size.height} は使えません（${ALLOWED_SIZES.join(' / ')}）`);
  }
  if (!ALIAS_RE.test(menu.aliasId)) {
    errors.push(`${where} aliasId "${menu.aliasId}" が不正（英小文字・数字・-・_ の32文字以内）`);
  }
  if (richMenu.name.length > 300) errors.push(`${where} name が300文字を超えています`);
  if (richMenu.chatBarText.length > 14) errors.push(`${where} chatBarText "${richMenu.chatBarText}" が14文字を超えています`);
  if (richMenu.areas.length === 0) errors.push(`${where} タップ領域が1つもありません`);
  if (richMenu.areas.length > 20) errors.push(`${where} タップ領域は20個までです（現在 ${richMenu.areas.length}個）`);

  richMenu.areas.forEach((area, i) => {
    const b = area.bounds;
    const at = `${where} areas[${i}]`;
    if (b.x < 0 || b.y < 0 || b.x + b.width > richMenu.size.width || b.y + b.height > richMenu.size.height) {
      errors.push(`${at} が画像の外にはみ出しています: ${JSON.stringify(b)}`);
    }
    const a = area.action;
    if (a.type === 'uri' && !/^(https?|tel|line):/.test(a.uri)) {
      errors.push(`${at} uri "${a.uri}" は https / tel / line スキームである必要があります`);
    }
    if (a.type === 'message' && (!a.text || a.text.length > 300)) errors.push(`${at} message.text は1〜300文字`);
    if (a.type === 'postback' && (!a.data || a.data.length > 300)) errors.push(`${at} postback.data は1〜300文字`);
    if (a.type === 'richmenuswitch') {
      if (!ALIAS_RE.test(a.richMenuAliasId)) errors.push(`${at} richMenuAliasId "${a.richMenuAliasId}" が不正`);
      if (!menus.some((m) => m.aliasId === a.richMenuAliasId)) {
        errors.push(`${at} 切替先 "${a.richMenuAliasId}" にあたるメニューが config にありません`);
      }
    }
  });

  return errors;
}

/** すべてのメニューを組み立てて検証する。1件でも駄目なら例外。 */
export function buildAll() {
  const built = menus.map((menu) => ({ menu, richMenu: toRichMenu(menu) }));
  const errors = built.flatMap(({ menu, richMenu }) => validate(menu, richMenu));
  const defaults = menus.filter((m) => m.isDefault);
  if (defaults.length !== 1) {
    errors.push(`isDefault: true のメニューはちょうど1つにしてください（現在 ${defaults.length}個）`);
  }
  if (errors.length) throw new Error(`設定にエラーがあります:\n  - ${errors.join('\n  - ')}`);
  return built;
}
