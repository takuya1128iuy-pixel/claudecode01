import { GRADES } from "../data";
import { dayKey, masteredCount, streak, weakEntries, type Store } from "../lib/progress";
import ScreenHeader from "./ScreenHeader";

interface Props {
  store: Store;
  onBack: () => void;
  onReset: () => void;
}

/** 直近14日ぶんの学習カレンダー。 */
function recentDays(store: Store): { key: string; label: string; done: boolean }[] {
  const days = new Set(store.days);
  const list: { key: string; label: string; done: boolean }[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dayKey(date);
    list.push({ key, label: `${date.getDate()}`, done: days.has(key) });
  }
  return list;
}

export default function RecordScreen({ store, onBack, onReset }: Props) {
  const weak = weakEntries(store).slice(0, 20);
  const totalMastered = masteredCount(store);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-10">
      <ScreenHeader title="きろく" onBack={onBack} />

      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">れんぞく</p>
          <p className="text-3xl font-black text-orange-500">{streak(store)}</p>
        </div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">やった日</p>
          <p className="text-3xl font-black text-blue-600">{store.days.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">おぼえた</p>
          <p className="text-3xl font-black text-emerald-500">{totalMastered}</p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-slate-600">この2週間</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {recentDays(store).map((day) => (
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
        <p className="text-lg font-black text-slate-600">学年ごとの ようす</p>
        <div className="mt-3 grid gap-3">
          {GRADES.filter((info) => info.ready > 0).map((info) => {
            const mastered = masteredCount(store, info.grade);
            const ratio = Math.round((mastered / info.ready) * 100);
            return (
              <div key={info.grade}>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>{info.label}</span>
                  <span>
                    {mastered} / {info.ready}字
                  </span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${ratio}%` }}
                  />
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
          if (window.confirm("これまでの きろくを ぜんぶ けしますか？")) onReset();
        }}
        className="mt-2 self-center rounded-full border border-slate-300 px-5 py-2 text-sm font-bold text-slate-400"
      >
        きろくを ぜんぶ けす
      </button>
    </div>
  );
}
