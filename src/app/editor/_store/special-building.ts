import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BuildingConfig } from '@/map-core/building';

interface SpecialBuildingState {
  show: boolean;
  buildings: { [key: string]: BuildingConfig };
  setShow: (show: boolean) => void;
  isNameValid: (name: string) => boolean;
  insertBuilding: (b: BuildingConfig) => boolean;
  deleteBuilding: (name?: string) => void;
}

export const useSpecialBuilding = create<SpecialBuildingState>()(
  persist(
    (set, get) => ({
      show: false,
      buildings: {},
      setShow: show => set({ show }),
      isNameValid: name => {
        if (!name || name in get().buildings || name.includes('-')) {
          return false;
        }
        return true;
      },
      insertBuilding: b => {
        const name = b.name;
        if (!name || !get().isNameValid(name)) {
          return false;
        }
        set(
          produce(state => {
            state.buildings[name] = b;
          }),
        );
        return true;
      },
      deleteBuilding: (name = '') => {
        if (!(name in get().buildings)) {
          return;
        }
        set(
          produce(state => {
            delete state.buildings[name];
          }),
        );
      },
    }),
    {
      name: 'special-building-store',
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key === 'buildings'),
        ),
    },
  ),
);
