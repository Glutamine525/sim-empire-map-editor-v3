import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BuildingConfig } from '@/app/editor/_map-core/building/type';

interface SpecialBuildingState {
  buildings: { [key: string]: BuildingConfig };
  isNameValid: (name: string) => boolean;
  insert: (b: BuildingConfig) => boolean;
  remove: (name?: string) => void;
}

export const useSpecialBuilding = create<SpecialBuildingState>()(
  persist(
    (set, get) => ({
      buildings: {},
      isNameValid: name => {
        if (!name || name in get().buildings || name.includes('-')) {
          return false;
        }
        return true;
      },
      insert: b => {
        const name = b.name;
        if (!name || !get().isNameValid(name)) {
          return false;
        }
        set(
          produce<SpecialBuildingState>(state => {
            state.buildings[name] = { ...b };
          }),
        );
        return true;
      },
      remove: (name = '') => {
        if (!(name in get().buildings)) {
          return;
        }
        set(
          produce<SpecialBuildingState>(state => {
            delete state.buildings[name];
          }),
        );
      },
    }),
    {
      name: 'special-building-store',
      partialize: state => ({ buildings: state.buildings }),
    },
  ),
);
