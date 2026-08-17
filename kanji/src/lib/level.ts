/**
 * レベルのしくみ。
 * 練習で1問正解すると 10、まちがえても 2（がんばった分）。
 * テストは点数がそのまま経験値になり、100点だとボーナスがつく。
 */
export const XP_CORRECT = 10;
export const XP_WRONG = 2;
export const XP_PERFECT_BONUS = 50;

/** そのレベルになるまでに必要な経験値の合計。 */
export function totalXpFor(level: number): number {
  return 50 * (level - 1) * level; // レベル2で100、3で300、4で600…
}

export function levelOf(xp: number): number {
  let level = 1;
  while (xp >= totalXpFor(level + 1)) level += 1;
  return level;
}

const TITLES: { min: number; title: string }[] = [
  { min: 20, title: "かんじマスター" },
  { min: 15, title: "かんじ名人" },
  { min: 10, title: "かんじ博士" },
  { min: 6, title: "かんじ好き" },
  { min: 3, title: "かけだし" },
  { min: 1, title: "みならい" },
];

export function titleOf(level: number): string {
  return TITLES.find((entry) => level >= entry.min)?.title ?? "みならい";
}

export interface LevelInfo {
  level: number;
  title: string;
  /** 今のレベルの中でためた経験値 */
  current: number;
  /** 次のレベルまでに必要な経験値 */
  needed: number;
  ratio: number;
}

export function levelInfo(xp: number): LevelInfo {
  const level = levelOf(xp);
  const start = totalXpFor(level);
  const next = totalXpFor(level + 1);
  const current = xp - start;
  const needed = next - start;
  return { level, title: titleOf(level), current, needed, ratio: current / needed };
}
