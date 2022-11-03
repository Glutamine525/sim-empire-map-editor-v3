import { BorderStyleType, Building, CatalogType, CivilBuilding } from './building';
import { Cell, CivilType, MapCounter, MapLength } from './type';
import {
  getBuildingKey,
  isInBuildingRange,
  isInRange as _isInRange,
  parseBuildingKey,
} from '../utils/coordinate';
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
import { getRoadBuilding, showMarker } from '@/utils/building';

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

  public protection!: string[];

  public cells!: Cell[][];

  public buildings!: { [key: string]: Building };

  public buildingCache!: Set<string>;

  public roadCache!: Set<string>;

  public emptyCells!: number;

  public counter!: MapCounter;

  public constructor() {
    this.getProtectionNum = this.getProtectionNum.bind(this);
    this.init(5, CivilType.China, false);
  }

  public init(mapType: number, civil: CivilType, noTree: boolean) {
    this.mapType = mapType;
    this.civil = civil;
    this.emptyCells = 0;
    this.noTree = noTree;
    this.protection = CivilBuilding[civil]['防护'];
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
    this.buildingCache = new Set<string>();
    this.roadCache = new Set<string>();
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
      this.buildingCache.add(key);
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
    const { width: w, height: h, name = '', isProtection, range = 0, isRoad } = b;
    let marker = 0;
    for (let i = line; i < line + h; i++) {
      for (let j = column; j < column + w; j++) {
        this.cells[i][j].occupied = key;
        marker = Math.max(marker, this.getProtectionNum(i, j));
      }
    }
    this.buildings[key] = { ...b, marker: isRoad ? 1 : marker };
    this.buildingCache.add(key);
    this.updateCounter(b, 1);
    if (isRoad) {
      this.roadCache.add(key);
      this.updateRoadCount(line, column);
      return;
    }
    if (!isProtection) {
      return;
    }
    const records = new Set<string>();
    for (let i = line - range; i < line + h + range; i++) {
      for (let j = column - range; j < column + w + range; j++) {
        if (!isInBuildingRange(i, j, line, column, w, h, range)) continue;
        if (i < 1 || j < 1) continue;
        if (i > MapLength || j > MapLength) continue;
        const cell = this.cells[i][j];
        if (cell.protection[name]) {
          cell.protection[name].push(key);
        } else {
          cell.protection[name] = [key];
        }
        const target = this.getBuilding(i, j);
        if (!target) continue;
        if (!showMarker(target) || target.isRoad) continue;
        records.add(this.cells[i][j].occupied);
        this.buildingCache.add(this.cells[i][j].occupied);
      }
    }
    this.updateBuildingsMarker([...records]);
  }

  public replaceBuilding(b: Building, line: number, column: number) {
    this.deleteBuilding(line, column);
    this.placeBuilding(b, line, column);
  }

  public deleteBuilding(
    line: number,
    column: number,
    config?: { force?: boolean; processingRoadCache?: boolean },
  ) {
    const { occupied } = this.cells[line][column];
    if (!occupied) {
      return;
    }
    const [li, co] = parseBuildingKey(occupied);
    const key = getBuildingKey(li, co);
    const {
      width: w,
      height: h,
      name = 0,
      range = 0,
      isFixed,
      isProtection,
      isRoad,
    } = this.buildings[key];
    if (isFixed && !config?.force) {
      return;
    }
    if (isProtection) {
      const record = new Set<string>();
      for (let i = li - range; i < li + h + range; i++) {
        for (let j = co - range; j < co + w + range; j++) {
          if (!isInBuildingRange(i, j, li, co, w, h, range)) {
            continue;
          }
          if (i < 1 || j < 1) continue;
          if (i > MapLength || j > MapLength) continue;
          const { protection: p, occupied: o } = this.cells[i][j];
          p[name].splice(p[name].indexOf(occupied), 1);
          if (!o) continue;
          const b = this.getBuilding(o)!;
          if (!showMarker(b) || b.isRoad) continue;
          record.add(o);
          this.buildingCache.add(o);
        }
      }
      this.updateBuildingsMarker([...record]);
    }
    for (let i = li; i < li + h; i++) {
      for (let j = co; j < co + w; j++) {
        this.cells[i][j].occupied = '';
      }
    }
    const b = { ...this.buildings[key] };
    this.updateCounter(b, -1);
    delete this.buildings[key];
    if (isRoad) {
      this.roadCache.delete(key);
      config?.processingRoadCache && this.buildingCache.delete(key);
      this.updateRoadCount(line, column);
    }
    return b;
  }

  public placeStraightRoad(initLi: number, initCo: number, curLi: number, curCo: number) {
    if (initLi !== curLi && initCo !== curCo) {
      this.roadCache.clear();
      return;
    }
    for (let key of this.roadCache) {
      const [li, co] = parseBuildingKey(key);
      this.deleteBuilding(li, co, { processingRoadCache: true });
    }
    const deltaLi = curLi - initLi;
    const deltaCo = curCo - initCo;
    const w = deltaCo > 0 ? deltaCo + 1 : Math.abs(deltaCo - 1);
    const h = deltaLi > 0 ? deltaLi + 1 : Math.abs(deltaLi - 1);
    const realInitLi = deltaLi < 0 ? initLi + deltaLi : initLi;
    const realInitCo = deltaCo < 0 ? initCo + deltaCo : initCo;
    const road = getRoadBuilding();
    for (let i = realInitLi; i < realInitLi + h; i++) {
      for (let j = realInitCo; j < realInitCo + w; j++) {
        if (this.cells[i][j].occupied) {
          continue;
        }
        this.placeBuilding(road, i, j);
      }
    }
    this.roadCache.clear();
  }

  public updateRoadCount(line: number, column: number) {
    const neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (this.isRoad(line + i, column + j)) {
          neighbors.push({ li: line + i, co: column + j });
        }
      }
    }
    let queue = [];
    for (let v of neighbors) {
      const self = this.getBuilding(v.li, v.co)!;
      if (this.getRoadDir(v.li, v.co) === 'h') {
        let hasLeft = false;
        if (this.isRoad(v.li, v.co - 1)) {
          const left = this.getBuilding(v.li, v.co - 1)!;
          let { marker = 1 } = left;
          if (marker === 1) {
            left.marker = 1;
            self.marker = 2;
            left.isRoadVertex = true;
          } else {
            self.marker = marker + 1;
            if (marker > 1) left.isRoadVertex = false;
          }
          self.isRoadVertex = true;
          queue.push(`${v.li}-${v.co - 1}`);
          queue.push(`${v.li}-${v.co}`);
          hasLeft = true;
        }
        if (this.isRoad(v.li, v.co + 1)) {
          const right = this.getBuilding(v.li, v.co + 1)!;
          let { marker = 1 } = self;
          if (marker === 1 || !hasLeft) {
            marker = 1;
            self.marker = 1;
            right.marker = 2;
            self.isRoadVertex = true;
          } else {
            right.marker = marker + 1;
            if (marker > 1) self.isRoadVertex = false;
          }
          right.isRoadVertex = true;
          queue.push(`${v.li}-${v.co}`);
          queue.push(`${v.li}-${v.co + 1}`);
          marker += 2;
          let idx = v.co + 2;
          while (this.isRoad(v.li, idx)) {
            this.getBuilding(v.li, idx)!.isRoadVertex = true;
            this.getBuilding(v.li, idx)!.marker = marker;
            this.getBuilding(v.li, idx - 1)!.isRoadVertex = false;
            if (!this.isRoad(v.li - 1, idx - 1) && !this.isRoad(v.li + 1, idx - 1)) {
              queue.pop();
            }
            queue.push(`${v.li}-${idx}`);
            marker++;
            idx++;
          }
        }
      }
    }
    for (let v of neighbors) {
      const self = this.getBuilding(v.li, v.co)!;
      if (this.getRoadDir(v.li, v.co) === 'v') {
        let hasTop = false;
        if (this.judgeRoadDirection(v.li - 1, v.co, 'v')) {
          const top = this.getBuilding(v.li - 1, v.co)!;
          let { marker = 1 } = top;
          if (marker === 1) {
            top.marker = 1;
            self.marker = 2;
            top.isRoadVertex = true;
          } else {
            self.marker = marker + 1;
            if (marker > 1) top.isRoadVertex = false;
          }
          self.isRoadVertex = true;
          queue.push(`${v.li - 1}-${v.co}`);
          queue.push(`${v.li}-${v.co}`);
          hasTop = true;
        }
        if (this.judgeRoadDirection(v.li + 1, v.co, 'v')) {
          const bottom = this.getBuilding(v.li + 1, v.co)!;
          let { marker = 1 } = self;
          if (marker === 1 || !hasTop) {
            marker = 1;
            self.marker = 1;
            bottom.marker = 2;
            self.isRoadVertex = true;
          } else {
            bottom.marker = marker + 1;
            if (marker > 1) self.isRoadVertex = false;
          }
          bottom.isRoadVertex = true;
          queue.push(`${v.li}-${v.co}`);
          queue.push(`${v.li + 1}-${v.co}`);
          marker += 2;
          let idx = v.li + 2;
          while (this.judgeRoadDirection(idx, v.co, 'v')) {
            this.getBuilding(idx, v.co)!.marker = marker;
            this.getBuilding(idx, v.co)!.isRoadVertex = true;
            this.getBuilding(idx - 1, v.co)!.isRoadVertex = false;
            queue.pop();
            queue.push(`${idx}-${v.co}`);
            marker++;
            idx++;
          }
        }
      }
      if (this.getRoadDir(v.li, v.co) === 'n') {
        self.isRoadVertex = false;
        self.marker = 1;
        queue.push(`${v.li}-${v.co}`);
      }
    }
    queue = [...new Set(queue)];
    let record: string[] = [];
    for (let v of queue) {
      const [li, co] = parseBuildingKey(v);
      record.push(...this.updateRoadDisplay(li, co));
    }
    record = [...new Set(record)];
    for (let v of record) {
      this.buildingCache.add(v);
    }
  }

  public updateRoadDisplay(line: number, column: number) {
    const self = this.getBuilding(line, column)!;
    const selfDir = this.getRoadDir(line, column);
    if (selfDir === 'h') {
      for (let i = -1; i < 2; i += 2) {
        if (this.isRoad(line + i, column)) {
          const adj = this.getBuilding(line + i, column)!;
          if (i === -1) {
            adj.borderBStyle = BorderStyleType.Dashed;
            self.borderTStyle = BorderStyleType.Dashed;
          } else {
            self.borderBStyle = BorderStyleType.Dashed;
            adj.borderTStyle = BorderStyleType.Dashed;
          }
          if (
            this.judgeRoadDirection(line + i, column, 'v') ||
            this.judgeRoadDirection(line + i, column, 'n')
          ) {
            self.isRoadVertex = true;
          }
        }
      }
    } else if (selfDir === 'v') {
      if (this.judgeRoadDirection(line - 1, column, 'v')) {
        self.borderTStyle = BorderStyleType.None;
      } else if (this.judgeRoadDirection(line - 1, column, 'h')) {
        self.borderTStyle = BorderStyleType.Dashed;
      } else {
        self.borderTStyle = BorderStyleType.Solid;
      }
      if (this.judgeRoadDirection(line + 1, column, 'v')) {
        self.borderBStyle = BorderStyleType.None;
      } else if (this.judgeRoadDirection(line + 1, column, 'h')) {
        self.borderBStyle = BorderStyleType.Dashed;
      } else {
        self.borderBStyle = BorderStyleType.Solid;
      }
    }
    const records: string[] = self.isRoad ? [`${line}-${column}`] : [];
    if (this.isRoad(line, column - 1)) {
      self.borderLStyle = BorderStyleType.None;
      records.push(`${line}-${column - 1}`);
    } else {
      self.borderLStyle = BorderStyleType.Solid;
    }
    if (this.isRoad(line, column + 1)) {
      self.borderRStyle = BorderStyleType.None;
      records.push(`${line}-${column + 1}`);
    } else {
      self.borderRStyle = BorderStyleType.Solid;
    }
    if (!this.isRoad(line - 1, column)) {
      self.borderTStyle = BorderStyleType.Solid;
    } else {
      records.push(`${line - 1}-${column}`);
    }
    if (!this.isRoad(line + 1, column)) {
      self.borderBStyle = BorderStyleType.Solid;
    } else {
      records.push(`${line + 1}-${column}`);
    }
    return records;
  }

  public updateBuildingsMarker(buildings: string[]) {
    for (let key of buildings) {
      const [li, co] = parseBuildingKey(key);
      const target = this.getBuilding(key)!;
      let marker = 0;
      for (let i = li; i < li + target.height; i++) {
        for (let j = co; j < co + target.width; j++) {
          marker = Math.max(marker, this.getProtectionNum(i, j));
        }
      }
      this.buildings[key].marker = marker;
    }
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

  public clearBuildingCache() {
    this.buildingCache.clear();
  }

  public getBuilding(keyOrLine: string | number, column?: number) {
    let [li, co] = [0, 0];
    if (typeof keyOrLine === 'string') {
      [li, co] = parseBuildingKey(keyOrLine);
    } else {
      li = keyOrLine;
      co = column || 0;
    }
    const { occupied } = this.cells[li][co];
    if (!occupied) {
      return null;
    }
    return this.buildings[occupied];
  }

  public getProtectionNum(line: number, column: number) {
    return Object.entries(this.cells[line][column].protection)
      .map(([_, v]) => v)
      .filter((v) => v.length).length;
  }

  public isRoad(line: number, column: number) {
    return Boolean(this.getBuilding(line, column)?.isRoad);
  }

  public getRoadDir(line: number, column: number) {
    if (this.isRoad(line, column - 1)) {
      return 'h';
    }
    if (this.isRoad(line, column + 1)) {
      return 'h';
    }
    if (
      this.isRoad(line - 1, column) &&
      !this.isRoad(line - 1, column - 1) &&
      !this.isRoad(line - 1, column + 1)
    ) {
      return 'v';
    }
    if (
      this.isRoad(line + 1, column) &&
      !this.isRoad(line + 1, column - 1) &&
      !this.isRoad(line + 1, column + 1)
    ) {
      return 'v';
    }
    return 'n';
  }

  public judgeRoadDirection(line: number, column: number, direction: string) {
    if (this.isRoad(line, column) && this.getRoadDir(line, column) === direction) {
      return true;
    }
    return false;
  }
}
