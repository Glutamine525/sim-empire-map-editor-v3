export const UnitPx = 30;

export const MapType = [5, 4, 3];

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
  Empty,
  PlaceBuilding,
  SelectBuilding,
  DeleteBuilding,
  WatermarkMode,
}
