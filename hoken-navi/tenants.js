/* テナント（提供先）ごとの設定
 *
 * 1つのページを複数の担当者・代理店で使い回すための設定。
 * URL の ?c=<id> で切り替える。指定が無ければ default。
 *
 *   /?c=sample              サンプル事務所の設定で開く
 *   /?c=sample&theme=plum   配色だけ差し替えて見せる（提案時のデモ用）
 *   /?preview=1             配色を切り替えるボタンを出す（商談で色を選んでもらう用）
 *
 * palette に使える値は PALETTES を参照。
 * lineId を入れると「担当者に相談する」ボタンが出る（未設定なら出ない）。
 */
var PALETTES = [
  { id: 'indigo', label: '藍' },
  { id: 'teal', label: '青緑' },
  { id: 'plum', label: '梅' },
  { id: 'amber', label: '琥珀' },
  { id: 'slate', label: '鉄紺' },
];

var TENANTS = {
  default: {
    siteName: 'てつづきコンパス',
    tagline: '保険のお手続き案内',
    org: '',
    agent: '',
    palette: 'indigo',
    lineId: '@489xybid', // 相談ボタンの飛び先（LINE公式アカウントのベーシックID）
    consultLabel: '担当者に相談する',
  },

  // 提案・デモ用のサンプル。実在の事務所ではない。
  sample: {
    siteName: 'てつづきコンパス',
    tagline: '保険のお手続き案内',
    org: 'みらい保険サービス',
    agent: '山田',
    palette: 'teal',
    lineId: '',
    consultLabel: '山田に相談する',
  },
};

function resolveTenant(params) {
  var t = TENANTS[params.get('c')] || TENANTS.default;
  var tenant = {};
  for (var k in TENANTS.default) tenant[k] = TENANTS.default[k];
  for (var k2 in t) tenant[k2] = t[k2];

  // ?theme= は配色だけの上書き。商談中に色を見せ替えるために使う。
  var theme = params.get('theme');
  if (theme && PALETTES.some(function (p) { return p.id === theme; })) tenant.palette = theme;

  return tenant;
}
