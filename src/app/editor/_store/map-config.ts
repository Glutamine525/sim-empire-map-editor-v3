import { create } from 'zustand';
import {
  CivilType,
  MapCounter,
  MapCounterType,
  MapType,
} from '@/map-core/type';

interface MapConfigState {
  mapType: MapType;
  civil: CivilType;
  noTree: boolean;
  rotated: boolean;
  counter: MapCounter;
  emptyCells: number;
  changeMapType: (mapType: MapType) => void;
  changeCivil: (civil: CivilType) => void;
  changeNoTree: (noTree: boolean) => void;
  changeRotated: (rotated: boolean) => void;
  changeCounter: (counter: MapCounter) => void;
  changeEmptyCells: (emptyCells: number) => void;
}

export const useMapConfig = create<MapConfigState>()(set => ({
  mapType: MapType._5,
  civil: CivilType.China,
  noTree: false,
  rotated: false,
  counter: {
    [MapCounterType.House]: 0,
    [MapCounterType.Villa]: 0,
    [MapCounterType.Granary]: 0,
    [MapCounterType.Warehouse]: 0,
    [MapCounterType.Agriculture]: 0,
    [MapCounterType.Industry]: 0,
    [MapCounterType.General]: 0,
    [MapCounterType.Coverage]: 0,
  },
  emptyCells: 0,
  changeMapType: mapType => set(state => ({ ...state, mapType })),
  changeCivil: civil => set(state => ({ ...state, civil })),
  changeNoTree: noTree => set(state => ({ ...state, noTree })),
  changeRotated: rotated => set(state => ({ ...state, rotated })),
  changeCounter: counter => set(state => ({ ...state, counter })),
  changeEmptyCells: emptyCells => set(state => ({ ...state, emptyCells })),
}));
