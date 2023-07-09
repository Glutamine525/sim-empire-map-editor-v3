import { create } from 'zustand';
import { BuildingConfig } from '@/map-core/building/type';
import {
  CivilType,
  MapCounter,
  MapCounterType,
  MapType,
  OperationType,
} from '@/map-core/type';

interface MapConfigState {
  mapType: MapType;
  civil: CivilType;
  noTree: boolean;
  rotated: boolean;
  operation: OperationType;
  brush: BuildingConfig | undefined;
  counter: MapCounter;
  emptyCells: number;
  changeMapType: (mapType: MapType) => void;
  changeCivil: (civil: CivilType) => void;
  changeNoTree: (noTree: boolean) => void;
  changeRotated: (rotated: boolean) => void;
  changeOperation: (operation: OperationType) => void;
  changeBrush: (brush: BuildingConfig | undefined) => void;
  changeCounter: (counter: MapCounter) => void;
  changeEmptyCells: (emptyCells: number) => void;
}

export const useMapConfig = create<MapConfigState>()(set => ({
  mapType: MapType._5,
  civil: CivilType.China,
  noTree: false,
  rotated: false,
  operation: OperationType.Empty,
  brush: undefined,
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
  changeMapType: mapType => set({ mapType }),
  changeCivil: civil => set({ civil }),
  changeNoTree: noTree => set({ noTree }),
  changeRotated: rotated => set({ rotated }),
  changeOperation: operation => set({ operation }),
  changeBrush: brush => set({ brush }),
  changeCounter: counter => set({ counter }),
  changeEmptyCells: emptyCells => set({ emptyCells }),
}));
