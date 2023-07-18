import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Setting {
  enableTopMenuShortcut: boolean;
  enableLeftMenuShortcut: boolean;
  enableInteractLayerShortcut: boolean;
  enableDoubleClickDelete: boolean;
  enableResidenceRequirementQuery: boolean;
  autoSaveInterval: number;
  autoSaveMaxNum: number;
  roadCountStyle: string;
  protectionCountStyle: string;
  enableFixedBuildingIcon: boolean;
  enableProtectionHighlight: boolean;
  commandMaxNum: number;
  enableLoadCommand: boolean;
  enableCommandStoredInDb: boolean;
  screenshotScale: number;
  screenshotQuality: number;
  enableCityAndCivilMode: boolean;
}

interface SettingState extends Setting {
  setSetting: (data: Partial<Setting>) => void;
}

export const useSetting = create<SettingState>()(
  persist(
    set => ({
      enableTopMenuShortcut: true,
      enableLeftMenuShortcut: true,
      enableInteractLayerShortcut: true,
      enableDoubleClickDelete: true,
      enableResidenceRequirementQuery: true,
      autoSaveInterval: 30,
      autoSaveMaxNum: 20,
      roadCountStyle: 'A',
      protectionCountStyle: 'A',
      enableFixedBuildingIcon: true,
      enableProtectionHighlight: true,
      commandMaxNum: 200,
      enableLoadCommand: false,
      enableCommandStoredInDb: false,
      screenshotScale: 2,
      screenshotQuality: 0.8,
      enableCityAndCivilMode: false,
      setSetting: data => {
        set(
          produce<SettingState>(state => {
            for (const v in data) {
              (state as any)[v] = (data as any)[v];
            }
          }),
        );
      },
    }),
    {
      name: 'setting-store',
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['setSetting'].includes(key),
          ),
        ),
    },
  ),
);
