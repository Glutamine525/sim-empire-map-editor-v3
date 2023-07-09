import { parseBuildingKey } from '@/utils/coordinate';
import MapCore from '../_map-core';
import { BuildingConfig } from '../_map-core/building/type';
import Command from './';

interface MoveBuildingData {
  key: string;
  oldKey: string;
  building: BuildingConfig;
}

interface MoveBuildingCache {
  building: BuildingConfig;
  row: number;
  col: number;
}

const mapCore = MapCore.getInstance();
export default class MoveBuildingCommand implements Command {
  data: MoveBuildingData[];

  constructor() {
    this.data = [];
  }

  push(payload: MoveBuildingData) {
    this.data.push(payload);
  }

  execute() {
    const cache: MoveBuildingCache[] = [];
    for (const v of this.data) {
      const [row, col] = parseBuildingKey(v.key);
      const [_row, _col] = parseBuildingKey(v.oldKey);
      mapCore.deleteBuilding(_row, _col);
      cache.push({ building: v.building, row, col });
    }
    for (const v of cache) {
      mapCore.placeBuilding(v.building, v.row, v.col);
    }
    mapCore.roadCache.clear();
  }

  undo() {
    const cache: MoveBuildingCache[] = [];
    for (const v of this.data) {
      const [row, col] = parseBuildingKey(v.key);
      const [_row, _col] = parseBuildingKey(v.oldKey);
      mapCore.deleteBuilding(row, col);
      cache.push({ building: v.building, row: _row, col: _col });
    }
    for (const v of cache) {
      mapCore.placeBuilding(v.building, v.row, v.col);
    }
    mapCore.roadCache.clear();
  }
}
