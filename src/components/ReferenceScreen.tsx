import { useState } from "react";
import { CARE_SYMBOLS, COLOR_RULES, SILHOUETTES } from "../data/index.ts";
import { Card, SectionTitle, SourceNote } from "./common.tsx";

type Topic = "rules" | "care" | "silhouette";

const TABS: { key: Topic; label: string }[] = [
  { key: "rules", label: "配色ルール" },
  { key: "care", label: "洗濯表示" },
  { key: "silhouette", label: "シルエット" },
];

export default function ReferenceScreen() {
  const [topic, setTopic] = useState<Topic>("rules");

  return (
    <div className="px-4 pb-28">
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TABS.map((t) => {
          const on = t.key === topic;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTopic(t.key)}
              aria-pressed={on}
              className="min-h-11 rounded-lg px-2 text-sm font-semibold"
              style={{
                background: on ? "var(--color-accent)" : "var(--color-surface)",
                color: on ? "var(--color-onaccent)" : "var(--color-ink)",
                boxShadow: on ? undefined : "inset 0 0 0 1px var(--color-line)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {topic === "rules" && (
        <div>
          <div className="mt-4">
            <SourceNote source={COLOR_RULES[0].source} />
          </div>
          <p className="mt-3 text-sm text-muted">シーズンが変わっても使える考え方です。</p>
          {COLOR_RULES.map((r) => (
            <details
              key={r.id}
              className="mt-2 rounded-lg bg-surface p-3"
              style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
            >
              <summary className="cursor-pointer list-none">
                <span className="block text-sm font-bold">{r.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{r.summary}</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed">{r.why}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-accent)" }}>
                売場では ── {r.inStore}
              </p>
              <ul className="mt-2 ml-4 list-disc text-sm leading-relaxed">
                {r.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}

      {topic === "care" && (
        <div>
          <div className="mt-4">
            <SourceNote source={CARE_SYMBOLS[0].source} />
          </div>
          <p className="mt-3 text-sm text-muted">
            「洗えますか？」に答えるための一覧です。実際の判断は商品のタグを一緒に見てください。
          </p>
          {CARE_SYMBOLS.map((g) => (
            <section key={g.id}>
              <SectionTitle note={g.shape}>{g.title}</SectionTitle>
              <Card>
                <p className="text-sm leading-relaxed text-muted">{g.common}</p>
                <dl className="mt-3 flex flex-col gap-2">
                  {g.items.map((it) => (
                    <div key={it.mark} className="border-t pt-2" style={{ borderColor: "var(--color-line)" }}>
                      <dt className="text-sm font-bold">{it.mark}</dt>
                      <dd className="text-sm leading-relaxed">{it.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </section>
          ))}
        </div>
      )}

      {topic === "silhouette" && (
        <div>
          <div className="mt-4">
            <SourceNote source={SILHOUETTES[0].source} />
          </div>
          <p className="mt-3 text-sm text-muted">
            「なんかしっくりこない」の正体は、たいていシルエットが定まっていないことです。
          </p>
          {SILHOUETTES.map((s) => (
            <section key={s.id}>
              <SectionTitle note={s.shape}>
                {s.id}ライン
              </SectionTitle>
              <Card>
                <p className="text-sm leading-relaxed">{s.effect}</p>
                <p className="mt-2 text-sm leading-relaxed">
                  <span className="text-muted">向いている場面 ── </span>
                  {s.suits}
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-accent)" }}>
                  気をつける点 ── {s.careful}
                </p>
                <p className="mt-3 rounded-lg p-3 text-sm leading-relaxed" style={{ background: "var(--color-accent-soft)" }}>
                  「{s.talk}」
                </p>
              </Card>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
