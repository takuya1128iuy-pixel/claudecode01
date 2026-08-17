import { useState } from "react";
import type { Answer, Question } from "../types";
import { isSameReading } from "../lib/kana";
import WritingPad from "./WritingPad";

interface Props {
  title: string;
  questions: Question[];
  /** テストモードかどうか */
  isTest?: boolean;
  /** 1問こたえるたびに呼ばれる（とちゅうでやめても記録が残るように） */
  onAnswer: (answer: Answer) => void;
  onFinish: (answers: Answer[]) => void;
  onQuit: () => void;
}

type Phase = "answering" | "checking" | "feedback";

export default function Quiz({ title, questions, isTest = false, onAnswer, onFinish, onQuit }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [phase, setPhase] = useState<Phase>("answering");
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);

  const question = questions[index];
  const { entry, item } = question;

  const judge = (isCorrect: boolean) => {
    setCorrect(isCorrect);
    setPhase("feedback");
  };

  const next = () => {
    const answer: Answer = { question, correct };
    const nextAnswers = [...answers, answer];
    onAnswer(answer);
    setAnswers(nextAnswers);
    setInput("");
    setSelected(null);
    setPhase("answering");
    if (index + 1 >= questions.length) {
      onFinish(nextAnswers);
    } else {
      setIndex(index + 1);
    }
  };

  const blank = (content: string, tone: "kana" | "kanji") => (
    <span
      className={`mx-1 inline-block rounded-xl border-2 border-dashed px-3 py-1 align-middle ${
        tone === "kana"
          ? "border-blue-400 bg-blue-50 text-blue-700"
          : "border-amber-400 bg-amber-50 text-amber-800"
      }`}
    >
      {content}
    </span>
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-4 pt-4 pb-8">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onQuit}
          className="rounded-full bg-white px-4 py-2 text-base font-bold text-slate-500 shadow-sm"
        >
          やめる
        </button>
        <div className="flex-1">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-400">
            {isTest && (
              <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs font-black text-white">
                テスト 1もん{Math.round(100 / questions.length)}点
              </span>
            )}
            {title}
          </p>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${isTest ? "bg-violet-500" : "bg-blue-500"}`}
              style={{ width: `${((index + (phase === "feedback" ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-lg font-black text-slate-500">
          {index + 1}
          <span className="text-sm font-bold text-slate-400"> / {questions.length}</span>
        </p>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-2xl leading-relaxed font-bold sm:text-3xl">
          {question.before}
          {question.mode === "write" && blank(item.reading, "kana")}
          {question.mode === "choice" && (
            <span className="mx-1 inline-flex flex-col items-center align-middle">
              <span className="rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 px-3 py-1 text-amber-800">
                {question.masked}
              </span>
              <span className="text-sm font-bold text-slate-400">{item.reading}</span>
            </span>
          )}
          {question.mode === "reading" && blank(item.word, "kanji")}
          {question.after}
        </p>
        <p className="mt-3 text-base font-bold text-slate-400">
          {question.mode === "write" && "青いところを 漢字で 書こう"}
          {question.mode === "choice" && "□に 入る 漢字を えらぼう"}
          {question.mode === "reading" && "オレンジのところの 読みを ひらがなで 書こう"}
        </p>
      </section>

      {question.mode === "write" && (
        <div className="flex flex-col items-center gap-4">
          {phase !== "feedback" && <WritingPad key={question.id} />}
          {phase === "answering" && (
            <button
              type="button"
              onClick={() => setPhase("checking")}
              className="w-full max-w-sm rounded-full bg-blue-600 px-6 py-4 text-xl font-black text-white shadow-md active:bg-blue-700"
            >
              こたえを 見る
            </button>
          )}
          {phase === "checking" && (
            <div className="flex w-full flex-col items-center gap-4">
              <div className="rounded-3xl border-4 border-blue-200 bg-white px-8 py-4 text-center">
                <p className="text-sm font-bold text-slate-400">おてほん</p>
                <p className="font-kyokasho text-6xl font-medium sm:text-7xl">{item.word}</p>
              </div>
              <p className="text-lg font-bold text-slate-500">じぶんの 字と くらべてみよう</p>
              <div className="flex w-full max-w-sm gap-3">
                <button
                  type="button"
                  onClick={() => judge(true)}
                  className="flex-1 rounded-full bg-emerald-500 px-6 py-4 text-xl font-black text-white shadow-md active:bg-emerald-600"
                >
                  ⭕️ あってた
                </button>
                <button
                  type="button"
                  onClick={() => judge(false)}
                  className="flex-1 rounded-full bg-rose-500 px-6 py-4 text-xl font-black text-white shadow-md active:bg-rose-600"
                >
                  ❌ まちがえた
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {question.mode === "choice" && phase !== "feedback" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {question.choices?.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => {
                setSelected(choice);
                judge(choice === entry.char);
              }}
              className={`font-kyokasho aspect-square rounded-3xl bg-white text-6xl font-medium shadow-sm active:bg-blue-50 sm:text-7xl ${
                selected === choice ? "ring-4 ring-blue-400" : ""
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {question.mode === "reading" && phase !== "feedback" && (
        <div className="flex flex-col items-center gap-4">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing && input.trim()) {
                judge(isSameReading(input, item.reading));
              }
            }}
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            enterKeyHint="done"
            placeholder="ひらがなで にゅうりょく"
            className="w-full max-w-sm rounded-2xl border-4 border-slate-200 bg-white px-5 py-4 text-center text-3xl font-bold outline-none focus:border-blue-400"
          />
          <button
            type="button"
            disabled={!input.trim()}
            onClick={() => judge(isSameReading(input, item.reading))}
            className="w-full max-w-sm rounded-full bg-blue-600 px-6 py-4 text-xl font-black text-white shadow-md active:bg-blue-700 disabled:opacity-40"
          >
            こたえあわせ
          </button>
        </div>
      )}

      {phase === "feedback" && (
        <div
          className={`flex flex-col items-center gap-3 rounded-3xl p-6 text-center ${
            correct ? "bg-emerald-50" : "bg-rose-50"
          }`}
        >
          <p className={`text-5xl ${correct ? "text-emerald-500" : "text-rose-500"}`}>
            {correct ? "⭕️" : "❌"}
          </p>
          <p className="font-kyokasho text-6xl font-medium">{item.word}</p>
          <p className="text-xl font-bold text-slate-500">{item.reading}</p>
          <p className="text-base text-slate-500">
            {entry.char}（{entry.strokes}かく）
            {entry.on.length > 0 && ` 音: ${entry.on.join("・")}`}
            {entry.kun.length > 0 && ` 訓: ${entry.kun.join("・")}`}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-2 w-full max-w-sm rounded-full bg-slate-800 px-6 py-4 text-xl font-black text-white shadow-md active:bg-slate-900"
          >
            {index + 1 >= questions.length ? "けっかを 見る" : "つぎへ →"}
          </button>
        </div>
      )}
    </div>
  );
}
