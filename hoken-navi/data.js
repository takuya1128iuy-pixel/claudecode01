/* 保険のお手続きナビ データ
 *
 * リンクはすべて各社の「公開ページ」を検索で集めたもので、こちらでは開いて確認できていない。
 * 公開前に `node tools/check-links.mjs` を実行して、生きているURLか必ず確かめること。
 * 各社サイトはリニューアルでURLが変わりやすいので、定期的な再チェックが要る。
 *
 * tel は各社の公式サイトで公開されている代表窓口。telNote に窓口名と受付時間を書く。
 * extraTels は手続き専用ダイヤルがある会社のぶん（給付金請求・控除証明書再発行など）。
 * 受付時間は変わりやすいので、番号を足すときは必ず公式サイトで確認すること。
 *
 * status:
 *   'direct' … その手続きの専用ページが分かっているもの
 *   'list'   … 会社の「お手続き一覧」に飛ばし、そこから選んでもらうもの
 */
var HOKEN = {
  updatedAt: '2026-09-05',
  // 収録リンクを最後に全件疎通確認した日。CI（毎月1日と hoken-navi 変更時）で確認している。
  checkedAt: '2026-09-05',

  // needs / duration / pitfalls は「リンク先に行く前に知りたいこと」。
  // 会社ごとに違うので、あくまで一般的な目安として出している。
  procedures: [
    { id: 'address', icon: '🏠', label: '住所・氏名の変更', desc: '引っ越し・結婚などで登録内容が変わったとき',
      needs: ['証券番号（保険証券やご契約内容のお知らせに記載）', '新しい住所'],
      duration: 'Webなら5〜10分。反映まで数営業日',
      pitfalls: [
        '複数社に加入している場合は、会社ごとに手続きが必要です',
        '契約者と被保険者の両方の住所が変わるときは、別の手続きになることがあります',
      ],
    },
    { id: 'payment', icon: '💳', label: 'クレジットカード・口座変更', desc: '保険料の引き落とし先を変えるとき',
      needs: ['証券番号', '新しい口座番号またはクレジットカード', 'キャッシュカードや通帳（口座振替の場合）'],
      duration: 'Web完結なら10分ほど。切替は翌月または翌々月の引き落としから',
      pitfalls: [
        '切替が間に合わないと、旧口座から1回引き落とされることがあります',
        '口座やカードの名義が契約者と違うと、受け付けられない場合があります',
      ],
    },
    { id: 'certificate', icon: '📄', label: '控除証明書の再発行', desc: '年末調整・確定申告で使う証明書をなくしたとき',
      needs: ['証券番号', '登録している住所'],
      duration: '再発行の到着まで1週間ほど',
      pitfalls: [
        '登録住所が古いままだと届きません。先に住所変更を',
        '10月〜11月は各社の窓口が混み合います。早めの手続きが安全です',
      ],
    },
    { id: 'beneficiary', icon: '👪', label: '受取人・契約者の変更', desc: '受取人や契約者を変えるとき',
      needs: ['証券番号', '新しい受取人の氏名・生年月日・続柄'],
      duration: '書類のやり取りが必要で、2週間ほどかかることが多い',
      pitfalls: [
        '受取人になれる範囲が決まっている会社があります（配偶者・二親等以内など）',
        '被保険者の同意が必要な場合があります',
      ],
    },
    { id: 'claim', icon: '🏥', label: '給付金・保険金の請求', desc: '入院・手術・万一のとき',
      needs: ['証券番号', '入院・手術の期間と病名', '診断書や領収書（会社により異なります）'],
      duration: '書類が揃ってから5営業日前後で支払われることが多い',
      pitfalls: [
        '診断書は自己負担になることがあります。まず必要書類を会社に確認してください',
        '請求には時効があります（一般に3年）。古い入院でも一度ご相談を',
      ],
    },
    { id: 'loan', icon: '🏦', label: '契約者貸付・解約', desc: '一時的にお金が必要なとき／やめるとき',
      needs: ['証券番号', '本人確認書類'],
      duration: '契約者貸付はWebなら即日〜数営業日',
      pitfalls: [
        '解約は元に戻せません。減額や払済など、続けたまま負担を減らす方法もあります',
        '貸付には利息がつきます。返済しないと保険が失効することがあります',
      ],
    },
  ],

  companies: [
    {
      id: 'nissay', name: '日本生命',
      tel: '0120-201-021', telNote: 'ニッセイコールセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: 'ニッセイマイページ', url: 'https://www.nissay.co.jp/keiyaku/' },
      top: 'https://www.nissay.co.jp/keiyaku/',
      links: {
        address: 'https://www.nissay.co.jp/keiyaku/tetsuzuki/henko/kojinjohohen.html',
        certificate: 'https://www.nissay.co.jp/keiyaku/tetsuzuki/sonohoka/kojo/',
      },
    },
    {
      id: 'dai-ichi', name: '第一生命',
      tel: '0120-157-157', telNote: '第一生命コンタクトセンター 平日9:00〜18:00／土9:00〜17:00',
      extraTels: { claim: { tel: '0120-211-157', note: '入院・手術給付金／死亡保険金 専用ダイヤル' } },
      portal: { name: 'ご契約者専用サイト', url: 'https://www.dai-ichi-life.co.jp/contractor/' },
      top: 'https://www.dai-ichi-life.co.jp/contractor/change/index.html',
      links: {
        address: 'https://www.dai-ichi-life.co.jp/contractor/change/address/index.html',
        payment: 'https://www.dai-ichi-life.co.jp/contractor/change/account/index.html',
        beneficiary: 'https://www.dai-ichi-life.co.jp/contractor/change/uketori/index.html',
      },
    },
    {
      id: 'meijiyasuda', name: '明治安田生命',
      tel: '0120-662-332', telNote: 'コミュニケーションセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: 'MYほけんページ', url: 'https://www.meijiyasuda.co.jp/contractor/myhoken/' },
      top: 'https://www.meijiyasuda.co.jp/contractor/guide/',
      links: {
        certificate: 'https://www.meijiyasuda.co.jp/contractor/service/detail/14.html',
      },
    },
    {
      id: 'sumitomo', name: '住友生命',
      tel: '0120-307-506', telNote: 'スミセイコールセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: 'スミセイダイレクトサービス', url: 'https://www.sumitomolife.co.jp/contract/ds/' },
      top: 'https://www.sumitomolife.co.jp/contract/service/index.html',
      links: {
        address: 'https://www.sumitomolife.co.jp/contract/service/detail/coaa.html',
      },
    },
    {
      id: 'kampo', name: 'かんぽ生命',
      tel: '0120-552-950', telNote: 'かんぽコールセンター 平日9:00〜21:00／土日祝9:00〜17:00',
      portal: { name: 'かんぽ生命マイページ', url: 'https://www.jp-life.japanpost.jp/customer/index.html' },
      top: 'https://www.jp-life.japanpost.jp/customer/procedure/index.html',
      links: {
        address: 'https://www.jp-life.japanpost.jp/customer/procedure/address.html',
      },
    },
    {
      id: 'aflac', name: 'アフラック生命',
      tel: '0120-5555-95', telNote: 'アフラックコールセンター 平日9:00〜18:00／土9:00〜17:00',
      extraTels: { claim: { tel: '0120-555-877', note: '給付金・保険金のご請求（オペレーター 平日9:00〜17:00）' } },
      portal: { name: 'アフラック よりそうネット', url: 'https://www.aflac.co.jp/canet/' },
      top: 'https://www.aflac.co.jp/keiyaku/step/index.html',
      links: {
        address: 'https://www.aflac.co.jp/keiyaku/step/address_change.html',
        payment: 'https://www.aflac.co.jp/keiyaku/step/account_change.html',
        beneficiary: 'https://www.aflac.co.jp/keiyaku/step/beneficiary_change.html',
      },
    },
    {
      id: 'metlife', name: 'メットライフ生命',
      tel: '0120-881-796', telNote: 'カスタマーサービスセンター 月〜土9:00〜18:00',
      portal: { name: 'ご契約者さまWEBサービス', url: 'https://www.metlife.co.jp/customer/' },
      top: 'https://www.metlife.co.jp/customer/procedures/',
      links: {
        address: 'https://www.metlife.co.jp/customer/procedures/address/',
        certificate: 'https://www.metlife.co.jp/customer/procedures/document/life/',
      },
    },
    {
      id: 'sonylife', name: 'ソニー生命',
      tel: '0120-158-821', telNote: 'カスタマーセンター 9:00〜17:30（日曜・年末年始を除く）',
      portal: { name: 'お客さま専用WEBサービス', url: 'https://www.sonylife.co.jp/contractor/' },
      top: 'https://www.sonylife.co.jp/contractor/guide/',
      links: {
        address: 'https://www.sonylife.co.jp/contractor/guide/address/',
        payment: 'https://www.sonylife.co.jp/contractor/guide/bank/',
      },
    },
    {
      id: 'orixlife', name: 'オリックス生命',
      tel: '0120-506-094', telNote: 'カスタマーサービスセンター 月〜土9:00〜18:00',
      extraTels: { certificate: { tel: '0120-155-131', note: '控除証明書の再発行など 24時間自動音声' } },
      portal: { name: 'WEBお手続きページ', url: 'https://www.orixlife.co.jp/customer/ivr/' },
      top: 'https://www.orixlife.co.jp/customer/',
      links: {
        address: 'https://faq.orixlife.co.jp/faq_detail.html?id=8401535',
        payment: 'https://www.orixlife.co.jp/customer/procedures/payment/',
        certificate: 'https://faq.orixlife.co.jp/faq_detail.html?id=8401577',
      },
    },
    {
      id: 'fwdlife', name: 'FWD生命',
      tel: '0120-211-901', telNote: '総合サービスセンター 平日9:00〜18:00',
      extraTels: { payment: { tel: '0120-622-211', note: 'クレジットカード関連 24時間自動音声' } },
      portal: { name: 'ご契約者さまページ', url: 'https://www.fwdlife.co.jp/support/' },
      top: 'https://www.fwdlife.co.jp/support/_procedure/',
      links: {
        payment: 'https://www.fwdlife.co.jp/support/procedure/payment/',
      },
    },
    {
      id: 'nnlife', name: 'エヌエヌ生命',
      tel: '0120-521-513', telNote: 'サービスセンター 平日9:00〜17:00',
      portal: { name: 'マイページ', url: 'https://www.nnlife.co.jp/customers/mypage' },
      top: 'https://www.nnlife.co.jp/customers/services/list',
      links: {
        address: 'https://www.nnlife.co.jp/customers/services/registration/address',
        loan: 'https://www.nnlife.co.jp/customers/services/policy_loan',
      },
    },
    {
      id: 'tmn-anshin', name: '東京海上日動あんしん生命',
      tel: '0120-016-234', telNote: 'カスタマーセンター 平日9:00〜18:00／土9:00〜17:00',
      extraTels: { claim: { tel: '0120-536-338', note: '保険金請求受付 平日8:00〜18:00／土9:00〜17:00' }, certificate: { tel: '0120-733-669', note: '控除証明書再発行 専用ダイヤル 平日9:00〜18:00' } },
      portal: { name: '東京海上日動マイページ', url: 'https://www.tmn-anshin.co.jp/keiyaku/' },
      top: 'https://www.tmn-anshin.co.jp/keiyaku/contract/',
      links: {
        address: 'https://www.tmn-anshin.co.jp/keiyaku/contract/address/',
        payment: 'https://www.tmn-anshin.co.jp/keiyaku/pmethod/account/',
      },
    },
    {
      id: 'himawari', name: 'SOMPOひまわり生命',
      tel: '0120-563-506', telNote: 'カスタマーセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: 'MYひまわり', url: 'https://www.himawari-life.co.jp/customer/' },
      top: 'https://www.himawari-life.co.jp/customer/',
      links: {
        address: 'https://www.himawari-life.co.jp/customer/address/',
        payment: 'https://www.himawari-life.co.jp/customer/account/',
        certificate: 'https://www.himawari-life.co.jp/customer/kojo/',
        beneficiary: 'https://www.himawari-life.co.jp/customer/contractor/',
      },
    },
    {
      id: 'msa-life', name: '三井住友海上あいおい生命',
      tel: '0120-324-386', telNote: 'カスタマーセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: 'お客さまWebサービス', url: 'https://www.msa-life.co.jp/customer/service/' },
      top: 'https://www.msa-life.co.jp/customer/msa/procedure/',
      links: {
        address: 'https://www.msa-life.co.jp/customer/msa/procedure/address/',
        beneficiary: 'https://www.msa-life.co.jp/customer/change/05.html',
      },
    },
    {
      id: 'axa', name: 'アクサ生命',
      tel: '0120-568-093', telNote: 'カスタマーサービスセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: 'MyAXA', url: 'https://www.axa.co.jp/customer/' },
      top: 'https://www.axa.co.jp/customer/',
      links: {
        address: 'https://www.axa.co.jp/customer/guide/change-address/',
        beneficiary: 'https://www.axa.co.jp/customer/guide/change-customer/',
      },
    },
    {
      id: 'daido', name: '大同生命',
      tel: '0120-789-501', telNote: 'コールセンター 平日9:00〜17:00（住所変更・控除証明書は24時間自動音声）',
      portal: { name: 'お客さまページ', url: 'https://www.daido-life.co.jp/c_keiyaku/' },
      top: 'https://www.daido-life.co.jp/c_keiyaku/procedure/',
      links: {
        address: 'https://www.daido-life.co.jp/c_keiyaku/procedure/change_address.html',
        beneficiary: 'https://www.daido-life.co.jp/c_keiyaku/procedure/change_namet.html',
      },
    },
    {
      id: 'taiyo', name: '太陽生命',
      tel: '0120-97-2111', telNote: 'お客様サービスセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: '太陽生命マイページ', url: 'https://www.taiyo-seimei.co.jp/customer/' },
      top: 'https://www.taiyo-seimei.co.jp/customer/procedure/index.html',
      links: {
        address: 'https://www.taiyo-seimei.co.jp/customer/procedure/address_c.html',
        payment: 'https://www.taiyo-seimei.co.jp/customer/procedure/hoken_f.html',
      },
    },
    {
      id: 'gib-life', name: 'ジブラルタ生命',
      tel: '0120-37-2269', telNote: 'カスタマーサービスセンター 平日9:00〜18:00／土9:00〜17:00',
      portal: { name: 'Myページ', url: 'https://www.gib-life.co.jp/st/keiyaku/' },
      top: 'https://www.gib-life.co.jp/st/keiyaku/process/index.html',
      links: {
        address: 'https://www.gib-life.co.jp/st/keiyaku/process/adress/',
      },
    },
    {
      id: 'prudential', name: 'プルデンシャル生命',
      tel: '0120-810-740', telNote: 'カスタマーサービスセンター 平日9:00〜17:30／土9:00〜17:00',
      portal: { name: 'Myページ', url: 'https://www.prudential.co.jp/contractor/' },
      top: 'https://www.prudential.co.jp/contractor/process/',
      links: {
        address: 'https://www.prudential.co.jp/contractor/process/henkou/henkou02.html',
        beneficiary: 'https://www.prudential.co.jp/contractor/process/henkou/',
      },
    },
    {
      id: 'asahi-life', name: '朝日生命',
      tel: '0120-714-532', telNote: 'お客様サービスセンター 月〜土9:00〜17:00',
      portal: { name: 'あさひマイページ', url: 'https://www.asahi-life.co.jp/service/' },
      top: 'https://www.asahi-life.co.jp/service/',
      links: {
        address: 'https://www.asahi-life.co.jp/service/tetuzuki/t05.html',
        beneficiary: 'https://www.asahi-life.co.jp/service/tetuzuki/t07.html',
      },
    },
    {
      id: 'fukoku', name: 'フコク生命（富国生命）',
      tel: '0120-259-817', telNote: 'フコク生命お客さまセンター 平日9:00〜17:00',
      portal: { name: 'ご契約者専用サービス', url: 'https://www.fukoku-life.co.jp/contract/' },
      top: 'https://www.fukoku-life.co.jp/contract/procedure/index.html',
      links: {
        address: 'https://www.fukoku-life.co.jp/contract/procedure/change/01.html',
      },
    },
    {
      id: 'manulife', name: 'マニュライフ生命',
      tel: '0120-063-730', telNote: 'コールセンター 平日9:00〜17:00',
      portal: { name: 'マイページ', url: 'https://www.manulife.co.jp/ja/policyholder.html' },
      top: 'https://www.manulife.co.jp/ja/policyholder/procedure.html',
      links: {
        address: 'https://www.manulife.co.jp/ja/policyholder/procedure/procedure-address.html',
        payment: 'https://www.manulife.co.jp/ja/policyholder/procedure/procedure-regularpremium.html',
        beneficiary: 'https://www.manulife.co.jp/ja/policyholder/procedure/procedure-owner.html',
      },
    },
    {
      id: 'neofirst', name: '第一ネオ生命（旧ネオファースト生命）',
      tel: '0120-312-201', telNote: 'コンタクトセンター 9:00〜17:00（日・祝を除く）',
      portal: { name: 'マイページ', url: 'https://neofirst.co.jp/customer/' },
      top: 'https://neofirst.co.jp/customer/procedure/',
      links: {
        address: 'https://neofirst.co.jp/customer/procedure/address.html',
      },
    },
    {
      id: 'lifenet', name: 'ライフネット生命',
      tel: '0120-205-566', telNote: 'コンタクトセンター 平日9:00〜20:00／土日祝9:00〜18:00',
      extraTels: { claim: { tel: '0120-717-991', note: '保険金・給付金のご請求 平日9:00〜17:30' } },
      portal: { name: 'マイページ', url: 'https://www.lifenet-seimei.co.jp/customer/' },
      top: 'https://www.lifenet-seimei.co.jp/customer/',
      links: {
        address: 'https://www.lifenet-seimei.co.jp/customer/registration/',
      },
    },
    {
      id: 'zurichlife', name: 'チューリッヒ生命',
      tel: '0120-236-523', telNote: 'カスタマーケアセンター 月〜土9:00〜18:00',
      portal: { name: 'マイページ（Z-Life）', url: 'https://www.zurichlife.co.jp/customer/z-life/' },
      top: 'https://www.zurichlife.co.jp/vivr/list',
      links: {
        address: 'https://www.zurichlife.co.jp/customer/z-life/guide/address',
      },
    },
  ],
};

if (typeof module !== 'undefined') module.exports = HOKEN;
