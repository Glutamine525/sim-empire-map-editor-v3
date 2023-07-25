import { parseBuildingKey } from '@/utils/coordinate';
import MapCore from '../_map-core';
import { BuildingConfig } from '../_map-core/building/type';
import { useMapConfig } from '../_store/map-config';
import Command from './';

interface ChangeNoTreeData {
  building: BuildingConfig;
  key: string;
}

const mapCore = MapCore.getInstance();

export default class ChangeNoTreeCommand implements Command {
  noTree: boolean;
  data: ChangeNoTreeData[];

  constructor(noTree: boolean) {
    this.noTree = noTree;
    this.data = [];
  }

  push(payload: ChangeNoTreeData) {
    this.data.push(payload);
  }

  execute() {
    useMapConfig.setState({ noTree: this.noTree });
    if (!this.noTree) {
      for (const v of this.data) {
        const [row, col] = parseBuildingKey(v.key);
        mapCore.deleteBuilding(row, col);
      }
      mapCore.roadCache.clear();
    }
    mapCore.toggleNoTree(this.noTree);
  }

  undo() {
    useMapConfig.setState({ noTree: !this.noTree });
    mapCore.toggleNoTree(!this.noTree);
    if (!this.noTree) {
      for (const v of this.data) {
        const [row, col] = parseBuildingKey(v.key);
        mapCore.placeBuilding(v.building, row, col);
      }
      mapCore.roadCache.clear();
    }
  }
}
