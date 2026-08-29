import { useMemo, useState } from "react";
import { CURRENT_SEASON, MATERIALS } from "./data/index.ts";
import { useFavorites } from "./hooks/useFavorites.ts";
import ColorScreen from "./components/ColorScreen.tsx";
import HomeScreen from "./components/HomeScreen.tsx";
import MaterialScreen from "./components/MaterialScreen.tsx";
import ReferenceScreen from "./components/ReferenceScreen.tsx";
import { Swatch } from "./components/common.tsx";

type Tab = "home" | "color" | "material" | "ref";

/* 端末のフォントに左右されないよう、タブのアイコンは自前の SVG にする */
function TabIcon({ name }: { name: Tab }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "home") {
    return (
      <svg {...common}>
        <path d="M4 11 12 4l8 7" />
        <path d="M6 10v9h12v-9" />
      </svg>
    );
  }
  if (name === "color") {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="5" />
        <circle cx="15" cy="15" r="5" />
      </svg>
    );
  }
  if (name === "material") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 10h16M4 15h16M10 4v16" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M9 10h6M9 14h4" />
    </svg>
  );
}

const TABS: { key: Tab; label: string }[] = [
  { key: "home", label: "ホーム" },
  { key: "color", label: "カラー" },
  { key: "material", label: "素材" },
  { key: "ref", label: "参考" },
];

const ALL_COLORS = CURRENT_SEASON.groups.flatMap((g) => g.colors);

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [openColorId, setOpenColorId] = useState<string | null>(null);
  const [openMaterialId, setOpenMaterialId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const fav = useFavorites();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      colors: ALL_COLORS.filter((c) =>
        [c.nameJa, c.hex, c.tone, c.role, c.impression, c.talk].join(" ").toLowerCase().includes(q),
      ),
      materials: MATERIALS.filter((m) =>
        [m.nameJa, m.nameEn, m.category, m.talk, ...m.pros, ...m.cons, ...m.faq.map((f) => f.q)]
          .join(" ")
          .toLowerCase()
          .includes(q),
      ),
    };
  }, [query]);

  const openColor = (id: string) => {
    setQuery("");
    setOpenColorId(id);
    setTab("color");
  };
  const openMaterial = (id: string) => {
    setQuery("");
    setOpenMaterialId(id);
    setTab("material");
  };

  /* 詳細画面は自前のヘッダーを持つので、検索バーは隠して情報量を減らす */
  const inDetail =
    (tab === "color" && openColorId !== null) || (tab === "material" && openMaterialId !== null);

  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      {!inDetail && (
        <header
          className="sticky top-0 z-10 bg-ground/95 px-4 pb-2 backdrop-blur"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="色・素材・気になることばで探す"
            aria-label="検索"
            className="w-full rounded-full bg-surface px-4 py-2.5"
            style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
          />
        </header>
      )}

      <main>
        {results ? (
          <div className="px-4 pb-28">
            <p className="mt-3 text-sm text-muted">
              色 {results.colors.length}件 / 素材 {results.materials.length}件
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {results.colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openColor(c.id)}
                  className="flex items-center gap-3 rounded-lg bg-surface p-2 text-left"
                  style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
                >
                  <Swatch hex={c.hex} className="h-10 w-10 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{c.nameJa}</span>
                    <span className="block truncate text-xs text-muted">{c.impression}</span>
                  </span>
                </button>
              ))}
              {results.materials.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openMaterial(m.id)}
                  className="rounded-lg bg-surface p-3 text-left"
                  style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}
                >
                  <span className="block text-sm font-bold">{m.nameJa}</span>
                  <span className="mt-1 block truncate text-xs text-muted">{m.talk}</span>
                </button>
              ))}
              {results.colors.length + results.materials.length === 0 && (
                <p className="text-sm leading-relaxed text-muted">
                  見つかりませんでした。「洗える」「毛玉」「くすみ」など、お客様の言葉でも探せます。
                </p>
              )}
            </div>
          </div>
        ) : tab === "home" ? (
          <HomeScreen favoriteIds={fav.ids} onOpenColor={openColor} onOpenMaterial={openMaterial} />
        ) : tab === "color" ? (
          <ColorScreen
            openId={openColorId}
            setOpenId={setOpenColorId}
            isFav={fav.has}
            toggleFav={fav.toggle}
          />
        ) : tab === "material" ? (
          <MaterialScreen
            openId={openMaterialId}
            setOpenId={setOpenMaterialId}
            isFav={fav.has}
            toggleFav={fav.toggle}
          />
        ) : (
          <ReferenceScreen />
        )}
      </main>

      {/* 片手・親指で届くよう、主要ナビは画面下部に固定する */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t bg-surface"
        style={{
          borderColor: "var(--color-line)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-label="メインナビゲーション"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-4">
          {TABS.map((t) => {
            const on = !results && tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setQuery("");
                  setTab(t.key);
                  if (t.key === "color") setOpenColorId(null);
                  if (t.key === "material") setOpenMaterialId(null);
                }}
                aria-current={on ? "page" : undefined}
                className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs"
                style={{ color: on ? "var(--color-accent)" : "var(--color-muted)" }}
              >
                <TabIcon name={t.key} />
                <span className={on ? "font-bold" : undefined}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
