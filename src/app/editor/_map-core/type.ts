export const MapLength = 116;

export enum MapType {
  _5 = 5,
  _4 = 4,
  _3 = 3,
}

export enum CivilType {
  China = 'china',
  Persian = 'persian',
  Egypt = 'egypt',
  Greece = 'greece',
  Aztec = 'aztec',
  Custom = 'custom',
}

export const CivilTypeLabel: { [key in CivilType]: string } = {
  [CivilType.China]: '中国',
  [CivilType.Persian]: '波斯',
  [CivilType.Egypt]: '埃及',
  [CivilType.Greece]: '希腊',
  [CivilType.Aztec]: '阿兹特克',
  [CivilType.Custom]: '自定义',
};

export const mapCivilLabelToType: { [key: string]: CivilType } = {
  中国: CivilType.China,
  波斯: CivilType.Persian,
  埃及: CivilType.Egypt,
  希腊: CivilType.Greece,
  阿兹特克: CivilType.Aztec,
};

export enum OperationType {
  Empty = '空',
  PlaceBuilding = '放置建筑',
  MoveBuilding = '移动建筑',
  DeleteBuilding = '删除建筑',
  WatermarkMode = '水印模式',
}

export interface Cell {
  isInRange: boolean;
  occupied: string;
  protection: { [key: string]: string[] };
}

export enum MapCounterType {
  House = '普通住宅',
  Villa = '高级住宅',
  Granary = '粮仓',
  Warehouse = '货栈',
  Agriculture = '农业',
  Industry = '工业',
  General = '通用',
  Coverage = '覆盖',
}

export type MapCounter = { [key in MapCounterType]: number };
