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
