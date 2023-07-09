import { getRoadBuilding, showMarker } from '@/utils/building';
import {
  getBuildingKey,
  isInBuildingRange,
  isInRange as _isInRange,
  parseBuildingKey,
} from '@/utils/coordinate';
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
  BorderStyleType,
  BuildingConfig,
  CatalogType,
  CivilBuilding,
} from './building/type';
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
  isEmpty: true,
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
    this.counterUpdater?.({ ...this.counter });
  }

  public placeBarrier(type: BarrierType) {
    const keys = BuildingFixed[type][this.mapType - 3];
    const color = BarrierColor[type];
    for (const key of keys) {
      const [row, col] = parseBuildingKey(key);
      const tKey = `${row - 1}-${col}`;
      const bKey = `${row + 1}-${col}`;
      const lKey = `${row}-${col - 1}`;
      const rKey = `${row}-${col + 1}`;
      this.cells[row][col].occupied = key;
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
      const [row, col] = parseBuildingKey(key);
      this.cells[row][col].occupied = '';
      delete this.buildings[key];
      this.emptyCells++;
      this.mapUpdater?.(key, EMPTY_CELL);
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
      const [row, col] = parseBuildingKey(key);
      if (FixedBuildingSize[type] > 1) {
        for (let i = row; i < row + FixedBuildingSize[type]; i++) {
          for (let j = col; j < col + FixedBuildingSize[type]; j++) {
            this.cells[i][j].occupied = key;
            this.emptyCells--;
          }
        }
      } else {
        this.cells[row][col].occupied = key;
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

  public placeBuilding(b: BuildingConfig, row: number, col: number) {
    const key = getBuildingKey(row, col);
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
    for (let i = row; i < row + h; i++) {
      for (let j = col; j < col + w; j++) {
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
      this.updateRoadCount(row, col);
      return;
    }
    if (!isProtection) {
      return;
    }
    const records = new Set<string>();
    for (let i = row - range; i < row + h + range; i++) {
      for (let j = col - range; j < col + w + range; j++) {
        if (!isInBuildingRange(i, j, row, col, w, h, range)) continue;
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

  public replaceBuilding(b: BuildingConfig, row: number, col: number) {
    this.deleteBuilding(row, col);
    this.placeBuilding(b, row, col);
  }

  public deleteBuilding(
    _row: number,
    _col: number,
    config?: { force?: boolean },
  ) {
    const { occupied } = this.cells[_row][_col];
    if (!occupied) {
      return;
    }
    const [row, col] = parseBuildingKey(occupied);
    const key = getBuildingKey(row, col);
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
      for (let i = row - range; i < row + h + range; i++) {
        for (let j = col - range; j < col + w + range; j++) {
          if (!isInBuildingRange(i, j, row, col, w, h, range)) {
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
    for (let i = row; i < row + h; i++) {
      for (let j = col; j < col + w; j++) {
        this.cells[i][j].occupied = '';
      }
    }
    const b = { ...this.buildings[key], originRow: row, originCol: col };
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
      this.updateRoadCount(_row, _col);
    }
    return b;
  }

  public placeStraightRoad(
    initRow: number,
    initCol: number,
    curRow: number,
    curCol: number,
  ) {
    const coords = Array.from(this.roadCache);
    if (initRow !== curRow && initCol !== curCol) {
      this.roadCache.clear();
      return coords;
    }
    for (const key of coords) {
      const [row, col] = parseBuildingKey(key);
      this.deleteBuilding(row, col);
    }
    const deltaRow = curRow - initRow;
    const deltaCol = curCol - initCol;
    const w = deltaCol > 0 ? deltaCol + 1 : Math.abs(deltaCol - 1);
    const h = deltaRow > 0 ? deltaRow + 1 : Math.abs(deltaRow - 1);
    const realInitRow = deltaRow < 0 ? initRow + deltaRow : initRow;
    const realInitCol = deltaCol < 0 ? initCol + deltaCol : initCol;
    const road = getRoadBuilding();
    for (let i = realInitRow; i < realInitRow + h; i++) {
      for (let j = realInitCol; j < realInitCol + w; j++) {
        if (this.cells[i][j].occupied || !_isInRange(i, j)) {
          continue;
        }
        this.placeBuilding(road, i, j);
      }
    }
    this.roadCache.clear();
    return coords;
  }

  public updateRoadCount(row: number, col: number) {
    const neighbors: { row: number; col: number }[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (this.isRoad(row + i, col + j)) {
          neighbors.push({ row: row + i, col: col + j });
        }
      }
    }
    let queue = [];
    for (const v of neighbors) {
      const self = this.getBuilding(v.row, v.col)!;
      if (this.getRoadDir(v.row, v.col) === 'h') {
        let hasLeft = false;
        if (this.isRoad(v.row, v.col - 1)) {
          const left = this.getBuilding(v.row, v.col - 1)!;
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
          queue.push(`${v.row}-${v.col - 1}`);
          queue.push(`${v.row}-${v.col}`);
          hasLeft = true;
        }
        if (this.isRoad(v.row, v.col + 1)) {
          const right = this.getBuilding(v.row, v.col + 1)!;
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
          queue.push(`${v.row}-${v.col}`);
          queue.push(`${v.row}-${v.col + 1}`);
          marker += 2;
          let idx = v.col + 2;
          while (this.isRoad(v.row, idx)) {
            this.getBuilding(v.row, idx)!.isRoadVertex = true;
            this.getBuilding(v.row, idx)!.marker = marker;
            this.getBuilding(v.row, idx - 1)!.isRoadVertex = false;
            if (
              !this.isRoad(v.row - 1, idx - 1) &&
              !this.isRoad(v.row + 1, idx - 1)
            ) {
              queue.pop();
            }
            queue.push(`${v.row}-${idx}`);
            marker++;
            idx++;
          }
        }
      }
    }
    for (const v of neighbors) {
      const self = this.getBuilding(v.row, v.col)!;
      if (this.getRoadDir(v.row, v.col) === 'v') {
        let hasTop = false;
        if (this.judgeRoadDirection(v.row - 1, v.col, 'v')) {
          const top = this.getBuilding(v.row - 1, v.col)!;
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
          queue.push(`${v.row - 1}-${v.col}`);
          queue.push(`${v.row}-${v.col}`);
          hasTop = true;
        }
        if (this.judgeRoadDirection(v.row + 1, v.col, 'v')) {
          const bottom = this.getBuilding(v.row + 1, v.col)!;
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
          queue.push(`${v.row}-${v.col}`);
          queue.push(`${v.row + 1}-${v.col}`);
          marker += 2;
          let idx = v.row + 2;
          while (this.judgeRoadDirection(idx, v.col, 'v')) {
            this.getBuilding(idx, v.col)!.marker = marker;
            this.getBuilding(idx, v.col)!.isRoadVertex = true;
            this.getBuilding(idx - 1, v.col)!.isRoadVertex = false;
            queue.pop();
            queue.push(`${idx}-${v.col}`);
            marker++;
            idx++;
          }
        }
      }
      if (this.getRoadDir(v.row, v.col) === 'n') {
        self.isRoadVertex = false;
        self.marker = 1;
        queue.push(`${v.row}-${v.col}`);
      }
    }
    queue = Array.from(queue);
    let record: string[] = [];
    for (const v of queue) {
      const [r, c] = parseBuildingKey(v);
      record.push(...this.updateRoadDisplay(r, c));
    }
    record = Array.from(record);
    for (const v of record) {
      this.mapUpdater(v, this.buildings[v]);
    }
  }

  public updateRoadDisplay(row: number, col: number) {
    const self = this.getBuilding(row, col)!;
    const selfDir = this.getRoadDir(row, col);
    if (selfDir === 'h') {
      for (let i = -1; i < 2; i += 2) {
        if (this.isRoad(row + i, col)) {
          const adj = this.getBuilding(row + i, col)!;
          if (i === -1) {
            adj.borderBStyle = BorderStyleType.Dashed;
            self.borderTStyle = BorderStyleType.Dashed;
          } else {
            self.borderBStyle = BorderStyleType.Dashed;
            adj.borderTStyle = BorderStyleType.Dashed;
          }
          if (
            this.judgeRoadDirection(row + i, col, 'v') ||
            this.judgeRoadDirection(row + i, col, 'n')
          ) {
            self.isRoadVertex = true;
          }
        }
      }
    } else if (selfDir === 'v') {
      if (this.judgeRoadDirection(row - 1, col, 'v')) {
        self.borderTStyle = BorderStyleType.None;
      } else if (this.judgeRoadDirection(row - 1, col, 'h')) {
        self.borderTStyle = BorderStyleType.Dashed;
      } else {
        self.borderTStyle = BorderStyleType.Solid;
      }
      if (this.judgeRoadDirection(row + 1, col, 'v')) {
        self.borderBStyle = BorderStyleType.None;
      } else if (this.judgeRoadDirection(row + 1, col, 'h')) {
        self.borderBStyle = BorderStyleType.Dashed;
      } else {
        self.borderBStyle = BorderStyleType.Solid;
      }
    }
    const records: string[] = self.isRoad ? [`${row}-${col}`] : [];
    if (this.isRoad(row, col - 1)) {
      self.borderLStyle = BorderStyleType.None;
      records.push(`${row}-${col - 1}`);
    } else {
      self.borderLStyle = BorderStyleType.Solid;
    }
    if (this.isRoad(row, col + 1)) {
      self.borderRStyle = BorderStyleType.None;
      records.push(`${row}-${col + 1}`);
    } else {
      self.borderRStyle = BorderStyleType.Solid;
    }
    if (!this.isRoad(row - 1, col)) {
      self.borderTStyle = BorderStyleType.Solid;
    } else {
      records.push(`${row - 1}-${col}`);
    }
    if (!this.isRoad(row + 1, col)) {
      self.borderBStyle = BorderStyleType.Solid;
    } else {
      records.push(`${row + 1}-${col}`);
    }
    return records;
  }

  public updateBuildingsMarker(keys: string[]) {
    for (const key of keys) {
      const [row, col] = parseBuildingKey(key);
      const target = this.getBuilding(key)!;
      const { w: width = 1, h: height = 1 } = target;
      let marker = 0;
      for (let i = row; i < row + height; i++) {
        for (let j = col; j < col + width; j++) {
          marker = Math.max(marker, this.getProtectionNum(i, j));
        }
      }
      this.buildings[key].marker = marker;
      this.mapUpdater(key, this.buildings[key]);
    }
  }

  public selectBuildingInBlock(
    initRow: number,
    initCol: number,
    curRow: number,
    curCol: number,
  ) {
    this.selectCache.clear();
    const deltaRow = curRow - initRow;
    const deltaCol = curCol - initCol;
    const w = deltaCol > 0 ? deltaCol + 1 : Math.abs(deltaCol - 1);
    const h = deltaRow > 0 ? deltaRow + 1 : Math.abs(deltaRow - 1);
    const realInitRow = deltaRow < 0 ? initRow + deltaRow : initRow;
    const realInitCol = deltaCol < 0 ? initCol + deltaCol : initCol;
    for (let row = realInitRow; row < realInitRow + h; row++) {
      for (let col = realInitCol; col < realInitCol + w; col++) {
        const { occupied } = this.cells[row][col];
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
    this.counterUpdater({ ...this.counter });
  }

  public getBuilding(keyOrRow: string | number, col?: number) {
    let [r, c] = [0, 0];
    if (typeof keyOrRow === 'string') {
      [r, c] = parseBuildingKey(keyOrRow);
    } else {
      r = keyOrRow;
      c = col || 0;
    }
    const { occupied } = this.cells[r][c];
    if (!occupied) {
      return null;
    }
    return this.buildings[occupied];
  }

  public getProtectionNum(row: number, col: number) {
    return Object.entries(this.cells[row][col].protection)
      .map(([, v]) => v)
      .filter(v => v.length).length;
  }

  public isRoad(row: number, col: number) {
    return Boolean(this.getBuilding(row, col)?.isRoad);
  }

  public getRoadDir(row: number, col: number) {
    if (this.isRoad(row, col - 1)) {
      return 'h';
    }
    if (this.isRoad(row, col + 1)) {
      return 'h';
    }
    if (
      this.isRoad(row - 1, col) &&
      !this.isRoad(row - 1, col - 1) &&
      !this.isRoad(row - 1, col + 1)
    ) {
      return 'v';
    }
    if (
      this.isRoad(row + 1, col) &&
      !this.isRoad(row + 1, col - 1) &&
      !this.isRoad(row + 1, col + 1)
    ) {
      return 'v';
    }
    return 'n';
  }

  public judgeRoadDirection(row: number, col: number, direction: string) {
    if (this.isRoad(row, col) && this.getRoadDir(row, col) === direction) {
      return true;
    }
    return false;
  }
}
