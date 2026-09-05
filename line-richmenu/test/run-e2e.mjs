// モックAPIを立てて、deploy → 再deploy（冪等性）→ link → clear を通しで確認する。
// 実際のLINEアカウントには一切アクセスしない。
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { startMock } from './mock-line-api.mjs';
import { menus } from '../config/menus.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

const mock = await startMock();
const env = {
  ...process.env,
  LINE_API_BASE: mock.url,
  LINE_API_DATA_BASE: mock.url,
  LINE_CHANNEL_ACCESS_TOKEN: 'test-token',
};
// モックサーバーは同じプロセスで動いているので、子プロセスは非同期で待つ
// （同期待ちにするとイベントループが止まってモックが応答できない）
function run(script, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'src', script), ...args], { env, cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve(out) : reject(new Error(`${script} が exit ${code}:\n${out}`)),
    );
  });
}

let failures = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log(`ok   ${name}`);
  } catch (e) {
    failures++;
    console.error(`FAIL ${name}\n     ${e.message.split('\n')[0]}`);
  }
};

// 1回目
await run('build-images.mjs');
await run('deploy.mjs');

check('メニューが2件登録される', () => assert.equal(mock.state.menus.size, menus.length));
check('全メニューに画像がアップされている', () => {
  for (const [id, v] of mock.state.menus) {
    assert.ok(v.image, `${id} に画像がない`);
    assert.equal(v.image.contentType, 'image/png');
    assert.ok(v.image.bytes > 0 && v.image.bytes <= 1024 * 1024, `${id} の画像サイズが不正: ${v.image.bytes}`);
  }
});
check('エイリアスが全メニューぶん登録される', () => {
  for (const m of menus) assert.ok(mock.state.aliases.has(m.aliasId), `${m.aliasId} がない`);
});
check('デフォルトが isDefault のメニューになる', () => {
  const expected = mock.state.aliases.get(menus.find((m) => m.isDefault).aliasId);
  assert.equal(mock.state.defaultRichMenuId, expected);
});
check('切替先エイリアスが実在するメニューを指している', () => {
  for (const [, v] of mock.state.menus) {
    for (const a of v.richMenu.areas) {
      if (a.action.type !== 'richmenuswitch') continue;
      const target = mock.state.aliases.get(a.action.richMenuAliasId);
      assert.ok(target && mock.state.menus.has(target), `${a.action.richMenuAliasId} の指す先がない`);
    }
  }
});

// 2回目（作り直しても増えない・エイリアスは新IDに貼り替わる）
const idsBefore = new Set(mock.state.menus.keys());
await run('deploy.mjs');
check('再実行してもメニューは増えない', () => assert.equal(mock.state.menus.size, menus.length));
check('再実行で全メニューが新しいIDに入れ替わる', () => {
  for (const id of mock.state.menus.keys()) assert.ok(!idsBefore.has(id), `${id} が古いまま`);
});
check('再実行後もエイリアスが現存メニューを指す', () => {
  for (const [alias, id] of mock.state.aliases) assert.ok(mock.state.menus.has(id), `${alias} が消えたメニューを指している`);
});
check('再実行後もデフォルトが現存メニュー', () => assert.ok(mock.state.menus.has(mock.state.defaultRichMenuId)));

// ユーザー単位リンク
await run('link.mjs', ['U0123456789abcdef0123456789abcdef']);
check('ユーザーにメニューがリンクされる', () => {
  const linked = mock.state.userLinks.get('U0123456789abcdef0123456789abcdef');
  assert.equal(linked, mock.state.aliases.get(menus.find((m) => m.isDefault).aliasId));
});
await run('link.mjs', ['U0123456789abcdef0123456789abcdef', 'procedures']);
check('キー指定で別メニューに貼り替えられる', () => {
  assert.equal(
    mock.state.userLinks.get('U0123456789abcdef0123456789abcdef'),
    mock.state.aliases.get(menus.find((m) => m.key === 'procedures').aliasId),
  );
});

await run('inspect.mjs');
check('inspect が例外なく動く', () => {});

// 後片付け
await run('clear.mjs', ['--yes']);
check('clear で全部消える', () => {
  assert.equal(mock.state.menus.size, 0);
  assert.equal(mock.state.aliases.size, 0);
  assert.equal(mock.state.defaultRichMenuId, null);
});

mock.close();
console.log(failures === 0 ? '\nすべて通りました' : `\n${failures}件 失敗`);
process.exit(failures === 0 ? 0 : 1);
