import { useEffect, useMemo, useState } from "react";
import Backup from "./components/Backup";
import GradeList from "./components/GradeList";
import Home from "./components/Home";
import LessonList from "./components/LessonList";
import Quiz from "./components/Quiz";
import RecordScreen from "./components/RecordScreen";
import Result from "./components/Result";
import UserSelect from "./components/UserSelect";
import { requestPersistentStorage } from "./lib/backup";
import { buildQuestions } from "./lib/quiz";
import {
  currentUser,
  dueEntries,
  loadStore,
  newUser,
  recordAnswer,
  recordTest,
  saveStore,
  updateUser,
  type Store,
  type UserProfile,
} from "./lib/store";
import type { Answer, Grade, KanjiEntry, Question, QuizMode } from "./types";

type Purpose = "practice" | "test";

interface TestContext {
  grade: Grade;
  lesson: number | null;
}

type Screen =
  | { name: "users" }
  | { name: "home" }
  | { name: "grades"; purpose: Purpose }
  | { name: "lessons"; grade: Grade; purpose: Purpose }
  | { name: "quiz"; title: string; questions: Question[]; test: TestContext | null }
  | {
      name: "result";
      title: string;
      answers: Answer[];
      test: { score: number; gainedXp: number; best: boolean } | null;
    }
  | { name: "record" }
  | { name: "backup" };

/** 練習1回ぶんの最大問題数。テストは回が10問、学年まとめが20問。 */
const MAX_PRACTICE = 20;
const LESSON_TEST_COUNT = 10;
const GRADE_TEST_COUNT = 20;

export default function App() {
  const [store, setStore] = useState<Store>(() => loadStore());
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  useEffect(() => {
    saveStore(store);
  }, [store]);

  // ブラウザに「このデータを勝手に消さないで」とお願いしておく
  useEffect(() => {
    void requestPersistentStorage();
  }, []);

  const user = currentUser(store);
  const due = useMemo(() => (user ? dueEntries(user) : []), [user]);

  const patchUser = (update: (user: UserProfile) => UserProfile) => {
    if (!user) return;
    setStore((prev) => updateUser(prev, user.id, update));
  };

  const startPractice = (entries: KanjiEntry[], title: string) => {
    if (!user || entries.length === 0) return;
    setScreen({
      name: "quiz",
      title,
      questions: buildQuestions(entries, user.mode, MAX_PRACTICE),
      test: null,
    });
  };

  const startTest = (entries: KanjiEntry[], title: string, grade: Grade, lesson: number | null) => {
    if (!user || entries.length === 0) return;
    const count = lesson === null ? GRADE_TEST_COUNT : LESSON_TEST_COUNT;
    setScreen({
      name: "quiz",
      title,
      questions: buildQuestions(entries, user.mode, count),
      test: { grade, lesson },
    });
  };

  const finishQuiz = (title: string, answers: Answer[], test: TestContext | null) => {
    if (!test || !user) {
      setScreen({ name: "result", title, answers, test: null });
      return;
    }
    const correct = answers.filter((answer) => answer.correct).length;
    const score = Math.round((correct / answers.length) * 100);
    const outcome = recordTest(user, {
      title,
      grade: test.grade,
      lesson: test.lesson,
      mode: user.mode,
      score,
      correct,
      total: answers.length,
    });
    setStore((prev) => updateUser(prev, user.id, () => outcome.user));
    setScreen({
      name: "result",
      title,
      answers,
      test: { score, gainedXp: outcome.gainedXp, best: outcome.best },
    });
  };

  if (screen.name === "backup") {
    return (
      <Backup
        store={store}
        onImport={setStore}
        onBack={() => setScreen(user ? { name: "home" } : { name: "users" })}
      />
    );
  }

  // ユーザーがいない、または選ばれていないときは、まず選んでもらう
  if (!user || screen.name === "users") {
    return (
      <UserSelect
        users={store.users}
        currentUserId={store.currentUserId}
        onSelect={(id) => {
          setStore((prev) => ({ ...prev, currentUserId: id }));
          setScreen({ name: "home" });
        }}
        onCreate={(name, emoji) => {
          const created = newUser(name, emoji);
          setStore((prev) => ({ ...prev, users: [...prev.users, created], currentUserId: created.id }));
          setScreen({ name: "home" });
        }}
        onDelete={(id) =>
          setStore((prev) => {
            const users = prev.users.filter((item) => item.id !== id);
            return {
              ...prev,
              users,
              currentUserId: prev.currentUserId === id ? (users[0]?.id ?? null) : prev.currentUserId,
            };
          })
        }
        onOpenBackup={() => setScreen({ name: "backup" })}
        onBack={user ? () => setScreen({ name: "home" }) : null}
      />
    );
  }

  const setMode = (mode: QuizMode) => patchUser((prev) => ({ ...prev, mode }));

  switch (screen.name) {
    case "quiz":
      return (
        <Quiz
          title={screen.title}
          questions={screen.questions}
          isTest={screen.test !== null}
          onAnswer={(answer) =>
            patchUser((prev) => recordAnswer(prev, answer.question.entry, answer.correct, screen.test === null))
          }
          onFinish={(answers) => finishQuiz(screen.title, answers, screen.test)}
          onQuit={() => setScreen({ name: "home" })}
        />
      );

    case "result":
      return (
        <Result
          title={screen.title}
          answers={screen.answers}
          test={screen.test}
          onRetryWrong={(entries) => startPractice(entries, `${screen.title}（なおし）`)}
          onHome={() => setScreen({ name: "home" })}
        />
      );

    case "grades":
      return (
        <GradeList
          user={user}
          purpose={screen.purpose}
          onSelect={(grade) => setScreen({ name: "lessons", grade, purpose: screen.purpose })}
          onBack={() => setScreen({ name: "home" })}
        />
      );

    case "lessons":
      return (
        <LessonList
          grade={screen.grade}
          user={user}
          mode={user.mode}
          purpose={screen.purpose}
          onChangeMode={setMode}
          onPractice={startPractice}
          onTest={(entries, title, lesson) => startTest(entries, title, screen.grade, lesson)}
          onBack={() => setScreen({ name: "grades", purpose: screen.purpose })}
        />
      );

    case "record":
      return (
        <RecordScreen
          user={user}
          onBack={() => setScreen({ name: "home" })}
          onOpenBackup={() => setScreen({ name: "backup" })}
          onReset={() => {
            patchUser((prev) => ({ ...prev, progress: {}, days: [], tests: [], xp: 0 }));
            setScreen({ name: "home" });
          }}
        />
      );

    default:
      return (
        <Home
          user={user}
          mode={user.mode}
          onChangeMode={setMode}
          dueCount={due.length}
          onStartReview={() => startPractice(due, "きょうの ふくしゅう")}
          onOpenGrades={(purpose) => setScreen({ name: "grades", purpose })}
          onOpenRecord={() => setScreen({ name: "record" })}
          onSwitchUser={() => setScreen({ name: "users" })}
        />
      );
  }
}
