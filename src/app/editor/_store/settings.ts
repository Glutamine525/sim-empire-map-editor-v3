import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum RoadCountStyleType {
  CenterBigNumber = 'A',
  TopLeftSmallNumber = 'B',
}

export enum ProtectionCountStyleType {
  Circle = 'A',
  Number = 'B',
}

interface Setting {
  enableTopMenuShortcut: boolean;
  enableLeftMenuShortcut: boolean;
  enableInteractLayerShortcut: boolean;
  enableDoubleClickDelete: boolean;
  enableResidenceRequirementQuery: boolean;
  autoSaveInterval: number;
  roadCountStyle: RoadCountStyleType;
  protectionCountStyle: ProtectionCountStyleType;
  enableMiniMap: boolean;
  enableFixedBuildingIcon: boolean;
  enableSpecialBuildingIcon: boolean;
  enableProtectionHighlight: boolean;
  screenshotScale: number;
  screenshotQuality: number;
  enableScreenshot45deg: boolean;
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
      roadCountStyle: RoadCountStyleType.CenterBigNumber,
      protectionCountStyle: ProtectionCountStyleType.Circle,
      enableMiniMap: true,
      enableFixedBuildingIcon: true,
      enableSpecialBuildingIcon: true,
      enableProtectionHighlight: true,
      screenshotScale: 2,
      screenshotQuality: 0.8,
      enableScreenshot45deg: false,
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
