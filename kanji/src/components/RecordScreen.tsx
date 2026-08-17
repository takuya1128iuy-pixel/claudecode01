import { GRADES } from "../data";
import { levelInfo } from "../lib/level";
import { dayKey, masteredCount, streak, weakEntries, type UserProfile } from "../lib/store";
import ScreenHeader from "./ScreenHeader";

interface Props {
  user: UserProfile;
  onBack: () => void;
  onReset: () => void;
}

/** 直近14日ぶんの学習カレンダー。 */
function recentDays(user: UserProfile): { key: string; label: string; done: boolean }[] {
  const days = new Set(user.days);
  const list: { key: string; label: string; done: boolean }[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dayKey(date);
    list.push({ key, label: `${date.getDate()}`, done: days.has(key) });
  }
  return list;
}

export default function RecordScreen({ user, onBack, onReset }: Props) {
  const weak = weakEntries(user).slice(0, 24);
  const info = levelInfo(user.xp);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-10">
      <ScreenHeader title={`${user.name}の きろく`} onBack={onBack} />

      <section className="rounded-3xl bg-white p-5 text-center shadow-sm">
        <p className="text-6xl">{user.emoji}</p>
        <p className="mt-2 text-3xl font-black text-blue-700">レベル {info.level}</p>
        <p className="text-base font-bold text-slate-400">{info.title}</p>
        <div className="mx-auto mt-3 h-3 w-full max-w-sm overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.round(info.ratio * 100)}%` }} />
        </div>
        <p className="mt-1 text-sm font-bold text-slate-400">
          けいけんち {user.xp}（つぎまで あと {info.needed - info.current}）
        </p>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">れんぞく</p>
          <p className="text-3xl font-black text-orange-500">{streak(user)}</p>
        </div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">やった日</p>
          <p className="text-3xl font-black text-blue-600">{user.days.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">おぼえた</p>
          <p className="text-3xl font-black text-emerald-500">{masteredCount(user)}</p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">この2週間</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {recentDays(user).map((day) => (
            <div
              key={day.key}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                day.done ? "bg-orange-400 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {day.label}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">テストの きろく</p>
        {user.tests.length === 0 ? (
          <p className="mt-2 text-base font-bold text-slate-400">まだ テストを うけていません</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {user.tests.slice(0, 10).map((test) => (
              <li key={test.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>
                  <span className="block text-base font-bold text-slate-700">{test.title}</span>
                  <span className="block text-xs font-bold text-slate-400">
                    {new Date(test.at).toLocaleDateString("ja-JP")}・{test.correct}/{test.total}もん
                  </span>
                </span>
                <span
                  className={`text-2xl font-black ${
                    test.score === 100
                      ? "text-amber-500"
                      : test.score >= 80
                        ? "text-emerald-500"
                        : "text-slate-500"
                  }`}
                >
                  {test.score}点
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">学年ごとの ようす</p>
        <div className="mt-3 grid gap-3">
          {GRADES.map((grade) => {
            const mastered = masteredCount(user, grade.grade);
            const ratio = Math.round((mastered / grade.ready) * 100);
            return (
              <div key={grade.grade}>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>{grade.label}</span>
                  <span>
                    {mastered} / {grade.total}字
                  </span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${ratio}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">にがてな漢字</p>
        {weak.length === 0 ? (
          <p className="mt-2 text-base font-bold text-slate-400">まだ ありません</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {weak.map((entry) => (
              <span
                key={entry.char}
                className="font-kyokasho rounded-2xl bg-rose-50 px-4 py-2 text-3xl font-medium text-rose-700"
              >
                {entry.char}
              </span>
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(`${user.name}の きろくを ぜんぶ けしますか？`)) onReset();
        }}
        className="mt-2 self-center rounded-full border border-slate-300 px-5 py-2 text-sm font-bold text-slate-400"
      >
        この人の きろくを けす
      </button>
    </div>
  );
}
