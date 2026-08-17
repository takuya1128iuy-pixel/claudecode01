import { QUIZ_MODES, type QuizMode } from "../types";

interface Props {
  mode: QuizMode;
  onChange: (mode: QuizMode) => void;
}

export default function ModeSelector({ mode, onChange }: Props) {
  const current = QUIZ_MODES.find((item) => item.id === mode);
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-200 p-1.5">
        {QUIZ_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-xl px-2 py-3 text-base font-black transition ${
              mode === item.id ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"
            }`}
          >
            <span className="mr-1">{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-sm font-bold text-slate-400">{current?.hint}</p>
    </div>
  );
}
