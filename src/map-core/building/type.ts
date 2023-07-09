import { CivilType } from '../type';
import { BuildingAztec } from './aztec';
import { BuildingChina } from './china';
import { BuildingEgypt } from './egypt';
import { BuildingGreece } from './greece';
import { BuildingPersian } from './persian';

export const CivilBuilding: { [key in CivilType]: typeof BuildingChina } = {
  [CivilType.China]: BuildingChina,
  [CivilType.Persian]: BuildingPersian,
  [CivilType.Egypt]: BuildingEgypt,
  [CivilType.Greece]: BuildingGreece,
  [CivilType.Aztec]: BuildingAztec,
  [CivilType.Custom]: {} as typeof BuildingChina,
};

export enum BuildingType {
  Residence = '住宅',
  Agriculture = '农业',
  Industry = '工业',
  Commerce = '商业',
  Municipal = '市政',
  Culture = '文化',
  Religion = '宗教',
  Military = '军事',
  Decoration = '美化',
  Wonder = '奇迹',
}

enum _CatalogType {
  Road = '道路',
}

enum __CatalogType {
  General = '通用',
  Special = '特殊建筑',
  Cancel = '取消操作',
  Move = '移动建筑',
  Delete = '删除建筑',
  Undo = '撤销',
  Redo = '重做',
  ImportExport = '导入导出',
  WatermarkMode = '水印模式',
}

export enum ImportExportSubmenu {
  ImportNewCivil = '导入新文明',
  ImportMapData = '导入地图数据',
  Screenshot = '截图',
  ExportMapData = '导出地图数据',
}

export type CatalogType = BuildingType | _CatalogType | __CatalogType;
export const CatalogType = {
  ..._CatalogType,
  ...BuildingType,
  ...__CatalogType,
};

export enum BorderStyleType {
  Solid = 'solid',
  Dashed = 'dashed',
  None = 'none',
}

export interface SimpleBuildingConfig {
  // 建筑配置文件对应的简单建筑
  name: string;
  text: string;
  size: number;
  range: number;
  background: string;
  isPalace?: boolean;
}

export interface BuildingConfig {
  name?: string;
  text?: string;
  range?: number;
  marker?: number;
  catalog?: CatalogType;
  isFixed?: boolean;
  isBarrier?: boolean;
  isRoad?: boolean;
  isProtection?: boolean;
  isWonder?: boolean;
  isDecoration?: boolean;
  isGeneral?: boolean;
  isEmpty?: boolean;
  w?: number;
  h?: number;
  color?: string;
  shadowColor?: string;
  fontSize?: number;
  bg?: string;
  borderTStyle?: BorderStyleType;
  borderRStyle?: BorderStyleType;
  borderBStyle?: BorderStyleType;
  borderLStyle?: BorderStyleType;
  isRoadVertex?: boolean;
}
