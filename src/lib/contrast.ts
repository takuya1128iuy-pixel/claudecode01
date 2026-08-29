function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function luminance(hex: string): number {
  const srgb = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** カラーチップの上に文字を重ねるときの文字色 */
export function textOn(hex: string): string {
  return luminance(hex) > 0.45 ? "#23201F" : "#FFFFFF";
}

/** 淡い色は白地で輪郭が消えるため、枠線を足すかどうか */
export function needsBorder(hex: string): boolean {
  return luminance(hex) > 0.8;
}
