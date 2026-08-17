import { GRADES } from "../data";
import { masteredCount, type Store } from "../lib/progress";
import type { Grade } from "../types";
import ScreenHeader from "./ScreenHeader";

interface Props {
  store: Store;
  onSelect: (grade: Grade) => void;
  onBack: () => void;
}

export default function GradeList({ store, onSelect, onBack }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-10">
      <ScreenHeader title="学年を えらぶ" onBack={onBack} />
      <div className="grid gap-3 sm:grid-cols-2">
        {GRADES.map((info) => {
          const mastered = masteredCount(store, info.grade);
          const ratio = info.ready === 0 ? 0 : Math.round((mastered / info.ready) * 100);
          const disabled = info.ready === 0;
          return (
            <button
              key={info.grade}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(info.grade)}
              className={`rounded-3xl p-5 text-left shadow-sm ${
                disabled ? "bg-slate-100 text-slate-400" : "bg-white active:bg-blue-50"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black">{info.label}</span>
                <span className="text-sm font-bold text-slate-400">
                  {disabled ? "じゅんび中" : `${info.ready}字 / 全${info.total}字`}
                </span>
              </div>
              {!disabled && (
                <>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-400">
                    おぼえた {mastered}字（{ratio}%）
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm text-slate-400">
        「じゅんび中」の学年は これから 例文データを 追加していきます
      </p>
    </div>
  );
}
