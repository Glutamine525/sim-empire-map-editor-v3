import { CHESSBOARD_LEN } from '@/config';
import createSubscribeStore, {
  UseSubscribeStore,
} from '@/utils/create-subscribe-store';

export interface BuildingConfig {
  name?: string;
  text?: string;
  range?: number;
  marker?: number;
  isFixed?: boolean;
  isBarrier?: boolean;
  isRoad?: boolean;
  isProtection?: boolean;
  isWonder?: boolean;
  isDecoration?: boolean;
  isGeneral?: boolean;
  isEmpty?: boolean;
  width?: number;
  height?: number;
  textColor?: string;
  textShadowColor?: string;
  fontSize?: number;
  bg?: string;
  isRoadVertex?: boolean;
}

export const mapData: { [key: string]: UseSubscribeStore<BuildingConfig> } = {};

console.time('init');
for (let i = 1; i <= CHESSBOARD_LEN; i++) {
  for (let j = 1; j <= CHESSBOARD_LEN; j++) {
    mapData[`${i}-${j}`] = createSubscribeStore<BuildingConfig>({
      bg: 'white',
    });
  }
}
console.timeEnd('init');

export const useMapData = (arg0: number | string, arg1?: number) => {
  let key: string;
  if (typeof arg0 === 'number') {
    key = `${arg0}-${arg1}`;
  } else {
    key = arg0;
  }
  return mapData[key]();
};
