// 動作確認用の最小Webhookサーバー（依存なし）。
//  - 友だち追加(follow)されたら、そのユーザーにメニューAをリンクする
//    → タブ切替はユーザー単位リンクが要るので、これが入っていると全員で切替が使える
//  - リッチメニューのpostbackやメッセージに簡単な返信をする
//  - 受け取ったイベントを標準出力に出すので、自分の userId もここで分かる
//
//   npm run webhook          → http://localhost:3000/webhook で待ち受け
//   別ターミナルで公開トンネルを立て、LINE DevelopersのWebhook URLに設定する
//     例) cloudflared tunnel --url http://localhost:3000
//         ngrok http 3000
import http from 'node:http';
import crypto from 'node:crypto';
import { menus, SITE } from '../config/menus.mjs';
import * as line from './line-api.mjs';

const PORT = Number(process.env.PORT ?? 3000);
const SECRET = process.env.LINE_CHANNEL_SECRET;

function verify(body, signature) {
  if (!SECRET) return null; // 未設定なら検証しない（ローカル確認用）
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature ?? '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function linkDefaultMenu(userId) {
  const target = menus.find((m) => m.isDefault);
  const alias = (await line.listAliases()).find((a) => a.richMenuAliasId === target.aliasId);
  if (!alias) return;
  await line.linkRichMenuToUser(userId, alias.richMenuId);
  console.log(`  → ${userId} に ${target.name} をリンク`);
}

const REPLIES = {
  'coupon=meeting': '面談を早く進めるクーポンです。次回の面談時にこの画面をお見せください。',
};

// 動画と同じく「メニューから送られた言葉」に自動で返す形も用意しておく。
// リッチメニューのタイルを uri ではなく message アクションにした場合はこちらが効く。
const KEYWORDS = [
  { match: /住所|氏名|引っ越し|改姓/, procedure: 'address', label: '住所・氏名の変更' },
  { match: /クレジット|カード|口座|引き落と/, procedure: 'payment', label: 'クレジットカード・口座変更' },
  { match: /控除証明書|年末調整|確定申告/, procedure: 'certificate', label: '控除証明書の再発行' },
  { match: /受取人|契約者変更|名義/, procedure: 'beneficiary', label: '受取人・契約者の変更' },
  { match: /給付金|保険金|入院|手術/, procedure: 'claim', label: '給付金・保険金の請求' },
  { match: /貸付|解約|減額/, procedure: 'loan', label: '契約者貸付・解約' },
];

function keywordReply(text) {
  const hit = KEYWORDS.find((k) => k.match.test(text));
  if (!hit) return null;
  return `${hit.label}のお手続きですね。\nこちらから各社のお手続きページにアクセスできます。\n${SITE}/?p=${hit.procedure}`;
}

async function handle(event) {
  console.log(`${event.type}  userId=${event.source?.userId ?? '-'}  ${JSON.stringify(event.postback ?? event.message ?? {})}`);

  if (event.type === 'follow') {
    await linkDefaultMenu(event.source.userId);
    await line.replyMessage(event.replyToken, [{ type: 'text', text: '友だち追加ありがとうございます。下のメニューからどうぞ。' }]);
    return;
  }
  if (event.type === 'postback') {
    const data = event.postback.data;
    // タブ切替のpostbackは、切替そのものはLINE側が処理するので返信不要
    if (data.startsWith('switch=')) return;
    const text = REPLIES[data] ?? `受け取りました: ${data}`;
    await line.replyMessage(event.replyToken, [{ type: 'text', text }]);
    return;
  }
  if (event.type === 'message' && event.message.type === 'text') {
    const text = keywordReply(event.message.text)
      ?? `「${event.message.text}」を受け取りました。担当者から折り返しご連絡します。`;
    await line.replyMessage(event.replyToken, [{ type: 'text', text }]);
  }
}

http
  .createServer((req, res) => {
    if (req.method !== 'POST' || !req.url.startsWith('/webhook')) {
      res.writeHead(200).end('ok');
      return;
    }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const ok = verify(body, req.headers['x-line-signature']);
      if (ok === false) {
        console.error('署名が一致しません（LINE_CHANNEL_SECRET を確認）');
        res.writeHead(401).end();
        return;
      }
      // LINEは応答が遅いと再送してくるので、先に200を返してから処理する
      res.writeHead(200).end();
      try {
        for (const event of JSON.parse(body).events ?? []) await handle(event);
      } catch (e) {
        console.error(e.message);
      }
    });
  })
  .listen(PORT, () => {
    console.log(`webhook: http://localhost:${PORT}/webhook で待ち受け中`);
    if (!SECRET) console.log('（LINE_CHANNEL_SECRET が未設定なので署名検証をスキップしています）');
  });
