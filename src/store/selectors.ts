import type { RootState } from '.';
import { MapState } from './reducers/map';

export const rootSelector = (state: RootState): RootState => state;

export const mapSelector = ({ map }: RootState): MapState => map;
