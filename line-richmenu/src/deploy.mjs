// 画像とJSONを実際のLINE公式アカウントに反映する。
// 何度実行しても同じ状態になる（古い同名メニューは最後に消す）。
import { existsSync } from 'node:fs';
import path from 'node:path';
import { buildAll } from './richmenu.mjs';
import * as line from './line-api.mjs';

const OUT = path.resolve(import.meta.dirname, '../out');

async function main() {
  const built = buildAll();

  for (const { menu } of built) {
    if (!existsSync(path.join(OUT, `${menu.key}.png`))) {
      throw new Error(`out/${menu.key}.png がありません。先に \`npm run build\` を実行してください。`);
    }
  }

  const before = await line.listRichMenus();
  const managedNames = new Set(built.map((b) => b.menu.name));
  const stale = before.filter((m) => managedNames.has(m.name));

  const created = [];
  for (const { menu, richMenu } of built) {
    const { richMenuId } = await line.createRichMenu(richMenu);
    await line.uploadImage(richMenuId, path.join(OUT, `${menu.key}.png`));
    created.push({ menu, richMenuId });
    console.log(`作成: ${menu.name}  ${richMenuId}  (領域 ${richMenu.areas.length}個)`);
  }

  // エイリアスは切替先の指定に使う名前。既にあれば新しいIDに貼り替える。
  const aliases = new Set((await line.listAliases()).map((a) => a.richMenuAliasId));
  for (const { menu, richMenuId } of created) {
    if (aliases.has(menu.aliasId)) {
      await line.updateAlias(menu.aliasId, richMenuId);
      console.log(`エイリアス更新: ${menu.aliasId} → ${richMenuId}`);
    } else {
      await line.createAlias(menu.aliasId, richMenuId);
      console.log(`エイリアス作成: ${menu.aliasId} → ${richMenuId}`);
    }
  }

  const def = created.find(({ menu }) => menu.isDefault);
  await line.setDefaultRichMenu(def.richMenuId);
  console.log(`デフォルトに設定: ${def.menu.name}`);

  // 貼り替えが済んでから、前回のぶんを消す
  for (const old of stale) {
    await line.deleteRichMenu(old.richMenuId);
    console.log(`旧メニューを削除: ${old.richMenuId}`);
  }

  console.log('\n完了。LINEアプリでトークを開き直すと反映されます（すぐ出ないときは数分待つか再起動）。');
  console.log('タブ切替を試すには `npm run link -- <あなたのuserId>` でユーザー単位のリンクが必要です。');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
