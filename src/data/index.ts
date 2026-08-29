/**
 * アパレル販売サポートアプリ データ層のエントリポイント。
 *
 * L1（不変知識）  : COLOR_RULES / BASIC_COLORS / MATERIALS / CARE_SYMBOLS / SILHOUETTES
 * L2（シーズン情報）: SEASONS
 * L3（市場実データ）: v1では未実装（docs/apparel-fw2026-requirements.md §7 を参照）
 */
export type * from "./types.ts";

export { COLOR_RULES, BASIC_COLORS } from "./colorHarmony.ts";
export { MATERIALS } from "./materials.ts";
export { CARE_SYMBOLS } from "./careLabels.ts";
export { SILHOUETTES } from "./silhouettes.ts";

import type { Season } from "./types.ts";
import { FW2026 } from "./seasons/fw2026.ts";

/** 収録シーズン。新しい順 */
export const SEASONS: Season[] = [FW2026];

/** 既定で表示するシーズン */
export const CURRENT_SEASON: Season = FW2026;
