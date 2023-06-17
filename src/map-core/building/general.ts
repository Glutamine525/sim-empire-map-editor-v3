import { SimpleBuildingConfig } from '.';
import { BuildingColor } from './color';

export const GeneralBuilding: SimpleBuildingConfig[] = [
  {
    name: '2x2建筑',
    text: '2x2',
    size: 2,
    range: 0,
    background: BuildingColor['通用'][0],
  },
  {
    name: '3x3建筑',
    text: '3x3',
    size: 3,
    range: 0,
    background: BuildingColor['通用'][1],
  },
  {
    name: '4x4建筑',
    text: '4x4',
    size: 4,
    range: 0,
    background: BuildingColor['通用'][2],
  },
  {
    name: '5x5建筑',
    text: '5x5',
    size: 5,
    range: 0,
    background: BuildingColor['通用'][3],
  },
];
