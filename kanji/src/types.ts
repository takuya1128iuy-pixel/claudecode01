export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

/** 1つの漢字にひもづく出題材料（ことば＋例文）。 */
export interface KanjiItem {
  /** 出題する語（漢字表記）。例: "案内" */
  word: string;
  /** その語の読み（ひらがな）。例: "あんない" */
  reading: string;
  /**
   * 例文。出題対象の語を {} で囲む。
   * 例: "駅までの道を{案内}する。"
   * 書き取りモードでは {} の中が読みに、読みモードでは漢字のまま表示される。
   */
  sentence: string;
}

export interface KanjiEntry {
  char: string;
  grade: Grade;
  /** 参考プリントと同じ「第○回」の区切り。1始まり。 */
  lesson: number;
  /** 音読み（カタカナ） */
  on: string[];
  /** 訓読み（ひらがな。送りがなは - で区切る） */
  kun: string[];
  strokes: number;
  items: KanjiItem[];
}

export type QuizMode = "write" | "choice" | "reading";

export const QUIZ_MODES: { id: QuizMode; label: string; emoji: string; hint: string }[] = [
  { id: "write", label: "かきとり", emoji: "✍️", hint: "ゆびやペンで書いて、じぶんで丸つけ" },
  { id: "choice", label: "4たくクイズ", emoji: "🔘", hint: "4つのなかから正しい漢字をえらぶ" },
  { id: "reading", label: "よみ", emoji: "🔤", hint: "漢字の読みをひらがなで入力する" },
];

/** 1問ぶんの出題データ。 */
export interface Question {
  id: string;
  mode: QuizMode;
  entry: KanjiEntry;
  item: KanjiItem;
  /** 例文の {} より前の部分 */
  before: string;
  /** 例文の {} より後の部分 */
  after: string;
  /** 4択モードの選択肢（正解の漢字1字を含む） */
  choices?: string[];
  /** 4択モードで表示する、対象の漢字を□にした語。例: "□内" */
  masked?: string;
}

export interface Answer {
  question: Question;
  correct: boolean;
}
