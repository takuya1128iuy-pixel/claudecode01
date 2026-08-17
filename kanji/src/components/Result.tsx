import type { Answer, KanjiEntry } from "../types";

interface Props {
  title: string;
  answers: Answer[];
  onRetryWrong: (entries: KanjiEntry[]) => void;
  onHome: () => void;
}

export default function Result({ title, answers, onRetryWrong, onHome }: Props) {
  const correctCount = answers.filter((answer) => answer.correct).length;
  const wrong = answers.filter((answer) => !answer.correct);
  const perfect = wrong.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pt-8 pb-10">
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-base font-bold text-slate-400">{title}</p>
        <p className="mt-2 text-6xl">{perfect ? "🎉" : "💮"}</p>
        <p className="mt-2 text-5xl font-black text-blue-700">
          {correctCount}
          <span className="text-2xl text-slate-400"> / {answers.length}もん</span>
        </p>
        <p className="mt-2 text-lg font-bold text-slate-500">
          {perfect ? "ぜんもん せいかい！ すごい！" : "まちがえた漢字は また 出てくるよ"}
        </p>
      </div>

      {wrong.length > 0 && (
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-lg font-black text-slate-600">まちがえた漢字</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {wrong.map((answer) => (
              <li
                key={answer.question.id}
                className="flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3"
              >
                <span className="font-kyokasho text-4xl font-medium text-rose-700">
                  {answer.question.entry.char}
                </span>
                <span>
                  <span className="block text-lg font-bold text-slate-700">
                    {answer.question.item.word}
                  </span>
                  <span className="block text-sm font-bold text-slate-400">
                    {answer.question.item.reading}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onRetryWrong(wrong.map((answer) => answer.question.entry))}
            className="mt-4 w-full rounded-full bg-rose-500 px-6 py-4 text-xl font-black text-white shadow-md active:bg-rose-600"
          >
            まちがえた漢字を もう一度
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onHome}
        className="rounded-full bg-slate-800 px-6 py-4 text-xl font-black text-white shadow-md active:bg-slate-900"
      >
        ホームへ もどる
      </button>
    </div>
  );
}
