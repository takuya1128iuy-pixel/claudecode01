import type { ReactNode } from "react";
import { needsBorder, textOn } from "../lib/contrast.ts";

export function Swatch({
  hex,
  className = "",
  label,
}: {
  hex: string;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`block rounded-sm ${className}`}
      style={{
        background: hex,
        boxShadow: needsBorder(hex) ? "inset 0 0 0 1px var(--color-line)" : undefined,
      }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

/** 淡い色でも読めるよう、チップの上に載せる文字色を自動で選ぶ */
export function SwatchLabel({ hex, children }: { hex: string; children: ReactNode }) {
  return (
    <span
      className="rounded-sm px-2 py-1 text-sm font-semibold"
      style={{
        background: hex,
        color: textOn(hex),
        boxShadow: needsBorder(hex) ? "inset 0 0 0 1px var(--color-line)" : undefined,
      }}
    >
      {children}
    </span>
  );
}

export function Star({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      /* 売場で片手で押せるよう 44px 以上を確保する */
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl leading-none"
      style={{ color: active ? "var(--color-accent)" : "var(--color-muted)" }}
    >
      {active ? "★" : "☆"}
    </button>
  );
}

export function Pill({ children, tone = "line" }: { children: ReactNode; tone?: "line" | "accent" | "muted" }) {
  const style =
    tone === "accent"
      ? { background: "var(--color-accent)", color: "var(--color-onaccent)" }
      : tone === "muted"
        ? { color: "var(--color-muted)", boxShadow: "inset 0 0 0 1px var(--color-line)" }
        : { color: "var(--color-ink)", boxShadow: "inset 0 0 0 1px var(--color-line)" };
  return (
    <span className="rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap" style={style}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg bg-surface p-4 ${className}`} style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mt-6 mb-2 flex items-baseline gap-2">
      <h2 className="text-base font-bold">{children}</h2>
      {note && <span className="text-xs text-muted">{note}</span>}
    </div>
  );
}

/** 詳細画面のヘッダー。戻るボタンは常に左上・親指の届く高さに置く */
export function DetailHeader({
  title,
  sub,
  onBack,
  right,
}: {
  title: string;
  sub?: string;
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-2 border-b bg-ground/95 px-2 py-2 backdrop-blur"
      style={{ borderColor: "var(--color-line)", paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <button
        type="button"
        onClick={onBack}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl"
        aria-label="戻る"
      >
        ←
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-bold">{title}</div>
        {sub && <div className="truncate text-xs text-muted">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((f) => (
        <details key={f.q} className="rounded-lg bg-surface p-3" style={{ boxShadow: "inset 0 0 0 1px var(--color-line)" }}>
          <summary className="cursor-pointer list-none text-sm font-semibold">
            <span className="text-accent">Q. </span>
            {f.q}
          </summary>
          <p className="mt-2 text-sm leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** 接客でそのまま言える一言。売場で目に入りやすいよう明確に囲う */
export function TalkBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--color-accent-soft)" }}>
      <div className="mb-1 text-xs font-bold tracking-wider text-accent">接客での一言</div>
      <p className="text-sm leading-relaxed">「{children}」</p>
    </div>
  );
}
