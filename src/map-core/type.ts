export const UnitPx = 30;

export const MapLength = 116;

export const MapType = [5, 4, 3];

export const MiniMapRatio = 4;

export const MiniMapDisplayRatio = 2;

export enum CivilType {
  China = 'china',
  Persian = 'persian',
  Egypt = 'egypt',
  Greece = 'greece',
  Aztec = 'aztec',
  Custom = 'custom',
}

export const CivilTypeLabel = {
  [CivilType.China]: '中国',
  [CivilType.Persian]: '波斯',
  [CivilType.Egypt]: '埃及',
  [CivilType.Greece]: '希腊',
  [CivilType.Aztec]: '阿兹特克',
  [CivilType.Custom]: '自定义',
};

export enum OperationType {
  Empty = '空',
  PlaceBuilding = '放置建筑',
  SelectBuilding = '选择建筑',
  DeleteBuilding = '删除建筑',
  WatermarkMode = '水印模式',
}

export interface Cell {
  isInRange: boolean;
  occupied: string;
  protection: { [key: string]: string[] };
}

export interface MapCounter {
  house: number;
  villa: number;
  granary: number;
  warehouse: number;
  agriculture: number;
  industry: number;
  general: number;
  coverage: number;
}
