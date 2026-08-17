import type { Grade, KanjiEntry } from "../types";
import { GRADE1 } from "./grade1";
import { GRADE4 } from "./grade4";

export interface GradeInfo {
  grade: Grade;
  label: string;
  /** 学年別漢字配当表での字数 */
  total: number;
  /** 例文データが入っている字数 */
  ready: number;
  entries: KanjiEntry[];
}

const TOTALS: Record<Grade, number> = { 1: 80, 2: 160, 3: 200, 4: 202, 5: 193, 6: 191 };

const ENTRIES: Record<Grade, KanjiEntry[]> = {
  1: GRADE1,
  2: [],
  3: [],
  4: GRADE4,
  5: [],
  6: [],
};

export const GRADES: GradeInfo[] = ([1, 2, 3, 4, 5, 6] as Grade[]).map((grade) => ({
  grade,
  label: `${grade}年生`,
  total: TOTALS[grade],
  ready: ENTRIES[grade].length,
  entries: ENTRIES[grade],
}));

export function gradeInfo(grade: Grade): GradeInfo {
  return GRADES[grade - 1];
}

export interface LessonInfo {
  grade: Grade;
  lesson: number;
  entries: KanjiEntry[];
}

/** ある学年の「第○回」一覧を返す。 */
export function lessonsOf(grade: Grade): LessonInfo[] {
  const map = new Map<number, KanjiEntry[]>();
  for (const entry of ENTRIES[grade]) {
    const list = map.get(entry.lesson) ?? [];
    list.push(entry);
    map.set(entry.lesson, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([lesson, entries]) => ({ grade, lesson, entries }));
}

export const ALL_ENTRIES: KanjiEntry[] = GRADES.flatMap((g) => g.entries);

const BY_CHAR = new Map(ALL_ENTRIES.map((entry) => [entry.char, entry]));

export function entryByChar(char: string): KanjiEntry | undefined {
  return BY_CHAR.get(char);
}
