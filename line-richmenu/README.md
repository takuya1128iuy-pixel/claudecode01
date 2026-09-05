# LINE公式アカウントのリッチメニュー

テスト用のLINE公式アカウントに、タブ切替つきのリッチメニューをコードから作って反映するための道具一式。
画像もタップ領域も `config/menus.mjs` の1ファイルから作るので、**画像とタップ位置がズレない**。

反映されるメニューは2枚:

| タブ | 中身 |
| --- | --- |
| メニュー | プロフィール / 面談予約 / 紹介 / 会社情報 / 便利ツール / クーポン |
| 各種お手続き | 住所・氏名変更 / カード・口座 / 控除証明書 / 受取人・契約者 / 給付金請求 / 貸付・解約 |

「各種お手続き」の6枚は、同じリポジトリの [`../hoken-navi`](../hoken-navi)（保険のお手続きナビ）の
該当ステップを直接開く。

## 1. LINE側の準備

1. [LINE Developers](https://developers.line.biz/console/) にログイン
2. プロバイダー → **Messaging API** のチャネルを作る
   （LINE公式アカウントマネージャーから作った公式アカウントも、ここに紐づいたチャネルが出てくる）
3. **Messaging API設定** タブ → 「チャネルアクセストークン（長期）」を発行してコピー
4. 同じタブの「応答メッセージ」「あいさつメッセージ」は、必要に応じてオフにしておく
   （Webhookで返事をさせる場合、応答メッセージが有効だと二重に返る）

## 2. 設定

```bash
cd line-richmenu
npm install
cp .env.example .env
# .env に LINE_CHANNEL_ACCESS_TOKEN と SITE_BASE_URL を書く
```

`SITE_BASE_URL` は「保険のお手続きナビ」を公開したURL。
未設定だと `https://example.com/hoken-navi` のままリンクが作られるので、必ず入れ替えること。

## 3. 反映

```bash
npm run build     # out/*.png を作る（2500x1686）
npm run deploy    # 作成 → 画像アップ → エイリアス登録 → デフォルト設定
npm run inspect   # いま何が登録されているか見る
```

`deploy` は何度実行しても同じ状態になる（前回ぶんは最後に消す）。
LINEアプリでトークを開き直すと反映される。すぐ出ないときは数分待つかアプリを再起動。

## 4. タブ切替を試す

タブの切替（`richmenuswitch`）は、**ユーザー単位でリンクされたリッチメニュー**で動く。
デフォルトリッチメニューのままだと切替が効かないので、自分のIDに貼って確かめる:

```bash
npm run webhook                       # 別ターミナル。届いたイベントの userId が出る
npm run link -- U0123456789abcdef...  # メニューAを自分にリンク
npm run link -- U0123... procedures   # お手続きタブを直接貼る
npm run link -- U0123... --unlink     # はがす（デフォルトに戻る）
```

友だち追加した人全員で切替を使いたいなら、`npm run webhook` のサーバーを常時動かして
`follow` イベントで自動リンクさせる（`src/webhook.mjs` にその実装が入っている）。
公開するにはトンネルかホスティングが要る:

```bash
cloudflared tunnel --url http://localhost:3000   # または ngrok http 3000
# 出てきたURL + /webhook を LINE Developers の Webhook URL に設定して「検証」
```

## 5. 作り直し

```bash
npm run clear -- --yes   # リッチメニューとエイリアスを全削除
```

## ファイル

| パス | 役割 |
| --- | --- |
| `config/menus.mjs` | メニュー定義。**普段いじるのはここだけ** |
| `src/layout.mjs` | タブ・タイルの座標計算（画像とJSONで共通） |
| `src/template.mjs` | 画像用のHTML。デザインを変えたいときはここ |
| `src/build-images.mjs` | ChromiumでHTMLを撮ってPNGにする |
| `src/richmenu.mjs` | LINEに送るJSONの組み立てと事前チェック |
| `src/line-api.mjs` | Messaging APIの薄いラッパー |
| `src/deploy.mjs` `inspect` `clear` `link` | 操作コマンド |
| `src/webhook.mjs` | 最小のWebhookサーバー（follow時の自動リンク、キーワード返信） |
| `test/` | モックAPIを立てて deploy〜clear を通しで確認するテスト |

## テスト

```bash
npm test
```

モックのMessaging APIを立てて、実アカウントに触らずに
「登録される / 画像が上がる / 再実行しても増えない / エイリアスが張り替わる / 全消しできる」を確認する。

## 画像だけ差し替えたいとき

`out/*.html` をブラウザで開けば、そのままリッチメニューの見た目になっている。
CSSを直して `npm run build` すればPNGが作り直される。
Chromiumが見つからない環境では `CHROMIUM_PATH=<Chromeの実行ファイル>` を指定するか、
`npx playwright install chromium` を実行する。

## 制約メモ

- 画像は 2500x1686 / 2500x843 / 1200x810 / 1200x405 / 800x540 / 800x270 のいずれか、1MB以内
- タップ領域は1枚あたり20個まで
- `chatBarText` は14文字まで
- エイリアスIDは英小文字・数字・`-`・`_` の32文字以内
