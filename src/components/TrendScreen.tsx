import { useMemo, useState } from "react";
import type { TrendCategory } from "../data/index.ts";
import { CURRENT_SEASON } from "../data/index.ts";
import { Card, SectionTitle, SourceNote, Swatch } from "./common.tsx";

/** 表示順。売場で気になる順に並べる */
const CATEGORY_ORDER: TrendCategory[] = [
  "店頭",
  "キーワード",
  "シルエット",
  "アイテム",
  "スタイリング",
  "柄",
  "カラー",
  "素材",
];

export default function TrendScreen({ onOpenColor }: { onOpenColor: (id: string) => void }) {
  const season = CURRENT_SEASON;
  const year = season.yearColor;
  const [cat, setCat] = useState<TrendCategory | "すべて">("すべて");

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => season.topics.some((t) => t.category === c)),
    [season.topics],
  );
  const topics = cat === "すべて" ? season.topics : season.topics.filter((t) => t.category === cat);

  /** 出典は重複するので、画面の頭では一度だけまとめて出す */
  const allSources = useMemo(() => {
    const seen = new Set<string>();
    return [...season.sources, ...season.topics.map((t) => t.source)].filter((s) => {
      const key = s.url ?? s.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [season]);

  const publishers = useMemo(
    () => [...new Set(allSources.map((s) => s.publisher).filter(Boolean))] as string[],
    [allSources],
  );

  return (
    <div className="px-4 pb-28">
      {/* 出典はまとめると画面を埋めてしまうので、上部は一覧をたたんで置き、
          各項目の出典は本文の前に個別に出す */}
      <details className="mt-3 rounded-lg px-3 py-2" style={{ background: "var(--color-sunk)" }}>
        <summary className="cursor-pointer list-none text-sm">
          <span className="mr-2 text-xs font-bold tracking-wider text-muted">出典</span>
          {publishers.join(" ／ ")}
          <span className="ml-2 text-xs text-muted">全{allSources.length}件を見る</span>
        </summary>
        <div className="mt-2 flex flex-col gap-2">
          {allSources.map((s) => (
            <SourceNote key={s.url ?? s.title} source={s} />
          ))}
        </div>
      </details>

      <SectionTitle note={`${season.topics.length}項目`}>今季のトレンド</SectionTitle>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(["すべて", ...categories] as const).map((c) => {
          const on = c === cat;
          const n = c === "すべて" ? season.topics.length : season.topics.filter((t) => t.category === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={on}
              className="min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold whitespace-nowrap"
              style={{
                background: on ? "var(--color-accent)" : "var(--color-surface)",
                color: on ? "var(--color-onaccent)" : "var(--color-ink)",
                boxShadow: on ? undefined : "inset 0 0 0 1px var(--color-line)",
              }}
            >
              {c} {n}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {topics.map((t) => (
          <Card key={t.id}>
            <div className="flex items-baseline gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
                style={{ background: "var(--color-sunk)", color: "var(--color-muted)" }}
              >
                {t.category}
              </span>
              <span className="text-base font-bold">{t.title}</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">
              出典:{" "}
              {t.source.url ? (
                <a href={t.source.url} target="_blank" rel="noreferrer" className="underline">
                  {t.source.publisher}
                </a>
              ) : (
                t.source.publisher
              )}{" "}
              {t.source.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{t.summary}</p>
            <div className="mt-2 rounded-lg p-3" style={{ background: "var(--color-accent-soft)" }}>
              <div className="mb-1 text-xs font-bold tracking-wider text-accent">売場では</div>
              <p className="text-sm leading-relaxed">{t.inStore}</p>
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle note={season.label}>カラーテーマ</SectionTitle>
      <Card>
        <div className="text-xl font-bold">{season.theme.titleEn}</div>
        <div className="text-xs text-muted">{season.theme.titleJa}</div>
        <p className="mt-1.5 text-xs text-muted">
          出典: {season.sources[0].publisher} {season.sources[0].title}
        </p>
        <p className="mt-3 text-sm leading-relaxed">{season.theme.description}</p>
      </Card>
      <div className="mt-2 rounded-lg p-3" style={{ background: "var(--color-accent-soft)" }}>
        <div className="mb-1 text-xs font-bold tracking-wider text-accent">売場での読み替え</div>
        <p className="text-sm leading-relaxed">{season.theme.inStore}</p>
      </div>

      <SectionTitle note="会話のとっかかりに">テーマのキーワード</SectionTitle>
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
          <Card>
            <p className="mb-2 text-xs text-muted">
              出典: {year.source.publisher} {year.source.title}
            </p>
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

      <div className="mt-6 rounded-lg p-3 text-xs leading-relaxed" style={{ background: "var(--color-sunk)" }}>
        <b className="text-muted">読むときの注意</b>
        <br />
        「売場では」は、出典の内容をこのアプリが読み替えたもので、出典元の主張ではありません。
        また海外コレクションの傾向は、実際に店頭に並ぶ商品とは時期も強さもずれます。
        店頭の実感と違うと感じたら、店頭のほうが正しいと考えてください。
      </div>
    </div>
  );
}
