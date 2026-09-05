# 保険のお手続きナビ（デモ）

「手続きを選ぶ → 保険会社を選ぶ → 方法を確認」の3ステップで、
各保険会社の該当する手続きページに案内する1枚もののWebページ。
LINEのリッチメニューから直接開かせる前提で作ってある。

- 依存ライブラリなし・ビルド不要。`index.html` をそのまま置けば動く
- 個人情報の入力欄はなし。どこにもデータを送らない
- 収録: **保険会社25社 / 手続き6種 / リンク97件 / 電話窓口25件**
- 給付金請求・控除証明書再発行など、専用ダイヤルがある会社はその番号を優先して表示

プレビュー（Artifact・既定では自分だけが見られる）:
https://claude.ai/code/artifact/fdf96169-abc7-4172-8525-a341213e8349

## 動かす

```bash
# そのままブラウザで開くだけ
open index.html
```

## LINEから特定の手続きを開く

URLにパラメータを付けると、その手続きの会社選択画面から始まる。

```
https://example.com/hoken-navi/?p=payment              クレジットカード・口座変更
https://example.com/hoken-navi/?p=payment&c=orixlife   オリックス生命の結果画面を直接開く
```

`p` に使える値: `address` `payment` `certificate` `beneficiary` `claim` `loan`
（`data.js` の `procedures` の id）。

リッチメニュー側の設定は [`../line-richmenu/config/menus.mjs`](../line-richmenu/config/menus.mjs) にある。

## リンクの確認（公開前に必ず）

`data.js` のURLは各社の公開ページを検索で集めたもので、**まだ一度も開いて確認していない**。
電話番号と受付時間は各社の公式ページに載っていたものを転記しているが、受付時間は変わりやすい。
保険会社のサイトはリニューアルでURLが変わりやすいので、公開前と、その後も月1くらいで確認する:

```bash
node tools/check-links.mjs          # NGのURLだけ出る
node tools/check-links.mjs --json   # 全件の結果をJSONで
```

全件NGになる場合は、リンク切れではなくネットワーク側（プロキシ等）を先に疑うこと。

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

- **Netlify**: `dist/` フォルダを https://app.netlify.com/drop にドラッグ&ドロップ
- **GitHub Pages**: このフォルダごと公開する（同リポジトリの `.github/workflows/deploy.yml` は
  別ブランチのアプリを公開しているので、そのまま有効にすると上書きになる。分けて設定すること）

公開URLが決まったら `line-richmenu/.env` の `SITE_BASE_URL` に入れて `npm run deploy` する。

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
実際のお客さまに案内する前に、リンク先と手続き方法を各社サイトで確認すること。
