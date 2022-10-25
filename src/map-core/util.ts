import { MapLength } from './type';

export function isInRange(line: number, column: number) {
  const halfLength = MapLength / 2;
  if (line + column <= halfLength + 2) return false;
  if (line + column >= halfLength * 3) return false;
  if (line <= column - halfLength) return false;
  if (line >= column + halfLength) return false;
  return true;
}
