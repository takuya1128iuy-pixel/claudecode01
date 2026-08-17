interface Props {
  title: string;
  onBack: () => void;
}

export default function ScreenHeader({ title, onBack }: Props) {
  return (
    <header className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="rounded-full bg-white px-4 py-2 text-base font-bold text-slate-500 shadow-sm active:bg-slate-100"
      >
        ← もどる
      </button>
      <h2 className="text-2xl font-black text-slate-700">{title}</h2>
    </header>
  );
}
