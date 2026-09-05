/* 保険のお手続きナビ データ
 *
 * リンクはすべて各社の「公開ページ」を検索で集めたもので、こちらでは開いて確認できていない。
 * 公開前に `node tools/check-links.mjs` を実行して、生きているURLか必ず確かめること。
 * 各社サイトはリニューアルでURLが変わりやすいので、定期的な再チェックが要る。
 *
 * tel は検索結果で番号が確認できた会社にだけ入れている（自動音声・専用ダイヤルを含む）。
 * 番号は用途が限られる場合があるので、追加するときは必ず公式サイトで確認すること。
 *
 * status:
 *   'direct' … その手続きの専用ページが分かっているもの
 *   'list'   … 会社の「お手続き一覧」に飛ばし、そこから選んでもらうもの
 */
var HOKEN = {
  updatedAt: '2026-09-05',

  procedures: [
    { id: 'address', icon: '🏠', label: '住所・氏名の変更', desc: '引っ越し・結婚などで登録内容が変わったとき' },
    { id: 'payment', icon: '💳', label: 'クレジットカード・口座変更', desc: '保険料の引き落とし先を変えるとき' },
    { id: 'certificate', icon: '📄', label: '控除証明書の再発行', desc: '年末調整・確定申告で使う証明書をなくしたとき' },
    { id: 'beneficiary', icon: '👪', label: '受取人・契約者の変更', desc: '受取人や契約者を変えるとき' },
    { id: 'claim', icon: '🏥', label: '給付金・保険金の請求', desc: '入院・手術・万一のとき' },
    { id: 'loan', icon: '🏦', label: '契約者貸付・解約', desc: '一時的にお金が必要なとき／やめるとき' },
  ],

  companies: [
    {
      id: 'nissay', name: '日本生命',
      portal: { name: 'ニッセイマイページ', url: 'https://www.nissay.co.jp/keiyaku/' },
      top: 'https://www.nissay.co.jp/keiyaku/',
      links: {
        address: 'https://www.nissay.co.jp/keiyaku/tetsuzuki/henko/kojinjohohen.html',
        certificate: 'https://www.nissay.co.jp/keiyaku/tetsuzuki/sonohoka/kojo/',
      },
    },
    {
      id: 'dai-ichi', name: '第一生命',
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
      portal: { name: 'MYほけんページ', url: 'https://www.meijiyasuda.co.jp/contractor/myhoken/' },
      top: 'https://www.meijiyasuda.co.jp/contractor/guide/',
      links: {
        certificate: 'https://www.meijiyasuda.co.jp/contractor/service/detail/14.html',
      },
    },
    {
      id: 'sumitomo', name: '住友生命',
      portal: { name: 'スミセイダイレクトサービス', url: 'https://www.sumitomolife.co.jp/contract/ds/' },
      top: 'https://www.sumitomolife.co.jp/contract/service/index.html',
      links: {
        address: 'https://www.sumitomolife.co.jp/contract/service/detail/coaa.html',
      },
    },
    {
      id: 'kampo', name: 'かんぽ生命',
      portal: { name: 'かんぽ生命マイページ', url: 'https://www.jp-life.japanpost.jp/customer/index.html' },
      top: 'https://www.jp-life.japanpost.jp/customer/procedure/index.html',
      links: {
        address: 'https://www.jp-life.japanpost.jp/customer/procedure/address.html',
      },
    },
    {
      id: 'aflac', name: 'アフラック生命',
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
      portal: { name: 'ご契約者さまWEBサービス', url: 'https://www.metlife.co.jp/customer/' },
      top: 'https://www.metlife.co.jp/customer/procedures/',
      links: {
        address: 'https://www.metlife.co.jp/customer/procedures/address/',
        certificate: 'https://www.metlife.co.jp/customer/procedures/document/life/',
      },
    },
    {
      id: 'sonylife', name: 'ソニー生命',
      portal: { name: 'お客さま専用WEBサービス', url: 'https://www.sonylife.co.jp/contractor/' },
      top: 'https://www.sonylife.co.jp/contractor/guide/',
      links: {
        address: 'https://www.sonylife.co.jp/contractor/guide/address/',
        payment: 'https://www.sonylife.co.jp/contractor/guide/bank/',
      },
    },
    {
      id: 'orixlife', telNote: '24時間自動音声（控除証明書の再発行など）', tel: '0120-155-131', name: 'オリックス生命',
      portal: { name: 'WEBお手続きページ', url: 'https://www.orixlife.co.jp/customer/ivr/' },
      top: 'https://www.orixlife.co.jp/customer/',
      links: {
        address: 'https://faq.orixlife.co.jp/faq_detail.html?id=8401535',
        payment: 'https://www.orixlife.co.jp/customer/procedures/payment/',
        certificate: 'https://faq.orixlife.co.jp/faq_detail.html?id=8401577',
      },
    },
    {
      id: 'fwdlife', telNote: '24時間自動音声（クレジットカード関連）', tel: '0120-622-211', name: 'FWD生命',
      portal: { name: 'ご契約者さまページ', url: 'https://www.fwdlife.co.jp/support/' },
      top: 'https://www.fwdlife.co.jp/support/_procedure/',
      links: {
        payment: 'https://www.fwdlife.co.jp/support/procedure/payment/',
      },
    },
    {
      id: 'nnlife', telNote: 'サービスセンター（平日9:00〜17:00）', tel: '0120-521-513', name: 'エヌエヌ生命',
      portal: { name: 'マイページ', url: 'https://www.nnlife.co.jp/customers/mypage' },
      top: 'https://www.nnlife.co.jp/customers/services/list',
      links: {
        address: 'https://www.nnlife.co.jp/customers/services/registration/address',
        loan: 'https://www.nnlife.co.jp/customers/services/policy_loan',
      },
    },
    {
      id: 'tmn-anshin', name: '東京海上日動あんしん生命',
      portal: { name: '東京海上日動マイページ', url: 'https://www.tmn-anshin.co.jp/keiyaku/' },
      top: 'https://www.tmn-anshin.co.jp/keiyaku/contract/',
      links: {
        address: 'https://www.tmn-anshin.co.jp/keiyaku/contract/address/',
        payment: 'https://www.tmn-anshin.co.jp/keiyaku/pmethod/account/',
      },
    },
    {
      id: 'himawari', name: 'SOMPOひまわり生命',
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
      id: 'msa-life', telNote: 'コールセンター（通話料有料）', tel: '0476-31-4600', name: '三井住友海上あいおい生命',
      portal: { name: 'お客さまWebサービス', url: 'https://www.msa-life.co.jp/customer/service/' },
      top: 'https://www.msa-life.co.jp/customer/msa/procedure/',
      links: {
        address: 'https://www.msa-life.co.jp/customer/msa/procedure/address/',
        beneficiary: 'https://www.msa-life.co.jp/customer/change/05.html',
      },
    },
    {
      id: 'axa', name: 'アクサ生命',
      portal: { name: 'MyAXA', url: 'https://www.axa.co.jp/customer/' },
      top: 'https://www.axa.co.jp/customer/',
      links: {
        address: 'https://www.axa.co.jp/customer/guide/change-address/',
        beneficiary: 'https://www.axa.co.jp/customer/guide/change-customer/',
      },
    },
    {
      id: 'daido', telNote: 'コールセンター', tel: '0120-789-501', name: '大同生命',
      portal: { name: 'お客さまページ', url: 'https://www.daido-life.co.jp/c_keiyaku/' },
      top: 'https://www.daido-life.co.jp/c_keiyaku/procedure/',
      links: {
        address: 'https://www.daido-life.co.jp/c_keiyaku/procedure/change_address.html',
        beneficiary: 'https://www.daido-life.co.jp/c_keiyaku/procedure/change_namet.html',
      },
    },
    {
      id: 'taiyo', name: '太陽生命',
      portal: { name: '太陽生命マイページ', url: 'https://www.taiyo-seimei.co.jp/customer/' },
      top: 'https://www.taiyo-seimei.co.jp/customer/procedure/index.html',
      links: {
        address: 'https://www.taiyo-seimei.co.jp/customer/procedure/address_c.html',
        payment: 'https://www.taiyo-seimei.co.jp/customer/procedure/hoken_f.html',
      },
    },
    {
      id: 'gib-life', name: 'ジブラルタ生命',
      portal: { name: 'Myページ', url: 'https://www.gib-life.co.jp/st/keiyaku/' },
      top: 'https://www.gib-life.co.jp/st/keiyaku/process/index.html',
      links: {
        address: 'https://www.gib-life.co.jp/st/keiyaku/process/adress/',
      },
    },
    {
      id: 'prudential', name: 'プルデンシャル生命',
      portal: { name: 'Myページ', url: 'https://www.prudential.co.jp/contractor/' },
      top: 'https://www.prudential.co.jp/contractor/process/',
      links: {
        address: 'https://www.prudential.co.jp/contractor/process/henkou/henkou02.html',
        beneficiary: 'https://www.prudential.co.jp/contractor/process/henkou/',
      },
    },
    {
      id: 'asahi-life', name: '朝日生命',
      portal: { name: 'あさひマイページ', url: 'https://www.asahi-life.co.jp/service/' },
      top: 'https://www.asahi-life.co.jp/service/',
      links: {
        address: 'https://www.asahi-life.co.jp/service/tetuzuki/t05.html',
        beneficiary: 'https://www.asahi-life.co.jp/service/tetuzuki/t07.html',
      },
    },
    {
      id: 'fukoku', name: 'フコク生命（富国生命）',
      portal: { name: 'ご契約者専用サービス', url: 'https://www.fukoku-life.co.jp/contract/' },
      top: 'https://www.fukoku-life.co.jp/contract/procedure/index.html',
      links: {
        address: 'https://www.fukoku-life.co.jp/contract/procedure/change/01.html',
      },
    },
    {
      id: 'manulife', name: 'マニュライフ生命',
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
      portal: { name: 'マイページ', url: 'https://neofirst.co.jp/customer/' },
      top: 'https://neofirst.co.jp/customer/procedure/',
      links: {
        address: 'https://neofirst.co.jp/customer/procedure/address.html',
      },
    },
    {
      id: 'lifenet', name: 'ライフネット生命',
      portal: { name: 'マイページ', url: 'https://www.lifenet-seimei.co.jp/customer/' },
      top: 'https://www.lifenet-seimei.co.jp/customer/',
      links: {
        address: 'https://www.lifenet-seimei.co.jp/customer/registration/',
      },
    },
    {
      id: 'zurichlife', name: 'チューリッヒ生命',
      portal: { name: 'マイページ（Z-Life）', url: 'https://www.zurichlife.co.jp/customer/z-life/' },
      top: 'https://www.zurichlife.co.jp/vivr/list',
      links: {
        address: 'https://www.zurichlife.co.jp/customer/z-life/guide/address',
      },
    },
  ],
};

if (typeof module !== 'undefined') module.exports = HOKEN;
