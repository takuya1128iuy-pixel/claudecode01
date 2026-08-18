import { useState } from "react";
import { levelInfo } from "../lib/level";
import { AVATARS, type UserProfile } from "../lib/store";

interface Props {
  users: UserProfile[];
  currentUserId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string, emoji: string) => void;
  onDelete: (id: string) => void;
  onOpenBackup: () => void;
  onOpenParent: () => void;
  onBack: (() => void) | null;
}

export default function UserSelect({
  users,
  currentUserId,
  onSelect,
  onCreate,
  onDelete,
  onOpenBackup,
  onOpenParent,
  onBack,
}: Props) {
  const [adding, setAdding] = useState(users.length === 0);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(AVATARS[0]);

  const create = () => {
    if (!name.trim()) return;
    onCreate(name, emoji);
    setName("");
    setEmoji(AVATARS[(AVATARS.indexOf(emoji) + 1) % AVATARS.length]);
    setAdding(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pt-8 pb-10">
      <header className="text-center">
        <h1 className="text-3xl font-black text-blue-700">だれが つかう？</h1>
        <p className="mt-1 text-base font-bold text-slate-400">
          きょうだいで べつべつに きろくを のこせます
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {users.map((user) => {
          const info = levelInfo(user.xp);
          return (
            <div
              key={user.id}
              className={`rounded-3xl bg-white p-5 shadow-sm ${
                user.id === currentUserId ? "ring-4 ring-blue-400" : ""
              }`}
            >
              <button type="button" onClick={() => onSelect(user.id)} className="flex w-full items-center gap-4 text-left">
                <span className="text-5xl">{user.emoji}</span>
                <span>
                  <span className="block text-2xl font-black text-slate-700">{user.name}</span>
                  <span className="block text-sm font-bold text-slate-400">
                    レベル {info.level}・{info.title}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`${user.name}の きろくを ぜんぶ けしますか？`)) onDelete(user.id);
                }}
                className="mt-3 text-sm font-bold text-slate-300"
              >
                このユーザーを けす
              </button>
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-lg font-black text-slate-600">なまえを いれてね</p>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing) create();
            }}
            maxLength={12}
            placeholder="なまえ"
            className="mt-3 w-full rounded-2xl border-4 border-slate-200 px-5 py-4 text-center text-2xl font-bold outline-none focus:border-blue-400"
          />
          <p className="mt-4 text-lg font-black text-slate-600">アイコンを えらぼう</p>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {AVATARS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setEmoji(item)}
                className={`aspect-square rounded-2xl text-3xl ${
                  emoji === item ? "bg-blue-100 ring-4 ring-blue-400" : "bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={create}
              disabled={!name.trim()}
              className="flex-1 rounded-full bg-blue-600 px-6 py-4 text-xl font-black text-white shadow-md active:bg-blue-700 disabled:opacity-40"
            >
              つくる
            </button>
            {users.length > 0 && (
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-full border border-slate-300 px-6 py-4 text-lg font-bold text-slate-500"
              >
                やめる
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-3xl border-4 border-dashed border-slate-300 px-6 py-6 text-xl font-black text-slate-500"
        >
          ＋ あたらしく つくる
        </button>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={onOpenParent}
          className="rounded-full px-5 py-3 text-base font-bold text-slate-400 underline"
        >
          ほごしゃメニュー
        </button>
        <button
          type="button"
          onClick={onOpenBackup}
          className="rounded-full px-5 py-3 text-base font-bold text-slate-400 underline"
        >
          きろくの バックアップ
        </button>
      </div>

      {onBack && users.length > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="self-center rounded-full px-6 py-3 text-base font-bold text-slate-400"
        >
          もどる
        </button>
      )}
    </div>
  );
}
