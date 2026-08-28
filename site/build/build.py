# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from style import CSS
from render import section
from c_field import FIELD
from c_qa import QA
from c_qa2 import QA2
from c_law import LAW
from c_ref import REF, SOURCES

CARD_FIELD=[
 ("flow","現場 01","募集の流れが、こう変わる","意向を聞く → 選ぶ → 説明する → 記録する。4ステップで整理。","指針Ⅱ-4-2-9(5) ／ 資料01 多数"),
 ("words","現場 02","言える理由、言えない理由","推奨理由に使える言葉と、使えない言葉。159件が集中した論点。","資料01 No.59〜94 ／ 385〜507"),
 ("scope","現場 03","「他にもあります」はどこまで言うか","伝える範囲と、概要説明の程度。負担が軽くなる回答が並んだ。","資料01 No.518〜533 情報提供"),
 ("q1","場面 01","「お任せします」と言われたら","その一言だけでは決められない。ではどうするか。","資料01 No.14〜25 意向がない場合"),
 ("q2","場面 02","保険会社を指定されたら","指名買いのとき、推奨販売の対応は要るのか。","資料01 No.26〜30 指名買い"),
 ("q3","場面 03","毎回、全社の見積もりが要るか","網羅義務はあるのか。絞り込むときの条件は。","資料01 No.10・48・63・83 ほか"),
 ("q4","場面 04","更改・継続契約はどうするか","「前回と同じで」のとき、比較は要るのか。","資料01 No.107〜112 更改・継続契約"),
 ("q5","場面 05","どこまで記録を残すか","項目・媒体・保存期間・検証方法。書式の指定は。","資料01 No.152〜162 証跡保存"),
 ("q6","場面 06","取扱いを絞ってよいか","乗合を減らす・販売停止する場合の線引き。","資料01 No.39〜52 比較可能な同種"),
 ("q7","場面 07","ツール・アンケートを使うとき","比較システム、事前アンケート、選別ロジック。","資料01 No.20・33〜37・82・88"),
 ("q8","場面 08","社内規則に何を書くか","定めるべき5項目と、そこまでは求められないこと。","資料01 No.79・90・151 ほか"),
 ("q9","場面 09","自賠責・小規模代理店","自賠責は対象か。小規模でも同じ体制が要るのか。","資料01 No.128〜131・132〜151"),
 ("q10","場面 10","施行までにどれだけ猶予があるか","1年程度の猶予を求める声への回答は。","資料01 No.163〜184 施行時期"),
 ("checklist","現場 04","施行までに用意するもの","代理店の準備を7項目に。覚書だけは相手の合意が要る。","本サイトの各テーマの整理"),
]
CARD_LAW=[
 ("t1","条文 01","全体像と施行スケジュール","何がどう改正され、いつから効くのか。","資料02 附則1・2"),
 ("t2","条文 02","「ハ」の削除で何が変わるか","最も構造的な変更。説明の型が3つから2つへ。","規則227条の2③四／234条の21の2①二"),
 ("t3","条文 03","出発点は誠実公正義務","柱書に「顧客の最善の利益」が置かれる。","指針Ⅱ-4-2-9(5) 柱書"),
 ("t4","条文 04","比較説明（Ａ）のルール","複数契約を並べて説明するときに守る3点。","指針Ⅱ-4-2-9(5)①Ａ"),
 ("t5","条文 05","推奨販売（Ｂ）のルール","選別の前後で何を確認し、何を伝えるか。","指針Ⅱ-4-2-9(5)①Ｂ(a)"),
 ("t6","条文 06","意向が不明確なとき","「わからない」で止めない。ただし誘導は禁止。","指針Ⅱ-4-2-9(5)①Ｂ(b)"),
 ("t7","条文 07","体制整備の4項目","社内規則・教育・記録の保存と検証・見直し。","指針Ⅱ-4-2-9(5)②"),
 ("t8","条文 08","事業報告書の様式変更","チェック方式と推奨商品一覧が消える。","別紙様式25号の2／25号の3"),
 ("t9","条文 09","金融サービス仲介業者版","保険媒介業務も同じ構造。読み替え表つき。","指針Ⅵ-1-1-2(3)"),
]
CARD_REF=[("t0","資料 01","金融庁の考え方を引く","759件の回答を、20の分類とNo.から探すための早見表。","資料01 目次・凡例"),
          ("sources","資料 02","出典一覧","公表資料4本へのリンクと、本サイトの作り方。","金融庁 2026年8月28日公表")]

def cards(lst):
    o=['      <div class="cards">']
    for cid,kn,t,d,tag in lst:
        o.append('        <a class="card" href="#%s"><span class="kn">%s</span><b>%s</b><span class="d">%s</span><span class="tag">%s</span></a>'%(cid,kn,t,d,tag))
    o.append('      </div>')
    return '\n'.join(o)

def rail(groups):
    o=[]
    for label,lst in groups:
        o.append('    <h2>%s</h2>'%label)
        o.append('    <ol>')
        for cid,kn,t,d,tag in lst:
            o.append('      <li><a href="#%s">%s</a></li>'%(cid,t))
        o.append('    </ol>')
    return '\n'.join(o)

def chips(groups):
    o=['  <div class="chips"><div class="chips-in">']
    for label,lst in groups:
        for cid,kn,t,d,tag in lst:
            o.append('    <a href="#%s">%s</a>'%(cid,t))
    o.append('  </div></div>')
    return '\n'.join(o)

GROUPS=[("現場編",CARD_FIELD),("条文編",CARD_LAW),("資料編",CARD_REF)]

HEAD = '''<title>比較推奨販売 実務ガイド</title>
<meta name="description" content="金融庁のパブリックコメント結果（759件・450ページ）と新旧対照表をもとに、比較推奨販売の改正内容を保険募集人向けに整理した実務ガイド。「サクッと」「じっくり」の2モードで読めます。" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@500;700;900&family=Zen+Old+Mincho:wght@400;600&display=swap" rel="stylesheet" />
<style>%s</style>''' % CSS

BODY = '''<header class="topbar">
  <div class="progress"><i id="prog"></i></div>
  <div class="topbar-in">
    <div class="brand">
      <b>比較推奨販売 実務ガイド</b>
      <span>金融庁パブリックコメント結果（2026年8月28日公表）にもとづく</span>
    </div>
    <div class="seg" role="group" aria-label="読み方の切り替え">
      <button type="button" id="m-quick" aria-pressed="true">サクッと</button>
      <button type="button" id="m-deep" aria-pressed="false">じっくり</button>
    </div>
  </div>
__CHIPS__
</header>

<div class="wrap">
<div class="cols">

  <nav class="rail" aria-label="もくじ">
__RAIL__
  </nav>

  <main>

    <section class="hero">
      <span class="eyebrow">金融庁 パブリックコメント結果 ／ 2026年8月28日公表</span>
      <h1>「うちはこの会社」が、<br />できなくなります</h1>
      <p class="lead">乗合代理店の募集人と、保険媒介業務を行う金融サービス仲介業者のための実務ガイド。新旧対照表で変わる点を押さえ、759件のコメントに対する金融庁の回答から、現場で迷う場面の答えをまとめました。</p>
      <div class="facts">
        <dl class="fact"><dt>施行予定日</dt><dd>令和10年3月1日<small id="countdown">&nbsp;</small></dd></dl>
        <dl class="fact"><dt>金融庁の回答</dt><dd>759件<small>全450ページ</small></dd></dl>
        <dl class="fact"><dt>最大の論点</dt><dd>159件<small>合理的かつ具体的な理由</small></dd></dl>
        <dl class="fact"><dt>主な対象</dt><dd>乗合代理店<small>保険媒介業者を含む</small></dd></dl>
      </div>
      <div class="modehelp">
        <div><b>読み方は2つあります。</b>「サクッと」は結論とやること・やらないことだけ。「じっくり」に切り替えると、条文の引用・新旧対照・金融庁の回答が全文で開きます。<br />サクッとのままでも、各テーマの「＋」ボタンでそこだけ詳しく読めます。切り替えは右上から。</div>
      </div>
    </section>

    <section class="tldr">
      <h2>3行でわかる改正のポイント</h2>
      <ol>
        <li>「顧客の意向に沿った選別をせずに提案する」という説明の型（規則227条の2第3項第4号ハ）が<strong>なくなります</strong>。提案は「意向を聞く → 選ぶ → 概要と理由を説明する」の一本道に。</li>
        <li>特定の1本を推奨するときは、<strong>①合理的かつ一定の具体性を有する基準・理由、②ほかにも保険契約がある旨、③求めがあれば説明する旨</strong>の3点を伝えます。①と②は、求められなくても説明します。</li>
        <li>推奨理由に<strong>手数料・販売目標・便宜供与・資本関係・社内都合・募集人の主観や属人的な事情</strong>は使えません。「この会社の事務に慣れているから」も明確に否定されました。</li>
      </ol>
    </section>

    <section class="picker" id="top">
      <h2>もくじ</h2>
      <p>カードをクリックすると、そのテーマへ移動します。「サクッと」のまま開いた場合は、そのテーマだけ詳細が展開されます。</p>

      <div class="part">
        <span class="n">第1部 ─ 現場編</span>
        <h2>明日から、どうすればいいのか</h2>
        <p>759件のコメントに対する金融庁の回答から、募集現場で判断に迷う場面を抜き出しました。回答はすべて原文からの引用です。</p>
      </div>
__CARDS_FIELD__

      <div class="part">
        <span class="n">第2部 ─ 条文編</span>
        <h2>何が、どう変わるのか</h2>
        <p>内閣府令と監督指針の新旧対照表から、改正の中身を条文レベルで整理しています。</p>
      </div>
__CARDS_LAW__

      <div class="part">
        <span class="n">第3部 ─ 資料編</span>
        <h2>原文にあたるために</h2>
        <p>450ページの回答集から目当ての箇所を探すための早見表と、公表資料へのリンクです。</p>
      </div>
__CARDS_REF__
    </section>

    <div class="part">
      <span class="n">第1部 ─ 現場編</span>
      <h2>明日から、どうすればいいのか</h2>
    </div>
__SEC_FIELD__

    <div class="part">
      <span class="n">第2部 ─ 条文編</span>
      <h2>何が、どう変わるのか</h2>
    </div>
__SEC_LAW__

    <div class="part">
      <span class="n">第3部 ─ 資料編</span>
      <h2>原文にあたるために</h2>
    </div>
__SEC_REF__

  </main>
</div>
</div>

<script>
(function(){
  var root=document.documentElement;
  var qb=document.getElementById('m-quick'), db=document.getElementById('m-deep');

  function setMode(mode,persist){
    root.setAttribute('data-mode',mode);
    qb.setAttribute('aria-pressed',String(mode==='quick'));
    db.setAttribute('aria-pressed',String(mode==='deep'));
    if(mode==='deep'){
      var open=document.querySelectorAll('.sec.open');
      for(var i=0;i<open.length;i++) open[i].classList.remove('open');
    }
    var mb=document.querySelectorAll('[data-more]');
    for(var b2=0;b2<mb.length;b2++) mb[b2].setAttribute('aria-expanded',String(mode==='deep'));
    if(persist){try{localStorage.setItem('gd-mode',mode);}catch(e){}}
  }
  var saved='quick';
  try{saved=localStorage.getItem('gd-mode')||'quick';}catch(e){}
  setMode(saved==='deep'?'deep':'quick',false);
  qb.addEventListener('click',function(){setMode('quick',true);});
  db.addEventListener('click',function(){setMode('deep',true);});

  var buttons=document.querySelectorAll('[data-more]');
  for(var i=0;i<buttons.length;i++){
    buttons[i].setAttribute('aria-expanded','false');
    buttons[i].addEventListener('click',function(e){
      var sec=e.currentTarget.closest('.sec');
      sec.classList.add('open');
      e.currentTarget.setAttribute('aria-expanded','true');
      sec.scrollIntoView({block:'start'});
    });
  }

  function openTarget(hash){
    if(!hash||hash==='#top')return;
    var el=document.querySelector(hash);
    if(el&&el.classList.contains('sec')) el.classList.add('open');
  }
  var jumps=document.querySelectorAll('.card, .rail a, .chips a');
  for(var j=0;j<jumps.length;j++){
    jumps[j].addEventListener('click',function(e){openTarget(e.currentTarget.getAttribute('href'));});
  }
  try{openTarget(location.hash);}catch(e){}

  // countdown
  var cd=document.getElementById('countdown');
  if(cd){
    var d=Math.ceil((new Date(2028,2,1)-new Date())/86400000);
    if(d>0) cd.textContent='あと '+d.toLocaleString('ja-JP')+' 日';
  }

  // scrollspy + progress
  var railLinks=document.querySelectorAll('.rail a');
  var chipLinks=document.querySelectorAll('.chips a');
  var chipWrap=document.querySelector('.chips-in');
  var targets=[];
  for(var k=0;k<railLinks.length;k++){
    var el=document.getElementById(railLinks[k].getAttribute('href').slice(1));
    if(el) targets.push({el:el,i:k});
  }
  var prog=document.getElementById('prog');
  var ticking=false, lastIdx=-1;
  function spy(){
    ticking=false;
    var y=window.scrollY+140, cur=-1;
    for(var i=0;i<targets.length;i++){ if(targets[i].el.offsetTop<=y) cur=targets[i].i; }
    if(cur!==lastIdx){
      lastIdx=cur;
      for(var m=0;m<railLinks.length;m++) railLinks[m].classList.toggle('on',m===cur);
      for(var n=0;n<chipLinks.length;n++) chipLinks[n].classList.toggle('on',n===cur);
      if(cur>=0&&chipWrap&&chipLinks[cur]){
        var c=chipLinks[cur];
        chipWrap.scrollTo({left:c.offsetLeft-16,behavior:'smooth'});
      }
    }
    var h=document.documentElement.scrollHeight-window.innerHeight;
    if(prog) prog.style.width=(h>0?Math.min(100,window.scrollY/h*100):0)+'%';
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(spy);}},{passive:true});
  window.addEventListener('resize',spy);
  spy();
})();
</script>'''

BODY = BODY.replace('__CHIPS__', chips(GROUPS))
BODY = BODY.replace('__RAIL__', rail(GROUPS))
BODY = BODY.replace('__CARDS_FIELD__', cards(CARD_FIELD))
BODY = BODY.replace('__CARDS_LAW__', cards(CARD_LAW))
BODY = BODY.replace('__CARDS_REF__', cards(CARD_REF))
BODY = BODY.replace('__SEC_FIELD__', '\n\n'.join(section(s) for s in FIELD+QA+QA2))
BODY = BODY.replace('__SEC_LAW__', '\n\n'.join(section(s) for s in LAW))
BODY = BODY.replace('__SEC_REF__', '\n\n'.join(section(s) for s in REF)+'\n\n'+SOURCES)

full = '<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n' \
     + '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E%F0%9F%93%98%3C/text%3E%3C/svg%3E" />\n' \
     + HEAD + '\n</head>\n<body>\n' + BODY + '\n</body>\n</html>\n'
open('/home/user/claudecode01/site/index.html','w',encoding='utf-8').write(full)

art = HEAD + '\n' + BODY + '\n'
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','artifact.html'),'w',encoding='utf-8').write(art)
print('built:', len(full), 'bytes (site)  /', len(art), 'bytes (artifact)')
