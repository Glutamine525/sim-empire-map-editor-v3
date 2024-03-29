import { produce } from 'immer';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { compress, decompress } from '@/utils/compress';
import { getMapData, MapData } from '@/utils/import-export';
import { miniMapCanvas } from '../_components/mini-map';

type FinalMapData = MapData & { imgSrc: string };

const LIMIT = 20;

interface AutoSaveState {
  mapData?: MapData;
  snapshots: FinalMapData[];
  trigger: () => boolean;
  moveSelectedToFirst: (index: number) => void;
}

export const useAutoSave = create<AutoSaveState>()(
  persist(
    (set, get) => ({
      snapshots: [],
      trigger: () => {
        const _data = getMapData();
        if (get().mapData?.md5 !== _data.md5) {
          set({ mapData: getMapData() });
        }
        if (
          _data.roads.length === 0 &&
          Object.keys(_data.buildings).length === 0
        ) {
          return false;
        }
        const md5s = get().snapshots.map(v => v.md5);
        if (md5s.includes(_data.md5)) {
          return false;
        }
        const data = {
          ..._data,
          imgSrc: miniMapCanvas.current!.toDataURL('image/png', 1),
        };
        set(
          produce<AutoSaveState>(state => {
            state.snapshots = [data, ...state.snapshots.slice(0, LIMIT - 1)];
          }),
        );
        return true;
      },
      moveSelectedToFirst: index => {
        set(
          produce<AutoSaveState>(state => {
            const selected = state.snapshots.splice(index, 1);
            state.snapshots.unshift(...selected);
          }),
        );
      },
    }),
    {
      name: 'auto-save-data',
      partialize: state => ({
        mapData: state.mapData,
        snapshots: state.snapshots,
      }),
      storage: createJSONStorage(() => localStorage, {
        replacer: (_, v) => {
          return compress(JSON.stringify(v));
        },
        reviver: (_, v) => {
          return JSON.parse(decompress(v as string));
        },
      }),
    },
  ),
);
