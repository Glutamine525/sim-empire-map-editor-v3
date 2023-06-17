import { MapLength } from '../map-core/type';

export function parseBuildingKey(key: string) {
  const data = key.split('-').map(v => Number(v));
  if (data.length === 3) data.push(data[2]);
  return data;
}

export function getBuildingKey(line: number, column: number) {
  return `${line}-${column}`;
}

// 检测当前cell是否再地图范围内
export function isInRange(line: number, column: number) {
  const halfLength = MapLength / 2;
  if (line + column <= halfLength + 2) return false;
  if (line + column >= halfLength * 3) return false;
  if (line <= column - halfLength) return false;
  if (line >= column + halfLength) return false;
  return true;
}

export function isBoundary(line: number, column: number) {
  const halfLength = MapLength / 2;
  if (line + column == halfLength + 2) return true;
  if (line + column == halfLength * 3) return true;
  if (line == column - halfLength) return true;
  if (line == column + halfLength) return true;
  return false;
}

// 检测建筑是否都在地图范围内
export function isAllInRange(
  line: number,
  column: number,
  width: number,
  height: number,
) {
  return (
    isInRange(line, column) &&
    isInRange(line + height, column) &&
    isInRange(line, column + width) &&
    isInRange(line + height, column + width)
  );
}

// 检测[li, co]是否在建筑范围内
export function isInBuildingRange(
  li: number,
  co: number,
  originLi: number,
  originCo: number,
  width: number,
  height: number,
  range: number,
) {
  const diff = range - 4;
  const relativeLi = li - originLi;
  const relativeCo = co - originCo;
  if (relativeLi + relativeCo + range + diff < 0) return false;
  if (relativeLi + relativeCo > range + diff + width + height - 2) return false;
  if (relativeLi < relativeCo - (range + diff + width - 1)) return false;
  if (relativeLi > relativeCo + (range + diff + height - 1)) return false;
  return true;
}
