import { ALL_ENTRIES, gradeInfo } from "../data";
import type { KanjiEntry, KanjiItem, Question, QuizMode } from "../types";

export function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function splitSentence(sentence: string): { before: string; after: string } {
  const match = /^(.*)\{.+?\}(.*)$/s.exec(sentence);
  if (!match) return { before: sentence, after: "" };
  return { before: match[1], after: match[2] };
}

/**
 * 4択のダミーを選ぶ。
 * 同じ学年の漢字から、音読みが同じ → 画数が近い、の順で紛らわしいものを優先する。
 */
function dummyChoices(entry: KanjiEntry, count: number): string[] {
  const pool = gradeInfo(entry.grade).entries.length > count
    ? gradeInfo(entry.grade).entries
    : ALL_ENTRIES;

  const scored = pool
    .filter((other) => other.char !== entry.char)
    .map((other) => {
      let score = Math.random();
      if (other.on.some((reading) => entry.on.includes(reading))) score += 3;
      if (Math.abs(other.strokes - entry.strokes) <= 2) score += 1;
      return { char: other.char, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((candidate) => candidate.char);
}

function buildQuestion(entry: KanjiEntry, item: KanjiItem, mode: QuizMode, index: number): Question {
  const { before, after } = splitSentence(item.sentence);
  const question: Question = {
    id: `${entry.char}-${item.word}-${mode}-${index}`,
    mode,
    entry,
    item,
    before,
    after,
  };
  if (mode === "choice") {
    question.masked = item.word.replace(entry.char, "□");
    question.choices = shuffle([entry.char, ...dummyChoices(entry, 3)]);
  }
  return question;
}

/** 漢字1字につき1問（例文はランダムに1つ）を作り、順番をまぜて返す。 */
export function buildQuestions(entries: KanjiEntry[], mode: QuizMode, limit?: number): Question[] {
  const chosen = shuffle(entries);
  const sliced = limit ? chosen.slice(0, limit) : chosen;
  return sliced.map((entry, index) => buildQuestion(entry, pick(entry.items), mode, index));
}
