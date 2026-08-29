import { useCallback, useEffect, useState } from "react";

const KEY = "fw-assistant.favorites";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    // プライベートブラウズなど、保存領域が使えない場合も動き続ける
    return [];
  }
}

/**
 * お気に入り。色と素材を同じ配列で持ち、id に接頭辞をつけて区別する。
 * 端末内のみ。外部には一切送らない。
 */
export function useFavorites() {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      // 保存できなくても表示は継続する
    }
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, has };
}
