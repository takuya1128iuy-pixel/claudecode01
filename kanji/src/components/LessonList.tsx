import { gradeInfo, lessonsOf } from "../data";
import { MASTER_LEVEL, type Store } from "../lib/progress";
import type { Grade, KanjiEntry, QuizMode } from "../types";
import ModeSelector from "./ModeSelector";
import ScreenHeader from "./ScreenHeader";

interface Props {
  grade: Grade;
  store: Store;
  mode: QuizMode;
  onChangeMode: (mode: QuizMode) => void;
  onStart: (entries: KanjiEntry[], title: string) => void;
  onBack: () => void;
}

export default function LessonList({ grade, store, mode, onChangeMode, onStart, onBack }: Props) {
  const info = gradeInfo(grade);
  const lessons = lessonsOf(grade);

  const masteredIn = (entries: KanjiEntry[]) =>
    entries.filter((entry) => (store.progress[entry.char]?.level ?? 0) >= MASTER_LEVEL).length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-10">
      <ScreenHeader title={`${info.label}の 漢字`} onBack={onBack} />
      <ModeSelector mode={mode} onChange={onChangeMode} />

      <button
        type="button"
        onClick={() => onStart(info.entries, `${info.label} まとめて`)}
        className="rounded-3xl bg-blue-600 px-6 py-4 text-left text-white shadow-md active:bg-blue-700"
      >
        <span className="block text-xl font-black">ぜんぶ まとめて やる</span>
        <span className="block text-sm font-bold opacity-90">{info.ready}もん</span>
      </button>

      <div className="grid gap-3">
        {lessons.map((lesson) => {
          const mastered = masteredIn(lesson.entries);
          return (
            <button
              key={lesson.lesson}
              type="button"
              onClick={() =>
                onStart(lesson.entries, `${info.label} 第${lesson.lesson}回`)
              }
              className="rounded-3xl bg-white p-5 text-left shadow-sm active:bg-blue-50"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-700">第{lesson.lesson}回</span>
                <span className="text-sm font-bold text-slate-400">
                  {mastered} / {lesson.entries.length} 字
                </span>
              </div>
              <p className="font-kyokasho mt-2 text-3xl leading-snug font-medium text-slate-800">
                {lesson.entries.map((entry) => entry.char).join(" ")}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
