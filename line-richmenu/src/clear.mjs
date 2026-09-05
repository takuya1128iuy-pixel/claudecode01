// 登録済みのリッチメニューとエイリアスを全部消す（作り直したいとき用）。
import * as line from './line-api.mjs';

async function main() {
  if (!process.argv.includes('--yes')) {
    console.error('この公式アカウントのリッチメニューとエイリアスを全削除します。');
    console.error('実行するなら: npm run clear -- --yes');
    process.exit(1);
  }

  for (const a of await line.listAliases()) {
    await line.deleteAlias(a.richMenuAliasId);
    console.log(`エイリアス削除: ${a.richMenuAliasId}`);
  }
  await line.deleteDefaultRichMenu().catch(() => {});
  console.log('デフォルト設定を解除');

  for (const m of await line.listRichMenus()) {
    await line.deleteRichMenu(m.richMenuId);
    console.log(`削除: ${m.name} ${m.richMenuId}`);
  }
  console.log('完了');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
