/*
 * バックヤードや地下フロアは電波が弱い前提なので、一度開いたものは
 * 通信なしで開けるようにする。
 * ビルド出力のファイル名にはハッシュが付くため、事前に列挙せず
 * 実際に読まれたものをキャッシュしていく方式にする。
 */
const CACHE = "fw-assistant-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(["./", "./index.html"])).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // 画面遷移は最新を優先し、オフライン時だけキャッシュに落とす
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r ?? Response.error())),
    );
    return;
  }

  // ファイル名にハッシュが付く資産はキャッシュ優先で問題ない
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ??
        fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
