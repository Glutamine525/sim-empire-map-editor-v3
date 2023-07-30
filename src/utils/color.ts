export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number) {
  if (r > 255 || g > 255 || b > 255) {
    throw 'Invalid color component';
  }
  return `#${((r << 16) | (g << 8) | b).toString(16)}`;
}

export function getColorByBg(_hex: string) {
  const hex = hexToRgb(_hex);
  if (!hex) {
    return 'rgb(var(--gray-7))';
  }
  var color = 0.213 * hex.r + 0.715 * hex.g + 0.072 * hex.b > 255 / 2;
  return color ? 'rgb(var(--gray-7))' : 'rgb(var(--gray-10))';
}
