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
  [CivilType.Custom]: undefined as any,
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

export enum CatalogType {
  Road = '道路',
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
  General = '通用',
  Special = '特殊建筑',
  Cancel = '取消操作',
  Select = '选中建筑',
  Delete = '删除建筑',
  WatermarkMode = '水印模式',
  ImportExport = '导入导出',
}

export enum BorderStyleType {
  Solid = 'solid',
  Dashed = 'dashed',
  None = 'none',
}

export interface SimpleBuilding {
  // 建筑配置文件对应的简单建筑
  name: string;
  text?: string;
  catalog?: string;
  catagory?: string;
  size?: number;
  width?: number;
  height?: number;
  range?: number;
  color?: string;
  shadow?: string;
  background?: string;
  fontSize?: number;
  isRoad?: boolean;
  isWonder?: boolean;
  isMiracle?: boolean;
  isDecoration?: boolean;
  isPalace?: boolean;
  isGeneral?: boolean;
  isProtection?: boolean;
  isBarrier?: boolean;
  isFixed?: boolean;
}

export interface Building {
  name: string;
  text: string;
  range: number;
  marker: number;
  catalog: CatalogType;
  isFixed: boolean;
  isBarrier: boolean;
  isRoad: boolean;
  isProtection: boolean;
  isWonder: boolean;
  isDecoration: boolean;
  isGeneral: boolean;
  width: number;
  height: number;
  color: string;
  textShadowColor: string;
  fontSize: number;
  backgroundColor: string;
  borderTStyle: BorderStyleType;
  borderRStyle: BorderStyleType;
  borderBStyle: BorderStyleType;
  borderLStyle: BorderStyleType;
}

export enum MarkerColor {
  Normal = 'black',
  Danger = 'rgb(var(--danger-6))',
  Safe = 'rgb(var(--success-6))',
}
