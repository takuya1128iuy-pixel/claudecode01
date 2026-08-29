/**
 * アパレル販売サポートアプリ データモデル
 *
 * データは3層に分ける（docs/apparel-fw2026-requirements.md §7.2）:
 *   L1 不変知識   … 配色ルール・素材・洗濯表示・シルエット。外部に依存せず陳腐化しない
 *   L2 シーズン情報 … トレンドカラー・テーマ。公開情報を出典付きで手入力
 *   L3 市場実データ … 商品APIからの集計。v1では保留
 */

/** 出典。全コンテンツに必須とする（出典を書けない情報は載せない） */
export interface Source {
  /** own: 自前で執筆した一般知識 / public: 公開情報 / standard: 公的規格 */
  kind: "own" | "public" | "standard";
  title: string;
  publisher?: string;
  url?: string;
  /** 内容を確認した日 (YYYY-MM-DD) */
  checkedAt: string;
  /** 転載条件など、扱う上での注意 */
  note?: string;
}

/* ------------------------------------------------------------------ *
 * L1: 配色
 * ------------------------------------------------------------------ */

/** 配色ルール。シーズンに依存せず毎年使える */
export interface ColorRule {
  id: string;
  title: string;
  /** 一行で言うと何か */
  summary: string;
  /** なぜそうなるのか */
  why: string;
  /** 売場でどう使うか */
  inStore: string;
  /** 具体例 */
  examples: string[];
  source: Source;
}

/** ベーシック色。お客様が「すでに持っている」前提の色 */
export interface BasicColor {
  id: string;
  nameJa: string;
  hex: string;
  /** その色が持つ印象 */
  impression: string;
  /** 合わせやすい相手の傾向 */
  goesWith: string;
  /** 難しい組み合わせと、その理由 */
  careful: string;
  /** 接客での一言 */
  talk: string;
}

/* ------------------------------------------------------------------ *
 * L1: 素材
 * ------------------------------------------------------------------ */

export type MaterialCategory =
  | "獣毛・ウール"
  | "植物繊維"
  | "化学繊維"
  | "皮革・フェイク"
  | "生地・編み";

export interface MaterialCare {
  /** 家庭で水洗いできるか */
  washable: "可" | "条件付き可" | "不可";
  /** 洗い方の要点 */
  note: string;
  /** 毛玉のできやすさ */
  pilling: "できにくい" | "ふつう" | "できやすい";
  /** しまい方 */
  storage: string;
}

export interface Material {
  id: string;
  nameJa: string;
  nameEn: string;
  category: MaterialCategory;
  /** 暖かさ 1(涼しい)〜5(真冬向け) */
  warmth: 1 | 2 | 3 | 4 | 5;
  /** 重さの体感 1(軽い)〜5(重い) */
  weight: 1 | 2 | 3 | 4 | 5;
  /** 価格帯の体感 */
  priceFeel: "低" | "中" | "高";
  /**
   * 売場での登場頻度。
   * 手の届く価格帯のデイリー向けレディースを想定した並び順に使う。
   * 覚える優先順位を決めるためのもので、商品の良し悪しとは関係ない。
   */
  frequency: "定番" | "ときどき" | "たまに";
  pros: string[];
  cons: string[];
  /** 接客での一言説明（30秒で言い切れる長さ） */
  talk: string;
  /** 実際によく聞かれる質問 */
  faq: { q: string; a: string }[];
  care: MaterialCare;
  source: Source;
}

/* ------------------------------------------------------------------ *
 * L1: 洗濯表示・シルエット
 * ------------------------------------------------------------------ */

export interface CareSymbolGroup {
  id: string;
  /** 記号の系統（洗濯・漂白 など） */
  title: string;
  /** 基本の形 */
  shape: string;
  /** 共通ルール */
  common: string;
  items: { mark: string; meaning: string }[];
  source: Source;
}

export type SilhouetteLine = "I" | "A" | "Y" | "X";

export interface Silhouette {
  id: SilhouetteLine;
  nameJa: string;
  /** 形の説明 */
  shape: string;
  /** どう見えるか */
  effect: string;
  /** 合う人・シーン */
  suits: string;
  /** 崩れやすいポイント */
  careful: string;
  talk: string;
  source: Source;
}

/* ------------------------------------------------------------------ *
 * L2: シーズン情報
 * ------------------------------------------------------------------ */

/**
 * 色の系統。29色を一度に見せると選べないので、まずここで絞る。
 * 販売員が口に出す呼び方に合わせている（色相環の厳密な分類ではない）。
 */
export type ColorFamily =
  | "ニュートラル"
  | "ベージュ・ブラウン"
  | "レッド"
  | "オレンジ"
  | "イエロー"
  | "グリーン"
  | "ブルー"
  | "パープル"
  | "ピンク";

/** 暖色・寒色。最初のひと絞りに使う */
export type ColorTemperature = "暖色" | "寒色" | "中性";

/** トレンドカラー1色 */
export interface SeasonColor {
  id: string;
  /** アプリ内での呼び名（日本語） */
  nameJa: string;
  /** 表示用のHEX。出典画像から実測した近似値であり、色の規格値ではない */
  hex: string;
  /** 明度・彩度の傾向 */
  tone: "ペール" | "ライト" | "ソフト" | "モデレート" | "ディープ" | "ダーク" | "ビビッド";
  /** 色の系統。一覧を絞りこむのに使う */
  family: ColorFamily;
  /** 暖色・寒色 */
  temperature: ColorTemperature;
  /** ベース向きか、差し色向きか */
  role: "ベース" | "アソート" | "アクセント";
  /** どんな印象か */
  impression: string;
  /** 相性のよいベーシック色のid */
  goesWithBasics: string[];
  /** 接客での一言 */
  talk: string;
}

/** カラーグループ（JAFCAのカラーグループに対応） */
export interface ColorGroup {
  id: string;
  nameEn: string;
  nameJa: string;
  /** グループの説明 */
  description: string;
  /** 売場での立ち位置 */
  inStore: string;
  colors: SeasonColor[];
}

/**
 * その年を象徴する色（JAFCA「時代の色 — メッセージカラー」）。
 * シーズンのトレンドカラーとは別物で、世の中のムードを表すもの。
 */
export interface YearColor {
  year: number;
  nameJa: string;
  nameEn: string;
  /** 発表元が参考値として公開している16進数 */
  hex: string;
  /** マンセル値（発表元の表記どおり） */
  munsell: string;
  /** 系統色名 */
  systematicName: string;
  /** なぜこの色が選ばれたか */
  reason: string;
  keywords: string[];
  source: Source;
}

/** トレンド項目の分類 */
export type TrendCategory =
  | "キーワード"
  | "シルエット"
  | "アイテム"
  | "スタイリング"
  | "柄"
  | "カラー"
  | "素材"
  | "店頭";

/**
 * 今季のトレンド1項目。
 * summary は出典の内容を自分の言葉でまとめたもの、
 * inStore は「売場でどう使うか」というアプリ独自の読み替え。
 */
export interface TrendTopic {
  id: string;
  category: TrendCategory;
  title: string;
  summary: string;
  inStore: string;
  source: Source;
}

export interface Season {
  id: string;
  label: string;
  /** シーズン全体のテーマ */
  theme: {
    titleEn: string;
    titleJa: string;
    /** テーマの背景 */
    description: string;
    /** 販売員向けの読み替え */
    inStore: string;
  };
  /** シーズンを一言で表すことば。売場での会話のとっかかりに使う */
  keywords: string[];
  /** その年のメッセージカラー */
  yearColor?: YearColor;
  /** 今季のトレンド項目 */
  topics: TrendTopic[];
  groups: ColorGroup[];
  sources: Source[];
}
