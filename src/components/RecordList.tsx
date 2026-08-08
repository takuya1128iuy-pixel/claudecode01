import type { TastingRecord } from "../types";
import StarRating from "./StarRating";

interface Props {
  records: TastingRecord[];
  onDelete: (id: string) => void;
}

export default function RecordList({ records, onDelete }: Props) {
  if (records.length === 0) {
    return (
      <div className="text-center text-stone-400 py-16 border border-dashed border-stone-300 rounded-xl bg-white">
        まだ記録がありません。「記録を追加」から最初の一杯を記録してみましょう。
      </div>
    );
  }

  const sorted = [...records].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((r) => (
        <div
          key={r.id}
          className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col text-left"
        >
          <div className="h-36 bg-[color:var(--color-washi)] flex items-center justify-center overflow-hidden">
            {r.photo ? (
              <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🍶</span>
            )}
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[color:var(--color-indigo)] leading-tight">
                  {r.name}
                </h3>
                {r.brewery && <p className="text-xs text-stone-400 mt-0.5">{r.brewery}</p>}
              </div>
              <button
                onClick={() => onDelete(r.id)}
                className="text-stone-300 hover:text-[color:var(--color-seal)] text-xs shrink-0"
                aria-label="削除"
              >
                削除
              </button>
            </div>
            <StarRating value={r.rating} readOnly size={16} />
            <div className="flex flex-wrap gap-1">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[color:var(--color-washi)] text-stone-600">
                {r.category}
              </span>
              {r.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
                >
                  {t}
                </span>
              ))}
            </div>
            {r.note && <p className="text-xs text-stone-500 line-clamp-2">{r.note}</p>}
            <p className="text-[11px] text-stone-300 mt-auto">{r.drankAt}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
