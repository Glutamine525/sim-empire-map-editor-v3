import { MapLength } from '../map-core/type';

export function parseBuildingKey(key: string) {
  let data = key.split('-').map((v) => Number(v));
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

// 检测建筑是否都在地图范围内
export function isAllInRange(line: number, column: number, width: number, height: number) {
  return (
    isInRange(line, column) &&
    isInRange(line + height, column) &&
    isInRange(line, column + width) &&
    isInRange(line + height, column + width)
  );
}
