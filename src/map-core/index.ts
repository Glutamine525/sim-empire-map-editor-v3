import { BorderStyleType, Building, CatalogType } from './building';
import { Cell, CivilType, MapCounter, MapLength } from './type';
import { getBuildingKey, isInRange as _isInRange, parseBuildingKey } from '../utils/coord';
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

  public emptyCells!: number;

  public counter!: MapCounter;

  public constructor() {
    this.init(5, CivilType.China, false);
  }

  public init(mapType: number, civil: CivilType, noTree: boolean) {
    this.mapType = mapType;
    this.civil = civil;
    this.emptyCells = 0;
    this.noTree = noTree;
    this.cells = Array.from(Array(MapLength + 1), (_, i) =>
      Array.from(Array(MapLength + 1), (_, j) => {
        const isInRange = _isInRange(i + 1, j + 1);
        if (isInRange) {
          this.emptyCells++;
        }
        return {
          isInRange,
          occupied: '',
          protection: {},
        };
      }),
    );
    this.buildings = {};
    this.placeBarriers();
    this.placeFixedBuildings();
    this.counter = {
      house: 0,
      villa: 0,
      granary: 0,
      warehouse: 0,
      agriculture: 0,
      industry: 0,
      general: 0,
      coverage: 0,
    };
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
      this.emptyCells--;
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
      this.emptyCells++;
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
      if (FixedBuildingSize[type] > 1) {
        for (let i = line; i < line + FixedBuildingSize[type]; i++) {
          for (let j = column; j < column + FixedBuildingSize[type]; j++) {
            this.cells[i][j].occupied = key;
            this.emptyCells--;
          }
        }
      } else {
        this.cells[line][column].occupied = key;
        this.emptyCells--;
      }
      this.buildings[key] = {
        name: type === FixedBuildingType.Road ? CatalogType.Road : FixedBuildingText[type],
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
    if (this.buildings[key]) {
      return;
    }
    const { width: w, height: h } = b;
    for (let i = line; i < line + h; i++) {
      for (let j = column; j < column + w; j++) {
        this.cells[i][j].occupied = key;
      }
    }
    this.buildings[key] = { ...b };
    this.updateCounter(b, 1);
  }

  public deleteBuilding(line: number, column: number, config?: { force?: boolean }) {
    const { occupied } = this.cells[line][column];
    if (!occupied) {
      return;
    }
    const [li, co] = parseBuildingKey(occupied);
    const key = getBuildingKey(li, co);
    const { width: w, height: h, isFixed } = this.buildings[key];
    if (isFixed && !config?.force) {
      return;
    }
    for (let i = li; i < li + h; i++) {
      for (let j = co; j < co + w; j++) {
        this.cells[i][j].occupied = '';
      }
    }
    const b = { ...this.buildings[key] };
    this.updateCounter(b, -1);
    delete this.buildings[key];
    return b;
  }

  public updateCounter(b: Building, diff: number) {
    const { name, catalog, width, height } = b;
    if (name === '普通住宅') {
      this.counter.house += diff;
    } else if (name === '高级住宅') {
      this.counter.villa += diff;
    } else if (name === '粮仓') {
      this.counter.granary += diff;
    } else if (name === '货栈') {
      this.counter.warehouse += diff;
    } else if (catalog === CatalogType.Agriculture) {
      this.counter.agriculture += diff;
    } else if (catalog === CatalogType.Industry) {
      this.counter.industry += diff;
    } else if (catalog === CatalogType.General) {
      this.counter.general += diff;
    }
    this.counter.coverage += diff * width * height;
  }
}
