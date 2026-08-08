import { useRef, useState } from "react";

interface Props {
  photo: string | null;
  onPhotoChange: (dataUrl: string | null) => void;
  onTextPicked: (text: string) => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoOcrInput({ photo, onPhotoChange, onTextPicked }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);

  const handleFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    onPhotoChange(dataUrl);
    setCandidates([]);
    setOcrError(null);
  };

  const runOcr = async () => {
    if (!photo) return;
    setOcrLoading(true);
    setOcrError(null);
    setCandidates([]);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("jpn+eng");
      const {
        data: { text },
      } = await worker.recognize(photo);
      await worker.terminate();
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length >= 2)
        .slice(0, 8);
      if (lines.length === 0) {
        setOcrError("ラベルの文字を読み取れませんでした。手入力してください。");
      } else {
        setCandidates(lines);
      }
    } catch {
      setOcrError("読み取りに失敗しました（オフライン環境の可能性）。手入力してください。");
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div>
      <span className="text-sm font-medium text-[color:var(--color-indigo)] block mb-1">
        ラベル写真
      </span>
      <div className="flex gap-3 items-start flex-wrap">
        <div
          className="w-28 h-28 rounded-lg border-2 border-dashed border-stone-300 bg-white flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {photo ? (
            <img src={photo} alt="ラベル" className="w-full h-full object-cover" />
          ) : (
            <span className="text-stone-400 text-xs text-center px-2">タップして写真を追加</span>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div className="flex flex-col gap-2 min-w-[180px]">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 text-sm rounded-md border border-stone-300 bg-white hover:bg-stone-50"
          >
            写真を選ぶ / 撮影する
          </button>
          {photo && (
            <button
              type="button"
              onClick={runOcr}
              disabled={ocrLoading}
              className="px-3 py-1.5 text-sm rounded-md bg-[color:var(--color-indigo)] text-white hover:opacity-90 disabled:opacity-50"
            >
              {ocrLoading ? "読み取り中…" : "写真から銘柄を読み取る"}
            </button>
          )}
          {photo && (
            <button
              type="button"
              onClick={() => {
                onPhotoChange(null);
                setCandidates([]);
                setOcrError(null);
              }}
              className="text-xs text-stone-400 underline text-left"
            >
              写真を削除
            </button>
          )}
        </div>
      </div>

      {ocrError && <p className="text-xs text-[color:var(--color-seal)] mt-2">{ocrError}</p>}

      {candidates.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-stone-500 mb-1">読み取り結果から選択（タップで銘柄欄に反映）：</p>
          <div className="flex flex-wrap gap-1.5">
            {candidates.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onTextPicked(c)}
                className="text-xs px-2 py-1 rounded-full bg-[color:var(--color-washi)] border border-stone-300 hover:bg-stone-200"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
