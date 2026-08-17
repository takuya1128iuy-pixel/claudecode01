// 漢字の基礎データ（学年・配当順・画数・音訓）を生成する。
//
// 出典（どちらも再取得可能）:
//   1. 学年別漢字配当表（平成29年告示 = 現行）
//      https://github.com/fnshr/kyo-kan の kyoiku-kanji-2017.csv（CC0 1.0）
//   2. 画数・音読み・訓読み
//      https://github.com/davidluzgouveia/kanji-data の kanji.json
//      （KANJIDIC2 由来。KANJIDIC2 は電子辞書研究開発グループ(EDRDG)の CC BY-SA 4.0）
//
// 使い方:
//   node scripts/build-base.mjs <kyoiku-kanji-2017.csv> <kanji.json>
// 例文は人が書くものなので、このスクリプトは触らない（src/data/items/ 以下を参照）。
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [csvPath, jsonPath] = process.argv.slice(2);
if (!csvPath || !jsonPath) {
  console.error("usage: node scripts/build-base.mjs <kyoiku-kanji-2017.csv> <kanji.json>");
  process.exit(1);
}

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "base.generated.ts");

/** 1学年をいくつの「回」に分けるか。参考プリントに合わせて1回10〜12字にする。 */
const LESSON_COUNT = { 1: 8, 2: 16, 3: 18, 4: 18, 5: 17, 6: 17 };

const toKatakana = (text) =>
  text.replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));

/** KANJIDIC の "かこ.む" 形式を、このアプリの "かこ-む" 形式に直す。 */
function normalizeKun(reading) {
  if (reading.startsWith("-") || reading.endsWith("-")) return null; // 接頭辞・接尾辞は使わない
  return reading.replace(".", "-");
}

const rows = readFileSync(csvPath, "utf8")
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => line.trim().split(","))
  .map(([char, grade, order]) => ({ char, grade: Number(grade), order: Number(order) }));

const dict = JSON.parse(readFileSync(jsonPath, "utf8"));

/** n個をできるだけ均等に groups 個に分ける。各回の字数を返す。 */
function evenSizes(total, groups) {
  const base = Math.floor(total / groups);
  const extra = total % groups;
  return Array.from({ length: groups }, (_, i) => base + (i < extra ? 1 : 0));
}

const entries = [];
const missing = [];
for (const grade of [1, 2, 3, 4, 5, 6]) {
  const inGrade = rows.filter((row) => row.grade === grade).sort((a, b) => a.order - b.order);
  const sizes = evenSizes(inGrade.length, LESSON_COUNT[grade]);
  let index = 0;
  sizes.forEach((size, lessonIndex) => {
    for (let i = 0; i < size; i++) {
      const row = inGrade[index++];
      const info = dict[row.char];
      if (!info) {
        missing.push(row.char);
        continue;
      }
      entries.push({
        char: row.char,
        grade,
        lesson: lessonIndex + 1,
        order: row.order,
        strokes: info.strokes,
        on: (info.readings_on ?? [])
          .filter((reading) => !reading.startsWith("-") && !reading.endsWith("-"))
          .slice(0, 2)
          .map(toKatakana),
        kun: (info.readings_kun ?? []).map(normalizeKun).filter(Boolean).slice(0, 2),
      });
    }
  });
}

if (missing.length > 0) {
  console.error(`辞書に見つからない漢字: ${missing.join("")}`);
  process.exit(1);
}

const lines = entries.map(
  (e) =>
    `  { char: "${e.char}", grade: ${e.grade}, lesson: ${e.lesson}, strokes: ${e.strokes}, ` +
    `on: [${e.on.map((r) => `"${r}"`).join(", ")}], kun: [${e.kun.map((r) => `"${r}"`).join(", ")}] },`,
);

writeFileSync(
  OUT,
  `// このファイルは scripts/build-base.mjs が生成しています。手で編集しないでください。
// 学年・配当順: 学年別漢字配当表（平成29年告示） https://github.com/fnshr/kyo-kan (CC0 1.0)
// 画数・音訓: KANJIDIC2 由来のデータ https://github.com/davidluzgouveia/kanji-data
//            KANJIDIC2 (c) 電子辞書研究開発グループ(EDRDG), CC BY-SA 4.0
import type { Grade } from "../types";

export interface KanjiBase {
  char: string;
  grade: Grade;
  lesson: number;
  strokes: number;
  on: string[];
  kun: string[];
}

export const KANJI_BASE: KanjiBase[] = [
${lines.join("\n")}
];
`,
);

console.log(`wrote ${entries.length} kanji to ${OUT}`);
for (const grade of [1, 2, 3, 4, 5, 6]) {
  const inGrade = entries.filter((e) => e.grade === grade);
  const lessons = new Set(inGrade.map((e) => e.lesson));
  console.log(`  ${grade}年: ${inGrade.length}字 / ${lessons.size}回`);
}
