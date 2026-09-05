/* 保険のお手続きナビ
 * 「手続きを選ぶ → 保険会社を選ぶ → 方法を確認」の3ステップ。
 * LINEのリッチメニューから特定の手続きへ直接飛ばせるように、URLで状態を持つ。
 *   ?p=payment            … 手続きを指定して会社選択から始める
 *   ?p=payment&c=orixlife … 結果画面を直接開く
 * （#/p/payment/c/orixlife の形も同じ意味で受け付ける）
 */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var byId = function (list, id) { return list.filter(function (x) { return x.id === id; })[0]; };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  var state = { view: 'top', procedure: null, company: null, query: '' };

  // ---- URL との同期 ------------------------------------------------------
  function readUrl() {
    var p = null, c = null;
    var q = new URLSearchParams(location.search);
    if (q.get('p')) { p = q.get('p'); c = q.get('c'); }
    var m = location.hash.match(/^#\/p\/([\w-]+)(?:\/c\/([\w-]+))?/);
    if (m) { p = m[1]; c = m[2] || null; }
    if (!p) return;
    var proc = byId(HOKEN.procedures, p);
    if (!proc) return;
    state.procedure = proc;
    state.view = 'companies';
    if (c) {
      var comp = byId(HOKEN.companies, c);
      if (comp) { state.company = comp; state.view = 'result'; }
    }
  }

  function writeUrl() {
    var hash = '';
    if (state.procedure) {
      hash = '#/p/' + state.procedure.id;
      if (state.company && state.view === 'result') hash += '/c/' + state.company.id;
    }
    if (location.hash !== hash) history.replaceState(null, '', location.pathname + location.search + hash);
  }

  // ---- 部品 --------------------------------------------------------------
  function stepper(current) {
    var caps = ['手続きを選ぶ', '会社を選ぶ', '方法を確認'];
    var html = '<div class="steps">';
    for (var i = 0; i < 3; i++) {
      var st = i + 1 === current ? 'current' : (i + 1 < current ? 'done' : 'todo');
      html += '<div class="step" data-state="' + st + '">' +
        '<span class="num">' + (st === 'done' ? '✓' : i + 1) + '</span>' +
        '<span class="cap">' + caps[i] + '</span></div>';
      if (i < 2) html += '<span class="bar"></span>';
    }
    return html + '</div>';
  }

  // 会社がその手続きの専用ページを持っているか
  function linkFor(company, procedureId) {
    if (company.links && company.links[procedureId]) {
      return { url: company.links[procedureId], kind: 'direct' };
    }
    return { url: company.top, kind: 'list' };
  }

  // ---- 画面 --------------------------------------------------------------
  function viewTop() {
    return stepper(1) +
      '<div class="card">' +
        '<span class="pill">個人情報の入力は一切不要です</span>' +
        '<h1>保険のお手続きナビ</h1>' +
        '<p class="lead">ご希望のお手続きを選択してください。ご加入中の保険会社のお手続き方法をご案内します。</p>' +
      '</div>' +
      '<h2>手続きを選ぶ</h2>' + tiles();
  }

  function tiles() {
    return '<div class="tiles">' + HOKEN.procedures.map(function (p) {
      return '<button class="tile" type="button" data-proc="' + p.id + '">' +
        '<span class="ic">' + p.icon + '</span>' +
        '<span><span class="t">' + esc(p.label) + '</span><br>' +
        '<span class="d">' + esc(p.desc) + '</span></span></button>';
    }).join('') + '</div>';
  }

  function viewCompanies() {
    var p = state.procedure;
    var q = state.query.trim();
    var hits = HOKEN.companies.filter(function (c) { return !q || c.name.indexOf(q) >= 0; });

    var rows = hits.map(function (c) {
      var l = linkFor(c, p.id);
      var badge = l.kind === 'direct'
        ? '<span class="badge direct">Webで手続き可能</span>'
        : '<span class="badge list">お手続き一覧から</span>';
      return '<li><button class="row" type="button" data-company="' + c.id + '">' +
        '<span class="nm">' + esc(c.name) + '</span>' +
        '<span>' + badge + ' <span class="arrow">›</span></span></button></li>';
    }).join('');

    return stepper(2) +
      '<button class="back" type="button" data-back="top">← 手続きを選びなおす</button>' +
      '<div class="card">' +
        '<div class="result-head"><span class="ic">' + p.icon + '</span><h2 style="margin:0">' + esc(p.label) + '</h2></div>' +
        '<p class="lead">' + esc(p.desc) + '</p>' +
      '</div>' +
      '<h2>ご加入中の保険会社を選ぶ</h2>' +
      '<input class="search" id="q" type="search" placeholder="会社名で絞り込む（例: オリックス）" value="' + esc(state.query) + '">' +
      (rows ? '<ul class="list">' + rows + '</ul>'
            : '<p class="empty">該当する保険会社が見つかりませんでした。会社名を短く入れてお試しください。</p>');
  }

  // 番号は用途が限られることがあるので、何の窓口かを必ず添える
  function telLink(tel, note) {
    return '<a class="sub-link" href="tel:' + esc(tel.replace(/-/g, '')) + '">' +
      '<span>' + esc(tel) + '<br><span class="sub-note">' + esc(note) + '</span></span>' +
      '<span>›</span></a>';
  }

  function viewResult() {
    var p = state.procedure, c = state.company;
    var l = linkFor(c, p.id);
    var head = l.kind === 'direct'
      ? '<span class="badge direct">このお手続きの案内ページがあります</span>'
      : '<span class="badge list">会社のお手続き一覧からお選びください</span>';

    var subs = '';
    if (c.portal && c.portal.url) {
      subs += '<a class="sub-link" href="' + esc(c.portal.url) + '" target="_blank" rel="noopener">' +
        '<span>' + esc(c.portal.name) + '（契約者向けサービス）</span><span>›</span></a>';
    }
    if (l.url !== c.top) {
      subs += '<a class="sub-link" href="' + esc(c.top) + '" target="_blank" rel="noopener">' +
        '<span>お手続き一覧をすべて見る</span><span>›</span></a>';
    }
    // その手続き専用のダイヤルがある会社は、代表番号より先に出す
    var dedicated = c.extraTels && c.extraTels[p.id];
    if (dedicated) subs += telLink(dedicated.tel, dedicated.note);
    if (c.tel) subs += telLink(c.tel, c.telNote || '電話窓口');

    return stepper(3) +
      '<button class="back" type="button" data-back="companies">← 保険会社を選びなおす</button>' +
      '<div class="card">' +
        '<div class="result-head"><span class="ic">' + p.icon + '</span>' +
        '<div><h2 style="margin:0">' + esc(c.name) + '</h2>' +
        '<p class="lead" style="margin:0">' + esc(p.label) + '</p></div></div>' +
        '<p style="margin:12px 0 0">' + head + '</p>' +
        '<a class="cta" href="' + esc(l.url) + '" target="_blank" rel="noopener">公式サイトでお手続きへ</a>' +
        '<div class="sub-links">' + subs + '</div>' +
        '<p class="note">お手続きの可否や必要書類はご契約内容によって異なります。' +
        'リンク先が変わっている場合は、各社の公式サイトのトップから「ご契約者さま」をお探しください。</p>' +
      '</div>';
  }

  function viewContact() {
    return '<div class="card">' +
      '<h1>お問い合わせ</h1>' +
      '<p class="lead">このページはデモです。お手続きの内容によっては、担当者が一緒に確認したほうが早い場合があります。</p>' +
      '<p class="note">LINEのトーク画面に戻って、そのままメッセージを送ってください。</p>' +
      '</div>';
  }

  // ---- 描画とイベント ----------------------------------------------------
  function render() {
    var html;
    if (state.view === 'companies' && state.procedure) html = viewCompanies();
    else if (state.view === 'result' && state.company) html = viewResult();
    else if (state.view === 'contact') html = viewContact();
    else { state.view = 'top'; html = viewTop(); }

    app.innerHTML = html;
    writeUrl();

    document.querySelectorAll('.nav button').forEach(function (b) {
      var isCurrent = (b.dataset.nav === 'top' && state.view === 'top') ||
        (b.dataset.nav === 'procedures' && (state.view === 'companies' || state.view === 'result')) ||
        (b.dataset.nav === 'contact' && state.view === 'contact');
      b.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });

    var q = document.getElementById('q');
    if (q) {
      q.addEventListener('input', function () {
        state.query = q.value;
        var pos = q.selectionStart;
        render();
        var q2 = document.getElementById('q');
        if (q2) { q2.focus(); q2.setSelectionRange(pos, pos); }
      });
    }
  }

  app.addEventListener('click', function (e) {
    var t = e.target.closest('[data-proc], [data-company], [data-back]');
    if (!t) return;
    if (t.dataset.proc) {
      state.procedure = byId(HOKEN.procedures, t.dataset.proc);
      state.company = null; state.query = ''; state.view = 'companies';
    } else if (t.dataset.company) {
      state.company = byId(HOKEN.companies, t.dataset.company);
      state.view = 'result';
    } else if (t.dataset.back) {
      state.view = t.dataset.back;
      if (t.dataset.back === 'top') { state.procedure = null; state.company = null; }
    }
    window.scrollTo(0, 0);
    render();
  });

  document.querySelector('.nav').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-nav]');
    if (!b) return;
    if (b.dataset.nav === 'contact') state.view = 'contact';
    else if (b.dataset.nav === 'procedures') { state.view = 'top'; state.procedure = null; state.company = null; }
    else { state.view = 'top'; state.procedure = null; state.company = null; }
    window.scrollTo(0, 0);
    render();
  });

  document.getElementById('updated').textContent = HOKEN.updatedAt;
  readUrl();
  render();
})();
