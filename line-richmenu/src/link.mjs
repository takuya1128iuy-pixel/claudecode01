// 特定のユーザーにリッチメニューを紐づける。
// タブ切替(richmenuswitch)はユーザー単位でリンクされた状態でのみ動くので、
// 手元で試すときはこれで自分のuserIdに貼る。
//   npm run link -- U1234...            → デフォルト指定のメニュー(A)を貼る
//   npm run link -- U1234... procedures → キーを指定して貼る
//   npm run link -- U1234... --unlink   → はがす
import { menus } from '../config/menus.mjs';
import * as line from './line-api.mjs';

async function main() {
  const [userId, arg] = process.argv.slice(2);
  if (!userId?.startsWith('U')) {
    console.error('userId を渡してください: npm run link -- U0123456789abcdef...');
    console.error('userId は Webhook で受け取るイベントの source.userId に入っています（npm run webhook で確認できます）。');
    process.exit(1);
  }

  if (arg === '--unlink') {
    await line.unlinkRichMenuFromUser(userId);
    console.log(`${userId} のリッチメニューをはがしました（デフォルトに戻ります）`);
    return;
  }

  const target = arg ? menus.find((m) => m.key === arg) : menus.find((m) => m.isDefault);
  if (!target) {
    console.error(`メニュー "${arg}" は config にありません。使えるキー: ${menus.map((m) => m.key).join(', ')}`);
    process.exit(1);
  }

  const alias = (await line.listAliases()).find((a) => a.richMenuAliasId === target.aliasId);
  if (!alias) throw new Error(`エイリアス ${target.aliasId} が未登録です。先に \`npm run deploy\` を実行してください。`);

  await line.linkRichMenuToUser(userId, alias.richMenuId);
  console.log(`${userId} に ${target.name} (${alias.richMenuId}) をリンクしました`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
