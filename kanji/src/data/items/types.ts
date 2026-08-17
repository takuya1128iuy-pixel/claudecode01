/**
 * 例文データの形。
 * [出題する語（漢字表記）, その読み（ひらがな）, 例文]
 * 例文の中では、出題する語を {} で囲む。
 */
export type ItemTuple = [word: string, reading: string, sentence: string];

/** 漢字1字をキーにした例文の一覧。 */
export type ItemMap = Record<string, ItemTuple[]>;
