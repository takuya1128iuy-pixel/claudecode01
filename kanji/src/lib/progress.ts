import { entryByChar } from "../data";
import type { Grade, KanjiEntry, QuizMode } from "../types";

const STORAGE_KEY = "kanji-drill-progress-v1";

/** レベルごとの復習間かく（日）。正解するたびに次の間かくへ進む。 */
export const INTERVALS = [1, 2, 4, 7, 14, 30];
export const MAX_LEVEL = INTERVALS.length - 1;
/** これ以上のレベルを「おぼえた」とみなす。 */
export const MASTER_LEVEL = 3;

export interface CharProgress {
  char: string;
  grade: Grade;
  level: number;
  correct: number;
  wrong: number;
  lastAt: number;
  dueAt: number;
}

export interface Store {
  version: 1;
  progress: Record<string, CharProgress>;
  /** 学習した日（YYYY-MM-DD）。連続日数の計算に使う。 */
  days: string[];
  mode: QuizMode;
}

export function emptyStore(): Store {
  return { version: 1, progress: {}, days: [], mode: "write" };
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      version: 1,
      progress: parsed.progress ?? {},
      days: parsed.days ?? [],
      mode: parsed.mode ?? "write",
    };
  } catch {
    return emptyStore();
  }
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // 保存できない環境（プライベートブラウズなど）でも学習は続けられるようにする
  }
}

export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** 1問ぶんの結果を記録した新しいストアを返す。 */
export function recordAnswer(store: Store, entry: KanjiEntry, correct: boolean): Store {
  const now = Date.now();
  const prev: CharProgress = store.progress[entry.char] ?? {
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
  return {
    ...store,
    progress: { ...store.progress, [entry.char]: next },
    days: store.days.includes(today) ? store.days : [...store.days, today],
  };
}

/** 復習の期限が来ている漢字。まちがえたものほど前に来る。 */
export function dueEntries(store: Store, now = Date.now()): KanjiEntry[] {
  return Object.values(store.progress)
    .filter((item) => item.dueAt <= now)
    .sort((a, b) => a.level - b.level || a.dueAt - b.dueAt)
    .map((item) => entryByChar(item.char))
    .filter((entry): entry is KanjiEntry => Boolean(entry));
}

/** まだ一度も正解していない、または苦手な漢字。 */
export function weakEntries(store: Store): KanjiEntry[] {
  return Object.values(store.progress)
    .filter((item) => item.wrong > 0 && item.level < MASTER_LEVEL)
    .sort((a, b) => b.wrong - a.wrong)
    .map((item) => entryByChar(item.char))
    .filter((entry): entry is KanjiEntry => Boolean(entry));
}

export function masteredCount(store: Store, grade?: Grade): number {
  return Object.values(store.progress).filter(
    (item) => item.level >= MASTER_LEVEL && (grade === undefined || item.grade === grade),
  ).length;
}

/** 今日（または昨日）から続いている学習日数。 */
export function streak(store: Store): number {
  const days = new Set(store.days);
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
