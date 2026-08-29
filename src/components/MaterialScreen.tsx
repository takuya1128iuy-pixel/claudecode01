import { useState } from "react";
import type { Material } from "../data/index.ts";
import { MATERIALS } from "../data/index.ts";
import { Card, DetailHeader, Faq, Pill, SectionTitle, Star, TalkBox } from "./common.tsx";

const FREQ_ORDER: Record<Material["frequency"], number> = { 定番: 0, ときどき: 1, たまに: 2 };

/** 売場で出てくる頻度の高い順。覚える優先順位に合わせる */
const SORTED = [...MATERIALS].sort(
  (a, b) => FREQ_ORDER[a.frequency] - FREQ_ORDER[b.frequency] || a.nameJa.localeCompare(b.nameJa, "ja"),
);

const CATEGORIES = ["すべて", ...new Set(MATERIALS.map((m) => m.category))] as const;

function Meter({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-xs text-muted">{label}</span>
      <span className="flex flex-1 gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="h-2 flex-1 rounded-full"
            style={{ background: i <= value ? "var(--color-accent)" : "var(--color-sunk)" }}
          />
        ))}
      </span>
      {/* 色だけで伝えず、必ず数値も併記する */}
      <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted">
        {value} / 5 {unit}
      </span>
    </div>
  );
}

function MaterialDetail({
  material,
  onBack,
  isFav,
  toggleFav,
}: {
  material: Material;
  onBack: () => void;
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
}) {
  const favId = `material:${material.id}`;
  const washTone =
    material.care.washable === "可" ? "accent" : material.care.washable === "不可" ? "muted" : "line";

  return (
    <div>
      <DetailHeader
        title={material.nameJa}
        sub={`${material.nameEn} · ${material.category}`}
        onBack={onBack}
        right={<Star active={isFav(favId)} onClick={() => toggleFav(favId)} label="お気に入りに入れる" />}
      />
      <div className="flex flex-col gap-3 px-4 pb-28">
        <TalkBox>{material.talk}</TalkBox>

        <SectionTitle>特徴</SectionTitle>
        <Card>
          <div className="flex flex-col gap-2">
            <Meter label="暖かさ" value={material.warmth} unit="" />
            <Meter label="重さ" value={material.weight} unit="" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone="muted">価格帯 {material.priceFeel}</Pill>
            <Pill tone="muted">毛玉 {material.care.pilling}</Pill>
            <Pill tone={washTone}>家庭洗濯 {material.care.washable}</Pill>
            <Pill tone="muted">売場では{material.frequency}</Pill>
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <div className="mb-2 text-sm font-bold text-accent">良いところ</div>
            <ul className="ml-4 list-disc text-sm leading-relaxed">
              {material.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="mb-2 text-sm font-bold text-muted">伝えておくところ</div>
            <ul className="ml-4 list-disc text-sm leading-relaxed">
              {material.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Card>
        </div>

        <SectionTitle note="最終判断は商品の洗濯表示に従う">お手入れ</SectionTitle>
        <Card>
          <p className="text-sm leading-relaxed">{material.care.note}</p>
          <p className="mt-2 text-sm leading-relaxed">
            <span className="text-muted">しまい方 ── </span>
            {material.care.storage}
          </p>
        </Card>

        <SectionTitle note="そのまま答えられる形にしてある">よく聞かれること</SectionTitle>
        <Faq items={material.faq} />
      </div>
    </div>
  );
}

export default function MaterialScreen({
  openId,
  setOpenId,
  isFav,
  toggleFav,
}: {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
}) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("すべて");

  const opened = MATERIALS.find((m) => m.id === openId);
  if (opened) {
    return (
      <MaterialDetail material={opened} onBack={() => setOpenId(null)} isFav={isFav} toggleFav={toggleFav} />
    );
  }

  const list = cat === "すべて" ? SORTED : SORTED.filter((m) => m.category === cat);

  return (
    <div className="px-4 pb-28">
      <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATEGORIES.map((c) => {
          const on = c === cat;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={on}
              className="min-h-11 shrink-0 rounded-full px-3 text-sm whitespace-nowrap"
              style={{
                background: on ? "var(--color-accent)" : "var(--color-surface)",
                color: on ? "var(--color-onaccent)" : "var(--color-ink)",
                boxShadow: on ? undefined : "inset 0 0 0 1px var(--color-line)",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-muted">売場でよく出るものから並べています。</p>

      <div className="mt-2 flex flex-col gap-2">
        {list.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setOpenId(m.id)}
            className="rounded-lg bg-surface p-3 text-left"
            style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
          >
            <span className="flex items-baseline gap-2">
              <span className="text-sm font-bold">{m.nameJa}</span>
              <span className="text-xs text-muted">{m.nameEn}</span>
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">
              暖かさ {m.warmth}/5 · 家庭洗濯 {m.care.washable} · 毛玉 {m.care.pilling}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
