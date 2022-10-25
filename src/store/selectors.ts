import type { RootState } from '.';
import { MapState } from './reducers/map-reducer';
import { SettingState } from './reducers/setting-reducer';

export const rootSelector = (state: RootState): RootState => state;

export const mapSelector = ({ map }: RootState): MapState => map;

export const settingSelector = ({ setting }: RootState): SettingState => setting;
