import type { KanjiEntry } from "../types";

/**
 * 小学4年生で習う漢字202字のうち、第1回・第2回ぶん（24字）。
 * 学年別漢字配当表の順に、11〜12字ずつを1回としてまとめている（全18回の予定）。
 * 例文はすべてこのアプリのために書き下ろしたもの。
 */
export const GRADE4: KanjiEntry[] = [
  // ── 第1回 ──
  {
    char: "愛", grade: 4, lesson: 1, on: ["アイ"], kun: [], strokes: 13,
    items: [
      { word: "愛する", reading: "あいする", sentence: "生き物を{愛する}気もち。" },
      { word: "愛用", reading: "あいよう", sentence: "父が{愛用}しているカップ。" },
    ],
  },
  {
    char: "案", grade: 4, lesson: 1, on: ["アン"], kun: [], strokes: 10,
    items: [
      { word: "案内", reading: "あんない", sentence: "駅までの道を{案内}する。" },
      { word: "名案", reading: "めいあん", sentence: "それは{名案}だ。" },
    ],
  },
  {
    char: "以", grade: 4, lesson: 1, on: ["イ"], kun: [], strokes: 5,
    items: [
      { word: "以上", reading: "いじょう", sentence: "十人{以上}が集まった。" },
      { word: "以前", reading: "いぜん", sentence: "{以前}にも来たことがある。" },
    ],
  },
  {
    char: "衣", grade: 4, lesson: 1, on: ["イ"], kun: ["ころも"], strokes: 6,
    items: [
      { word: "衣服", reading: "いふく", sentence: "たたんだ{衣服}をしまう。" },
      { word: "白衣", reading: "はくい", sentence: "{白衣}を着た人がならぶ。" },
    ],
  },
  {
    char: "位", grade: 4, lesson: 1, on: ["イ"], kun: ["くらい"], strokes: 7,
    items: [
      { word: "一位", reading: "いちい", sentence: "かけっこで{一位}になった。" },
      { word: "位置", reading: "いち", sentence: "つくえの{位置}を変える。" },
    ],
  },
  {
    char: "囲", grade: 4, lesson: 1, on: ["イ"], kun: ["かこ-む"], strokes: 7,
    items: [
      { word: "囲む", reading: "かこむ", sentence: "みんなでテーブルを{囲む}。" },
      { word: "周囲", reading: "しゅうい", sentence: "校庭の{周囲}を走る。" },
    ],
  },
  {
    char: "胃", grade: 4, lesson: 1, on: ["イ"], kun: [], strokes: 9,
    items: [
      { word: "胃", reading: "い", sentence: "食べすぎて{胃}が重い。" },
      { word: "胃薬", reading: "いぐすり", sentence: "{胃薬}を飲んで休む。" },
    ],
  },
  {
    char: "印", grade: 4, lesson: 1, on: ["イン"], kun: ["しるし"], strokes: 6,
    items: [
      { word: "目印", reading: "めじるし", sentence: "大きな木を{目印}にする。" },
      { word: "印刷", reading: "いんさつ", sentence: "ポスターを{印刷}する。" },
    ],
  },
  {
    char: "英", grade: 4, lesson: 1, on: ["エイ"], kun: [], strokes: 8,
    items: [
      { word: "英語", reading: "えいご", sentence: "{英語}であいさつする。" },
      { word: "英国", reading: "えいこく", sentence: "{英国}の地図を見る。" },
    ],
  },
  {
    char: "栄", grade: 4, lesson: 1, on: ["エイ"], kun: ["さか-える"], strokes: 9,
    items: [
      { word: "栄える", reading: "さかえる", sentence: "港のある町が{栄える}。" },
      { word: "栄光", reading: "えいこう", sentence: "優勝の{栄光}をつかむ。" },
    ],
  },
  {
    char: "塩", grade: 4, lesson: 1, on: ["エン"], kun: ["しお"], strokes: 13,
    items: [
      { word: "塩", reading: "しお", sentence: "スープに{塩}を入れる。" },
      { word: "食塩", reading: "しょくえん", sentence: "{食塩}水を作る実験。" },
    ],
  },
  {
    char: "億", grade: 4, lesson: 1, on: ["オク"], kun: [], strokes: 15,
    items: [
      { word: "一億", reading: "いちおく", sentence: "{一億}円の予算を組む。" },
      { word: "億", reading: "おく", sentence: "空には何{億}もの星がある。" },
    ],
  },

  // ── 第2回 ──
  {
    char: "加", grade: 4, lesson: 2, on: ["カ"], kun: ["くわ-える"], strokes: 5,
    items: [
      { word: "加える", reading: "くわえる", sentence: "さとうを少し{加える}。" },
      { word: "参加", reading: "さんか", sentence: "地いきの大会に{参加}する。" },
    ],
  },
  {
    char: "果", grade: 4, lesson: 2, on: ["カ"], kun: ["は-たす"], strokes: 8,
    items: [
      { word: "結果", reading: "けっか", sentence: "テストの{結果}が返ってきた。" },
      { word: "果物", reading: "くだもの", sentence: "あまい{果物}を食べる。" },
    ],
  },
  {
    char: "貨", grade: 4, lesson: 2, on: ["カ"], kun: [], strokes: 11,
    items: [
      { word: "貨物", reading: "かもつ", sentence: "{貨物}列車が通りすぎる。" },
      { word: "百貨店", reading: "ひゃっかてん", sentence: "駅前の{百貨店}へ行く。" },
    ],
  },
  {
    char: "課", grade: 4, lesson: 2, on: ["カ"], kun: [], strokes: 15,
    items: [
      { word: "課題", reading: "かだい", sentence: "夏休みの{課題}を進める。" },
      { word: "日課", reading: "にっか", sentence: "朝のさんぽが{日課}だ。" },
    ],
  },
  {
    char: "芽", grade: 4, lesson: 2, on: ["ガ"], kun: ["め"], strokes: 8,
    items: [
      { word: "芽", reading: "め", sentence: "たねから{芽}が出た。" },
      { word: "発芽", reading: "はつが", sentence: "豆の{発芽}を記録する。" },
    ],
  },
  {
    char: "改", grade: 4, lesson: 2, on: ["カイ"], kun: ["あらた-める"], strokes: 7,
    items: [
      { word: "改める", reading: "あらためる", sentence: "やり方を{改める}。" },
      { word: "改札", reading: "かいさつ", sentence: "駅の{改札}を通る。" },
    ],
  },
  {
    char: "械", grade: 4, lesson: 2, on: ["カイ"], kun: [], strokes: 11,
    items: [
      { word: "機械", reading: "きかい", sentence: "工場の{機械}が動き出す。" },
      { word: "器械", reading: "きかい", sentence: "{器械}体そうの練習をする。" },
    ],
  },
  {
    char: "害", grade: 4, lesson: 2, on: ["ガイ"], kun: [], strokes: 10,
    items: [
      { word: "害虫", reading: "がいちゅう", sentence: "畑の{害虫}を取りのぞく。" },
      { word: "水害", reading: "すいがい", sentence: "大雨で{水害}が起きた。" },
    ],
  },
  {
    char: "街", grade: 4, lesson: 2, on: ["ガイ"], kun: ["まち"], strokes: 12,
    items: [
      { word: "街", reading: "まち", sentence: "夜の{街}が明るくかがやく。" },
      { word: "商店街", reading: "しょうてんがい", sentence: "{商店街}を歩く。" },
    ],
  },
  {
    char: "各", grade: 4, lesson: 2, on: ["カク"], kun: ["おのおの"], strokes: 6,
    items: [
      { word: "各地", reading: "かくち", sentence: "{各地}で雨がふった。" },
      { word: "各自", reading: "かくじ", sentence: "{各自}で用意をする。" },
    ],
  },
  {
    char: "覚", grade: 4, lesson: 2, on: ["カク"], kun: ["おぼ-える", "さ-める"], strokes: 12,
    items: [
      { word: "覚える", reading: "おぼえる", sentence: "新しい漢字を{覚える}。" },
      { word: "感覚", reading: "かんかく", sentence: "指先の{感覚}がにぶる。" },
    ],
  },
  {
    char: "完", grade: 4, lesson: 2, on: ["カン"], kun: [], strokes: 7,
    items: [
      { word: "完成", reading: "かんせい", sentence: "作品がやっと{完成}した。" },
      { word: "完全", reading: "かんぜん", sentence: "ペンキが{完全}にかわく。" },
    ],
  },
];
