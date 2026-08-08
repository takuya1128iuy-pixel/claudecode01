import { useState } from "react";
import type { TastingRecord } from "./types";
import { ensureSeeded, saveRecords } from "./storage";
import RecordForm from "./components/RecordForm";
import RecordList from "./components/RecordList";
import PreferenceSummary from "./components/PreferenceSummary";

type Tab = "list" | "add" | "insight";

export default function App() {
  const [records, setRecords] = useState<TastingRecord[]>(() => ensureSeeded());
  const [tab, setTab] = useState<Tab>("list");

  const addRecord = (r: TastingRecord) => {
    const next = [r, ...records];
    setRecords(next);
    saveRecords(next);
    setTab("list");
  };

  const deleteRecord = (id: string) => {
    const next = records.filter((r) => r.id !== id);
    setRecords(next);
    saveRecords(next);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "list", label: "記録一覧" },
    { key: "add", label: "記録を追加" },
    { key: "insight", label: "好みの傾向" },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-[color:var(--color-indigo)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-wide">🍶 きき酒ノート</h1>
          <p className="text-sm text-white/70 mt-1">
            飲んだ日本酒を記録して、自分の好みを見つけるデモアプリ
          </p>
        </div>
      </header>

      <nav className="max-w-4xl mx-auto px-4 mt-4">
        <div className="flex gap-1 bg-white border border-stone-200 rounded-lg p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-1.5 text-sm rounded-md transition-colors " +
                (tab === t.key
                  ? "bg-[color:var(--color-indigo)] text-white"
                  : "text-stone-500 hover:bg-stone-100")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-16">
        {tab === "list" && <RecordList records={records} onDelete={deleteRecord} />}
        {tab === "add" && <RecordForm onSubmit={addRecord} />}
        {tab === "insight" && <PreferenceSummary records={records} />}
      </main>

      <footer className="text-center text-xs text-stone-400 pb-6">
        デモアプリ：データはこの端末のブラウザ内（localStorage）にのみ保存されます
      </footer>
    </div>
  );
}
