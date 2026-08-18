import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Backup from "./components/Backup";
import GradeList from "./components/GradeList";
import Home from "./components/Home";
import LessonList from "./components/LessonList";
import ParentScreen from "./components/ParentScreen";
import Quiz from "./components/Quiz";
import RecordScreen from "./components/RecordScreen";
import Result from "./components/Result";
import UserSelect from "./components/UserSelect";
import { requestPersistentStorage } from "./lib/backup";
import { buildDailySummary, sendWebhook } from "./lib/notify";
import { XP_PERFECT_BONUS } from "./lib/level";
import { buildQuestions } from "./lib/quiz";
import {
  bestScore,
  currentUser,
  dayKey,
  dueEntries,
  loadStore,
  newUser,
  recordAnswer,
  recordTest,
  saveStore,
  updateUser,
  type ParentSettings,
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
  | { name: "backup" }
  | { name: "parent" };

/** 練習1回ぶんの最大問題数。テストは回が10問、学年まとめが20問。 */
const MAX_PRACTICE = 20;
const LESSON_TEST_COUNT = 10;
const GRADE_TEST_COUNT = 20;

export default function App() {
  const [store, setStore] = useState<Store>(() => loadStore());
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  const storeRef = useRef(store);
  storeRef.current = store;
  /** 前の問題に答えた時こく。学習時間の計算に使う。 */
  const lastAnswerAt = useRef<number | null>(null);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  // ブラウザに「このデータを勝手に消さないで」とお願いしておく
  useEffect(() => {
    void requestPersistentStorage();
  }, []);

  /**
   * ほごしゃへ「1日のまとめ」を送る。
   * includeToday が false のときは、まだ送っていない過去の日ぶんだけ送る。
   */
  const flushDailySummaries = useCallback(async (includeToday: boolean) => {
    const current = storeRef.current;
    const { webhookUrl, enabled } = current.parent;
    if (!enabled || webhookUrl.trim() === "") return;

    const today = dayKey();
    const sent: { userId: string; day: string }[] = [];
    for (const user of current.users) {
      for (const [day, stat] of Object.entries(user.daily)) {
        if (stat.questions === 0 || user.notifiedDays.includes(day)) continue;
        if (day === today && !includeToday) continue;
        const result = await sendWebhook(webhookUrl, buildDailySummary(user, day, stat));
        if (result !== "error") sent.push({ userId: user.id, day });
      }
    }
    if (sent.length === 0) return;
    setStore((prev) => ({
      ...prev,
      users: prev.users.map((user) => {
        const days = sent.filter((item) => item.userId === user.id).map((item) => item.day);
        return days.length > 0 ? { ...user, notifiedDays: [...user.notifiedDays, ...days] } : user;
      }),
    }));
  }, []);

  // 開いたときに、送りそびれた日ぶんを送る
  useEffect(() => {
    void flushDailySummaries(false);
  }, [flushDailySummaries]);

  // アプリを閉じた（別の画面に移った）ときに、その日のまとめを送る
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flushDailySummaries(true);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flushDailySummaries]);

  const user = currentUser(store);
  const due = useMemo(() => (user ? dueEntries(user) : []), [user]);

  const patchUser = (update: (user: UserProfile) => UserProfile) => {
    if (!user) return;
    setStore((prev) => updateUser(prev, user.id, update));
  };

  /** 前の問題からの経過秒。長い中断は2分までとして学習時間に足す。 */
  const secondsSinceLastAnswer = () => {
    const now = Date.now();
    const previous = lastAnswerAt.current;
    lastAnswerAt.current = now;
    if (previous === null) return 5; // 1問目はだいたい5秒として数える
    return Math.min(120, Math.round((now - previous) / 1000));
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
    const result = {
      title,
      grade: test.grade,
      lesson: test.lesson,
      mode: user.mode,
      score,
      correct,
      total: answers.length,
    };
    // 直前の解答も反映されるよう、かならず最新のユーザーに対して記録する
    setStore((prev) => updateUser(prev, user.id, (latest) => recordTest(latest, result).user));

    const previousBest = bestScore(user, test.grade, test.lesson);
    setScreen({
      name: "result",
      title,
      answers,
      test: {
        score,
        gainedXp: score + (score === 100 ? XP_PERFECT_BONUS : 0),
        best: previousBest === null || score > previousBest,
      },
    });
  };

  if (screen.name === "parent") {
    return (
      <ParentScreen
        store={store}
        onChange={(parent: ParentSettings) => setStore((prev) => ({ ...prev, parent }))}
        onBack={() => setScreen(user ? { name: "home" } : { name: "users" })}
      />
    );
  }

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
        onOpenParent={() => setScreen({ name: "parent" })}
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
          onAnswer={(answer) => {
            const seconds = secondsSinceLastAnswer();
            patchUser((prev) =>
              recordAnswer(prev, answer.question.entry, answer.correct, screen.test === null, seconds),
            );
          }}
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
