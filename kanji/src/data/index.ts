import type { Grade, KanjiEntry, KanjiItem } from "../types";
import { KANJI_BASE } from "./base.generated";
import { GRADE1_ITEMS } from "./items/grade1";
import { GRADE2_ITEMS } from "./items/grade2";
import { GRADE3_ITEMS } from "./items/grade3";
import { GRADE4_ITEMS } from "./items/grade4";
import { GRADE5_ITEMS } from "./items/grade5";
import { GRADE6_ITEMS } from "./items/grade6";
import type { ItemMap } from "./items/types";

const ITEMS: Record<Grade, ItemMap> = {
  1: GRADE1_ITEMS,
  2: GRADE2_ITEMS,
  3: GRADE3_ITEMS,
  4: GRADE4_ITEMS,
  5: GRADE5_ITEMS,
  6: GRADE6_ITEMS,
};

function itemsOf(grade: Grade, char: string): KanjiItem[] {
  return (ITEMS[grade][char] ?? []).map(([word, reading, sentence]) => ({ word, reading, sentence }));
}

/** 基礎データ（学年・画数・音訓）と、書き下ろした例文を合わせた出題データ。 */
export const ALL_ENTRIES: KanjiEntry[] = KANJI_BASE.map((base) => ({
  ...base,
  items: itemsOf(base.grade, base.char),
})).filter((entry) => entry.items.length > 0);

export interface GradeInfo {
  grade: Grade;
  label: string;
  /** 学年別漢字配当表での字数 */
  total: number;
  /** 例文データが入っている字数 */
  ready: number;
  entries: KanjiEntry[];
}

const GRADE_LIST: Grade[] = [1, 2, 3, 4, 5, 6];

export const GRADES: GradeInfo[] = GRADE_LIST.map((grade) => {
  const entries = ALL_ENTRIES.filter((entry) => entry.grade === grade);
  return {
    grade,
    label: `${grade}年生`,
    total: KANJI_BASE.filter((base) => base.grade === grade).length,
    ready: entries.length,
    entries,
  };
});

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
  for (const entry of gradeInfo(grade).entries) {
    const list = map.get(entry.lesson) ?? [];
    list.push(entry);
    map.set(entry.lesson, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([lesson, entries]) => ({ grade, lesson, entries }));
}

const BY_CHAR = new Map(ALL_ENTRIES.map((entry) => [entry.char, entry]));

export function entryByChar(char: string): KanjiEntry | undefined {
  return BY_CHAR.get(char);
}
