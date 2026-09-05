// Messaging API の薄いラッパー。依存なし（Node 18+ の fetch を使う）。
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

// .env があれば読む（無くても環境変数から取れればよい）
try {
  process.loadEnvFile(path.join(ROOT, '.env'));
} catch {
  // .env なし
}

// テスト時にモックサーバーへ向けられるようにしてある
const API = process.env.LINE_API_BASE ?? 'https://api.line.me';
const DATA_API = process.env.LINE_API_DATA_BASE ?? 'https://api-data.line.me';

export function token() {
  const t = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!t) {
    throw new Error(
      'LINE_CHANNEL_ACCESS_TOKEN が未設定です。\n' +
        '  LINE Developers → 対象チャネル → Messaging API設定 → チャネルアクセストークン（長期）を発行し、\n' +
        '  line-richmenu/.env に LINE_CHANNEL_ACCESS_TOKEN=... と書いてください（.env.example をコピー）。',
    );
  }
  return t;
}

async function request(method, url, { body, contentType } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      ...(contentType ? { 'Content-Type': contentType } : {}),
    },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${url} → ${res.status}\n${text}`);
  }
  return text ? JSON.parse(text) : {};
}

const json = (method, url, payload) =>
  request(method, url, {
    body: payload === undefined ? undefined : JSON.stringify(payload),
    contentType: payload === undefined ? undefined : 'application/json',
  });

export const getBotInfo = () => json('GET', `${API}/v2/bot/info`);

export const createRichMenu = (richMenu) => json('POST', `${API}/v2/bot/richmenu`, richMenu);
export const listRichMenus = () => json('GET', `${API}/v2/bot/richmenu/list`).then((r) => r.richmenus ?? []);
export const deleteRichMenu = (id) => json('DELETE', `${API}/v2/bot/richmenu/${id}`);

export function uploadImage(richMenuId, file) {
  const buf = readFileSync(file);
  const contentType = file.endsWith('.jpg') || file.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  // 画像だけはデータ用のホスト（api-data.line.me）に送る
  return request('POST', `${DATA_API}/v2/bot/richmenu/${richMenuId}/content`, { body: buf, contentType });
}

export const setDefaultRichMenu = (id) => json('POST', `${API}/v2/bot/user/all/richmenu/${id}`);
export const getDefaultRichMenu = () =>
  json('GET', `${API}/v2/bot/user/all/richmenu`).catch(() => null);
export const deleteDefaultRichMenu = () => json('DELETE', `${API}/v2/bot/user/all/richmenu`);

export const listAliases = () =>
  json('GET', `${API}/v2/bot/richmenu/alias/list`).then((r) => r.aliases ?? []);
export const createAlias = (richMenuAliasId, richMenuId) =>
  json('POST', `${API}/v2/bot/richmenu/alias`, { richMenuAliasId, richMenuId });
export const updateAlias = (richMenuAliasId, richMenuId) =>
  json('POST', `${API}/v2/bot/richmenu/alias/${richMenuAliasId}`, { richMenuId });
export const deleteAlias = (richMenuAliasId) =>
  json('DELETE', `${API}/v2/bot/richmenu/alias/${richMenuAliasId}`);

// 個別ユーザーにリッチメニューを紐づける（タブ切替はこの状態でのみ動く）
export const linkRichMenuToUser = (userId, richMenuId) =>
  json('POST', `${API}/v2/bot/user/${userId}/richmenu/${richMenuId}`);
export const unlinkRichMenuFromUser = (userId) =>
  json('DELETE', `${API}/v2/bot/user/${userId}/richmenu`);

export const replyMessage = (replyToken, messages) =>
  json('POST', `${API}/v2/bot/message/reply`, { replyToken, messages });
