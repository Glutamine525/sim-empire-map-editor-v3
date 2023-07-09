import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encodeMapData, getMapData, MapData } from '@/utils/import-export';
import { miniMapCanvas } from '../_components/mini-map';

type FinalMapData = MapData & { imgSrc: string };

interface AutoSaveState {
  mapDataStr?: string;
  initImport: boolean;
  snapshots: FinalMapData[];
  trigger: () => boolean;
  changeInitImport: (initImport: boolean) => void;
}

const LIMIT = 50;

export const useAutoSave = create<AutoSaveState>()(
  persist(
    (set, get) => ({
      snapshots: [],
      initImport: true,
      trigger: () => {
        const _data = getMapData();
        set({ mapDataStr: encodeMapData(_data) });
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
      changeInitImport: initImport => set({ initImport }),
    }),
    {
      name: 'auto-save-data',
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key === 'mapDataStr'),
        ),
    },
  ),
);
