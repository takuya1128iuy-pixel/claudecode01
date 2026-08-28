# -*- coding: utf-8 -*-
def blocks(bs):
    o=[]
    for b in bs:
        k=b[0]
        if k=='h3': o.append('        <h3>%s</h3>'%b[1])
        elif k=='p': o.append('        <p>%s</p>'%b[1])
        elif k=='raw': o.append(b[1])
        elif k=='ul':
            o.append('        <ul>'); o+=['          <li>%s</li>'%x for x in b[1]]; o.append('        </ul>')
        elif k=='q':
            o.append('        <div class="q">')
            o.append('          <span class="cite">%s</span>'%b[1])
            o.append('          %s'%b[2])
            o.append('        </div>')
        elif k=='compare':
            _,oc,ot,nc,nt=b
            o.append('        <div class="compare">')
            o.append('          <div class="pane now"><span class="chip">%s</span><div class="body">%s</div></div>'%(oc,ot))
            o.append('          <div class="pane new"><span class="chip">%s</span><div class="body">%s</div></div>'%(nc,nt))
            o.append('        </div>')
        elif k=='note':
            o.append('        <div class="note"><b>%s</b>%s</div>'%(b[1],b[2]))
        elif k=='read':
            o.append('        <div class="read"><b>読み解き（編集部の整理）</b>%s</div>'%b[1])
        elif k=='checks':
            o.append('        <ul class="checks">'); o+=['          <li>%s</li>'%x for x in b[1]]; o.append('        </ul>')
        elif k=='table':
            _,head,rows=b
            o.append('        <div class="tablewrap">')
            o.append('          <table>')
            o.append('            <thead><tr>%s</tr></thead>'%''.join('<th>%s</th>'%h for h in head))
            o.append('            <tbody>')
            for r in rows:
                cells=''
                for c in r:
                    if isinstance(c,tuple): cells+='<td class="%s">%s</td>'%(c[0],c[1])
                    else: cells+='<td>%s</td>'%c
                o.append('              <tr>%s</tr>'%cells)
            o.append('            </tbody>')
            o.append('          </table>')
            o.append('        </div>')
        elif k=='qa':
            _,no,qq,paras=b
            o.append('        <div class="qa">')
            o.append('          <div class="h"><span class="qno">%s</span><b>%s</b></div>'%(no,qq))
            o.append('          <div class="ans">')
            o.append('            <div class="lbl">金融庁の考え方</div>')
            o+=['            <p>%s</p>'%p for p in paras]
            o.append('          </div>')
            o.append('        </div>')
        else: raise ValueError(k)
    return '\n'.join(o)

def section(s):
    b=[]
    b.append('    <section class="sec" id="%s">'%s['id'])
    b.append('      <span class="sec-no">%s</span>'%s['kicker'])
    b.append('      <h2>%s</h2>'%s['title'])
    if s.get('sub'): b.append('      <p class="sec-sub">%s</p>'%s['sub'])
    b.append('      <p class="lede">%s</p>'%s['lede'])
    if s.get('do') or s.get('dont'):
        b.append('      <div class="dd">')
        if s.get('do'):
            b.append('        <div class="ok">')
            b.append('          <h4><i>✓</i>%s</h4>'%s.get('do_title','こうする'))
            b.append('          <ul>'); b+=['            <li>%s</li>'%x for x in s['do']]; b.append('          </ul>')
            b.append('        </div>')
        if s.get('dont'):
            b.append('        <div class="ng">')
            b.append('          <h4><i>✕</i>%s</h4>'%s.get('dont_title','これはできない'))
            b.append('          <ul>'); b+=['            <li>%s</li>'%x for x in s['dont']]; b.append('          </ul>')
            b.append('        </div>')
        b.append('      </div>')
    if s.get('extra_quick'): b.append(s['extra_quick'])
    b.append('      <p class="srcline">%s</p>'%s.get('srcline','根拠は「じっくり」で表示されます。'))
    b.append('      <button class="more" type="button" data-more><span class="plus">＋</span>%s</button>'%s.get('more','根拠と条文を読む'))
    b.append('      <div class="deep">')
    b.append(blocks(s['deep']))
    b.append('      </div>')
    b.append('      <div class="src">')
    b.append('        <b>出典</b>')
    b.append('        <ul>')
    for d,t in s['src']: b.append('          <li><span class="doc">%s</span><span>%s</span></li>'%(d,t))
    b.append('        </ul>')
    if s.get('map'): b.append('        <div class="map"><b>%s</b>%s</div>'%(s['map'][0],s['map'][1]))
    b.append('      </div>')
    b.append('      <a class="totop" href="#top">↑ もくじへ戻る</a>')
    b.append('    </section>')
    return '\n'.join(b)
