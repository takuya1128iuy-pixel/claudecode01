import { useEffect, useRef, useState } from "react";
import {
  backupText,
  isStoragePersisted,
  mergeUsers,
  parseBackup,
  requestPersistentStorage,
  saveBackupFile,
} from "../lib/backup";
import type { Store } from "../lib/store";
import ScreenHeader from "./ScreenHeader";

interface Props {
  store: Store;
  onImport: (store: Store) => void;
  onBack: () => void;
}

export default function Backup({ store, onImport, onBack }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    isStoragePersisted().then(setPersisted);
  }, []);

  const load = (text: string) => {
    const users = parseBackup(text);
    if (!users) {
      setMessage("⚠️ バックアップの中身が読み取れませんでした");
      return;
    }
    const result = mergeUsers(store, users);
    onImport(result.store);
    setPasted("");
    setMessage(`✅ ${result.added}人ぶん 追加、${result.updated}人ぶん 上書きしました`);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-10">
      <ScreenHeader title="きろくの バックアップ" onBack={onBack} />

      <p className="rounded-3xl bg-white p-5 text-base leading-relaxed font-bold text-slate-500 shadow-sm">
        きろくは この端末の中だけに 保存されています。
        機種を変えるときや、iPad と iPhone の両方で使いたいときは、ここでファイルに書き出して
        もう一方で読みこんでください。
      </p>

      {message && (
        <p className="rounded-2xl bg-blue-50 px-5 py-4 text-base font-bold text-blue-700">{message}</p>
      )}

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">書き出す</p>
        <p className="mt-1 text-sm font-bold text-slate-400">
          いま登録されているのは {store.users.length}人ぶんです
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={async () => {
              const how = await saveBackupFile(backupText(store));
              setMessage(
                how === "shared"
                  ? "✅ 共有メニューから「ファイルに保存」を選べます"
                  : "✅ バックアップファイルを書き出しました",
              );
            }}
            className="rounded-full bg-blue-600 px-6 py-4 text-lg font-black text-white active:bg-blue-700"
          >
            ファイルに ほぞん
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(backupText(store));
                setMessage("✅ バックアップの文字をコピーしました");
              } catch {
                setMessage("⚠️ コピーできませんでした。下の枠の文字を選んでコピーしてください");
              }
            }}
            className="rounded-full border-2 border-blue-200 px-6 py-4 text-lg font-black text-blue-700"
          >
            文字を コピー
          </button>
        </div>
        <textarea
          readOnly
          value={backupText(store)}
          className="mt-3 h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-500"
        />
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">読みこむ</p>
        <p className="mt-1 text-sm font-bold text-slate-400">
          同じ人の記録は、進んでいるほう（けいけんちが多いほう）を残します
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json,text/plain"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            load(await file.text());
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="mt-3 w-full rounded-full bg-emerald-600 px-6 py-4 text-lg font-black text-white active:bg-emerald-700"
        >
          ファイルから 読みこむ
        </button>
        <textarea
          value={pasted}
          onChange={(event) => setPasted(event.target.value)}
          placeholder="コピーしたバックアップの文字を ここに はりつけてもOK"
          className="mt-3 h-24 w-full rounded-2xl border-2 border-slate-200 p-3 font-mono text-xs outline-none focus:border-blue-400"
        />
        <button
          type="button"
          disabled={!pasted.trim()}
          onClick={() => load(pasted)}
          className="mt-2 w-full rounded-full border-2 border-emerald-200 px-6 py-3 text-lg font-black text-emerald-700 disabled:opacity-40"
        >
          はりつけた 文字から 読みこむ
        </button>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">きろくの 消えにくさ</p>
        <p className="mt-1 text-base font-bold text-slate-400">
          {persisted === null
            ? "調べています…"
            : persisted
              ? "✅ このブラウザは 記録を 勝手に消さない設定になっています"
              : "このブラウザは しばらく使わないと 記録を消すことがあります"}
        </p>
        {persisted === false && (
          <button
            type="button"
            onClick={async () => {
              const ok = await requestPersistentStorage();
              setPersisted(ok);
              setMessage(
                ok
                  ? "✅ 記録を消さない設定に できました"
                  : "この端末では 設定できませんでした。ときどきバックアップを取ってください",
              );
            }}
            className="mt-3 w-full rounded-full bg-slate-800 px-6 py-4 text-lg font-black text-white active:bg-slate-900"
          >
            消えないように おねがいする
          </button>
        )}
      </section>
    </div>
  );
}
