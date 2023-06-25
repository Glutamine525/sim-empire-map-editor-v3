import { BuildingConfig } from '@/map-core/building';
import { MapLength } from '@/map-core/type';
import createSubscribeStore, {
  UseSubscribeStore,
} from '@/utils/create-subscribe-store';

export const buildingData: {
  [key: string]: UseSubscribeStore<BuildingConfig>;
} = {};

for (let i = 1; i <= MapLength; i++) {
  for (let j = 1; j <= MapLength; j++) {
    buildingData[`${i}-${j}`] = createSubscribeStore<BuildingConfig>({
      bg: 'white',
    });
  }
}

export const useBuildingData = (arg0: number | string, arg1?: number) => {
  let key: string;
  if (typeof arg0 === 'number') {
    key = `${arg0}-${arg1}`;
  } else {
    key = arg0;
  }
  return buildingData[key]();
};
