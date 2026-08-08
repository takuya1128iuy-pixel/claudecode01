import { useState, type FormEvent } from "react";
import type { TastingRecord } from "../types";
import { SAKE_CATEGORIES, FLAVOR_TAGS } from "../types";
import PhotoOcrInput from "./PhotoOcrInput";
import LabeledSlider from "./LabeledSlider";
import StarRating from "./StarRating";

interface Props {
  onSubmit: (record: TastingRecord) => void;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function RecordForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [brewery, setBrewery] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [category, setCategory] = useState(SAKE_CATEGORIES[0]);
  const [sweetness, setSweetness] = useState(3);
  const [richness, setRichness] = useState(3);
  const [aroma, setAroma] = useState(3);
  const [rating, setRating] = useState(4);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [note, setNote] = useState("");
  const [drankAt, setDrankAt] = useState(todayStr());

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setCustomTag("");
  };

  const reset = () => {
    setName("");
    setBrewery("");
    setPhoto(null);
    setCategory(SAKE_CATEGORIES[0]);
    setSweetness(3);
    setRichness(3);
    setAroma(3);
    setRating(4);
    setTags([]);
    setCustomTag("");
    setNote("");
    setDrankAt(todayStr());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      id: crypto.randomUUID(),
      name: name.trim(),
      brewery: brewery.trim(),
      photo,
      category,
      sweetness,
      richness,
      aroma,
      rating,
      tags,
      note: note.trim(),
      drankAt,
      createdAt: Date.now(),
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-5 text-left shadow-sm"
    >
      <PhotoOcrInput photo={photo} onPhotoChange={setPhoto} onTextPicked={(t) => setName(t)} />

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[color:var(--color-indigo)]">
            銘柄名 <span className="text-[color:var(--color-seal)]">*</span>
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例）獺祭 純米大吟醸45"
            className="border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-indigo)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[color:var(--color-indigo)]">蔵元</span>
          <input
            value={brewery}
            onChange={(e) => setBrewery(e.target.value)}
            placeholder="例）旭酒造"
            className="border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-indigo)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[color:var(--color-indigo)]">種別</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-indigo)]"
          >
            {SAKE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[color:var(--color-indigo)]">飲んだ日</span>
          <input
            type="date"
            value={drankAt}
            onChange={(e) => setDrankAt(e.target.value)}
            className="border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-indigo)]"
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <LabeledSlider
          label="甘辛"
          leftLabel="甘口"
          rightLabel="辛口"
          value={sweetness}
          onChange={setSweetness}
        />
        <LabeledSlider
          label="味わい"
          leftLabel="淡麗"
          rightLabel="濃醇"
          value={richness}
          onChange={setRichness}
        />
        <LabeledSlider
          label="香りの強さ"
          leftLabel="穏やか"
          rightLabel="華やか"
          value={aroma}
          onChange={setAroma}
        />
      </div>

      <div>
        <span className="text-sm font-medium text-[color:var(--color-indigo)] block mb-1">
          総合評価
        </span>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <span className="text-sm font-medium text-[color:var(--color-indigo)] block mb-1">
          味わいタグ
        </span>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {FLAVOR_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={
                "text-xs px-2.5 py-1 rounded-full border " +
                (tags.includes(t)
                  ? "bg-[color:var(--color-indigo)] text-white border-[color:var(--color-indigo)]"
                  : "bg-white border-stone-300 hover:bg-stone-50")
              }
            >
              {t}
            </button>
          ))}
          {tags
            .filter((t) => !FLAVOR_TAGS.includes(t))
            .map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className="text-xs px-2.5 py-1 rounded-full border bg-[color:var(--color-seal)] text-white border-[color:var(--color-seal)]"
              >
                {t} ×
              </button>
            ))}
        </div>
        <div className="flex gap-2">
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomTag();
              }
            }}
            placeholder="自由入力タグを追加"
            className="border border-stone-300 rounded-md px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-indigo)]"
          />
          <button
            type="button"
            onClick={addCustomTag}
            className="text-sm px-3 py-1.5 rounded-md border border-stone-300 bg-white hover:bg-stone-50"
          >
            追加
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[color:var(--color-indigo)]">感想メモ</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="香りや味わい、シーンなど自由に記録"
          className="border border-stone-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--color-indigo)]"
        />
      </label>

      <button
        type="submit"
        className="self-start px-5 py-2 rounded-md bg-[color:var(--color-seal)] text-white text-sm font-medium hover:opacity-90"
      >
        記録を保存する
      </button>
    </form>
  );
}
