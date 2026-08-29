import { useState } from "react";
import type { BasicColor, ColorFamily, ColorGroup, ColorTemperature, SeasonColor } from "../data/index.ts";
import { BASIC_COLORS, CURRENT_SEASON } from "../data/index.ts";
import { Card, DetailHeader, Pill, SectionTitle, SourceNote, Star, Swatch, TalkBox } from "./common.tsx";

/** role から面積比の目安へ */
const RATIO: Record<SeasonColor["role"], { pct: number; hint: string }> = {
  ベース: { pct: 70, hint: "コートやボトムなど、大きい面積に使う色" },
  アソート: { pct: 25, hint: "トップスやスカートなど、中くらいの面積に使う色" },
  アクセント: { pct: 5, hint: "マフラー・バッグ・靴など、小物で使う色" },
};

const ALL_COLORS = CURRENT_SEASON.groups.flatMap((g) =>
  g.colors.map((c) => ({ color: c, group: g })),
);

/** 表示順。売場で口に出す順に並べる */
const FAMILY_ORDER: ColorFamily[] = [
  "ニュートラル",
  "ベージュ・ブラウン",
  "レッド",
  "オレンジ",
  "イエロー",
  "グリーン",
  "ブルー",
  "パープル",
  "ピンク",
];

const TEMPERATURES: (ColorTemperature | "すべて")[] = ["すべて", "暖色", "寒色", "中性"];

function findBasic(id: string): BasicColor | undefined {
  return BASIC_COLORS.find((b) => b.id === id);
}

function ColorRow({
  color,
  group,
  onOpen,
}: {
  color: SeasonColor;
  group?: ColorGroup;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-lg bg-surface p-2 text-left"
      style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
    >
      <Swatch hex={color.hex} className="h-12 w-12 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{color.nameJa}</span>
        <span className="block truncate text-xs text-muted">
          {color.hex} · {color.tone}
          {group ? ` · ${group.nameEn}` : ""}
        </span>
      </span>
      <Pill tone={color.role === "アクセント" ? "accent" : "muted"}>{color.role}</Pill>
    </button>
  );
}

/** 選択式のボタン列。押されているものが一目で分かるようにする */
function Choice({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold"
      style={{
        background: on ? "var(--color-accent)" : "var(--color-surface)",
        color: on ? "var(--color-onaccent)" : "var(--color-ink)",
        boxShadow: on ? undefined : "inset 0 0 0 1px var(--color-line)",
      }}
    >
      {children}
    </button>
  );
}

function ColorDetail({
  color,
  group,
  onBack,
  onOpenColor,
  isFav,
  toggleFav,
}: {
  color: SeasonColor;
  group: ColorGroup;
  onBack: () => void;
  onOpenColor: (id: string) => void;
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
}) {
  const ratio = RATIO[color.role];
  const favId = `color:${color.id}`;
  const sameTone = group.colors.filter((c) => c.id !== color.id);

  return (
    <div>
      <DetailHeader
        title={color.nameJa}
        sub={`${color.family} · ${color.temperature} · ${color.hex}`}
        onBack={onBack}
        right={
          <Star active={isFav(favId)} onClick={() => toggleFav(favId)} label="お気に入りに入れる" />
        }
      />
      <div className="flex flex-col gap-3 px-4 pb-28">
        <Swatch hex={color.hex} className="h-32 w-full" label={`${color.nameJa} の色見本`} />
        <div className="flex flex-wrap gap-2">
          <Pill tone="muted">{color.family}</Pill>
          <Pill tone="muted">{color.temperature}</Pill>
          <Pill tone="muted">{color.tone}</Pill>
        </div>
        <p className="text-sm leading-relaxed">{color.impression}</p>

        <TalkBox>{color.talk}</TalkBox>

        <SectionTitle note="どのくらいの面積で使うか">使い方</SectionTitle>
        <Card>
          <div className="mb-2 flex h-8 overflow-hidden rounded-sm">
            <span style={{ flex: ratio.pct, background: color.hex }} />
            <span style={{ flex: 100 - ratio.pct, background: "var(--color-sunk)" }} />
          </div>
          <p className="text-sm">
            <b>{color.role}</b>（目安 {ratio.pct}%）── {ratio.hint}
          </p>
        </Card>

        <SectionTitle note="お客様が持っている色から考える">合わせやすいベーシック色</SectionTitle>
        <div className="flex flex-col gap-2">
          {color.goesWithBasics.map((id) => {
            const b = findBasic(id);
            if (!b) return null;
            return (
              <div
                key={id}
                className="flex items-start gap-3 rounded-lg bg-surface p-3"
                style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
              >
                <Swatch hex={b.hex} className="mt-0.5 h-9 w-9 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{b.nameJa}</span>
                  <span className="block text-xs leading-relaxed text-muted">{b.impression}</span>
                </span>
              </div>
            );
          })}
        </div>

        <SectionTitle note="同じグループ＝トーンが近いので馴染む">重ねやすい今季の色</SectionTitle>
        <div className="flex flex-col gap-2">
          {sameTone.map((c) => (
            <ColorRow key={c.id} color={c} onOpen={() => onOpenColor(c.id)} />
          ))}
        </div>

        <SectionTitle>このグループについて</SectionTitle>
        <SourceNote source={CURRENT_SEASON.sources[0]} />
        <Card>
          <div className="text-sm font-bold">
            {group.nameEn} <span className="text-xs font-normal text-muted">{group.nameJa}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{group.description}</p>
          <p className="mt-2 text-sm leading-relaxed text-accent">{group.inStore}</p>
        </Card>
      </div>
    </div>
  );
}

/** 系統でしぼる。29色を一度に見せても選べないので、ここが既定の入口 */
function ByFamily({ onOpenColor }: { onOpenColor: (id: string) => void }) {
  const [temp, setTemp] = useState<ColorTemperature | "すべて">("すべて");
  const [family, setFamily] = useState<ColorFamily | null>(null);

  const byTemp = ALL_COLORS.filter((x) => temp === "すべて" || x.color.temperature === temp);
  const families = FAMILY_ORDER.map((f) => ({
    family: f,
    items: byTemp.filter((x) => x.color.family === f),
  })).filter((f) => f.items.length > 0);

  // 温度をしぼった結果、選んでいた系統が消えたら解除する
  const activeFamily = families.some((f) => f.family === family) ? family : null;
  const shown = activeFamily
    ? byTemp.filter((x) => x.color.family === activeFamily)
    : byTemp;

  return (
    <div>
      <p className="mt-4 text-sm text-muted">まず大きく分けて、それから系統で選びます。</p>

      <div className="mt-2 grid grid-cols-4 gap-2">
        {TEMPERATURES.map((t) => (
          <Choice key={t} on={temp === t} onClick={() => setTemp(t)}>
            {t}
          </Choice>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <Choice on={activeFamily === null} onClick={() => setFamily(null)}>
          全系統 {byTemp.length}
        </Choice>
        {families.map((f) => (
          <Choice
            key={f.family}
            on={activeFamily === f.family}
            onClick={() => setFamily(f.family === activeFamily ? null : f.family)}
          >
            {/* 系統がひと目で分かるよう、その系統の色を小さく並べる */}
            <span className="flex gap-0.5" aria-hidden="true">
              {f.items.slice(0, 3).map((x) => (
                <Swatch key={x.color.id} hex={x.color.hex} className="h-4 w-2" />
              ))}
            </span>
            {f.family} {f.items.length}
          </Choice>
        ))}
      </div>

      <SectionTitle note={`${shown.length}色`}>
        {activeFamily ?? (temp === "すべて" ? "今季の色" : temp)}
      </SectionTitle>
      <div className="flex flex-col gap-2">
        {shown.map(({ color, group }) => (
          <ColorRow key={color.id} color={color} group={group} onOpen={() => onOpenColor(color.id)} />
        ))}
      </div>
    </div>
  );
}

/** ベーシック色から今季の色を引く（接客中に一番使う導線） */
function ReverseLookup({ onOpenColor }: { onOpenColor: (id: string) => void }) {
  const [basicId, setBasicId] = useState<string>(BASIC_COLORS[0].id);
  const basic = findBasic(basicId);
  const matched = ALL_COLORS.filter((x) => x.color.goesWithBasics.includes(basicId));

  return (
    <div>
      <p className="mt-4 text-sm text-muted">
        お客様がお持ちの色を選ぶと、それに合う今季の色が出ます。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {BASIC_COLORS.map((b) => (
          <Choice key={b.id} on={b.id === basicId} onClick={() => setBasicId(b.id)}>
            <Swatch hex={b.hex} className="h-5 w-5" />
            {b.nameJa}
          </Choice>
        ))}
      </div>

      {basic && (
        <Card className="mt-3">
          <p className="text-sm leading-relaxed">{basic.goesWith}</p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-accent)" }}>
            気をつける点 ── {basic.careful}
          </p>
        </Card>
      )}

      <SectionTitle note={`${matched.length}色`}>合う今季の色</SectionTitle>
      <div className="flex flex-col gap-2">
        {matched.map(({ color, group }) => (
          <ColorRow key={color.id} color={color} group={group} onOpen={() => onOpenColor(color.id)} />
        ))}
      </div>
    </div>
  );
}

export default function ColorScreen({
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
  const [mode, setMode] = useState<"family" | "basic">("family");

  const opened = ALL_COLORS.find((x) => x.color.id === openId);
  if (opened) {
    return (
      <ColorDetail
        color={opened.color}
        group={opened.group}
        onBack={() => setOpenId(null)}
        onOpenColor={setOpenId}
        isFav={isFav}
        toggleFav={toggleFav}
      />
    );
  }

  return (
    <div className="px-4 pb-28">
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Choice on={mode === "family"} onClick={() => setMode("family")}>
          色の系統から
        </Choice>
        <Choice on={mode === "basic"} onClick={() => setMode("basic")}>
          手持ちの色から
        </Choice>
      </div>

      {mode === "family" ? (
        <ByFamily onOpenColor={setOpenId} />
      ) : (
        <ReverseLookup onOpenColor={setOpenId} />
      )}

      <p className="mt-6 text-xs leading-relaxed text-muted">
        色の値は公開されているカラーカードからの実測の近似値です。画面や照明で見え方が変わるため、
        実物の色は必ず商品で確認してください。
      </p>
    </div>
  );
}
