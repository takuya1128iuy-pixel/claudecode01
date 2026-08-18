import { entryByChar } from "../data";
import type { Grade, KanjiEntry, QuizMode } from "../types";
import { XP_CORRECT, XP_PERFECT_BONUS, XP_WRONG } from "./level";

const STORAGE_KEY = "kanji-drill-v2";
const OLD_STORAGE_KEY = "kanji-drill-progress-v1";

/** レベルごとの復習間かく（日）。正解するたびに次の間かくへ進む。 */
export const INTERVALS = [1, 2, 4, 7, 14, 30];
export const MAX_LEVEL = INTERVALS.length - 1;
/** これ以上のレベルを「おぼえた」とみなす。 */
export const MASTER_LEVEL = 3;

export const AVATARS = ["🦊", "🐼", "🐧", "🐸", "🦁", "🐰", "🐯", "🐨", "🦄", "🐢", "🐙", "🐝"];

export interface CharProgress {
  char: string;
  grade: Grade;
  level: number;
  correct: number;
  wrong: number;
  lastAt: number;
  dueAt: number;
}

export interface TestResult {
  id: string;
  /** 「4年生 第3回」など */
  title: string;
  grade: Grade;
  lesson: number | null;
  mode: QuizMode;
  /** 100点満点 */
  score: number;
  correct: number;
  total: number;
  at: number;
}

/** 1日ぶんの学習のようす。ほごしゃへの「1日のまとめ」に使う。 */
export interface DailyStat {
  questions: number;
  correct: number;
  seconds: number;
  tests: { title: string; score: number }[];
  /** その日まちがえた漢字 */
  wrong: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
  xp: number;
  mode: QuizMode;
  progress: Record<string, CharProgress>;
  /** 学習した日（YYYY-MM-DD） */
  days: string[];
  tests: TestResult[];
  daily: Record<string, DailyStat>;
  /** ほごしゃに「1日のまとめ」を送りおえた日 */
  notifiedDays: string[];
}

/** ほごしゃ向けの設定（家族で1つ） */
export interface ParentSettings {
  webhookUrl: string;
  enabled: boolean;
  /** 4けたの数字。空なら ロックなし */
  pin: string;
}

export interface Store {
  version: 2;
  users: UserProfile[];
  currentUserId: string | null;
  parent: ParentSettings;
}

export function emptyParentSettings(): ParentSettings {
  return { webhookUrl: "", enabled: false, pin: "" };
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyStore(): Store {
  return { version: 2, users: [], currentUserId: null, parent: emptyParentSettings() };
}

export function newUser(name: string, emoji: string): UserProfile {
  return {
    id: newId(),
    name: name.trim() || "なまえなし",
    emoji,
    createdAt: Date.now(),
    xp: 0,
    mode: "write",
    progress: {},
    days: [],
    tests: [],
    daily: {},
    notifiedDays: [],
  };
}

/** 旧バージョン（1人ぶんだけの記録）が残っていれば、ユーザー1人として引きつぐ。 */
function migrateOld(): UserProfile | null {
  try {
    const raw = localStorage.getItem(OLD_STORAGE_KEY);
    if (!raw) return null;
    const old = JSON.parse(raw) as {
      progress?: Record<string, CharProgress>;
      days?: string[];
      mode?: QuizMode;
    };
    const user = newUser("わたし", AVATARS[0]);
    user.progress = old.progress ?? {};
    user.days = old.days ?? [];
    user.mode = old.mode ?? "write";
    return user;
  } catch {
    return null;
  }
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Store>;
      const users = (parsed.users ?? []).map((user) => ({ ...newUser(user.name, user.emoji), ...user }));
      return {
        version: 2,
        users,
        currentUserId: parsed.currentUserId ?? users[0]?.id ?? null,
        parent: { ...emptyParentSettings(), ...parsed.parent },
      };
    }
    const migrated = migrateOld();
    if (migrated) {
      return {
        version: 2,
        users: [migrated],
        currentUserId: migrated.id,
        parent: emptyParentSettings(),
      };
    }
  } catch {
    // 壊れていたら新しく始める
  }
  return emptyStore();
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // 保存できない環境（プライベートブラウズなど）でも学習は続けられるようにする
  }
}

export function currentUser(store: Store): UserProfile | null {
  return store.users.find((user) => user.id === store.currentUserId) ?? null;
}

export function updateUser(store: Store, id: string, update: (user: UserProfile) => UserProfile): Store {
  return { ...store, users: store.users.map((user) => (user.id === id ? update(user) : user)) };
}

export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 1問ぶんの結果を記録した新しいユーザーを返す。
 * テスト中は点数から経験値をつけるので、1問ごとの経験値は加えない（gainXp = false）。
 */
export function emptyDaily(): DailyStat {
  return { questions: 0, correct: 0, seconds: 0, tests: [], wrong: [] };
}

export function recordAnswer(
  user: UserProfile,
  entry: KanjiEntry,
  correct: boolean,
  gainXp = true,
  seconds = 0,
): UserProfile {
  const now = Date.now();
  const prev: CharProgress = user.progress[entry.char] ?? {
    char: entry.char,
    grade: entry.grade,
    level: 0,
    correct: 0,
    wrong: 0,
    lastAt: 0,
    dueAt: 0,
  };

  // 正解ならレベルを1つ上げ、まちがえたら2つ下げて早めに出しなおす
  const level = correct ? Math.min(MAX_LEVEL, prev.level + 1) : Math.max(0, prev.level - 2);
  const next: CharProgress = {
    ...prev,
    grade: entry.grade,
    level,
    correct: prev.correct + (correct ? 1 : 0),
    wrong: prev.wrong + (correct ? 0 : 1),
    lastAt: now,
    dueAt: now + (correct ? INTERVALS[level] : 0) * DAY_MS,
  };

  const today = dayKey();
  const before = user.daily[today] ?? emptyDaily();
  const stat: DailyStat = {
    ...before,
    questions: before.questions + 1,
    correct: before.correct + (correct ? 1 : 0),
    seconds: before.seconds + seconds,
    wrong: correct || before.wrong.includes(entry.char) ? before.wrong : [...before.wrong, entry.char],
  };

  return {
    ...user,
    xp: user.xp + (gainXp ? (correct ? XP_CORRECT : XP_WRONG) : 0),
    progress: { ...user.progress, [entry.char]: next },
    days: user.days.includes(today) ? user.days : [...user.days, today],
    daily: { ...user.daily, [today]: stat },
  };
}

/** テストの結果を記録する。点数がそのまま経験値になり、満点はボーナスつき。 */
export function recordTest(
  user: UserProfile,
  result: Omit<TestResult, "id" | "at">,
): { user: UserProfile; gainedXp: number; best: boolean } {
  const previousBest = bestScore(user, result.grade, result.lesson);
  const gainedXp = result.score + (result.score === 100 ? XP_PERFECT_BONUS : 0);
  const test: TestResult = { ...result, id: newId(), at: Date.now() };
  const today = dayKey();
  const before = user.daily[today] ?? emptyDaily();
  return {
    user: {
      ...user,
      xp: user.xp + gainedXp,
      tests: [test, ...user.tests].slice(0, 100),
      daily: {
        ...user.daily,
        [today]: { ...before, tests: [...before.tests, { title: result.title, score: result.score }] },
      },
    },
    gainedXp,
    best: previousBest === null || result.score > previousBest,
  };
}

/** その回（または学年まとめ）のベストスコア。 */
export function bestScore(user: UserProfile, grade: Grade, lesson: number | null): number | null {
  const scores = user.tests
    .filter((test) => test.grade === grade && test.lesson === lesson)
    .map((test) => test.score);
  return scores.length > 0 ? Math.max(...scores) : null;
}

/** 復習の期限が来ている漢字。まちがえたものほど前に来る。 */
export function dueEntries(user: UserProfile, now = Date.now()): KanjiEntry[] {
  return Object.values(user.progress)
    .filter((item) => item.dueAt <= now)
    .sort((a, b) => a.level - b.level || a.dueAt - b.dueAt)
    .map((item) => entryByChar(item.char))
    .filter((entry): entry is KanjiEntry => Boolean(entry));
}

/** まちがえたことがあって、まだ覚えきれていない漢字。 */
export function weakEntries(user: UserProfile): KanjiEntry[] {
  return Object.values(user.progress)
    .filter((item) => item.wrong > 0 && item.level < MASTER_LEVEL)
    .sort((a, b) => b.wrong - a.wrong)
    .map((item) => entryByChar(item.char))
    .filter((entry): entry is KanjiEntry => Boolean(entry));
}

export function masteredCount(user: UserProfile, grade?: Grade): number {
  return Object.values(user.progress).filter(
    (item) => item.level >= MASTER_LEVEL && (grade === undefined || item.grade === grade),
  ).length;
}

/** 今日（または昨日）から続いている学習日数。 */
export function streak(user: UserProfile): number {
  const days = new Set(user.days);
  if (days.size === 0) return 0;
  const today = new Date();
  if (!days.has(dayKey(today))) {
    today.setDate(today.getDate() - 1);
    if (!days.has(dayKey(today))) return 0;
  }
  let count = 0;
  const cursor = new Date(today);
  while (days.has(dayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
