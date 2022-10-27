import { BorderStyleType, Building } from './building';
import { Cell, CivilType, MapLength } from './type';
import { getBuildingKey, isInRange, parseBuildingKey } from '../utils/coord';
import {
  BarrierColor,
  BarrierType,
  BuildingFixed,
  FixedBuildingCatalog,
  FixedBuildingColor,
  FixedBuildingSize,
  FixedBuildingText,
  FixedBuildingType,
} from './building/fixed';

export class MapCore {
  public static instance: MapCore;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MapCore();
    }
    (window as any).__map__ = this.instance;
    return this.instance;
  }

  public mapType!: number;

  public civil!: CivilType;

  public noTree!: boolean;

  public cells!: Cell[][];

  public buildings!: { [key: string]: Building };

  public constructor() {
    this.init(5, CivilType.China, false);
  }

  public init(mapType: number, civil: CivilType, noTree: boolean) {
    this.mapType = mapType;
    this.civil = civil;
    this.noTree = noTree;
    this.cells = Array.from(Array(MapLength + 1), (_, i) =>
      Array.from(Array(MapLength + 1), (_, j) => {
        return {
          isInRange: isInRange(i + 1, j + 1),
          occupied: '',
          protection: {},
        };
      }),
    );
    this.buildings = {};
    this.placeBarriers();
    this.placeFixedBuildings();
  }

  public placeBarrier(type: BarrierType) {
    const keys = BuildingFixed[type][this.mapType - 3];
    const color = BarrierColor[type];
    for (let key of keys) {
      const [line, column] = parseBuildingKey(key);
      const tKey = `${line - 1}-${column}`;
      const bKey = `${line + 1}-${column}`;
      const lKey = `${line}-${column - 1}`;
      const rKey = `${line}-${column + 1}`;
      this.cells[line][column].occupied = key;
      this.buildings[key] = {
        width: 1,
        height: 1,
        backgroundColor: color,
        isBarrier: true,
        isFixed: true,
        borderTStyle: keys.includes(tKey) ? BorderStyleType.None : BorderStyleType.Solid,
        borderRStyle: keys.includes(rKey) ? BorderStyleType.None : BorderStyleType.Solid,
        borderBStyle: keys.includes(bKey) ? BorderStyleType.None : BorderStyleType.Solid,
        borderLStyle: keys.includes(lKey) ? BorderStyleType.None : BorderStyleType.Solid,
      };
    }
  }

  public toggleNoTree(noTree: boolean) {
    this.noTree = noTree;
    if (!noTree) {
      this.placeBarrier(BarrierType.Tree);
      return;
    }
    const keys = BuildingFixed[BarrierType.Tree][this.mapType - 3];
    for (let key of keys) {
      const [line, column] = parseBuildingKey(key);
      this.cells[line][column].occupied = '';
      delete this.buildings[key];
    }
  }

  public placeBarriers() {
    Object.keys(BarrierType).forEach((v) => {
      const type = v.toLowerCase() as BarrierType;
      if (type === BarrierType.Tree && this.noTree) {
        return;
      }
      this.placeBarrier(type);
    });
  }

  public placeFixedBuilding(type: FixedBuildingType) {
    const keys = BuildingFixed[type][this.mapType - 3];
    for (let key of keys) {
      const [line, column] = parseBuildingKey(key);
      this.cells[line][column].occupied = key;
      if (FixedBuildingSize[type] > 1) {
        for (let i = line; i < line + FixedBuildingSize[type]; i++) {
          for (let j = column; j < column + FixedBuildingSize[type]; j++) {
            this.cells[i][j].occupied = key;
          }
        }
      }
      this.buildings[key] = {
        name: type === FixedBuildingType.Road ? '道路' : FixedBuildingText[type],
        text: FixedBuildingText[type],
        width: FixedBuildingSize[type],
        height: FixedBuildingSize[type],
        backgroundColor: FixedBuildingColor[type],
        textColor: '#000000',
        isFixed: true,
        isRoad: type === FixedBuildingType.Road,
        catalog: FixedBuildingCatalog[type],
      };
    }
  }

  public placeFixedBuildings() {
    Object.keys(FixedBuildingType).forEach((v) => {
      const type = v.toLowerCase() as FixedBuildingType;
      this.placeFixedBuilding(type);
    });
  }

  public placeBuilding(b: Building, line: number, column: number) {
    const key = getBuildingKey(line, column);
    const { width: w, height: h } = b;
    this.cells[line][column].occupied = key;
    if (w > 1 || h > 1) {
      for (let i = line; i < line + h; i++) {
        for (let j = column; j < column + w; j++) {
          this.cells[i][j].occupied = key;
        }
      }
    }
    this.buildings[key] = { ...b };
  }
}
