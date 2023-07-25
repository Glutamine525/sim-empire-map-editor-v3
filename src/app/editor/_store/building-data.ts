import { BuildingConfig } from '@/app/editor/_map-core/building/type';
import { MapLength } from '@/app/editor/_map-core/type';
import { isInRange } from '@/utils/coordinate';
import createSubscribeStore, {
  UseSubscribeStore,
} from '@/utils/create-subscribe-store';

export const buildingData: {
  [key: string]: UseSubscribeStore<BuildingConfig>;
} = {};

for (let row = 1; row <= MapLength; row++) {
  for (let col = 1; col <= MapLength; col++) {
    if (!isInRange(row, col)) {
      continue;
    }
    buildingData[`${row}-${col}`] = createSubscribeStore<BuildingConfig>({
      isEmpty: true,
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

export const resetBuildingData = () => {
  for (const v in buildingData) {
    buildingData[v].set({
      isEmpty: true,
    });
  }
};
