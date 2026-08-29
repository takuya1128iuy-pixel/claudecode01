import { CURRENT_SEASON, SILHOUETTES } from "../data/index.ts";
import { Card, SectionTitle, SourceNote, Swatch } from "./common.tsx";

export default function TrendScreen({ onOpenColor }: { onOpenColor: (id: string) => void }) {
  const season = CURRENT_SEASON;
  const year = season.yearColor;

  return (
    <div className="px-4 pb-28">
      {/* 誰が言っていることなのかを、解説より先に出す */}
      <div className="mt-3">
        <SourceNote source={season.sources[0]} />
      </div>

      <SectionTitle note={season.label}>カラーテーマ</SectionTitle>
      <Card>
        <div className="text-xl font-bold">{season.theme.titleEn}</div>
        <div className="text-xs text-muted">{season.theme.titleJa}</div>
        <p className="mt-3 text-sm leading-relaxed">{season.theme.description}</p>
      </Card>
      <div className="mt-2 rounded-lg p-3" style={{ background: "var(--color-accent-soft)" }}>
        <div className="mb-1 text-xs font-bold tracking-wider text-accent">売場での読み替え</div>
        <p className="text-sm leading-relaxed">{season.theme.inStore}</p>
      </div>

      <SectionTitle note="会話のとっかかりに">今季のキーワード</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {season.keywords.map((k) => (
          <span
            key={k}
            className="rounded-full bg-surface px-3 py-1.5 text-sm"
            style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
          >
            {k}
          </span>
        ))}
      </div>

      <SectionTitle note="4つの方向性">カラーグループ</SectionTitle>
      <div className="flex flex-col gap-3">
        {season.groups.map((g) => (
          <Card key={g.id}>
            <div className="text-sm font-bold">{g.nameEn}</div>
            <div className="text-xs text-muted">{g.nameJa}</div>
            <div className="mt-2 flex gap-1">
              {g.colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onOpenColor(c.id)}
                  className="min-h-11 flex-1"
                  aria-label={`${c.nameJa}を見る`}
                >
                  <Swatch hex={c.hex} className="h-9 w-full" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed">{g.description}</p>
            <p className="mt-2 text-sm leading-relaxed text-accent">{g.inStore}</p>
          </Card>
        ))}
      </div>

      {year && (
        <>
          <SectionTitle note={`${year.year}年`}>その年のメッセージカラー</SectionTitle>
          <SourceNote source={year.source} />
          <Card className="mt-2">
            <div className="flex items-center gap-3">
              <Swatch hex={year.hex} className="h-16 w-16 shrink-0" label={`${year.nameJa} の色見本`} />
              <div className="min-w-0">
                <div className="text-base font-bold">{year.nameJa}</div>
                <div className="text-xs text-muted">{year.nameEn}</div>
                <div className="mt-1 text-xs text-muted">
                  マンセル値 {year.munsell} ・ 系統色名 {year.systematicName} ・ {year.hex}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{year.reason}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {year.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
                >
                  {k}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              シーズンのトレンドカラーとは別物で、その年の世の中のムードを表す色として毎年12月に発表されるもの。
              「今年はこういう気分の年なんですよ」という話のきっかけに使える。
            </p>
          </Card>
        </>
      )}

      <SectionTitle note="毎年使える基礎">シルエット</SectionTitle>
      <div className="rounded-lg p-3 text-sm leading-relaxed" style={{ background: "var(--color-sunk)" }}>
        <span className="mr-2 text-xs font-bold tracking-wider text-muted">注記</span>
        シルエットの4ラインは、シーズンに関係なく使える基礎知識。
        <b>今季のシルエット傾向を示すものではない</b>（アイテム別のリアルトレンドは未収録）。
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {SILHOUETTES.map((s) => (
          <Card key={s.id}>
            <div className="text-sm font-bold">
              {s.id}ライン <span className="text-xs font-normal text-muted">{s.shape}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed">{s.effect}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">向いている場面 ── {s.suits}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 rounded-lg p-3 text-xs leading-relaxed" style={{ background: "var(--color-sunk)" }}>
        <b className="text-muted">まだ入っていないもの</b>
        <br />
        アイテム別のトレンド（丈・シルエット・柄の今季の傾向）と、コーディネート例。
        出典を確認できる情報源が用意できていないため、推測では載せていない。
      </div>
    </div>
  );
}
