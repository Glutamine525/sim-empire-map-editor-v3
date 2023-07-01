import { MapLength } from '../map-core/type';

export function parseBuildingKey(key: string) {
  const data = key.split('-').map(v => Number(v));
  if (data.length === 3) data.push(data[2]);
  return data;
}

export function getBuildingKey(row: number, col: number) {
  return `${row}-${col}`;
}

// 检测当前cell是否再地图范围内
export function isInRange(row: number, col: number) {
  const halfLength = MapLength / 2;
  if (row + col <= halfLength + 2) return false;
  if (row + col >= halfLength * 3) return false;
  if (row <= col - halfLength) return false;
  if (row >= col + halfLength) return false;
  return true;
}

export function isBoundary(row: number, col: number) {
  const halfLength = MapLength / 2;
  if (row + col == halfLength + 2) return true;
  if (row + col == halfLength * 3) return true;
  if (row == col - halfLength) return true;
  if (row == col + halfLength) return true;
  return false;
}

// 检测建筑是否都在地图范围内
export function isAllInRange(row: number, col: number, w: number, h: number) {
  return (
    isInRange(row, col) &&
    isInRange(row + h, col) &&
    isInRange(row, col + w) &&
    isInRange(row + h, col + w)
  );
}

// 检测[li, co]是否在建筑范围内
export function isInBuildingRange(
  row: number,
  col: number,
  originRow: number,
  originCol: number,
  w: number,
  h: number,
  range: number,
) {
  const diff = range - 4;
  const relativeLi = row - originRow;
  const relativeCo = col - originCol;
  if (relativeLi + relativeCo + range + diff < 0) return false;
  if (relativeLi + relativeCo > range + diff + w + h - 2) return false;
  if (relativeLi < relativeCo - (range + diff + w - 1)) return false;
  if (relativeLi > relativeCo + (range + diff + h - 1)) return false;
  return true;
}
