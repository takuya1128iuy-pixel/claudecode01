import type { QuizMode } from "../types";
import ModeSelector from "./ModeSelector";

interface Props {
  mode: QuizMode;
  onChangeMode: (mode: QuizMode) => void;
  dueCount: number;
  streakDays: number;
  masteredTotal: number;
  onStartReview: () => void;
  onOpenGrades: () => void;
  onOpenRecord: () => void;
}

export default function Home({
  mode,
  onChangeMode,
  dueCount,
  streakDays,
  masteredTotal,
  onStartReview,
  onOpenGrades,
  onOpenRecord,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pt-6 pb-10">
      <header className="text-center">
        <h1 className="text-4xl font-black tracking-wide text-blue-700">かんじドリル</h1>
        <p className="mt-1 text-base font-bold text-slate-400">小学生の 漢字を 毎日 5分</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">れんぞく</p>
          <p className="text-3xl font-black text-orange-500">
            {streakDays}
            <span className="text-lg">日</span>
          </p>
        </div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">おぼえた漢字</p>
          <p className="text-3xl font-black text-emerald-500">
            {masteredTotal}
            <span className="text-lg">字</span>
          </p>
        </div>
      </section>

      <ModeSelector mode={mode} onChange={onChangeMode} />

      <button
        type="button"
        onClick={onStartReview}
        disabled={dueCount === 0}
        className="rounded-3xl bg-orange-500 px-6 py-6 text-left text-white shadow-md active:bg-orange-600 disabled:bg-slate-300 disabled:shadow-none"
      >
        <span className="block text-2xl font-black">きょうの ふくしゅう</span>
        <span className="block text-base font-bold opacity-90">
          {dueCount > 0 ? `${dueCount}もん たまっているよ` : "いまは ふくしゅうする漢字が ないよ"}
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenGrades}
        className="rounded-3xl bg-blue-600 px-6 py-6 text-left text-white shadow-md active:bg-blue-700"
      >
        <span className="block text-2xl font-black">学年を えらぶ</span>
        <span className="block text-base font-bold opacity-90">1年生〜6年生の 回ごとに 練習する</span>
      </button>

      <button
        type="button"
        onClick={onOpenRecord}
        className="rounded-3xl bg-white px-6 py-5 text-left shadow-sm active:bg-slate-50"
      >
        <span className="block text-xl font-black text-slate-700">きろくを 見る</span>
        <span className="block text-sm font-bold text-slate-400">がんばった日と にがてな漢字</span>
      </button>
    </div>
  );
}
