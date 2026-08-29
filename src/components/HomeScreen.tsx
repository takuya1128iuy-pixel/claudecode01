import type { SeasonColor } from "../data/index.ts";
import { COLOR_RULES, CURRENT_SEASON, MATERIALS } from "../data/index.ts";
import { Card, SectionTitle, Swatch } from "./common.tsx";

const ALL_COLORS = CURRENT_SEASON.groups.flatMap((g) => g.colors);

/** 日付から決まる「今日の1枚」。毎日ひとつだけ、隙間時間で読み切れる量にする */
function pickOfTheDay() {
  const days = Math.floor(Date.now() / 86_400_000);
  const color = ALL_COLORS[days % ALL_COLORS.length];
  const material = MATERIALS[days % MATERIALS.length];
  const rule = COLOR_RULES[days % COLOR_RULES.length];
  const topic = CURRENT_SEASON.topics[days % CURRENT_SEASON.topics.length];
  return { color, material, rule, topic };
}

export default function HomeScreen({
  favoriteIds,
  onOpenColor,
  onOpenMaterial,
  onOpenTrend,
}: {
  favoriteIds: string[];
  onOpenColor: (id: string) => void;
  onOpenMaterial: (id: string) => void;
  onOpenTrend: () => void;
}) {
  const { color, material, rule, topic } = pickOfTheDay();

  const favColors = favoriteIds
    .filter((id) => id.startsWith("color:"))
    .map((id) => ALL_COLORS.find((c) => c.id === id.slice(6)))
    .filter((c): c is SeasonColor => Boolean(c));
  const favMaterials = favoriteIds
    .filter((id) => id.startsWith("material:"))
    .map((id) => MATERIALS.find((m) => m.id === id.slice(9)))
    .filter((m): m is (typeof MATERIALS)[number] => Boolean(m));

  return (
    <div className="px-4 pb-28">
      <SectionTitle note={CURRENT_SEASON.label}>今季のテーマ</SectionTitle>
      <button
        type="button"
        onClick={onOpenTrend}
        className="w-full rounded-lg bg-surface p-4 text-left"
        style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
      >
        <span className="block text-lg font-bold">{CURRENT_SEASON.theme.titleEn}</span>
        <span className="block text-xs text-muted">{CURRENT_SEASON.theme.titleJa}</span>
        <span className="mt-2 block text-sm leading-relaxed">{CURRENT_SEASON.theme.inStore}</span>
        <span className="mt-2 block text-xs font-semibold text-accent">
          トレンドをくわしく見る →
        </span>
      </button>

      <SectionTitle note="1分で読める">今日の1枚</SectionTitle>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onOpenColor(color.id)}
          className="flex items-center gap-3 rounded-lg bg-surface p-3 text-left"
          style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
        >
          <Swatch hex={color.hex} className="h-14 w-14 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted">今日の色</span>
            <span className="block text-sm font-bold">{color.nameJa}</span>
            <span className="block truncate text-xs text-muted">{color.impression}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onOpenMaterial(material.id)}
          className="rounded-lg bg-surface p-3 text-left"
          style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
        >
          <span className="block text-xs text-muted">今日の素材</span>
          <span className="block text-sm font-bold">{material.nameJa}</span>
          <span className="mt-1 block text-sm leading-relaxed">{material.talk}</span>
        </button>

        <button
          type="button"
          onClick={onOpenTrend}
          className="rounded-lg bg-surface p-3 text-left"
          style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
        >
          <span className="block text-xs text-muted">今日のトレンド · {topic.category}</span>
          <span className="block text-sm font-bold">{topic.title}</span>
          <span className="mt-1 block text-sm leading-relaxed">{topic.inStore}</span>
        </button>

        <Card>
          <div className="text-xs text-muted">今日の配色ルール</div>
          <div className="text-sm font-bold">{rule.title}</div>
          <p className="mt-1 text-sm leading-relaxed">{rule.summary}</p>
        </Card>
      </div>

      <SectionTitle note={`${favColors.length + favMaterials.length}件`}>お気に入り</SectionTitle>
      {favColors.length + favMaterials.length === 0 ? (
        <p className="text-sm leading-relaxed text-muted">
          色や素材の画面で ☆ を押すと、ここにまとまります。よく聞かれるものを入れておくと、
          接客中にすぐ開けます。
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {favColors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpenColor(c.id)}
              className="flex items-center gap-3 rounded-lg bg-surface p-2 text-left"
              style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
            >
              <Swatch hex={c.hex} className="h-10 w-10 shrink-0" />
              <span className="text-sm font-bold">{c.nameJa}</span>
            </button>
          ))}
          {favMaterials.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onOpenMaterial(m.id)}
              className="rounded-lg bg-surface p-3 text-left"
              style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
            >
              <span className="text-sm font-bold">{m.nameJa}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
