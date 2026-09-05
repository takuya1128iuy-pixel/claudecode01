/*
 * 家計の顧問FP 年間顧問契約書（ドラフト）ジェネレータ
 *
 * 契約書の本文をこのファイル 1 か所に持ち、同じ内容から
 *   - 顧問契約書_ドラフト.docx  (Word)
 *   - contract.md               (Markdown)
 * を生成する。
 *
 * 使い方:
 *   cd fp-advisory/contract
 *   npm i --no-save docx      # 初回のみ（リポジトリの依存には含めない）
 *   node build-contract.cjs
 */
const fs = require("node:fs");
const path = require("node:path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, HeadingLevel, LevelFormat, PageBreak,
  ShadingType, WidthType, TabStopType,
} = require("docx");

// ---------------------------------------------------------------------------
// 契約書データ
// ---------------------------------------------------------------------------

const PARTY_INTRO =
  "＿＿＿＿＿＿＿＿（以下「甲」という。）と、○○FP事務所（以下「乙」という。）とは、乙が甲に対して提供する家計の顧問FPサービス（以下「本サービス」という。）に関し、次のとおり年間顧問契約（以下「本契約」という。）を締結する。";

const DRAFT_NOTICE = [
  "本書はドラフトです。実際の締結前に、次の点をご確認ください。",
  "・○○、＿＿、【 】で示した箇所は、事務所の実情に合わせて確定してください。",
  "・料金の税込・税別表記、中途解約時の返金方法（第12条）は選択が必要です。",
  "・金融商品仲介業（IFA）・保険募集に関する表現（第7条・別紙1）は、所属金融機関の規程及び関係法令に照らして確認してください。",
  "・最終版は弁護士等の専門家によるリーガルチェックを受けることを推奨します。",
];

/** clauses: string（単項） or { text, items? }（項番号あり）。items は (1)(2)… の号。 */
const ARTICLES = [
  {
    title: "目的",
    clauses: [
      "本契約は、乙が甲の「家計の顧問FP」として、甲及び甲の家族の家計・資産・保険・税金・年金等のお金に関する事項について継続的に相談を受け、助言及び支援を行うことにより、甲が「お金のことで何かあったら、とりあえずFPに聞けばいい」と安心して相談できる状態を作ることを目的とする。",
    ],
  },
  {
    title: "顧問業務の内容",
    clauses: [
      { text: "乙は、本契約の有効期間中、甲に対し、別表1に定める業務（以下「顧問業務」という。）を提供する。" },
      { text: "顧問業務の対象は、甲及び甲と生計を一にする家族（以下「甲の家族」という。）の家計に関する事項とする。" },
      { text: "別表1の各項目のうち、定期的に実施するものの頻度は別表1に記載のとおりとし、その他の項目は甲の求めに応じて随時実施する。" },
    ],
  },
  {
    title: "業務の提供方法",
    clauses: [
      { text: "顧問業務は、面談、オンライン面談、電話、メール、チャットツール等、甲乙が合意した方法により提供する。" },
      { text: "甲は、学校・勤務先・市区町村・金融機関等から届いたお金・保険・税金・年金等に関する書類を、写真、PDF等の電子データにより乙に共有することができる。乙が必要と認めた場合は、郵送により共有する。" },
      { text: "乙は、甲から共有された書類について、「何の書類か」「手続きが必要か」「甲の家庭ではどう対応するのがよいか」を個別に解説する。" },
      { text: "乙の対応時間は、原則として乙の営業日の○時から○時までとする。乙は、甲からの相談に対し、原則として○営業日以内に回答又は対応方針の連絡を行うよう努める。" },
    ],
  },
  {
    title: "顧問料",
    clauses: [
      { text: "甲は、乙に対し、顧問業務の対価として、年額50,000円（消費税込み）の顧問料を支払う。" },
      { text: "甲は、顧問料を、本契約締結後○日以内（更新時は更新日の属する月の末日まで）に、乙が指定する銀行口座への振込その他乙が指定する方法により支払う。振込手数料は甲の負担とする。" },
      { text: "顧問料には、別表1の顧問業務に係る費用が含まれる。別表2に定める個別業務（オプション）の料金は、顧問料とは別に同表のとおりとする。" },
      { text: "面談のための交通費、郵送費、書類取得のための実費等が発生する場合は、事前に甲の承諾を得た上で、甲の負担とする。" },
    ],
  },
  {
    title: "契約期間及び更新",
    clauses: [
      { text: "本契約の有効期間は、契約締結日から1年間とする。" },
      { text: "期間満了の1か月前までに甲又は乙のいずれからも書面又は電磁的方法による更新しない旨の申出がない場合、本契約は同一条件でさらに1年間更新されるものとし、以後も同様とする。" },
      { text: "ライフプランは、初年度に新規作成し、次年度以降は初年度に作成したものを基に毎年更新する。" },
    ],
  },
  {
    title: "個別業務（オプション）及びその料金",
    clauses: [
      { text: "甲は、本契約の有効期間中、別表2に定める個別業務を、同表に定める顧問顧客料金で乙に依頼することができる。" },
      { text: "個別業務の依頼は、書面、メール等の甲乙が確認できる方法により行う。" },
      { text: "住宅購入相談は、乙が顧問業務を通じて甲の家計及びライフプランを既に把握していることを前提に、住宅購入に必要な部分（住宅ローンの組み方、借入額・返済方法の検討、金利タイプの考え方、ペアローン等の検討、団体信用生命保険の選び方、購入後の確定申告の補助等）を追加でサポートするものとする。" },
      { text: "ネット証券等の口座開設及び積立設定は、原則として甲自身が行う。乙が設定完了まで同席して支援する場合は、別表2に定める料金を申し受ける。" },
    ],
  },
  {
    title: "保険相談及びNISA・iDeCo等の相談",
    clauses: [
      { text: "次の各号の相談は顧問業務に含まれ、追加料金を要しない。",
        items: [
          "保険相談（現在加入している保険の確認、必要保障額の整理、新規加入・見直し相談、ライフステージが変わったときの保障確認）",
          "NISA・iDeCo等の資産運用相談（制度の確認、積立金額の検討、資産配分の考え方、ファンド選びの相談、現在の運用内容の確認）",
        ] },
      { text: "乙は、必要に応じて乙又は乙の取扱金融機関が取り扱う保険商品又は金融商品を提案することがある。ただし、当該提案は情報提供及び助言であり、甲に加入又は契約を勧めることを目的とするものではなく、甲は当該提案を受け入れる義務を負わない。" },
      { text: "甲が乙又は乙の取扱金融機関を通じて商品の加入、契約又は口座開設を行う場合、乙は当該金融機関から手数料等を受領することがある。乙は、その旨を別紙1により事前に説明する。" },
      { text: "乙が金融商品仲介業者（IFA）又は保険募集人として行う金融商品・保険商品の説明、勧誘及び媒介は、本契約とは別に、関係法令及び所属金融機関の定めに従って行う。" },
    ],
  },
  {
    title: "業務の範囲外及び責任の限定",
    clauses: [
      { text: "次の各号に掲げる事項は、顧問業務の範囲に含まれない。",
        items: [
          "税務書類の作成、税務代理その他税理士法に定める税理士業務（確定申告に関する乙の支援は、一般的な制度の説明及び必要書類の整理等の補助にとどまる。）",
          "法律事務その他弁護士法に定める弁護士業務",
          "社会保険労務士、司法書士、行政書士等の他の資格者の独占業務",
          "特定の金融商品の価格・利回りの予測及び運用成果の保証",
          "甲に代わって行う金融機関、行政機関等への申請、届出及び契約手続き",
        ] },
      { text: "乙は、前項各号に該当する事項について甲から相談を受けた場合、一般的な情報提供を行うとともに、必要に応じて適切な専門家を紹介する。" },
      { text: "金融商品の購入・解約、保険の加入・解約、住宅ローンの借入等に関する最終的な判断は、甲自身の責任において行うものとし、乙はその結果について責任を負わない。" },
      { text: "乙は、顧問業務を、甲から提供された情報及び助言時点で有効な法令・制度に基づいて行う。甲が提供した情報が不正確又は不十分であったこと、又は助言後の法令・制度・経済環境の変化に起因して甲に生じた損害について、乙は責任を負わない。" },
    ],
  },
  {
    title: "甲の協力",
    clauses: [
      { text: "甲は、顧問業務の提供に必要な家計、資産、負債、保険、収入、家族構成等に関する情報を、正確かつ速やかに乙に提供する。" },
      { text: "甲は、提供した情報に重要な変更（転職、転居、出産、相続、住宅購入等）が生じたときは、速やかに乙に連絡する。" },
    ],
  },
  {
    title: "秘密保持及び個人情報の取扱い",
    clauses: [
      { text: "乙は、顧問業務を通じて知り得た甲及び甲の家族の情報を、本契約の履行以外の目的に使用せず、甲の同意なく第三者に開示又は漏えいしない。ただし、法令に基づき開示を求められた場合を除く。" },
      { text: "乙は、甲及び甲の家族の個人情報を、個人情報の保護に関する法律その他の関係法令及び乙のプライバシーポリシーに従って適切に取り扱う。" },
      { text: "乙が第7条第3項の手続きのために取扱金融機関に甲の情報を提供する場合は、その都度甲の同意を得る。" },
      { text: "本条の義務は、本契約終了後も存続する。" },
    ],
  },
  {
    title: "書類及びデータの取扱い",
    clauses: [
      { text: "甲が乙に共有した書類の原本は、原則として甲が保管する。乙が原本を預かった場合、乙は善良な管理者の注意をもって保管し、業務完了後又は甲の求めに応じて速やかに返却する。" },
      { text: "乙は、甲から共有された電子データを、本契約の有効期間中及び終了後○年間、適切な安全管理措置を講じた上で保管し、その後は適切な方法で消去する。ただし、法令上保存が義務付けられているものを除く。" },
      { text: "乙が作成したライフプランその他の成果物の著作権は乙に帰属する。甲は、自己及び甲の家族の利用の目的に限り、成果物を自由に利用できる。" },
    ],
  },
  {
    title: "中途解約",
    clauses: [
      { text: "甲は、1か月前までに書面又は電磁的方法により乙に通知することにより、本契約を解約することができる。" },
      { text: "甲の都合による中途解約の場合、既に支払われた顧問料は【返金しない／未経過月数（1か月未満切捨て）に応じて月割りで返金する】。" },
      { text: "乙は、やむを得ない事由により顧問業務の継続が困難となった場合、1か月前までに甲に通知して本契約を解約することができる。この場合、乙は未経過期間に相当する顧問料を月割りで甲に返金する。" },
    ],
  },
  {
    title: "契約の解除",
    clauses: [
      { text: "甲又は乙は、相手方が次の各号のいずれかに該当した場合、催告なく直ちに本契約を解除することができる。",
        items: [
          "本契約に違反し、相当期間を定めた催告にもかかわらず是正されないとき",
          "支払停止、破産手続開始等の申立てがあったとき",
          "相手方に対する暴言、威迫、迷惑行為等により信頼関係が著しく損なわれたとき",
          "次条に違反したとき",
        ] },
      { text: "前項により解除された場合、甲の責めに帰すべき事由によるときは顧問料の返金は行わず、乙の責めに帰すべき事由によるときは未経過期間の顧問料を月割りで返金する。" },
    ],
  },
  {
    title: "反社会的勢力の排除",
    clauses: [
      "甲及び乙は、自己が暴力団、暴力団員、暴力団準構成員、暴力団関係企業、総会屋、社会運動等標ぼうゴロ、特殊知能暴力集団その他これらに準ずる者（以下「反社会的勢力」という。）に該当しないこと、及び将来にわたって該当しないことを表明し、保証する。",
    ],
  },
  {
    title: "損害賠償",
    clauses: [
      "甲又は乙は、本契約に違反して相手方に損害を与えた場合、相手方に対しその損害を賠償する。ただし、乙が甲に対して負う損害賠償の額は、乙の故意又は重過失による場合を除き、損害発生時に甲が乙に支払済みの直近1年分の顧問料の額を上限とする。",
    ],
  },
  {
    title: "契約内容の変更",
    clauses: [
      "本契約の内容は、甲乙の書面又は電磁的方法による合意によってのみ変更することができる。ただし、別表2の料金は、乙が甲に対し1か月前までに通知することにより、次回更新時から改定することができる。",
    ],
  },
  {
    title: "協議及び管轄",
    clauses: [
      { text: "本契約に定めのない事項及び本契約の解釈に疑義が生じた事項については、甲乙誠意をもって協議し解決する。" },
      { text: "本契約に関する紛争については、○○地方裁判所を第一審の専属的合意管轄裁判所とする。" },
    ],
  },
];

const CLOSING =
  "本契約の成立を証するため、本書2通を作成し、甲乙記名押印の上、各1通を保有する。電磁的方法により締結する場合は、電子契約サービスの記録をもって原本に代える。";

const SCHEDULE1 = {
  title: "別表1　顧問業務一覧（年額50,000円に含まれる業務）",
  header: ["項目", "内容", "実施時期"],
  rows: [
    ["ライフプラン", "初年度は新規作成、次年度以降は毎年更新", "初年度：契約後○か月以内\n2年目以降：年1回"],
    ["資産状況の確認", "預貯金・運用資産などを確認し、1年間でどれくらい増減したかチェック", "年1回"],
    ["目標進捗の確認", "教育費・住宅・老後など、設定した目標に対して予定通り進んでいるか確認", "年1回"],
    ["保険の確認", "現在の保障内容が家族状況・資産状況に合っているか確認", "年1回及び随時"],
    ["資産運用の確認", "NISA・iDeCo等を含め、積立額や運用状況、今後の方針を確認", "年1回及び随時"],
    ["書類丸投げ", "学校・会社・市区町村などから届いた、お金・保険・税金・年金等の書類を写真・PDF・必要に応じて郵送で共有してもらう", "随時"],
    ["書類への対応案内", "「何の書類か」「手続きが必要か」「この家庭ならどう対応するのがいいか」まで個別に解説", "随時"],
    ["ふるさと納税", "その年の上限額を計算", "年1回（甲の求めに応じて）"],
    ["日常のお金相談", "家計・制度・税金・年金・保険など、日常的な「これどうしたらいい？」を相談可能", "随時"],
  ],
};

const SCHEDULE2 = {
  title: "別表2　個別業務（オプション）料金表",
  header: ["個別業務", "内容", "顧問顧客（甲）", "（参考）ビジター"],
  rows: [
    ["住宅購入相談",
     "住宅ローンの組み方、借入額・返済方法の検討、固定・変動など金利タイプの考え方、ペアローン等の検討、団信の選び方、購入後の確定申告の補助 など",
     "20,000円",
     "50,000円\n（ライフプラン作成→住宅購入予算の決定→住宅ローン→団信→購入後の確定申告サポート）"],
    ["保険相談",
     "現在加入している保険の確認、必要保障額の整理、新規加入・見直し相談、ライフステージが変わったときの保障確認",
     "年間顧問料に含む",
     "基本無料（※1）"],
    ["NISA・iDeCo\n（乙又は乙の取扱金融機関を利用する場合）",
     "制度説明、NISA・iDeCoの考え方、積立金額、運用方針、商品選択の考え方、開設・運用開始までのサポート など（※2）",
     "無料",
     "無料"],
    ["ネット証券等のサポート\n（運用方針・ファンド選びの相談）",
     "NISA・iDeCo制度の確認、積立金額の検討、資産配分の考え方、ファンド選びの相談、現在の運用内容の確認",
     "年間顧問料に含む",
     "10,000円\n（証券会社選びの考え方、NISA・iDeCo制度説明、積立金額・運用方針の整理、ファンド選びの相談、口座開設・初期設定、積立設定等のサポート）"],
    ["ネット証券等の口座開設・積立設定サポート",
     "実際の口座開設や積立設定は原則として甲自身が行う。乙が設定完了まで同席して支援する場合",
     "5,000円",
     "上記10,000円に含む"],
  ],
  notes: [
    "料金はすべて消費税込み。",
    "※1 ビジターの保険相談は、必要に応じて乙の取扱商品の提案をしてもよい場合は無料とする。「今入っている保険の内容だけ解説してほしい」「団体保険や学校の保険を比較してほしい」「商品の提案は一切してほしくない」など、解説・比較のみを希望する場合は、スポット相談（○○円）として承る。提案をした場合でも、加入をおすすめすることや契約を前提とするものではない。",
    "※2 乙の取扱金融機関を利用する場合など、乙がIFA（金融商品仲介業者）としての立場で行う説明・サポートは、所属金融機関の定めに従う。",
  ],
};

const APPENDIX1 = {
  title: "別紙1　重要事項（保険商品・金融商品のご提案について）",
  lead: "第7条に基づき、乙は甲に対し次の事項を説明し、甲はその内容を確認しました。",
  items: [
    "乙は、○○生命保険株式会社ほか【取扱保険会社名】の保険募集人、及び【所属金融商品取引業者名】を所属金融商品取引業者とする金融商品仲介業者（IFA）です。",
    "乙は、顧問業務の中で、必要に応じて乙の取扱商品を提案することがあります。提案は情報提供・助言であり、加入や契約を前提とするものではありません。提案を受けた商品に加入・契約するかどうかは、甲が自由に判断できます。",
    "甲が乙又は乙の取扱金融機関を通じて商品に加入・契約し、又は口座を開設した場合、乙は当該金融機関から手数料等を受領することがあります。手数料等の有無・水準は、契約前に個別にご説明します。",
    "乙は、乙の取扱商品以外の商品（他社の保険、他の証券会社のネット口座等）についても、甲の求めに応じて中立的な立場で解説・比較を行います。ただし、他社商品の勧誘・媒介は行いません。",
    "金融商品の価格・利回りは変動し、元本が保証されるものではありません。最終的な判断は甲自身の責任で行っていただきます。",
  ],
  confirm: "上記の内容について説明を受け、理解しました。",
};

const APPENDIX2 = {
  title: "別紙2　スポット相談（ビジター）申込書 兼 同意書",
  lead: "年間顧問契約を締結していない方（ビジター）が個別相談を申し込む場合にご利用ください。",
  services: [
    ["□ 住宅購入相談", "50,000円（税込）", "ライフプラン作成／住宅購入予算の決定／住宅ローン／団信／購入後の確定申告サポート"],
    ["□ 保険相談", "無料", "現在の保険の確認／必要保障額の整理／新規加入・見直し／ライフステージ変化時の保障確認（必要に応じて取扱商品の提案あり）"],
    ["□ 保険の解説・比較のみ（提案なし）", "○○円（税込）", "現在加入中の保険の解説、団体保険・学校の保険等との比較のみ"],
    ["□ NISA・iDeCo相談（取扱金融機関を利用）", "無料", "制度説明／考え方／積立金額／運用方針／商品選択の考え方／開設・運用開始までのサポート"],
    ["□ ネット証券サポート", "10,000円（税込）", "証券会社選びの考え方／NISA・iDeCo制度説明／積立金額・運用方針の整理／ファンド選び／口座開設・初期設定／積立設定等のサポート"],
  ],
  consent: [
    "相談の範囲、責任の限定、秘密保持及び個人情報の取扱いについては、年間顧問契約書第7条、第8条、第10条及び別紙1の内容を準用することに同意します。",
    "金融商品・保険商品の提案を受けた場合でも、加入・契約の義務がないことを理解しました。",
    "最終的な判断は自身の責任で行うことを理解しました。",
  ],
};

// ---------------------------------------------------------------------------
// Markdown 出力
// ---------------------------------------------------------------------------

function toMarkdown() {
  const out = [];
  out.push("# 家計の顧問FP 年間顧問契約書（ドラフト）", "");
  out.push("> " + DRAFT_NOTICE.join("  \n> "), "");
  out.push(PARTY_INTRO, "");
  ARTICLES.forEach((a, i) => {
    out.push(`## 第${i + 1}条（${a.title}）`, "");
    if (a.clauses.length === 1 && typeof a.clauses[0] === "string") {
      out.push(a.clauses[0], "");
      return;
    }
    a.clauses.forEach((c, j) => {
      const text = typeof c === "string" ? c : c.text;
      out.push(`${j + 1}. ${text}`);
      if (typeof c !== "string" && c.items) {
        c.items.forEach((it, k) => out.push(`   (${k + 1}) ${it}`));
      }
    });
    out.push("");
  });
  out.push(CLOSING, "");
  out.push("令和　　年　　月　　日", "");
  out.push("| | 甲（お客様） | 乙（FP事務所） |", "|---|---|---|");
  out.push("| 住所 | | |", "| 氏名／事務所名 | | ○○FP事務所 |", "| 代表者 | | |", "| 印 | | |", "");

  const table = (t) => {
    out.push(`## ${t.title}`, "");
    out.push("| " + t.header.join(" | ") + " |");
    out.push("|" + t.header.map(() => "---").join("|") + "|");
    t.rows.forEach((r) => out.push("| " + r.map((c) => c.replace(/\n/g, "<br>")).join(" | ") + " |"));
    out.push("");
    if (t.notes) { t.notes.forEach((n) => out.push(n, "")); }
  };
  table(SCHEDULE1);
  table(SCHEDULE2);

  out.push(`## ${APPENDIX1.title}`, "", APPENDIX1.lead, "");
  APPENDIX1.items.forEach((it, i) => out.push(`${i + 1}. ${it}`));
  out.push("", `${APPENDIX1.confirm}　　令和　　年　　月　　日　　甲 氏名：＿＿＿＿＿＿＿＿`, "");

  out.push(`## ${APPENDIX2.title}`, "", APPENDIX2.lead, "");
  out.push("| 希望する相談 | 料金 | 内容 |", "|---|---|---|");
  APPENDIX2.services.forEach((r) => out.push("| " + r.join(" | ") + " |"));
  out.push("", "**同意事項**", "");
  APPENDIX2.consent.forEach((c) => out.push(`- ${c}`));
  out.push("", "令和　　年　　月　　日　　氏名：＿＿＿＿＿＿＿＿　　連絡先：＿＿＿＿＿＿＿＿", "");
  return out.join("\n");
}

// ---------------------------------------------------------------------------
// DOCX 出力
// ---------------------------------------------------------------------------

const FONT = { ascii: "游明朝", hAnsi: "游明朝", eastAsia: "游明朝", cs: "游明朝" };
const FONT_G = { ascii: "游ゴシック", hAnsi: "游ゴシック", eastAsia: "游ゴシック", cs: "游ゴシック" };
const PAGE_W = 11906, MARGIN = 1134, CONTENT_W = PAGE_W - MARGIN * 2; // A4, 2cm margins
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const HEAD_FILL = "E8EEF5";

const run = (text, opts = {}) => new TextRun({ text, font: FONT, size: 21, ...opts });
const gRun = (text, opts = {}) => new TextRun({ text, font: FONT_G, size: 21, ...opts });

function body(text, opts = {}) {
  return new Paragraph({ children: [run(text)], spacing: { after: 80, line: 340 }, ...opts });
}

function cellParas(text, { bold = false, size = 18 } = {}) {
  return text.split("\n").map((t) => new Paragraph({
    children: [new TextRun({ text: t, font: bold ? FONT_G : FONT, size, bold })],
    spacing: { after: 20, line: 280 },
  }));
}

function cell(text, width, { header = false, fill } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: BORDERS,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    shading: fill ? { type: ShadingType.CLEAR, color: "auto", fill } : undefined,
    children: cellParas(text, { bold: header }),
  });
}

function table(header, rows, widths) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: header.map((h, i) => cell(h, widths[i], { header: true, fill: HEAD_FILL })) }),
      ...rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, widths[i])) })),
    ],
  });
}

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [gRun(text, { bold: true, size: 22 })],
    spacing: { before: 240, after: 100 },
    keepNext: true,
  });
}

function buildDocx() {
  const children = [];

  // 表紙相当（タイトル・注意書き）
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [gRun("家計の顧問FP　年間顧問契約書", { bold: true, size: 36 })],
    spacing: { before: 400, after: 120 },
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [gRun("（ドラフト）", { size: 22, color: "9C2F2F" })],
    spacing: { after: 300 },
  }));
  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: "9C2F2F" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "9C2F2F" }, left: { style: BorderStyle.SINGLE, size: 6, color: "9C2F2F" }, right: { style: BorderStyle.SINGLE, size: 6, color: "9C2F2F" } },
      shading: { type: ShadingType.CLEAR, color: "auto", fill: "FBF3F3" },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: DRAFT_NOTICE.map((t, i) => new Paragraph({
        children: [new TextRun({ text: t, font: FONT_G, size: 18, bold: i === 0 })],
        spacing: { after: 40, line: 280 },
      })),
    })] })],
  }));
  children.push(new Paragraph({ children: [], spacing: { after: 200 } }));
  children.push(body(PARTY_INTRO, { indent: { firstLine: 210 } }));

  ARTICLES.forEach((a, i) => {
    children.push(heading(`第${i + 1}条（${a.title}）`));
    if (a.clauses.length === 1 && typeof a.clauses[0] === "string") {
      children.push(body(a.clauses[0], { indent: { firstLine: 210 } }));
      return;
    }
    a.clauses.forEach((c) => {
      const text = typeof c === "string" ? c : c.text;
      children.push(new Paragraph({
        children: [run(text)],
        numbering: { reference: "clauses", level: 0, instance: i + 1 },
        spacing: { after: 80, line: 340 },
      }));
      if (typeof c !== "string" && c.items) {
        c.items.forEach((it) => children.push(new Paragraph({
          children: [run(it)],
          numbering: { reference: "clauses", level: 1, instance: i + 1 },
          spacing: { after: 60, line: 340 },
        })));
      }
    });
  });

  // 署名欄
  children.push(new Paragraph({ children: [run(CLOSING)], spacing: { before: 300, after: 200 }, indent: { firstLine: 210 } }));
  children.push(body("令和　　年　　月　　日", { alignment: AlignmentType.LEFT, spacing: { after: 200 } }));
  const SIGN_W = [1400, 4119, 4119];
  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: SIGN_W,
    rows: [
      new TableRow({ children: [cell("", SIGN_W[0], { fill: HEAD_FILL }), cell("甲（お客様）", SIGN_W[1], { header: true, fill: HEAD_FILL }), cell("乙（FP事務所）", SIGN_W[2], { header: true, fill: HEAD_FILL })] }),
      new TableRow({ children: [cell("住所", SIGN_W[0]), cell("\n", SIGN_W[1]), cell("\n", SIGN_W[2])] }),
      new TableRow({ children: [cell("氏名／事務所名", SIGN_W[0]), cell("\n", SIGN_W[1]), cell("○○FP事務所\n", SIGN_W[2])] }),
      new TableRow({ children: [cell("代表者・印", SIGN_W[0]), cell("\n　　　　　　　　　　　　　　　　　　㊞", SIGN_W[1]), cell("\n　　　　　　　　　　　　　　　　　　㊞", SIGN_W[2])] }),
    ],
  }));

  // 別表1
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(heading(SCHEDULE1.title));
  children.push(table(SCHEDULE1.header, SCHEDULE1.rows, [1900, 5338, 2400]));

  // 別表2
  children.push(new Paragraph({ children: [], spacing: { after: 300 } }));
  children.push(heading(SCHEDULE2.title));
  children.push(table(SCHEDULE2.header, SCHEDULE2.rows, [2100, 3538, 1600, 2400]));
  SCHEDULE2.notes.forEach((n, i) => children.push(new Paragraph({
    children: [new TextRun({ text: n, font: FONT, size: 18 })],
    spacing: { before: i === 0 ? 120 : 40, after: 40, line: 280 },
  })));

  // 別紙1
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(heading(APPENDIX1.title));
  children.push(body(APPENDIX1.lead));
  APPENDIX1.items.forEach((it) => children.push(new Paragraph({
    children: [run(it)], numbering: { reference: "clauses", level: 0, instance: 100 }, spacing: { after: 100, line: 340 },
  })));
  children.push(new Paragraph({
    children: [run(APPENDIX1.confirm)], spacing: { before: 300, after: 120 },
  }));
  children.push(body("令和　　年　　月　　日　　　甲 氏名：＿＿＿＿＿＿＿＿＿＿＿＿＿＿　㊞"));

  // 別紙2
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(heading(APPENDIX2.title));
  children.push(body(APPENDIX2.lead));
  children.push(table(["希望する相談（□にチェック）", "料金", "内容"], APPENDIX2.services, [2900, 1700, 5038]));
  children.push(new Paragraph({ children: [gRun("同意事項", { bold: true, size: 20 })], spacing: { before: 240, after: 80 } }));
  APPENDIX2.consent.forEach((c) => children.push(new Paragraph({
    children: [run(c)], numbering: { reference: "bullets", level: 0 }, spacing: { after: 60, line: 340 },
  })));
  children.push(new Paragraph({ children: [], spacing: { after: 200 } }));
  const AP_W = [1600, 8038];
  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: AP_W,
    rows: [
      ["申込日", "令和　　年　　月　　日"],
      ["氏名", "\n"],
      ["連絡先（電話・メール）", "\n"],
      ["相談したいこと（自由記入）", "\n\n"],
    ].map(([k, v]) => new TableRow({ children: [cell(k, AP_W[0], { fill: HEAD_FILL }), cell(v, AP_W[1])] })),
  }));

  return new Document({
    creator: "○○FP事務所",
    title: "家計の顧問FP 年間顧問契約書（ドラフト）",
    styles: {
      default: { document: { run: { font: FONT, size: 21 } } },
      paragraphStyles: [
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT_G, size: 22, bold: true }, paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
      ],
    },
    numbering: {
      config: [
        { reference: "clauses", levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 420, hanging: 420 } }, run: { font: FONT } } },
          { level: 1, format: LevelFormat.DECIMAL, text: "(%2)", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 900, hanging: 480 } }, run: { font: FONT } } },
        ] },
        { reference: "bullets", levels: [
          { level: 0, format: LevelFormat.BULLET, text: "・", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 420, hanging: 300 } } } },
        ] },
      ],
    },
    sections: [{
      properties: {
        page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 1300, bottom: 1300, left: MARGIN, right: MARGIN } },
      },
      footers: {
        default: new (require("docx").Footer)({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [require("docx").PageNumber.CURRENT], font: FONT, size: 18 })],
        })] }),
      },
      children,
    }],
  });
}

// ---------------------------------------------------------------------------

async function main() {
  const outDir = __dirname;
  fs.writeFileSync(path.join(outDir, "contract.md"), toMarkdown(), "utf8");
  const buf = await Packer.toBuffer(buildDocx());
  fs.writeFileSync(path.join(outDir, "顧問契約書_ドラフト.docx"), buf);
  console.log("wrote contract.md and 顧問契約書_ドラフト.docx");
}

main().catch((e) => { console.error(e); process.exit(1); });
