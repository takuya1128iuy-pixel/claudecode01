import type { KanjiEntry } from "../types";

/**
 * 小学1年生で習う漢字80字（学年別漢字配当表の順）。
 * 例文はすべてこのアプリのために書き下ろしたもの。
 * 1年生が読めるように、出題対象の語いがい原則ひらがなで書いている。
 */
export const GRADE1: KanjiEntry[] = [
  // ── 第1回 ──
  {
    char: "一", grade: 1, lesson: 1, on: ["イチ", "イツ"], kun: ["ひと-つ"], strokes: 1,
    items: [
      { word: "一つ", reading: "ひとつ", sentence: "りんごを{一つ}たべる。" },
      { word: "一年生", reading: "いちねんせい", sentence: "いもうとは{一年生}です。" },
    ],
  },
  {
    char: "右", grade: 1, lesson: 1, on: ["ウ", "ユウ"], kun: ["みぎ"], strokes: 5,
    items: [{ word: "右", reading: "みぎ", sentence: "{右}のてを あげる。" }],
  },
  {
    char: "雨", grade: 1, lesson: 1, on: ["ウ"], kun: ["あめ"], strokes: 8,
    items: [{ word: "雨", reading: "あめ", sentence: "そとは つよい{雨}だ。" }],
  },
  {
    char: "円", grade: 1, lesson: 1, on: ["エン"], kun: ["まる-い"], strokes: 4,
    items: [{ word: "円", reading: "えん", sentence: "ひゃく{円}の おかしを かう。" }],
  },
  {
    char: "王", grade: 1, lesson: 1, on: ["オウ"], kun: [], strokes: 4,
    items: [{ word: "王子", reading: "おうじ", sentence: "{王子}が うまに のる。" }],
  },
  {
    char: "音", grade: 1, lesson: 1, on: ["オン"], kun: ["おと"], strokes: 9,
    items: [{ word: "音", reading: "おと", sentence: "ピアノの{音}が きこえる。" }],
  },
  {
    char: "下", grade: 1, lesson: 1, on: ["カ", "ゲ"], kun: ["した", "さ-げる", "くだ-る"], strokes: 3,
    items: [{ word: "下", reading: "した", sentence: "つくえの{下}を のぞく。" }],
  },
  {
    char: "火", grade: 1, lesson: 1, on: ["カ"], kun: ["ひ"], strokes: 4,
    items: [{ word: "火", reading: "ひ", sentence: "キャンプで{火}を つける。" }],
  },
  {
    char: "花", grade: 1, lesson: 1, on: ["カ"], kun: ["はな"], strokes: 7,
    items: [{ word: "花", reading: "はな", sentence: "きれいな{花}が さく。" }],
  },
  {
    char: "貝", grade: 1, lesson: 1, on: [], kun: ["かい"], strokes: 7,
    items: [{ word: "貝", reading: "かい", sentence: "うみべで{貝}を ひろう。" }],
  },

  // ── 第2回 ──
  {
    char: "学", grade: 1, lesson: 2, on: ["ガク"], kun: ["まな-ぶ"], strokes: 8,
    items: [{ word: "学校", reading: "がっこう", sentence: "あるいて{学校}へ いく。" }],
  },
  {
    char: "気", grade: 1, lesson: 2, on: ["キ", "ケ"], kun: [], strokes: 6,
    items: [{ word: "天気", reading: "てんき", sentence: "きょうは{天気}が いい。" }],
  },
  {
    char: "九", grade: 1, lesson: 2, on: ["キュウ", "ク"], kun: ["ここの-つ"], strokes: 2,
    items: [{ word: "九つ", reading: "ここのつ", sentence: "たまごが{九つ}ある。" }],
  },
  {
    char: "休", grade: 1, lesson: 2, on: ["キュウ"], kun: ["やす-む"], strokes: 6,
    items: [{ word: "休む", reading: "やすむ", sentence: "かぜで がっこうを{休む}。" }],
  },
  {
    char: "玉", grade: 1, lesson: 2, on: ["ギョク"], kun: ["たま"], strokes: 5,
    items: [{ word: "玉", reading: "たま", sentence: "ゆかで{玉}を ころがす。" }],
  },
  {
    char: "金", grade: 1, lesson: 2, on: ["キン"], kun: ["かね"], strokes: 8,
    items: [{ word: "金", reading: "きん", sentence: "{金}いろの ほしが ひかる。" }],
  },
  {
    char: "空", grade: 1, lesson: 2, on: ["クウ"], kun: ["そら", "あ-く"], strokes: 8,
    items: [{ word: "空", reading: "そら", sentence: "{空}が とても あおい。" }],
  },
  {
    char: "月", grade: 1, lesson: 2, on: ["ゲツ", "ガツ"], kun: ["つき"], strokes: 4,
    items: [{ word: "月", reading: "つき", sentence: "よるの{月}が まるい。" }],
  },
  {
    char: "犬", grade: 1, lesson: 2, on: ["ケン"], kun: ["いぬ"], strokes: 4,
    items: [{ word: "犬", reading: "いぬ", sentence: "しろい{犬}と さんぽする。" }],
  },
  {
    char: "見", grade: 1, lesson: 2, on: ["ケン"], kun: ["み-る"], strokes: 7,
    items: [{ word: "見る", reading: "みる", sentence: "テレビを{見る}。" }],
  },

  // ── 第3回 ──
  {
    char: "五", grade: 1, lesson: 3, on: ["ゴ"], kun: ["いつ-つ"], strokes: 4,
    items: [{ word: "五つ", reading: "いつつ", sentence: "いしを{五つ}ならべる。" }],
  },
  {
    char: "口", grade: 1, lesson: 3, on: ["コウ", "ク"], kun: ["くち"], strokes: 3,
    items: [{ word: "口", reading: "くち", sentence: "おおきく{口}を あける。" }],
  },
  {
    char: "校", grade: 1, lesson: 3, on: ["コウ"], kun: [], strokes: 10,
    items: [{ word: "学校", reading: "がっこう", sentence: "{学校}の チャイムが なる。" }],
  },
  {
    char: "左", grade: 1, lesson: 3, on: ["サ"], kun: ["ひだり"], strokes: 5,
    items: [{ word: "左", reading: "ひだり", sentence: "{左}を むいて あるく。" }],
  },
  {
    char: "三", grade: 1, lesson: 3, on: ["サン"], kun: ["みっ-つ"], strokes: 3,
    items: [{ word: "三つ", reading: "みっつ", sentence: "はこを{三つ}かさねる。" }],
  },
  {
    char: "山", grade: 1, lesson: 3, on: ["サン"], kun: ["やま"], strokes: 3,
    items: [{ word: "山", reading: "やま", sentence: "たかい{山}に のぼる。" }],
  },
  {
    char: "子", grade: 1, lesson: 3, on: ["シ", "ス"], kun: ["こ"], strokes: 3,
    items: [{ word: "子", reading: "こ", sentence: "ねこの{子}が ないている。" }],
  },
  {
    char: "四", grade: 1, lesson: 3, on: ["シ"], kun: ["よっ-つ", "よん"], strokes: 5,
    items: [{ word: "四つ", reading: "よっつ", sentence: "いすが{四つ}ならぶ。" }],
  },
  {
    char: "糸", grade: 1, lesson: 3, on: ["シ"], kun: ["いと"], strokes: 6,
    items: [{ word: "糸", reading: "いと", sentence: "はりに{糸}を とおす。" }],
  },
  {
    char: "字", grade: 1, lesson: 3, on: ["ジ"], kun: [], strokes: 6,
    items: [{ word: "字", reading: "じ", sentence: "ノートに{字}を かく。" }],
  },

  // ── 第4回 ──
  {
    char: "耳", grade: 1, lesson: 4, on: ["ジ"], kun: ["みみ"], strokes: 6,
    items: [{ word: "耳", reading: "みみ", sentence: "うさぎの{耳}は ながい。" }],
  },
  {
    char: "七", grade: 1, lesson: 4, on: ["シチ"], kun: ["なな-つ"], strokes: 2,
    items: [{ word: "七つ", reading: "ななつ", sentence: "ほしが{七つ}ひかる。" }],
  },
  {
    char: "車", grade: 1, lesson: 4, on: ["シャ"], kun: ["くるま"], strokes: 7,
    items: [{ word: "車", reading: "くるま", sentence: "あかい{車}が とまる。" }],
  },
  {
    char: "手", grade: 1, lesson: 4, on: ["シュ"], kun: ["て"], strokes: 4,
    items: [{ word: "手", reading: "て", sentence: "せっけんで{手}を あらう。" }],
  },
  {
    char: "十", grade: 1, lesson: 4, on: ["ジュウ", "ジッ"], kun: ["とお"], strokes: 2,
    items: [{ word: "十", reading: "じゅう", sentence: "{十}まで かぞえる。" }],
  },
  {
    char: "出", grade: 1, lesson: 4, on: ["シュツ"], kun: ["で-る", "だ-す"], strokes: 5,
    items: [{ word: "出る", reading: "でる", sentence: "げんかんを{出る}。" }],
  },
  {
    char: "女", grade: 1, lesson: 4, on: ["ジョ", "ニョ"], kun: ["おんな"], strokes: 3,
    items: [{ word: "女", reading: "おんな", sentence: "{女}の ひとが てを ふる。" }],
  },
  {
    char: "小", grade: 1, lesson: 4, on: ["ショウ"], kun: ["ちい-さい", "こ"], strokes: 3,
    items: [{ word: "小さい", reading: "ちいさい", sentence: "{小さい}ありを みつけた。" }],
  },
  {
    char: "上", grade: 1, lesson: 4, on: ["ジョウ"], kun: ["うえ", "あ-げる", "のぼ-る"], strokes: 3,
    items: [{ word: "上", reading: "うえ", sentence: "やねの{上}に とりが いる。" }],
  },
  {
    char: "森", grade: 1, lesson: 4, on: ["シン"], kun: ["もり"], strokes: 12,
    items: [{ word: "森", reading: "もり", sentence: "{森}の なかを あるく。" }],
  },

  // ── 第5回 ──
  {
    char: "人", grade: 1, lesson: 5, on: ["ジン", "ニン"], kun: ["ひと"], strokes: 2,
    items: [{ word: "人", reading: "ひと", sentence: "たくさんの{人}が ならぶ。" }],
  },
  {
    char: "水", grade: 1, lesson: 5, on: ["スイ"], kun: ["みず"], strokes: 4,
    items: [{ word: "水", reading: "みず", sentence: "コップの{水}を のむ。" }],
  },
  {
    char: "正", grade: 1, lesson: 5, on: ["セイ", "ショウ"], kun: ["ただ-しい"], strokes: 5,
    items: [{ word: "正しい", reading: "ただしい", sentence: "{正しい}こたえを えらぶ。" }],
  },
  {
    char: "生", grade: 1, lesson: 5, on: ["セイ", "ショウ"], kun: ["い-きる", "う-まれる", "なま"], strokes: 5,
    items: [{ word: "生まれる", reading: "うまれる", sentence: "いもうとが{生まれる}。" }],
  },
  {
    char: "青", grade: 1, lesson: 5, on: ["セイ"], kun: ["あお-い"], strokes: 8,
    items: [{ word: "青い", reading: "あおい", sentence: "{青い}うみが ひろがる。" }],
  },
  {
    char: "夕", grade: 1, lesson: 5, on: ["セキ"], kun: ["ゆう"], strokes: 3,
    items: [{ word: "夕日", reading: "ゆうひ", sentence: "{夕日}が しずむ。" }],
  },
  {
    char: "石", grade: 1, lesson: 5, on: ["セキ"], kun: ["いし"], strokes: 5,
    items: [{ word: "石", reading: "いし", sentence: "かわらで{石}を ひろう。" }],
  },
  {
    char: "赤", grade: 1, lesson: 5, on: ["セキ"], kun: ["あか-い"], strokes: 7,
    items: [{ word: "赤い", reading: "あかい", sentence: "{赤い}はなが さいた。" }],
  },
  {
    char: "千", grade: 1, lesson: 5, on: ["セン"], kun: ["ち"], strokes: 3,
    items: [{ word: "千", reading: "せん", sentence: "つるを{千}わ おる。" }],
  },
  {
    char: "川", grade: 1, lesson: 5, on: ["セン"], kun: ["かわ"], strokes: 3,
    items: [{ word: "川", reading: "かわ", sentence: "{川}で さかなを つる。" }],
  },

  // ── 第6回 ──
  {
    char: "先", grade: 1, lesson: 6, on: ["セン"], kun: ["さき"], strokes: 6,
    items: [{ word: "先生", reading: "せんせい", sentence: "{先生}が おはなしを する。" }],
  },
  {
    char: "早", grade: 1, lesson: 6, on: ["ソウ"], kun: ["はや-い"], strokes: 6,
    items: [{ word: "早い", reading: "はやい", sentence: "けさは{早い}じかんに おきた。" }],
  },
  {
    char: "草", grade: 1, lesson: 6, on: ["ソウ"], kun: ["くさ"], strokes: 9,
    items: [{ word: "草", reading: "くさ", sentence: "にわの{草}を ぬく。" }],
  },
  {
    char: "足", grade: 1, lesson: 6, on: ["ソク"], kun: ["あし", "た-りる"], strokes: 7,
    items: [{ word: "足", reading: "あし", sentence: "{足}が とても はやい。" }],
  },
  {
    char: "村", grade: 1, lesson: 6, on: ["ソン"], kun: ["むら"], strokes: 7,
    items: [{ word: "村", reading: "むら", sentence: "やまの ふもとの{村}。" }],
  },
  {
    char: "大", grade: 1, lesson: 6, on: ["ダイ", "タイ"], kun: ["おお-きい"], strokes: 3,
    items: [{ word: "大きい", reading: "おおきい", sentence: "{大きい}こえで よぶ。" }],
  },
  {
    char: "男", grade: 1, lesson: 6, on: ["ダン", "ナン"], kun: ["おとこ"], strokes: 7,
    items: [{ word: "男", reading: "おとこ", sentence: "{男}の ひとが はしる。" }],
  },
  {
    char: "竹", grade: 1, lesson: 6, on: ["チク"], kun: ["たけ"], strokes: 6,
    items: [{ word: "竹", reading: "たけ", sentence: "{竹}の かごを つくる。" }],
  },
  {
    char: "中", grade: 1, lesson: 6, on: ["チュウ"], kun: ["なか"], strokes: 4,
    items: [{ word: "中", reading: "なか", sentence: "はこの{中}を のぞく。" }],
  },
  {
    char: "虫", grade: 1, lesson: 6, on: ["チュウ"], kun: ["むし"], strokes: 6,
    items: [{ word: "虫", reading: "むし", sentence: "はっぱに{虫}が とまる。" }],
  },

  // ── 第7回 ──
  {
    char: "町", grade: 1, lesson: 7, on: ["チョウ"], kun: ["まち"], strokes: 7,
    items: [{ word: "町", reading: "まち", sentence: "{町}の おまつりに いく。" }],
  },
  {
    char: "天", grade: 1, lesson: 7, on: ["テン"], kun: ["あめ"], strokes: 4,
    items: [{ word: "天気", reading: "てんき", sentence: "あしたの{天気}を しらべる。" }],
  },
  {
    char: "田", grade: 1, lesson: 7, on: ["デン"], kun: ["た"], strokes: 5,
    items: [{ word: "田", reading: "た", sentence: "{田}に みずを ひく。" }],
  },
  {
    char: "土", grade: 1, lesson: 7, on: ["ド", "ト"], kun: ["つち"], strokes: 3,
    items: [{ word: "土", reading: "つち", sentence: "スコップで{土}を ほる。" }],
  },
  {
    char: "二", grade: 1, lesson: 7, on: ["ニ"], kun: ["ふた-つ"], strokes: 2,
    items: [{ word: "二つ", reading: "ふたつ", sentence: "あめだまを{二つ}もらう。" }],
  },
  {
    char: "日", grade: 1, lesson: 7, on: ["ニチ", "ジツ"], kun: ["ひ", "か"], strokes: 4,
    items: [{ word: "日", reading: "ひ", sentence: "あさの{日}が のぼる。" }],
  },
  {
    char: "入", grade: 1, lesson: 7, on: ["ニュウ"], kun: ["はい-る", "い-れる"], strokes: 2,
    items: [{ word: "入る", reading: "はいる", sentence: "へやに{入る}。" }],
  },
  {
    char: "年", grade: 1, lesson: 7, on: ["ネン"], kun: ["とし"], strokes: 6,
    items: [{ word: "年", reading: "とし", sentence: "あたらしい{年}を むかえる。" }],
  },
  {
    char: "白", grade: 1, lesson: 7, on: ["ハク"], kun: ["しろ-い"], strokes: 5,
    items: [{ word: "白い", reading: "しろい", sentence: "{白い}ゆきが つもる。" }],
  },
  {
    char: "八", grade: 1, lesson: 7, on: ["ハチ"], kun: ["やっ-つ"], strokes: 2,
    items: [{ word: "八つ", reading: "やっつ", sentence: "みかんを{八つ}かぞえる。" }],
  },

  // ── 第8回 ──
  {
    char: "百", grade: 1, lesson: 8, on: ["ヒャク"], kun: [], strokes: 6,
    items: [{ word: "百", reading: "ひゃく", sentence: "{百}えんだまを もつ。" }],
  },
  {
    char: "文", grade: 1, lesson: 8, on: ["ブン", "モン"], kun: ["ふみ"], strokes: 4,
    items: [{ word: "文", reading: "ぶん", sentence: "みじかい{文}を かく。" }],
  },
  {
    char: "木", grade: 1, lesson: 8, on: ["ボク", "モク"], kun: ["き"], strokes: 4,
    items: [{ word: "木", reading: "き", sentence: "おおきな{木}に のぼる。" }],
  },
  {
    char: "本", grade: 1, lesson: 8, on: ["ホン"], kun: ["もと"], strokes: 5,
    items: [{ word: "本", reading: "ほん", sentence: "おもしろい{本}を よむ。" }],
  },
  {
    char: "名", grade: 1, lesson: 8, on: ["メイ", "ミョウ"], kun: ["な"], strokes: 6,
    items: [{ word: "名", reading: "な", sentence: "じぶんの{名}まえを かく。" }],
  },
  {
    char: "目", grade: 1, lesson: 8, on: ["モク"], kun: ["め"], strokes: 5,
    items: [{ word: "目", reading: "め", sentence: "しずかに{目}を とじる。" }],
  },
  {
    char: "立", grade: 1, lesson: 8, on: ["リツ"], kun: ["た-つ"], strokes: 5,
    items: [{ word: "立つ", reading: "たつ", sentence: "いすから{立つ}。" }],
  },
  {
    char: "力", grade: 1, lesson: 8, on: ["リョク", "リキ"], kun: ["ちから"], strokes: 2,
    items: [{ word: "力", reading: "ちから", sentence: "みんなで{力}を あわせる。" }],
  },
  {
    char: "林", grade: 1, lesson: 8, on: ["リン"], kun: ["はやし"], strokes: 8,
    items: [{ word: "林", reading: "はやし", sentence: "{林}の なかで とりが なく。" }],
  },
  {
    char: "六", grade: 1, lesson: 8, on: ["ロク"], kun: ["むっ-つ"], strokes: 4,
    items: [{ word: "六つ", reading: "むっつ", sentence: "たまごを{六つ}つかう。" }],
  },
];
