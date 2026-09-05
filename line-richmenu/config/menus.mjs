// リッチメニュー1枚ぶんの定義。ここだけ書き換えれば、画像もAPIに送るJSONも
// 同じ座標で作り直される（画像とタップ領域がズレないようにするための単一の情報源）。

// LINEが受け付ける画像サイズのうち、いちばん大きい「大サイズ」。
export const IMAGE = { width: 2500, height: 1686 };

// タブ帯の高さ。0にすればタブなしの普通のリッチメニューになる。
export const TAB_HEIGHT = 260;

// 「保険のお手続きナビ」の公開先。別の場所に出すときは .env の SITE_BASE_URL で上書きする。
export const SITE = (process.env.SITE_BASE_URL ?? 'https://takuya1128iuy-pixel.github.io/ai-secretary-pages/hoken-navi').replace(/\/$/, '');

// ナビの特定の手続きを直接開くURL（data.js の procedures の id と揃えること）
const navi = (procedureId) => `${SITE}/?p=${procedureId}`;

export const menus = [
  {
    key: 'main',
    aliasId: 'richmenu-main', // 切替先として指定するときの名前（英小文字/数字/-/_、32文字以内）
    name: 'メインメニュー(A)', // 管理用の名前。トークルームには出ない
    chatBarText: 'メニューを開く', // メニューを閉じているときに下部に出る文言（14文字以内）
    selected: true, // 友だち追加直後にメニューを開いた状態にするか
    isDefault: true, // 全ユーザー向けのデフォルトにするのはどれか（1つだけ true）
    grid: { cols: 3, rows: 2 },
    tabs: [
      { label: 'メニュー', active: true },
      { label: '各種お手続き', active: false, switchTo: 'richmenu-procedures', data: 'switch=procedures' },
    ],
    tiles: [
      { emoji: '👤', label: 'プロフィール', sub: '担当者の紹介', action: { type: 'uri', uri: 'https://example.com/profile' } },
      { emoji: '📅', label: '面談予約', sub: '日程変更/キャンセル', action: { type: 'uri', uri: 'https://example.com/reserve' } },
      { emoji: '🤝', label: '大切な人に紹介', sub: 'ご紹介はこちら', action: { type: 'uri', uri: 'https://example.com/referral' } },
      { emoji: '🏢', label: '会社情報', sub: '事業内容', action: { type: 'uri', uri: 'https://example.com/company' } },
      { emoji: '🧰', label: '便利ツール', sub: 'お手続きナビほか', action: { type: 'uri', uri: `${SITE}/` } },
      { emoji: '🎟', label: 'クーポン', sub: '面談を早く進める', action: { type: 'postback', data: 'coupon=meeting', displayText: 'クーポンについて' } },
    ],
  },
  {
    key: 'procedures',
    aliasId: 'richmenu-procedures',
    name: '各種お手続き(B)',
    chatBarText: 'メニューを開く',
    selected: false,
    isDefault: false,
    grid: { cols: 3, rows: 2 },
    tabs: [
      { label: 'メニュー', active: false, switchTo: 'richmenu-main', data: 'switch=main' },
      { label: '各種お手続き', active: true },
    ],
    // タップすると「保険のお手続きナビ」の該当ステップが直接開く
    tiles: [
      { emoji: '🏠', label: '住所・氏名変更', sub: '引っ越し・結婚', action: { type: 'uri', uri: navi('address') } },
      { emoji: '💳', label: 'カード・口座', sub: '引き落とし先の変更', action: { type: 'uri', uri: navi('payment') } },
      { emoji: '📄', label: '控除証明書', sub: '再発行', action: { type: 'uri', uri: navi('certificate') } },
      { emoji: '👪', label: '受取人・契約者', sub: '名義の変更', action: { type: 'uri', uri: navi('beneficiary') } },
      { emoji: '🏥', label: '給付金請求', sub: '入院・手術', action: { type: 'uri', uri: navi('claim') } },
      { emoji: '🏦', label: '貸付・解約', sub: 'まずは相談', action: { type: 'uri', uri: navi('loan') } },
    ],
  },
];
