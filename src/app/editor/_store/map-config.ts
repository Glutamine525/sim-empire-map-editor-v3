import { CivilType, MapType } from '@/map-core/type';
import createSubscribeStore from '@/utils/create-subscribe-store';

export const mapConfigData = createSubscribeStore({
  mapType: MapType._5,
  civil: CivilType.China,
  noTree: false,
  rotated: false,
});

export const useMapConfig = () => mapConfigData();
