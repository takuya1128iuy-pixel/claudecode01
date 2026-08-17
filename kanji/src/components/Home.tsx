import { levelInfo } from "../lib/level";
import { masteredCount, streak, type UserProfile } from "../lib/store";
import type { QuizMode } from "../types";
import ModeSelector from "./ModeSelector";

interface Props {
  user: UserProfile;
  mode: QuizMode;
  onChangeMode: (mode: QuizMode) => void;
  dueCount: number;
  onStartReview: () => void;
  onOpenGrades: (purpose: "practice" | "test") => void;
  onOpenRecord: () => void;
  onSwitchUser: () => void;
}

export default function Home({
  user,
  mode,
  onChangeMode,
  dueCount,
  onStartReview,
  onOpenGrades,
  onOpenRecord,
  onSwitchUser,
}: Props) {
  const info = levelInfo(user.xp);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-5 pb-10">
      <button
        type="button"
        onClick={onSwitchUser}
        className="flex items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm active:bg-slate-50"
      >
        <span className="text-4xl">{user.emoji}</span>
        <span className="flex-1">
          <span className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-700">{user.name}</span>
            <span className="text-sm font-bold text-blue-600">
              レベル {info.level}・{info.title}
            </span>
          </span>
          <span className="mt-1 block h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <span
              className="block h-full rounded-full bg-blue-500"
              style={{ width: `${Math.round(info.ratio * 100)}%` }}
            />
          </span>
          <span className="mt-1 block text-xs font-bold text-slate-400">
            つぎのレベルまで あと {info.needed - info.current}
          </span>
        </span>
        <span className="text-sm font-bold text-slate-400">きりかえ</span>
      </button>

      <header className="text-center">
        <h1 className="text-3xl font-black tracking-wide text-blue-700">かんじドリル</h1>
        <p className="mt-1 text-sm font-bold text-slate-400">小学生の 漢字 1026字</p>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-3xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400">れんぞく</p>
          <p className="text-2xl font-black text-orange-500">{streak(user)}日</p>
        </div>
        <div className="rounded-3xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400">おぼえた</p>
          <p className="text-2xl font-black text-emerald-500">{masteredCount(user)}字</p>
        </div>
        <div className="rounded-3xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400">けいけんち</p>
          <p className="text-2xl font-black text-blue-600">{user.xp}</p>
        </div>
      </section>

      <ModeSelector mode={mode} onChange={onChangeMode} />

      <button
        type="button"
        onClick={onStartReview}
        disabled={dueCount === 0}
        className="rounded-3xl bg-orange-500 px-6 py-5 text-left text-white shadow-md active:bg-orange-600 disabled:bg-slate-300 disabled:shadow-none"
      >
        <span className="block text-2xl font-black">きょうの ふくしゅう</span>
        <span className="block text-base font-bold opacity-90">
          {dueCount > 0 ? `${dueCount}もん たまっているよ` : "いまは ふくしゅうする漢字が ないよ"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onOpenGrades("practice")}
        className="rounded-3xl bg-blue-600 px-6 py-5 text-left text-white shadow-md active:bg-blue-700"
      >
        <span className="block text-2xl font-black">れんしゅうする</span>
        <span className="block text-base font-bold opacity-90">1年生〜6年生・回ごとに 練習</span>
      </button>

      <button
        type="button"
        onClick={() => onOpenGrades("test")}
        className="rounded-3xl bg-violet-600 px-6 py-5 text-left text-white shadow-md active:bg-violet-700"
      >
        <span className="block text-2xl font-black">テストを うける</span>
        <span className="block text-base font-bold opacity-90">100点まんてんで 何点とれるかな</span>
      </button>

      <button
        type="button"
        onClick={onOpenRecord}
        className="rounded-3xl bg-white px-6 py-4 text-left shadow-sm active:bg-slate-50"
      >
        <span className="block text-xl font-black text-slate-700">きろくを 見る</span>
        <span className="block text-sm font-bold text-slate-400">テストの点数・にがてな漢字</span>
      </button>
    </div>
  );
}
