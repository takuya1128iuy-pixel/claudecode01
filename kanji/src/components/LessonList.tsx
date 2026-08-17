import { gradeInfo, lessonsOf } from "../data";
import { bestScore, MASTER_LEVEL, type UserProfile } from "../lib/store";
import type { Grade, KanjiEntry, QuizMode } from "../types";
import ModeSelector from "./ModeSelector";
import ScreenHeader from "./ScreenHeader";

interface Props {
  grade: Grade;
  user: UserProfile;
  mode: QuizMode;
  purpose: "practice" | "test";
  onChangeMode: (mode: QuizMode) => void;
  onPractice: (entries: KanjiEntry[], title: string) => void;
  onTest: (entries: KanjiEntry[], title: string, lesson: number | null) => void;
  onBack: () => void;
}

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score === 100
      ? "bg-amber-100 text-amber-700"
      : score >= 80
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-500";
  return <span className={`rounded-full px-3 py-1 text-sm font-black ${tone}`}>さいこう {score}点</span>;
}

export default function LessonList({
  grade,
  user,
  mode,
  purpose,
  onChangeMode,
  onPractice,
  onTest,
  onBack,
}: Props) {
  const info = gradeInfo(grade);
  const lessons = lessonsOf(grade);

  const masteredIn = (entries: KanjiEntry[]) =>
    entries.filter((entry) => (user.progress[entry.char]?.level ?? 0) >= MASTER_LEVEL).length;

  const gradeBest = bestScore(user, grade, null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-10">
      <ScreenHeader title={`${info.label}の 漢字（${info.total}字）`} onBack={onBack} />
      <ModeSelector mode={mode} onChange={onChangeMode} />

      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-black text-slate-700">学年まとめ</p>
          {gradeBest !== null && <ScoreBadge score={gradeBest} />}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onPractice(info.entries, `${info.label} まとめて`)}
            className="flex-1 rounded-full bg-blue-600 px-4 py-3 text-lg font-black text-white active:bg-blue-700"
          >
            れんしゅう
          </button>
          <button
            type="button"
            onClick={() => onTest(info.entries, `${info.label} 学年テスト`, null)}
            className="flex-1 rounded-full bg-violet-600 px-4 py-3 text-lg font-black text-white active:bg-violet-700"
          >
            テスト（20問）
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {lessons.map((lesson) => {
          const mastered = masteredIn(lesson.entries);
          const best = bestScore(user, grade, lesson.lesson);
          return (
            <div key={lesson.lesson} className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl font-black text-slate-700">第{lesson.lesson}回</span>
                <span className="flex items-center gap-2">
                  {best !== null && <ScoreBadge score={best} />}
                  <span className="text-sm font-bold text-slate-400">
                    {mastered} / {lesson.entries.length} 字
                  </span>
                </span>
              </div>
              <p className="font-kyokasho mt-2 text-3xl leading-snug font-medium text-slate-800">
                {lesson.entries.map((entry) => entry.char).join(" ")}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onPractice(lesson.entries, `${info.label} 第${lesson.lesson}回`)}
                  className={`flex-1 rounded-full px-4 py-3 text-lg font-black ${
                    purpose === "practice"
                      ? "bg-blue-600 text-white active:bg-blue-700"
                      : "border-2 border-blue-200 text-blue-700"
                  }`}
                >
                  れんしゅう
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onTest(lesson.entries, `${info.label} 第${lesson.lesson}回 テスト`, lesson.lesson)
                  }
                  className={`flex-1 rounded-full px-4 py-3 text-lg font-black ${
                    purpose === "test"
                      ? "bg-violet-600 text-white active:bg-violet-700"
                      : "border-2 border-violet-200 text-violet-700"
                  }`}
                >
                  テスト（10問）
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
