import { getRoadBuilding, showMarker } from '@/utils/building';
import {
  getBuildingKey,
  isInBuildingRange,
  isInRange as _isInRange,
  parseBuildingKey,
} from '@/utils/coordinate';
import {
  BorderStyleType,
  BuildingConfig,
  CatalogType,
  CivilBuilding,
} from './building';
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
import {
  Cell,
  CivilType,
  MapCounter,
  MapCounterType,
  MapLength,
  MapType,
} from './type';

declare global {
  interface Window {
    __map__: MapCore;
  }
}

const EMPTY_CELL: BuildingConfig = {
  w: 1,
  h: 1,
  text: '',
  marker: 0,
  isEmpty: true,
  isRoad: false,
  bg: '',
  borderTStyle: BorderStyleType.Solid,
  borderRStyle: BorderStyleType.Solid,
  borderBStyle: BorderStyleType.Solid,
  borderLStyle: BorderStyleType.Solid,
};

export class MapCore {
  public static instance: MapCore;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MapCore();
    }
    if (typeof window !== 'undefined') {
      window.__map__ = this.instance;
    }
    return this.instance;
  }

  public mapType!: MapType;

  public civil!: CivilType;

  public noTree!: boolean;

  public protection!: string[];

  public cells!: Cell[][];

  public buildings!: { [key: string]: BuildingConfig };

  public roadCache!: Set<string>;

  public selectCache!: Set<string>;

  public emptyCells!: number;

  public counter!: MapCounter;

  public mapUpdater!: (key: string, b: BuildingConfig) => void;

  public counterUpdater!: (c: MapCounter) => void;

  public miniMapResetter!: () => void;

  public miniMapUpdater!: (key: string, b: BuildingConfig) => void;

  public constructor() {
    this.getProtectionNum = this.getProtectionNum.bind(this);
    this.init(MapType._5, CivilType.China, false);
  }

  public init(mapType: MapType, civil: CivilType, noTree: boolean) {
    this.mapType = mapType;
    this.civil = civil;
    this.emptyCells = 0;
    this.noTree = noTree;
    this.protection = CivilBuilding[civil]['防护'];
    this.cells = Array.from(Array(MapLength + 1), (_, i) =>
      Array.from(Array(MapLength + 1), (_, j) => {
        const isInRange = _isInRange(i, j);
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
    this.roadCache = new Set<string>();
    this.selectCache = new Set<string>();
    this.miniMapResetter?.();
    this.placeBarriers();
    this.placeFixedBuildings();
    this.counter = {
      [MapCounterType.House]: 0,
      [MapCounterType.Villa]: 0,
      [MapCounterType.Granary]: 0,
      [MapCounterType.Warehouse]: 0,
      [MapCounterType.Agriculture]: 0,
      [MapCounterType.Industry]: 0,
      [MapCounterType.General]: 0,
      [MapCounterType.Coverage]: 0,
    };
    this.counterUpdater?.(this.counter);
  }

  public placeBarrier(type: BarrierType) {
    const keys = BuildingFixed[type][this.mapType - 3];
    const color = BarrierColor[type];
    for (const key of keys) {
      const [line, column] = parseBuildingKey(key);
      const tKey = `${line - 1}-${column}`;
      const bKey = `${line + 1}-${column}`;
      const lKey = `${line}-${column - 1}`;
      const rKey = `${line}-${column + 1}`;
      this.cells[line][column].occupied = key;
      this.buildings[key] = {
        w: 1,
        h: 1,
        bg: color,
        isBarrier: true,
        isFixed: true,
        borderTStyle: keys.includes(tKey)
          ? BorderStyleType.None
          : BorderStyleType.Solid,
        borderRStyle: keys.includes(rKey)
          ? BorderStyleType.None
          : BorderStyleType.Solid,
        borderBStyle: keys.includes(bKey)
          ? BorderStyleType.None
          : BorderStyleType.Solid,
        borderLStyle: keys.includes(lKey)
          ? BorderStyleType.None
          : BorderStyleType.Solid,
      };
      this.emptyCells--;
      this.mapUpdater?.(key, this.buildings[key]);
      this.miniMapUpdater?.(key, {
        w: 1,
        h: 1,
        bg: BarrierColor[type],
      });
    }
  }

  public toggleNoTree(noTree: boolean) {
    this.noTree = noTree;
    if (!noTree) {
      this.placeBarrier(BarrierType.Tree);
      return;
    }
    const keys = BuildingFixed[BarrierType.Tree][this.mapType - 3];
    for (const key of keys) {
      const [line, column] = parseBuildingKey(key);
      this.cells[line][column].occupied = '';
      delete this.buildings[key];
      this.emptyCells++;
      this.miniMapUpdater?.(key, {
        ...EMPTY_CELL,
        w: 1,
        h: 1,
      });
    }
  }

  public placeBarriers() {
    Object.keys(BarrierType).forEach(v => {
      const type = v.toLowerCase() as BarrierType;
      if (type === BarrierType.Tree && this.noTree) {
        return;
      }
      this.placeBarrier(type);
    });
  }

  public placeFixedBuilding(type: FixedBuildingType) {
    const keys = BuildingFixed[type][this.mapType - 3];
    for (const key of keys) {
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
        name:
          type === FixedBuildingType.Road
            ? CatalogType.Road
            : FixedBuildingText[type],
        text: FixedBuildingText[type],
        w: FixedBuildingSize[type],
        h: FixedBuildingSize[type],
        bg: FixedBuildingColor[type],
        color: '#000000',
        isFixed: true,
        isRoad: type === FixedBuildingType.Road,
        catalog: FixedBuildingCatalog[type],
        isEmpty: false,
      };
      this.mapUpdater?.(key, this.buildings[key]);
      this.miniMapUpdater?.(key, {
        w: FixedBuildingSize[type],
        h: FixedBuildingSize[type],
        bg: FixedBuildingColor[type],
      });
    }
  }

  public placeFixedBuildings() {
    Object.keys(FixedBuildingType).forEach(v => {
      const type = v.toLowerCase() as FixedBuildingType;
      this.placeFixedBuilding(type);
    });
  }

  public hasPlacedBuilding() {
    for (const key in this.buildings) {
      if (!this.buildings[key].isFixed) {
        return true;
      }
    }
    return false;
  }

  public placeBuilding(b: BuildingConfig, line: number, column: number) {
    const key = getBuildingKey(line, column);
    if (this.buildings[key]) {
      return;
    }
    const {
      w: w = 1,
      h: h = 1,
      name = '',
      range = 0,
      isProtection,
      isRoad,
    } = b;
    let marker = 0;
    for (let i = line; i < line + h; i++) {
      for (let j = column; j < column + w; j++) {
        this.cells[i][j].occupied = key;
        marker = Math.max(marker, this.getProtectionNum(i, j));
      }
    }
    this.buildings[key] = { ...b, marker: isRoad ? 1 : marker, isEmpty: false };
    this.mapUpdater(key, this.buildings[key]);
    this.miniMapUpdater?.(key, this.buildings[key]);
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
      }
    }
    this.updateBuildingsMarker(Array.from(records));
  }

  public replaceBuilding(b: BuildingConfig, line: number, column: number) {
    this.deleteBuilding(line, column);
    this.placeBuilding(b, line, column);
  }

  public deleteBuilding(
    line: number,
    column: number,
    config?: { force?: boolean },
  ) {
    const { occupied } = this.cells[line][column];
    if (!occupied) {
      return;
    }
    const [li, co] = parseBuildingKey(occupied);
    const key = getBuildingKey(li, co);
    const {
      w: w = 1,
      h: h = 1,
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
      const records = new Set<string>();
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
          records.add(o);
        }
      }
      this.updateBuildingsMarker(Array.from(records));
    }
    for (let i = li; i < li + h; i++) {
      for (let j = co; j < co + w; j++) {
        this.cells[i][j].occupied = '';
      }
    }
    const b = { ...this.buildings[key], originLine: li, originColumn: co };
    this.updateCounter(b, -1);
    delete this.buildings[key];
    this.mapUpdater(key, EMPTY_CELL);
    this.miniMapUpdater?.(key, {
      ...EMPTY_CELL,
      w: b.w,
      h: b.h,
    });
    if (isRoad) {
      this.roadCache.delete(key);
      this.updateRoadCount(line, column);
    }
    return b;
  }

  public placeStraightRoad(
    initLi: number,
    initCo: number,
    curLi: number,
    curCo: number,
  ) {
    const coords = Array.from(this.roadCache);
    if (initLi !== curLi && initCo !== curCo) {
      this.roadCache.clear();
      return coords;
    }
    for (const key of coords) {
      const [li, co] = parseBuildingKey(key);
      this.deleteBuilding(li, co);
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
        if (this.cells[i][j].occupied || !_isInRange(i, j)) {
          continue;
        }
        this.placeBuilding(road, i, j);
      }
    }
    this.roadCache.clear();
    return coords;
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
    for (const v of neighbors) {
      const self = this.getBuilding(v.li, v.co)!;
      if (this.getRoadDir(v.li, v.co) === 'h') {
        let hasLeft = false;
        if (this.isRoad(v.li, v.co - 1)) {
          const left = this.getBuilding(v.li, v.co - 1)!;
          const { marker = 1 } = left;
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
            if (
              !this.isRoad(v.li - 1, idx - 1) &&
              !this.isRoad(v.li + 1, idx - 1)
            ) {
              queue.pop();
            }
            queue.push(`${v.li}-${idx}`);
            marker++;
            idx++;
          }
        }
      }
    }
    for (const v of neighbors) {
      const self = this.getBuilding(v.li, v.co)!;
      if (this.getRoadDir(v.li, v.co) === 'v') {
        let hasTop = false;
        if (this.judgeRoadDirection(v.li - 1, v.co, 'v')) {
          const top = this.getBuilding(v.li - 1, v.co)!;
          const { marker = 1 } = top;
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
    queue = Array.from(queue);
    let record: string[] = [];
    for (const v of queue) {
      const [li, co] = parseBuildingKey(v);
      record.push(...this.updateRoadDisplay(li, co));
    }
    record = Array.from(record);
    for (const v of record) {
      this.mapUpdater(v, this.buildings[v]);
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

  public updateBuildingsMarker(keys: string[]) {
    for (const key of keys) {
      const [li, co] = parseBuildingKey(key);
      const target = this.getBuilding(key)!;
      const { w: width = 1, h: height = 1 } = target;
      let marker = 0;
      for (let i = li; i < li + height; i++) {
        for (let j = co; j < co + width; j++) {
          marker = Math.max(marker, this.getProtectionNum(i, j));
        }
      }
      this.buildings[key].marker = marker;
      this.mapUpdater(key, this.buildings[key]);
    }
  }

  public selectBuildingInBlock(
    initLi: number,
    initCo: number,
    curLi: number,
    curCo: number,
  ) {
    this.selectCache.clear();
    const deltaLi = curLi - initLi;
    const deltaCo = curCo - initCo;
    const w = deltaCo > 0 ? deltaCo + 1 : Math.abs(deltaCo - 1);
    const h = deltaLi > 0 ? deltaLi + 1 : Math.abs(deltaLi - 1);
    const realInitLi = deltaLi < 0 ? initLi + deltaLi : initLi;
    const realInitCo = deltaCo < 0 ? initCo + deltaCo : initCo;
    for (let li = realInitLi; li < realInitLi + h; li++) {
      for (let co = realInitCo; co < realInitCo + w; co++) {
        const { occupied } = this.cells[li][co];
        if (!occupied) continue;
        if (this.buildings[occupied].isFixed) continue;
        this.selectCache.add(occupied);
      }
    }
    console.log(this.selectCache);
  }

  public updateCounter(b: BuildingConfig, diff: number) {
    const { name, catalog, w: width = 1, h: height = 1 } = b;
    if (name === '普通住宅') {
      this.counter[MapCounterType.House] += diff;
    } else if (name === '高级住宅') {
      this.counter[MapCounterType.Villa] += diff;
    } else if (name === '粮仓') {
      this.counter[MapCounterType.Granary] += diff;
    } else if (name === '货栈') {
      this.counter[MapCounterType.Warehouse] += diff;
    } else if (catalog === CatalogType.Agriculture) {
      this.counter[MapCounterType.Agriculture] += diff;
    } else if (catalog === CatalogType.Industry) {
      this.counter[MapCounterType.Industry] += diff;
    } else if (catalog === CatalogType.General) {
      this.counter[MapCounterType.General] += diff;
    }
    this.counter[MapCounterType.Coverage] += diff * width * height;
    this.counterUpdater(this.counter);
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
      .map(([, v]) => v)
      .filter(v => v.length).length;
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
    if (
      this.isRoad(line, column) &&
      this.getRoadDir(line, column) === direction
    ) {
      return true;
    }
    return false;
  }
}
