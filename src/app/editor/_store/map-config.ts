import { create } from 'zustand';
import { CivilType, MapType } from '@/map-core/type';

interface MapConfigState {
  mapType: MapType;
  civil: CivilType;
  noTree: boolean;
  rotated: boolean;
  changeMapType: (mapType: MapType) => void;
  changeCivil: (civil: CivilType) => void;
  changeNoTree: (noTree: boolean) => void;
  changeRotated: (rotated: boolean) => void;
}

export const useMapConfig = create<MapConfigState>()(set => ({
  mapType: MapType._5,
  civil: CivilType.China,
  noTree: false,
  rotated: false,
  changeMapType: mapType => set(state => ({ ...state, mapType })),
  changeCivil: civil => set(state => ({ ...state, civil })),
  changeNoTree: noTree => set(state => ({ ...state, noTree })),
  changeRotated: rotated => set(state => ({ ...state, rotated })),
}));
