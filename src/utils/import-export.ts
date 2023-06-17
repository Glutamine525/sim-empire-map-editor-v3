import md5 from 'md5';
import { MapCore } from '@/map-core';
import {
  BuildingConfig,
  BuildingType,
  CatalogType,
  CivilBuilding,
} from '@/map-core/building';
import {
  CivilType,
  mapCivilLabelToType,
  MapLength,
  MapType,
} from '@/map-core/type';
import {
  getGeneralBuilding,
  getRoadBuilding,
  getSelectedBuilding,
} from './building';
import { parseBuildingKey } from './coordinate';
import {
  base64ToString,
  download,
  getMapDataName,
  stringToBase64,
} from './file';

type ChangeMapConfig = (
  mapType: MapType,
  civil: CivilType,
  noTree: boolean,
) => void;

export interface MapData {
  md5: string;
  createAt: number;
  mapType: MapType;
  civil: CivilType;
  noTree: boolean;
  buildings: {
    [key: string]: string[];
  };
  roads: string[];
  specialBuildings: {
    [key: string]: BuildingConfig;
  };
}

export function importOldMapData(data: any, changeMapConfig: ChangeMapConfig) {
  const {
    md5: dataMd5,
    woodNum,
    civil: civilLabel,
    isNoWood: noTree,
    roads,
    buildings,
  } = data;
  delete data.md5;
  if (dataMd5 != md5(JSON.stringify(data))) {
    return false;
  }
  if (
    typeof woodNum === 'undefined' ||
    typeof civilLabel === 'undefined' ||
    typeof noTree === 'undefined' ||
    typeof roads === 'undefined' ||
    typeof buildings === 'undefined'
  ) {
    return false;
  }
  const mapType = Number(woodNum);
  const core = MapCore.getInstance();
  const civil = mapCivilLabelToType[civilLabel];
  if (!civil) {
    return false;
  }
  changeMapConfig(mapType, civil, noTree);
  core.init(mapType, civil, noTree);
  const roadBuilding = getRoadBuilding();
  roads.forEach((v: { line: number; column: number }) => {
    const { line, column } = v;
    core.placeBuilding(roadBuilding, line, column);
  });
  buildings.forEach(
    (
      v: BuildingConfig & {
        line: number;
        column: number;
        isMiracle: boolean;
        catagory: string;
        background: string;
        color: string;
      },
    ) => {
      const { line, column, background, color, isMiracle, catagory, ...rest } =
        v;
      core.placeBuilding(
        {
          ...rest,
          bg: background,
          color: color,
          catalog: catagory as CatalogType,
          isWonder:
            isMiracle ||
            (catagory === '市政' && ['皇宫', '宫殿'].includes(v.name || '')),
        },
        line,
        column,
      );
    },
  );
  core.roadCache.clear();
  return true;
}

export function getMapData(): MapData {
  const core = MapCore.getInstance();
  const { mapType, civil, noTree } = core;
  const specialBuildings: { [key: string]: BuildingConfig } = {};
  const buildings: { [key: string]: string[] } = {};
  const roads: string[] = [];
  for (let i = 0; i < MapLength; i++) {
    for (let j = 0; j < MapLength; j++) {
      const coord = `${i}-${j}`;
      const { occupied } = core.cells[i][j];
      if (!occupied || (occupied && occupied !== coord)) {
        continue;
      }
      const b = core.getBuilding(i, j);
      if (!b || b.isBarrier || b.isFixed) {
        continue;
      }
      if (b.isRoad) {
        roads.push(coord);
        continue;
      }
      const key = `${b.catalog}-${b.name}`;
      if (b.catalog !== CatalogType.Special) {
        if (key in buildings) {
          buildings[key].push(coord);
        } else {
          buildings[key] = [coord];
        }
        continue;
      }
      if (b.name! in specialBuildings) {
        buildings[key].push(coord);
        continue;
      }
      specialBuildings[b.name!] = b;
      buildings[key] = [coord];
    }
  }
  const data = { mapType, civil, noTree, buildings, roads, specialBuildings };
  const dataMd5 = md5(JSON.stringify(data));
  return { ...data, md5: dataMd5, createAt: Date.now() };
}

export function encodeMapData(data?: MapData) {
  return stringToBase64(JSON.stringify(data || getMapData()));
}

export function exportMapData() {
  const blob = new Blob([encodeMapData()]);
  download(blob, getMapDataName());
}

export function decodeMapData(dataStr: string) {
  return JSON.parse(base64ToString(dataStr));
}

export function importMapData(
  dataStr: string,
  changeMapConfig: ChangeMapConfig,
) {
  const data = decodeMapData(dataStr);
  if (!data) {
    return false;
  }
  if ('woodNum' in data) {
    return importOldMapData(data, changeMapConfig);
  }
  const {
    md5: dataMd5,
    mapType,
    civil,
    noTree,
    roads,
    buildings,
    specialBuildings,
  } = data;
  delete data.md5;
  delete data.createAt;
  if (dataMd5 != md5(JSON.stringify(data))) {
    return false;
  }
  const core = MapCore.getInstance();
  changeMapConfig(mapType, civil, noTree);
  core.init(mapType, civil, noTree);
  const roadBuilding = getRoadBuilding();
  roads.forEach((coord: string) => {
    const [line, column] = parseBuildingKey(coord);
    core.placeBuilding(roadBuilding, line, column);
  });
  for (const key in buildings) {
    const [catalog, name] = key.split('-');
    const b =
      catalog === CatalogType.Special
        ? specialBuildings[name]
        : catalog === CatalogType.General
        ? getGeneralBuilding(parseInt(name.split('x')[0]))
        : getSelectedBuilding(
            civil,
            catalog as BuildingType,
            CivilBuilding[civil as CivilType][catalog as BuildingType].find(
              v => v.name === name,
            )!,
          );
    for (const coord of buildings[key]) {
      const [line, column] = parseBuildingKey(coord);
      core.placeBuilding(b, line, column);
    }
  }
  core.roadCache.clear();
  return true;
}
