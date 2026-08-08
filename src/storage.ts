import type { TastingRecord } from "./types";

const STORAGE_KEY = "sake-tasting-records";

export function loadRecords(): TastingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TastingRecord[];
  } catch {
    return [];
  }
}

export function saveRecords(records: TastingRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

const SEED: TastingRecord[] = [
  {
    id: "seed-1",
    name: "獺祭 純米大吟醸45",
    brewery: "旭酒造",
    photo: null,
    category: "純米大吟醸",
    sweetness: 3,
    richness: 2,
    aroma: 4,
    rating: 5,
    tags: ["フルーティ", "華やか", "すっきり"],
    note: "香りが華やかでとても飲みやすかった。デザート感覚で飲めた。",
    drankAt: "2026-06-12",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
  },
  {
    id: "seed-2",
    name: "久保田 千寿",
    brewery: "朝日酒造",
    photo: null,
    category: "吟醸",
    sweetness: 2,
    richness: 2,
    aroma: 3,
    rating: 4,
    tags: ["キレがある", "すっきり"],
    note: "食事に合わせやすい淡麗辛口。冷やで飲むのが好き。",
    drankAt: "2026-07-02",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: "seed-3",
    name: "八海山 特別本醸造",
    brewery: "八海醸造",
    photo: null,
    category: "本醸造",
    sweetness: 2,
    richness: 3,
    aroma: 2,
    rating: 4,
    tags: ["米の旨み", "コク深い"],
    note: "燗にしたら旨みが増して好みだった。",
    drankAt: "2026-07-20",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
];

export function ensureSeeded(): TastingRecord[] {
  const existing = loadRecords();
  if (existing.length > 0) return existing;
  saveRecords(SEED);
  return SEED;
}
