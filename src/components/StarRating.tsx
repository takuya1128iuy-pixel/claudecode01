interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}

export default function StarRating({ value, onChange, size = 22, readOnly }: Props) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          style={{ fontSize: size, lineHeight: 1 }}
          aria-label={`${n}つ星`}
        >
          <span className={n <= value ? "text-[color:var(--color-seal)]" : "text-stone-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
