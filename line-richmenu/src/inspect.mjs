// いま公式アカウントに何が登録されているかを見る。
import * as line from './line-api.mjs';

async function main() {
  try {
    const info = await line.getBotInfo();
    console.log(`Bot: ${info.displayName} (${info.basicId})  chatMode=${info.chatMode}`);
  } catch (e) {
    console.error('Bot情報が取れません。トークンを確認してください。\n' + e.message);
    process.exit(1);
  }

  const def = await line.getDefaultRichMenu();
  console.log(`デフォルトリッチメニュー: ${def?.richMenuId ?? '(未設定)'}`);

  const aliases = await line.listAliases();
  const menus = await line.listRichMenus();

  console.log(`\nリッチメニュー ${menus.length}件`);
  for (const m of menus) {
    const alias = aliases.filter((a) => a.richMenuId === m.richMenuId).map((a) => a.richMenuAliasId);
    const mark = m.richMenuId === def?.richMenuId ? ' ★default' : '';
    console.log(`  - ${m.name}  ${m.richMenuId}${mark}`);
    console.log(`      chatBarText="${m.chatBarText}" selected=${m.selected} areas=${m.areas.length} alias=${alias.join(',') || '-'}`);
    for (const a of m.areas) {
      const act = a.action;
      const detail = act.uri ?? act.text ?? act.richMenuAliasId ?? act.data ?? '';
      console.log(`        (${a.bounds.x},${a.bounds.y}) ${a.bounds.width}x${a.bounds.height}  ${act.type}  ${detail}`);
    }
  }

  console.log(`\nエイリアス ${aliases.length}件`);
  for (const a of aliases) console.log(`  - ${a.richMenuAliasId} → ${a.richMenuId}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
