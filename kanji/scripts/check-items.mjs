// 例文データの形をチェックする。
//   - 配当表の全1026字に例文があるか
//   - 出題する語に、その漢字が入っているか
//   - 例文に {語} がそのまま入っているか
//   - 読みがひらがな（と長音記号）だけで書かれているか
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data");

const base = readFileSync(join(SRC, "base.generated.ts"), "utf8");
const baseEntries = [...base.matchAll(/char: "(.)", grade: (\d)/g)].map((m) => ({
  char: m[1],
  grade: Number(m[2]),
}));

const problems = [];
const seen = new Set();

for (const grade of [1, 2, 3, 4, 5, 6]) {
  const text = readFileSync(join(SRC, "items", `grade${grade}.ts`), "utf8");
  const entries = [...text.matchAll(/^ {2}(.): \[(.+)\],$/gm)];
  for (const [, char, body] of entries) {
    seen.add(char);
    const expected = baseEntries.find((entry) => entry.char === char);
    if (!expected) {
      problems.push(`${grade}年: ${char} は配当表にない`);
      continue;
    }
    if (expected.grade !== grade) {
      problems.push(`${char} は ${expected.grade}年の漢字なのに grade${grade}.ts にある`);
    }
    const tuples = [...body.matchAll(/\["(.+?)", "(.+?)", "(.+?)"\]/g)];
    if (tuples.length === 0) problems.push(`${char}: 例文が読み取れない`);
    for (const [, word, reading, sentence] of tuples) {
      if (!word.includes(char)) problems.push(`${char}: 語「${word}」に その漢字が入っていない`);
      if (!sentence.includes(`{${word}}`)) problems.push(`${char}: 例文に {${word}} がない → ${sentence}`);
      if (!/^[ぁ-ゖー]+$/.test(reading)) problems.push(`${char}: 読み「${reading}」がひらがなでない`);
    }
  }
}

const missing = baseEntries.filter((entry) => !seen.has(entry.char));
for (const entry of missing) problems.push(`${entry.grade}年: ${entry.char} の例文がない`);

console.log(`配当表 ${baseEntries.length}字 / 例文あり ${seen.size}字`);
if (problems.length > 0) {
  console.error(`\n問題 ${problems.length}件:`);
  for (const problem of problems.slice(0, 60)) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log("問題なし");
