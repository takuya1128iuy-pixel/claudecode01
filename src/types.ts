export interface TastingRecord {
  id: string;
  name: string;
  brewery: string;
  photo: string | null;
  category: string;
  sweetness: number;
  richness: number;
  aroma: number;
  rating: number;
  tags: string[];
  note: string;
  drankAt: string;
  createdAt: number;
}

export const SAKE_CATEGORIES = [
  "純米酒",
  "純米吟醸",
  "純米大吟醸",
  "吟醸",
  "大吟醸",
  "本醸造",
  "生酒",
  "にごり酒",
  "その他",
];

export const FLAVOR_TAGS = [
  "フルーティ",
  "華やか",
  "キレがある",
  "米の旨み",
  "コク深い",
  "すっきり",
  "acidity(酸味)",
  "ナッツ香",
  "熟成感",
  "微発泡",
];
