import { MapLength } from '../map-core/type';

export function isInRange(line: number, column: number) {
  const halfLength = MapLength / 2;
  if (line + column <= halfLength + 2) return false;
  if (line + column >= halfLength * 3) return false;
  if (line <= column - halfLength) return false;
  if (line >= column + halfLength) return false;
  return true;
}

export function parseBuildingKey(key: string) {
  let data = key.split('-').map((v) => Number(v));
  if (data.length === 3) data.push(data[2]);
  return data;
}

export function getBuildingKey(line: number, column: number) {
  return `${line}-${column}`;
}
