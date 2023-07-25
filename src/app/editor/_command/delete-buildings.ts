import { parseBuildingKey } from '@/utils/coordinate';
import MapCore from '../_map-core';
import { BuildingConfig } from '../_map-core/building/type';
import Command from './';

interface DeleteBuildingData {
  key: string;
  building: BuildingConfig;
}

const mapCore = MapCore.getInstance();

export default class DeleteBuildingCommand implements Command {
  data: DeleteBuildingData[];

  constructor() {
    this.data = [];
  }

  push(payload: DeleteBuildingData) {
    this.data.push(payload);
  }

  execute() {
    for (const v of this.data) {
      const [row, col] = parseBuildingKey(v.key);
      mapCore.deleteBuilding(row, col);
    }
    mapCore.roadCache.clear();
  }

  undo() {
    for (const v of this.data) {
      const [row, col] = parseBuildingKey(v.key);
      mapCore.placeBuilding(v.building, row, col);
    }
    mapCore.roadCache.clear();
  }
}
