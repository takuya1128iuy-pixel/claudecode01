interface Props {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export default function LabeledSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  min = 1,
  max = 5,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-[color:var(--color-indigo)]">{label}</span>
        <span className="text-xs text-stone-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--color-seal)]"
      />
      <div className="flex justify-between text-[11px] text-stone-400 mt-0.5">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
