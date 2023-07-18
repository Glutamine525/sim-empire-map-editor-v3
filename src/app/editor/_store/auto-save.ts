import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  decodeMapData,
  encodeMapData,
  getMapData,
  MapData,
} from '@/utils/import-export';
import { miniMapCanvas } from '../_components/mini-map';

type FinalMapData = MapData & { imgSrc: string };

interface AutoSaveState {
  mapDataStr?: string;
  snapshots: FinalMapData[];
  trigger: () => boolean;
  moveSelectedToFirst: (index: number) => void;
}

const LIMIT = 20;

export const useAutoSave = create<AutoSaveState>()(
  persist(
    (set, get) => ({
      snapshots: [],
      trigger: () => {
        const _data = getMapData();
        if (decodeMapData(get().mapDataStr)?.md5 !== _data.md5) {
          set({ mapDataStr: encodeMapData(_data) });
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
      partialize: state => ({ mapDataStr: state.mapDataStr }),
    },
  ),
);
