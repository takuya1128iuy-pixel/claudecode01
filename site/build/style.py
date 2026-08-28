# -*- coding: utf-8 -*-
CSS = r'''
:root{
  --ground:#EFF2F6;
  --surface:#FFFFFF;
  --surface-2:#E7ECF3;
  --line:#D3DAE5;
  --line-soft:#E4E9F0;
  --ink:#111721;
  --ink-2:#38424F;
  --ink-3:#66717F;
  --accent:#22467A;
  --accent-2:#3B6CA6;
  --accent-soft:#E1EAF6;
  --flag:#8F3527;
  --flag-soft:#F8E9E5;
  --flag-line:#DDBBB2;
  --old:#7A7360;
  --old-soft:#EFEDE4;
  --mark:#FAE6AE;
  --shadow-s:0 1px 2px rgba(17,23,33,.05);
  --shadow-m:0 1px 3px rgba(17,23,33,.06),0 10px 28px -18px rgba(17,23,33,.30);
  --r:12px;
  --maxw:1240px;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#0D1116; --surface:#161B23; --surface-2:#1F2531; --line:#2A323F; --line-soft:#222933;
    --ink:#E7EBF2; --ink-2:#AFB9C7; --ink-3:#828E9F;
    --accent:#93B8E8; --accent-2:#6E9AD2; --accent-soft:#1A2536;
    --flag:#E29A89; --flag-soft:#2B1E1A; --flag-line:#4A342E;
    --old:#A79D88; --old-soft:#232018; --mark:#4C3F19;
    --shadow-s:0 1px 2px rgba(0,0,0,.5);
    --shadow-m:0 1px 3px rgba(0,0,0,.5),0 12px 32px -20px rgba(0,0,0,.9);
  }
}
:root[data-theme="dark"]{
  --ground:#0D1116; --surface:#161B23; --surface-2:#1F2531; --line:#2A323F; --line-soft:#222933;
  --ink:#E7EBF2; --ink-2:#AFB9C7; --ink-3:#828E9F;
  --accent:#93B8E8; --accent-2:#6E9AD2; --accent-soft:#1A2536;
  --flag:#E29A89; --flag-soft:#2B1E1A; --flag-line:#4A342E;
  --old:#A79D88; --old-soft:#232018; --mark:#4C3F19;
  --shadow-s:0 1px 2px rgba(0,0,0,.5);
  --shadow-m:0 1px 3px rgba(0,0,0,.5),0 12px 32px -20px rgba(0,0,0,.9);
}

*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{
  margin:0;background:var(--ground);color:var(--ink);
  font-family:"Noto Sans JP",system-ui,-apple-system,"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif;
  font-size:16px;line-height:1.9;font-feature-settings:"palt" 1;
  overflow-wrap:anywhere;
}
h1,h2,h3,h4{font-family:"Zen Kaku Gothic New","Noto Sans JP",sans-serif;text-wrap:balance;margin:0;line-height:1.45}
p{margin:0}
ul,ol{margin:0;padding-left:1.4em}
li{margin:.3em 0}
a{color:var(--accent);text-underline-offset:3px}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent-2);outline-offset:3px;border-radius:6px}
u{text-decoration:underline;text-decoration-color:var(--flag);text-underline-offset:3px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto !important;transition:none !important;animation:none !important}}

/* ============ top bar ============ */
.topbar{position:sticky;top:0;z-index:60;background:var(--surface);border-bottom:1px solid var(--line)}
.progress{height:2px;background:transparent}
.progress i{display:block;height:100%;width:0;background:var(--accent-2)}
.topbar-in{max-width:var(--maxw);margin:0 auto;padding:9px 20px;display:flex;align-items:center;gap:14px}
.brand{margin-right:auto;min-width:0;display:flex;flex-direction:column;gap:0}
.brand b{font-family:"Zen Kaku Gothic New",sans-serif;font-weight:700;font-size:15px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brand span{font-size:10.5px;color:var(--ink-3);letter-spacing:.05em;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.seg{display:flex;background:var(--surface-2);border:1px solid var(--line);border-radius:999px;padding:3px;gap:2px;flex-shrink:0}
.seg button{
  font:inherit;font-size:13px;font-weight:700;font-family:"Zen Kaku Gothic New",sans-serif;
  border:0;background:transparent;color:var(--ink-3);padding:6px 16px;border-radius:999px;cursor:pointer;
  white-space:nowrap;transition:background .18s,color .18s;line-height:1.3;
}
.seg button:hover{color:var(--ink)}
.seg button[aria-pressed="true"]{background:var(--accent);color:var(--surface);box-shadow:var(--shadow-s)}
:root[data-theme="dark"] .seg button[aria-pressed="true"]{color:#0D1116}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .seg button[aria-pressed="true"]{color:#0D1116}}
@media (max-width:560px){.brand span{display:none}.seg button{padding:6px 13px;font-size:12.5px}}

/* mobile section chips */
.chips{display:none;border-top:1px solid var(--line-soft);background:var(--surface)}
.chips-in{display:flex;gap:7px;overflow-x:auto;padding:9px 20px;scrollbar-width:none}
.chips-in::-webkit-scrollbar{display:none}
.chips a{
  flex:0 0 auto;font-size:12.5px;font-weight:700;text-decoration:none;color:var(--ink-2);
  background:var(--surface-2);border:1px solid var(--line);border-radius:999px;padding:5px 13px;white-space:nowrap;
}
.chips a.on{background:var(--accent);border-color:var(--accent);color:var(--surface)}
:root[data-theme="dark"] .chips a.on{color:#0D1116}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .chips a.on{color:#0D1116}}
@media (max-width:980px){.chips{display:block}}

/* ============ layout ============ */
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 20px 96px}
.cols{display:grid;grid-template-columns:250px minmax(0,1fr);gap:52px;align-items:start}
@media (max-width:980px){.cols{grid-template-columns:minmax(0,1fr);gap:0}.rail{display:none}}

.rail{position:sticky;top:86px;padding:30px 0;font-size:13px;max-height:calc(100vh - 96px);overflow-y:auto;scrollbar-width:thin}
.rail h2{font-size:10.5px;letter-spacing:.16em;color:var(--ink-3);font-weight:700;margin:0 0 10px}
.rail h2+ol{margin-bottom:24px}
.rail ol{list-style:none;padding:0;margin:0;border-left:1px solid var(--line)}
.rail li{margin:0}
.rail a{
  display:block;padding:6px 0 6px 14px;margin-left:-1px;border-left:2px solid transparent;
  color:var(--ink-2);text-decoration:none;line-height:1.5;transition:color .15s,border-color .15s;
}
.rail a:hover{color:var(--ink)}
.rail a.on{color:var(--accent);border-left-color:var(--accent);font-weight:700}

/* ============ hero ============ */
.hero{padding:62px 0 44px;border-bottom:1px solid var(--line)}
.eyebrow{
  display:inline-flex;align-items:center;gap:8px;font-size:11.5px;letter-spacing:.13em;font-weight:700;
  color:var(--accent);background:var(--accent-soft);padding:6px 13px;border-radius:999px;
}
.hero h1{font-size:clamp(31px,5.4vw,52px);font-weight:900;letter-spacing:-.015em;margin:22px 0 0;line-height:1.22}
.hero .lead{margin-top:18px;max-width:33em;color:var(--ink-2);font-size:17px;line-height:1.85}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(158px,1fr));gap:10px;margin-top:30px;max-width:760px}
.fact{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:13px 16px}
.fact dt{font-size:10.5px;letter-spacing:.1em;color:var(--ink-3);font-weight:700;margin-bottom:3px}
.fact dd{margin:0;font-family:"Zen Kaku Gothic New",sans-serif;font-weight:700;font-size:15.5px;font-variant-numeric:tabular-nums;line-height:1.4}
.fact dd small{display:block;font-size:11px;font-weight:500;color:var(--ink-3);margin-top:2px}

/* mode explainer */
.modehelp{
  display:flex;gap:14px;align-items:flex-start;margin-top:34px;padding:16px 20px;
  background:var(--accent-soft);border-radius:var(--r);font-size:13.5px;color:var(--ink-2);max-width:760px;line-height:1.8;
}
.modehelp b{color:var(--accent);font-family:"Zen Kaku Gothic New",sans-serif}

/* ============ tldr ============ */
.tldr{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow-m);padding:30px 32px;margin:42px 0 54px}
.tldr h2{font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px}
.tldr h2::before{content:"";width:18px;height:2px;background:var(--accent);display:block;flex:0 0 auto}
.tldr ol{margin-top:20px;padding-left:0;list-style:none;counter-reset:t;display:grid;gap:18px}
.tldr li{counter-increment:t;position:relative;padding-left:42px;margin:0;font-size:16px}
.tldr li::before{
  content:counter(t);position:absolute;left:0;top:6px;font-family:"Zen Kaku Gothic New",sans-serif;
  font-weight:700;font-size:12.5px;width:27px;height:27px;border-radius:50%;
  background:var(--accent);color:var(--surface);display:grid;place-items:center;
}
:root[data-theme="dark"] .tldr li::before{color:#0D1116}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .tldr li::before{color:#0D1116}}
@media (max-width:560px){.tldr{padding:24px 20px}}

/* ============ part / picker ============ */
.part{margin:56px 0 22px;padding-top:44px;border-top:1px solid var(--line)}
.part:first-of-type{border-top:0;padding-top:0}
.part .n{font-family:"Zen Kaku Gothic New",sans-serif;font-size:11px;font-weight:700;letter-spacing:.17em;color:var(--accent);display:block}
.part h2{font-size:clamp(22px,3.4vw,28px);font-weight:900;margin-top:6px;letter-spacing:-.01em}
.part p{color:var(--ink-2);font-size:14.5px;margin-top:9px;max-width:58ch;line-height:1.85}

.picker>h2{font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px}
.picker>h2::before{content:"";width:18px;height:2px;background:var(--accent);display:block;flex:0 0 auto}
.picker>p{color:var(--ink-3);font-size:13.5px;margin-top:8px;max-width:60ch}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));gap:12px;margin-top:20px}
.card{
  display:flex;flex-direction:column;gap:7px;background:var(--surface);border:1px solid var(--line);
  border-radius:var(--r);padding:17px 19px 16px;text-decoration:none;color:inherit;
  transition:border-color .16s,transform .16s,box-shadow .16s;
}
.card:hover{border-color:var(--accent-2);transform:translateY(-2px);box-shadow:var(--shadow-m)}
@media (prefers-reduced-motion:reduce){.card:hover{transform:none}}
.card .kn{font-size:10.5px;font-weight:700;letter-spacing:.1em;color:var(--accent);font-variant-numeric:tabular-nums}
.card b{font-family:"Zen Kaku Gothic New",sans-serif;font-size:15.5px;font-weight:700;line-height:1.5}
.card span.d{font-size:13px;color:var(--ink-2);line-height:1.7}
.card .tag{margin-top:auto;padding-top:10px;border-top:1px dashed var(--line);font-size:10.5px;color:var(--ink-3);font-variant-numeric:tabular-nums;letter-spacing:.02em}

/* ============ sections ============ */
.sec{scroll-margin-top:96px;padding:40px 0 46px;border-top:1px solid var(--line)}
.sec:first-of-type{border-top:0}
.sec-no{font-family:"Zen Kaku Gothic New",sans-serif;font-size:11px;font-weight:700;letter-spacing:.14em;color:var(--accent);display:block}
.sec h2{font-size:clamp(23px,3.4vw,30px);font-weight:900;letter-spacing:-.012em;margin-top:4px}
.sec-sub{color:var(--ink-3);font-size:13px;margin-top:9px;line-height:1.75}

/* the one-line answer — the heart of quick mode */
.lede{
  margin-top:24px;font-family:"Zen Kaku Gothic New",sans-serif;font-size:clamp(17px,2.3vw,21px);
  font-weight:700;line-height:1.75;letter-spacing:-.005em;max-width:30em;
  padding-left:18px;border-left:4px solid var(--accent);
}
.lede em{font-style:normal;background:linear-gradient(transparent 62%,var(--mark) 62%);padding:0 .1em}

/* do / dont */
.dd{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:26px}
@media (max-width:760px){.dd{grid-template-columns:minmax(0,1fr)}}
.dd>div{border:1px solid var(--line);border-radius:var(--r);padding:18px 20px;background:var(--surface)}
.dd .ng{background:var(--flag-soft);border-color:var(--flag-line)}
.dd h4{font-family:"Zen Kaku Gothic New",sans-serif;font-size:12.5px;letter-spacing:.06em;margin-bottom:12px;display:flex;align-items:center;gap:7px}
.dd .ok h4{color:var(--accent)}
.dd .ng h4{color:var(--flag)}
.dd h4 i{
  font-style:normal;width:19px;height:19px;border-radius:50%;display:grid;place-items:center;
  font-size:12px;flex:0 0 auto;line-height:1;
}
.dd .ok h4 i{background:var(--accent);color:var(--surface)}
.dd .ng h4 i{background:var(--flag);color:var(--flag-soft)}
:root[data-theme="dark"] .dd .ok h4 i{color:#0D1116}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .dd .ok h4 i{color:#0D1116}}
.dd ul{list-style:none;padding:0;display:grid;gap:9px}
.dd li{margin:0;font-size:14.5px;line-height:1.8;padding-left:17px;position:relative}
.dd li::before{content:"";position:absolute;left:0;top:.72em;width:6px;height:6px;border-radius:50%}
.dd .ok li::before{background:var(--accent-2)}
.dd .ng li::before{background:var(--flag)}

/* more button */
.more{
  margin-top:26px;display:inline-flex;align-items:center;gap:9px;font-family:"Zen Kaku Gothic New",sans-serif;
  font-size:13.5px;font-weight:700;background:var(--surface);border:1px solid var(--line);color:var(--ink-2);
  padding:11px 20px;border-radius:999px;cursor:pointer;transition:border-color .16s,color .16s;
}
.more:hover{border-color:var(--accent-2);color:var(--accent)}
.more .plus{font-size:15px;line-height:1;color:var(--accent)}

/* ===== the two modes ===== */
.deep{display:none}
[data-mode="deep"] .deep{display:block}
.sec.open .deep{display:block}
[data-mode="deep"] .more,.sec.open .more{display:none}
.deep{margin-top:34px;padding-top:6px}

.deep h3{
  font-family:"Zen Kaku Gothic New",sans-serif;font-size:16px;font-weight:700;margin:38px 0 14px;
  padding-bottom:8px;border-bottom:1px solid var(--line);
}
.deep h3:first-child{margin-top:0}
.deep>p{max-width:66ch;font-size:15px}
.deep>p+p{margin-top:13px}
.deep>ul,.deep>ol{max-width:66ch;font-size:15px}

/* statute quotation — mincho */
.q{
  font-family:"Zen Old Mincho","Yu Mincho",serif;background:var(--surface);border:1px solid var(--line);
  border-left:3px solid var(--accent-2);border-radius:0 var(--r) var(--r) 0;padding:18px 22px;margin:14px 0;
  font-size:15px;line-height:2.05;
}
.q .cite{display:block;font-family:"Noto Sans JP",sans-serif;font-size:11.5px;letter-spacing:.03em;color:var(--ink-3);margin-bottom:9px;font-weight:700}
mark{background:var(--mark);color:var(--ink);padding:.08em .1em;border-radius:2px}

/* old / new */
.compare{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:16px 0}
@media (max-width:760px){.compare{grid-template-columns:minmax(0,1fr)}}
.pane{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px 20px;min-width:0}
.pane.now{background:var(--old-soft);border-color:color-mix(in srgb,var(--old) 38%,transparent)}
.chip{display:inline-block;font-size:11px;letter-spacing:.09em;font-weight:700;padding:3px 11px;border-radius:999px;margin-bottom:11px}
.pane.new .chip{background:var(--accent-soft);color:var(--accent)}
.pane.now .chip{background:color-mix(in srgb,var(--old) 20%,transparent);color:var(--old)}
.pane .body{font-family:"Zen Old Mincho","Yu Mincho",serif;font-size:14.5px;line-height:2}
.pane .del{color:var(--flag);font-weight:600;font-family:"Noto Sans JP",sans-serif;font-size:14px}

/* callouts */
.note{background:var(--flag-soft);border:1px solid var(--flag-line);border-radius:var(--r);padding:16px 20px;margin:16px 0;font-size:14.5px;line-height:1.85}
.note b{color:var(--flag);font-family:"Zen Kaku Gothic New",sans-serif;display:block;margin-bottom:5px;font-size:13px;letter-spacing:.03em}
.read{background:var(--surface-2);border:1px dashed var(--line);border-radius:var(--r);padding:16px 20px;margin:18px 0;font-size:14.5px;line-height:1.85}
.read b{display:block;font-size:10.5px;letter-spacing:.14em;color:var(--ink-3);margin-bottom:6px;font-family:"Zen Kaku Gothic New",sans-serif}

/* checklist */
.checks{list-style:none;padding:0;display:grid;gap:10px;margin:16px 0;max-width:68ch}
.checks li{position:relative;padding:14px 18px 14px 46px;margin:0;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);font-size:14.5px;line-height:1.8}
.checks li::before{content:"✓";position:absolute;left:19px;top:14px;color:var(--accent);font-weight:700;font-size:14px;line-height:1.8}

/* tables */
.tablewrap{overflow-x:auto;margin:16px 0;border:1px solid var(--line);border-radius:var(--r);background:var(--surface)}
table{border-collapse:collapse;width:100%;font-size:14px;min-width:540px}
th,td{text-align:left;padding:12px 16px;border-bottom:1px solid var(--line-soft);vertical-align:top;line-height:1.75}
thead th{font-family:"Zen Kaku Gothic New",sans-serif;font-size:11.5px;letter-spacing:.07em;color:var(--ink-3);background:var(--surface-2);border-bottom:1px solid var(--line);white-space:nowrap}
tbody tr:last-child td{border-bottom:0}
td.k{font-weight:700;white-space:nowrap}
td.mid{vertical-align:middle}
td.rng{font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ink-2)}
.barcell{display:flex;align-items:center;gap:10px;min-width:132px}
.bar{flex:1;height:8px;background:var(--surface-2);border-radius:2px;min-width:52px}
.bar i{display:block;height:100%;background:var(--accent-2);border-radius:2px 4px 4px 2px}
.num{font-variant-numeric:tabular-nums;font-weight:700;font-size:13px;min-width:3.5ch;text-align:right}

/* Q&A */
.qa{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:20px 24px;margin:12px 0}
.qa>.h{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}
.qno{font-size:10.5px;font-weight:700;letter-spacing:.05em;color:var(--accent);background:var(--accent-soft);border-radius:5px;padding:3px 9px;white-space:nowrap;font-variant-numeric:tabular-nums}
.qa>.h b{font-family:"Zen Kaku Gothic New",sans-serif;font-size:15.5px;font-weight:700;line-height:1.6;flex:1;min-width:60%}
.qa .ans{margin-top:15px;border-left:3px solid var(--accent-2);padding-left:17px}
.qa .ans .lbl{font-size:10.5px;letter-spacing:.14em;font-weight:700;color:var(--ink-3);font-family:"Zen Kaku Gothic New",sans-serif;margin-bottom:7px}
.qa .ans p{font-size:14.5px;line-height:1.95;max-width:64ch}
.qa .ans p+p{margin-top:10px}
@media (max-width:560px){.qa{padding:17px 18px}.qa .ans{padding-left:14px}}

/* flow steps */
.flow{display:grid;gap:14px;margin-top:26px;counter-reset:st}
.step{
  counter-increment:st;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:22px 24px 22px 26px;position:relative;
}
.step::after{
  content:"";position:absolute;left:44px;bottom:-14px;width:1px;height:14px;background:var(--line);
}
.step:last-child::after{display:none}
.step-h{display:flex;gap:14px;align-items:center}
.step-h .n{
  flex:0 0 auto;width:34px;height:34px;border-radius:10px;background:var(--accent);color:var(--surface);
  display:grid;place-items:center;font-family:"Zen Kaku Gothic New",sans-serif;font-weight:700;font-size:15px;
}
:root[data-theme="dark"] .step-h .n{color:#0D1116}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .step-h .n{color:#0D1116}}
.step-h .n::before{content:counter(st)}
.step-h b{font-family:"Zen Kaku Gothic New",sans-serif;font-size:18px;font-weight:700;line-height:1.4}
.step-h .t{font-size:12px;color:var(--ink-3);display:block;font-weight:500;margin-top:1px;letter-spacing:.02em}
.step .say{
  margin-top:16px;background:var(--surface-2);border-radius:10px;padding:13px 17px;font-size:14.5px;line-height:1.8;
}
.step .say b{font-family:"Zen Kaku Gothic New",sans-serif;font-size:11px;letter-spacing:.12em;color:var(--ink-3);display:block;margin-bottom:4px}
.step .dd{margin-top:16px}
@media (max-width:560px){.step{padding:19px 18px}.step::after{left:37px}}

/* word bank */
.words{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:24px}
@media (max-width:760px){.words{grid-template-columns:minmax(0,1fr)}}
.wbox{border:1px solid var(--line);border-radius:var(--r);padding:20px 22px;background:var(--surface)}
.wbox.ng{background:var(--flag-soft);border-color:var(--flag-line)}
.wbox h4{font-family:"Zen Kaku Gothic New",sans-serif;font-size:13px;letter-spacing:.05em;margin-bottom:4px}
.wbox.ok h4{color:var(--accent)}
.wbox.ng h4{color:var(--flag)}
.wbox .sub{font-size:12px;color:var(--ink-3);margin-bottom:14px;line-height:1.7}
.wlist{display:flex;flex-wrap:wrap;gap:7px}
.wlist span{
  font-size:13.5px;font-weight:500;padding:6px 12px;border-radius:8px;line-height:1.5;
  background:var(--surface-2);border:1px solid var(--line);
}
.wbox.ng .wlist span{background:var(--surface);border-color:var(--flag-line);color:var(--flag)}
.wbox.ok .wlist span{background:var(--accent-soft);border-color:transparent;color:var(--accent)}

/* source block */
.src{margin-top:30px;border-top:1px solid var(--line);padding-top:16px;font-size:12.5px;color:var(--ink-2);line-height:1.8}
.src b{display:block;font-size:10.5px;letter-spacing:.14em;color:var(--ink-3);font-family:"Zen Kaku Gothic New",sans-serif;margin-bottom:7px}
.src ul{list-style:none;padding:0;display:grid;gap:6px}
.src li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:11px;margin:0}
.src .doc{font-size:10.5px;font-weight:700;letter-spacing:.05em;color:var(--accent);background:var(--accent-soft);border-radius:5px;padding:2px 8px;height:fit-content;margin-top:4px;white-space:nowrap}
.map{margin-top:13px;padding-top:11px;border-top:1px dashed var(--line);font-size:12.5px;color:var(--ink-2);line-height:1.8}
.map b{display:block;font-size:10.5px;letter-spacing:.14em;color:var(--ink-3);font-family:"Zen Kaku Gothic New",sans-serif;margin-bottom:4px}

/* source cards */
.docs{display:grid;gap:12px;margin-top:22px}
.doccard{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px 22px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:17px;align-items:start}
.doccard .n{font-family:"Zen Kaku Gothic New",sans-serif;font-weight:900;font-size:20px;color:var(--accent);font-variant-numeric:tabular-nums}
.doccard b{display:block;font-family:"Zen Kaku Gothic New",sans-serif;font-size:15px;line-height:1.5}
.doccard p{font-size:13.5px;color:var(--ink-2);margin-top:5px}
.doccard a{font-size:13px;display:inline-block;margin-top:7px;word-break:break-all}

.disclaimer{margin-top:40px;padding:24px 26px;border:1px solid var(--line);border-radius:var(--r);background:var(--surface-2);font-size:13px;color:var(--ink-2);line-height:1.95}
.disclaimer b{font-family:"Zen Kaku Gothic New",sans-serif;color:var(--ink);display:block;margin-bottom:7px;font-size:13.5px}
.totop{display:inline-flex;gap:7px;align-items:center;margin-top:22px;font-size:12.5px;color:var(--ink-3);text-decoration:none;font-weight:700}
.totop:hover{color:var(--accent)}

/* quick-mode trims: keep the reading surface calm */
[data-mode="quick"] .sec-sub{display:none}
[data-mode="quick"] .sec.open .sec-sub{display:block}
[data-mode="quick"] .src{display:none}
[data-mode="quick"] .sec.open .src{display:block}
[data-mode="quick"] .srcline{display:block}
[data-mode="deep"] .srcline,.sec.open .srcline{display:none}
.srcline{display:none;margin-top:22px;font-size:12px;color:var(--ink-3)}
'''
