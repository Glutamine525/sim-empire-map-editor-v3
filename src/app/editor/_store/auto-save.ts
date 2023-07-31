import { produce } from 'immer';
import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
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
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name);
          if (!str) {
            return null;
          }
          const { state, ...rest } = JSON.parse(str) as {
            state: {
              mapData: string;
              snapshots: string[];
            };
          };
          return {
            state: {
              mapData: JSON.parse(decompress(state.mapData)),
              snapshots: state.snapshots.map(s => JSON.parse(decompress(s))),
            },
            ...rest,
          };
        },
        setItem: (
          key,
          data: StorageValue<{
            mapData?: MapData;
            snapshots: FinalMapData[];
          }>,
        ) => {
          const str = JSON.stringify({
            state: {
              mapData: compress(JSON.stringify(data.state?.mapData || {})),
              snapshots: (data.state?.snapshots || []).map(s =>
                compress(JSON.stringify(s)),
              ),
            },
            version: 0,
          });
          localStorage.setItem(key, str);
        },
        removeItem: name => localStorage.removeItem(name),
      },
    },
  ),
);
