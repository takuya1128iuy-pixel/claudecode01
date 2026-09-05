// Messaging API の代わりに使う最小のモック。
// 実アカウントを触らずに deploy / clear / link の手順を通しで確認するためのもの。
import http from 'node:http';

export function startMock() {
  const state = {
    menus: new Map(), // richMenuId -> {richMenu, image}
    aliases: new Map(), // aliasId -> richMenuId
    defaultRichMenuId: null,
    userLinks: new Map(),
    seq: 0,
  };

  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const send = (code, obj) => {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(obj ?? {}));
      };
      const { method } = req;
      const url = req.url;

      if (req.headers.authorization !== 'Bearer test-token') return send(401, { message: 'invalid token' });

      let m;
      if (method === 'GET' && url === '/v2/bot/info') {
        return send(200, { displayName: 'テスト公式アカウント', basicId: '@test000', chatMode: 'bot' });
      }
      if (method === 'POST' && url === '/v2/bot/richmenu') {
        const richMenu = JSON.parse(body.toString());
        const richMenuId = `richmenu-${++state.seq}`;
        state.menus.set(richMenuId, { richMenu, image: null });
        return send(200, { richMenuId });
      }
      if (method === 'GET' && url === '/v2/bot/richmenu/list') {
        return send(200, {
          richmenus: [...state.menus].map(([richMenuId, v]) => ({ richMenuId, ...v.richMenu })),
        });
      }
      if ((m = url.match(/^\/v2\/bot\/richmenu\/([^/]+)\/content$/)) && method === 'POST') {
        const entry = state.menus.get(m[1]);
        if (!entry) return send(404, { message: 'not found' });
        if (!req.headers['content-type']?.startsWith('image/')) return send(400, { message: 'bad content-type' });
        entry.image = { bytes: body.length, contentType: req.headers['content-type'] };
        return send(200, {});
      }
      if (method === 'POST' && url === '/v2/bot/richmenu/alias') {
        const { richMenuAliasId, richMenuId } = JSON.parse(body.toString());
        if (state.aliases.has(richMenuAliasId)) return send(400, { message: 'conflict alias id' });
        if (!state.menus.has(richMenuId)) return send(404, { message: 'rich menu not found' });
        state.aliases.set(richMenuAliasId, richMenuId);
        return send(200, {});
      }
      if ((m = url.match(/^\/v2\/bot\/richmenu\/alias\/list$/)) && method === 'GET') {
        return send(200, {
          aliases: [...state.aliases].map(([richMenuAliasId, richMenuId]) => ({ richMenuAliasId, richMenuId })),
        });
      }
      if ((m = url.match(/^\/v2\/bot\/richmenu\/alias\/([^/]+)$/))) {
        if (method === 'POST') {
          if (!state.aliases.has(m[1])) return send(404, { message: 'alias not found' });
          state.aliases.set(m[1], JSON.parse(body.toString()).richMenuId);
          return send(200, {});
        }
        if (method === 'DELETE') {
          state.aliases.delete(m[1]);
          return send(200, {});
        }
      }
      if ((m = url.match(/^\/v2\/bot\/richmenu\/([^/]+)$/)) && method === 'DELETE') {
        if (!state.menus.has(m[1])) return send(404, { message: 'not found' });
        state.menus.delete(m[1]);
        if (state.defaultRichMenuId === m[1]) state.defaultRichMenuId = null;
        return send(200, {});
      }
      if (url === '/v2/bot/user/all/richmenu' && method === 'GET') {
        if (!state.defaultRichMenuId) return send(404, { message: 'no default rich menu' });
        return send(200, { richMenuId: state.defaultRichMenuId });
      }
      if (url === '/v2/bot/user/all/richmenu' && method === 'DELETE') {
        state.defaultRichMenuId = null;
        return send(200, {});
      }
      if ((m = url.match(/^\/v2\/bot\/user\/all\/richmenu\/([^/]+)$/)) && method === 'POST') {
        if (!state.menus.has(m[1])) return send(404, { message: 'not found' });
        state.defaultRichMenuId = m[1];
        return send(200, {});
      }
      if ((m = url.match(/^\/v2\/bot\/user\/([^/]+)\/richmenu\/([^/]+)$/)) && method === 'POST') {
        if (!state.menus.has(m[2])) return send(404, { message: 'not found' });
        state.userLinks.set(m[1], m[2]);
        return send(200, {});
      }
      if ((m = url.match(/^\/v2\/bot\/user\/([^/]+)\/richmenu$/)) && method === 'DELETE') {
        state.userLinks.delete(m[1]);
        return send(200, {});
      }
      send(404, { message: `unhandled ${method} ${url}` });
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ url: `http://127.0.0.1:${port}`, state, close: () => server.close() });
    });
  });
}
