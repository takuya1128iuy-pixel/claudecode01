/** カタカナをひらがなに変換する。 */
function toHiragana(text: string): string {
  return text.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

/**
 * 読みの入力を比べられる形にそろえる。
 * 全角・半角、カタカナ、空白、記号のゆれを吸収する。
 */
export function normalizeKana(text: string): string {
  return toHiragana(text.normalize("NFKC"))
    .replace(/[\s　]/g, "")
    .replace(/[。、．，.,!?！？]/g, "")
    .trim();
}

export function isSameReading(input: string, answer: string): boolean {
  const a = normalizeKana(input);
  const b = normalizeKana(answer);
  return a.length > 0 && a === b;
}
