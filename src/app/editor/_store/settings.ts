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
  commandMaxNum: number;
  enableLoadCommand: boolean;
  enableCommandStoredInDb: boolean;
  screenshotScale: number;
  screenshotQuality: number;
  enableCityAndCivilMode: boolean;
}

interface SettingState {
  setting: Setting;
  setSetting: (data: Partial<Setting>) => void;
}

export const useSetting = create<SettingState>()(
  persist(
    set => ({
      setting: {
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
        commandMaxNum: 200,
        enableLoadCommand: false,
        enableCommandStoredInDb: false,
        screenshotScale: 2,
        screenshotQuality: 0.8,
        enableCityAndCivilMode: false,
      },
      setSetting: data => {
        set(
          produce<SettingState>(state => {
            for (const v in data) {
              (state.setting as any)[v] = (data as any)[v];
            }
          }),
        );
      },
    }),
    {
      name: 'setting-store',
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key === 'setting'),
        ),
    },
  ),
);
