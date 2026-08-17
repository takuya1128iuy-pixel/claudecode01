import { useEffect, useMemo, useState } from "react";
import GradeList from "./components/GradeList";
import Home from "./components/Home";
import LessonList from "./components/LessonList";
import Quiz from "./components/Quiz";
import RecordScreen from "./components/RecordScreen";
import Result from "./components/Result";
import {
  dueEntries,
  emptyStore,
  loadStore,
  masteredCount,
  recordAnswer,
  saveStore,
  streak,
  type Store,
} from "./lib/progress";
import { buildQuestions } from "./lib/quiz";
import type { Answer, Grade, KanjiEntry, Question, QuizMode } from "./types";

type Screen =
  | { name: "home" }
  | { name: "grades" }
  | { name: "lessons"; grade: Grade }
  | { name: "quiz"; title: string; questions: Question[] }
  | { name: "result"; title: string; answers: Answer[] }
  | { name: "record" };

/** 1回のセッションでの最大問題数。長すぎて飽きないように区切る。 */
const MAX_QUESTIONS = 20;

export default function App() {
  const [store, setStore] = useState<Store>(() => loadStore());
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const due = useMemo(() => dueEntries(store), [store]);

  const setMode = (mode: QuizMode) => setStore((prev) => ({ ...prev, mode }));

  const startQuiz = (entries: KanjiEntry[], title: string) => {
    if (entries.length === 0) return;
    const questions = buildQuestions(entries, store.mode, MAX_QUESTIONS);
    setScreen({ name: "quiz", title, questions });
  };

  const handleAnswer = (answer: Answer) => {
    setStore((prev) => recordAnswer(prev, answer.question.entry, answer.correct));
  };

  switch (screen.name) {
    case "quiz":
      return (
        <Quiz
          title={screen.title}
          questions={screen.questions}
          onAnswer={handleAnswer}
          onFinish={(answers) =>
            setScreen({ name: "result", title: screen.title, answers })
          }
          onQuit={() => setScreen({ name: "home" })}
        />
      );

    case "result":
      return (
        <Result
          title={screen.title}
          answers={screen.answers}
          onRetryWrong={(entries) => startQuiz(entries, `${screen.title}（なおし）`)}
          onHome={() => setScreen({ name: "home" })}
        />
      );

    case "grades":
      return (
        <GradeList
          store={store}
          onSelect={(grade) => setScreen({ name: "lessons", grade })}
          onBack={() => setScreen({ name: "home" })}
        />
      );

    case "lessons":
      return (
        <LessonList
          grade={screen.grade}
          store={store}
          mode={store.mode}
          onChangeMode={setMode}
          onStart={startQuiz}
          onBack={() => setScreen({ name: "grades" })}
        />
      );

    case "record":
      return (
        <RecordScreen
          store={store}
          onBack={() => setScreen({ name: "home" })}
          onReset={() => {
            setStore(emptyStore());
            setScreen({ name: "home" });
          }}
        />
      );

    default:
      return (
        <Home
          mode={store.mode}
          onChangeMode={setMode}
          dueCount={due.length}
          streakDays={streak(store)}
          masteredTotal={masteredCount(store)}
          onStartReview={() => startQuiz(due, "きょうの ふくしゅう")}
          onOpenGrades={() => setScreen({ name: "grades" })}
          onOpenRecord={() => setScreen({ name: "record" })}
        />
      );
  }
}
