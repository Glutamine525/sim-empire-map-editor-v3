import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BuildingConfig } from '@/app/editor/_map-core/building/type';
import {
  CivilType,
  MapCounter,
  MapCounterType,
  MapType,
  OperationType,
} from '@/app/editor/_map-core/type';
import { UI_SETTING } from '../_config';

interface MapConfigState {
  mapType: MapType;
  civil: CivilType;
  noTree: boolean;
  rotated: boolean;
  operation: OperationType;
  brush: BuildingConfig | undefined;
  counter: MapCounter;
  emptyCells: number;
  mapRedraw: number;
  leftMenuWidth: number;
  changeMapType: (mapType: MapType) => void;
  changeCivil: (civil: CivilType) => void;
  changeNoTree: (noTree: boolean) => void;
  changeRotated: (rotated: boolean) => void;
  changeOperation: (operation: OperationType) => void;
  changeBrush: (brush: BuildingConfig | undefined) => void;
  changeCounter: (counter: MapCounter) => void;
  changeEmptyCells: (emptyCells: number) => void;
  changeLeftMenuWidth: (leftMenuWidth: number) => void;
  triggerMapRedraw: () => void;
}

export const useMapConfig = create<MapConfigState>()(
  persist(
    set => ({
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
      mapRedraw: 0,
      leftMenuWidth: UI_SETTING.leftMenuWidth,
      changeMapType: mapType => set({ mapType }),
      changeCivil: civil => set({ civil }),
      changeNoTree: noTree => set({ noTree }),
      changeRotated: rotated => set({ rotated }),
      changeOperation: operation => set({ operation }),
      changeBrush: brush => set({ brush }),
      changeCounter: counter => set({ counter }),
      changeEmptyCells: emptyCells => set({ emptyCells }),
      changeLeftMenuWidth: leftMenuWidth => set({ leftMenuWidth }),
      triggerMapRedraw: () =>
        set(state => ({ mapRedraw: (state.mapRedraw + 1) % 10 })),
    }),
    {
      name: 'map-config-store',
      partialize: state => ({ leftMenuWidth: state.leftMenuWidth }),
    },
  ),
);
