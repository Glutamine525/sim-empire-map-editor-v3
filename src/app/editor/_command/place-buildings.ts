import { getGeneralBuilding } from '@/utils/building';
import { parseBuildingKey } from '@/utils/coordinate';
import MapCore from '../_map-core';
import { BuildingConfig } from '../_map-core/building/type';
import Command, { CommandAltType } from './';

const mapCore = MapCore.getInstance();

interface PlaceBuildingData {
  type: CommandAltType.Place | CommandAltType.Replace;
  key: string;
  building: BuildingConfig;
}

export default class PlaceBuildingCommand implements Command {
  data: PlaceBuildingData[];

  constructor() {
    this.data = [];
  }

  reset() {
    this.data = [];
  }

  len() {
    return this.data.length;
  }

  push(payload: PlaceBuildingData) {
    this.data.push(payload);
  }

  execute() {
    for (const v of this.data) {
      const [row, col] = parseBuildingKey(v.key);
      switch (v.type) {
        case CommandAltType.Place:
          mapCore.placeBuilding(v.building, row, col);
          break;
        case CommandAltType.Replace:
          mapCore.replaceBuilding(v.building, row, col);
          break;
        default:
          throw new Error(
            `unsupported alt type '${v.type}' in PlaceBuildingCommand`,
          );
      }
    }
    mapCore.roadCache.clear();
  }

  undo() {
    for (const v of this.data) {
      if (!v.key || !v.building) {
        return;
      }
      const [row, col] = parseBuildingKey(v.key);
      switch (v.type) {
        case CommandAltType.Place:
          mapCore.deleteBuilding(row, col);
          break;
        case CommandAltType.Replace:
          mapCore.deleteBuilding(row, col);
          mapCore.placeBuilding(getGeneralBuilding(v.building.w!), row, col);
          break;
        default:
          throw new Error(
            `unsupported alt type '${v.type}' in PlaceBuildingCommand`,
          );
      }
    }
    mapCore.roadCache.clear();
  }
}
