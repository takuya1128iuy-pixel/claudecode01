# てつづきコンパス

「手続きを選ぶ → 保険会社を選ぶ → 方法を確認」の3ステップで、
各保険会社の該当する手続きページに案内する1枚もののWebページ。
LINEのリッチメニューから直接開かせる前提で作ってある。

複数の担当者・代理店に提供できるよう、屋号・担当者名・配色・相談先LINEを
テナント設定で差し替えられる。保険会社のデータは全テナント共通なので、
1社のURLが変わっても直すのは1箇所。

- 依存ライブラリなし・ビルド不要。`index.html` をそのまま置けば動く
- 個人情報の入力欄はなし。どこにもデータを送らない
- 収録: **保険会社25社 / 手続き6種 / リンク97件 / 電話窓口25件**
- 給付金請求・控除証明書再発行など、専用ダイヤルがある会社はその番号を優先して表示
- 手続きごとに「用意するもの」「かかる時間の目安」「つまずきやすいところ」を表示
- 「担当者に相談する」でLINEのトークに用件入りで戻れる（送信するかは本人が決める）

公開URL: https://takuya1128iuy-pixel.github.io/ai-secretary-pages/tetsuzuki-compass/
（配信は `ai-secretary-pages` リポジトリ。GitHub Pages が main から出している）

プレビュー（Artifact・既定では自分だけが見られる）:
https://claude.ai/code/artifact/fdf96169-abc7-4172-8525-a341213e8349

## 動かす

```bash
# そのままブラウザで開くだけ
open index.html
```

## 提供先ごとの設定（テナント）

`tenants.js` に屋号・担当者名・配色・相談先のLINE IDを書き、URLで切り替える。

```
/                        既定のテナント
/?c=sample               サンプル事務所の設定で開く
/?c=sample&theme=plum    配色だけ差し替えて見せる（提案時のデモ用）
/?preview=1              配色を切り替えるボタンを出す（商談で色を選んでもらう用）
```

配色は `indigo`（藍）/ `teal`（青緑）/ `plum`（梅）/ `amber`（琥珀）/ `slate`（鉄紺）。
明るい設定・暗い設定の両方を用意してあるので、どれを選んでも端末の設定に追従する。
増やすときは `styles.css` の「配色のバリエーション」に3ブロック足して `tenants.js` の
`PALETTES` に1行足す。

`lineId` を空にすると「担当者に相談する」ボタンは出ない。

## LINEから特定の手続きを開く

URLにパラメータを付けると、その手続きの会社選択画面から始まる。

```
https://example.com/tetsuzuki-compass/?p=payment              クレジットカード・口座変更
https://example.com/tetsuzuki-compass/?p=payment&c=orixlife   オリックス生命の結果画面を直接開く
```

`p` に使える値: `address` `payment` `certificate` `beneficiary` `claim` `loan`
（`data.js` の `procedures` の id）。

リッチメニュー側の設定は [`../line-richmenu/config/menus.mjs`](../line-richmenu/config/menus.mjs) にある。

## リンクの確認（公開前に必ず）

収録している97件のURLは **2026-09-05 に全件疎通確認済み（97件中97件OK）**。
確認は GitHub Actions（[`.github/workflows/check-links.yml`](../.github/workflows/check-links.yml)）で
`tetsuzuki-compass/` を変更したときと毎月1日に自動で回るので、リンク切れは Actions の失敗で気づける。

手元で確かめたいときはこちら:

```bash
node tools/check-links.mjs          # NGのURLだけ出る
node tools/check-links.mjs --json   # 全件の結果をJSONで
```

全件NGになる場合は、リンク切れではなくネットワーク側（プロキシ等）を先に疑うこと。

電話番号と受付時間は各社の公式ページの記載を転記したもの。受付時間は変わりやすいので、
リンクほど自動では追えない。半年に一度くらいは目視で見直すこと。

## 会社・手続きを足す

`data.js` を編集するだけ。

```js
{
  id: 'example-life',            // URLに出る識別子。英小文字とハイフン
  name: '◯◯生命',
  tel: '0120-000-000',
  telNote: 'コールセンター 平日9:00〜17:00',   // 窓口名と受付時間を必ず添える
  extraTels: {                                 // 手続き専用ダイヤルがあれば
    claim: { tel: '0120-000-001', note: '給付金請求 専用ダイヤル' },
  },
  portal: { name: 'マイページ', url: 'https://...' },
  top: 'https://.../お手続き一覧',  // 個別ページが無いときの飛び先
  links: {                        // 手続きごとの専用ページが分かっているもの
    address: 'https://...',
    payment: 'https://...',
  },
}
```

`links` にある手続きは「Webで手続き可能」、無い手続きは `top`（お手続き一覧）に飛ばして
「お手続き一覧から」と表示する。

## 公開する

置き場所はどこでもよい。1ファイルにまとめたい場合:

```bash
node tools/build-single.mjs   # dist/index.html （CSS/JS/データ入り、約29KB）
```

**いまの公開方法**: `ai-secretary-pages` リポジトリに相乗りしている。
このリポジトリの GitHub Pages（`.github/workflows/deploy.yml`）は別アプリを配信しているため、
そちらは使っていない。中身を更新したら、固めたファイルを差し替えて push する:

```bash
node tools/build-single.mjs
cp dist/index.html ../../ai-secretary-pages/tetsuzuki-compass/index.html
# ai-secretary-pages 側で commit して main に push
```

別の場所に出すなら `dist/` を https://app.netlify.com/drop に投げてもよい。
その場合は `line-richmenu/.env` の `SITE_BASE_URL` を新しいURLに変えて `npm run deploy` し直す。

## ファイル

| パス | 役割 |
| --- | --- |
| `index.html` | 骨組みとヘッダー・フッター |
| `styles.css` | 見た目 |
| `app.js` | 3ステップの画面遷移とURL連動 |
| `data.js` | 保険会社と手続きのデータ。**普段いじるのはここ** |
| `tools/check-links.mjs` | URLが生きているかの確認 |
| `tools/build-single.mjs` | 1ファイルにまとめる |

## 注意

デモとして作ったもので、掲載内容の正確性は保証していない。
リンクの生死はCIで見ているが、「リンク先の内容がその手続きの案内になっているか」までは見ていない。
実際のお客さまに案内する前に、主要な会社ぶんは目で見て確認すること。
