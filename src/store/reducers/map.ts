import { CivilType } from '@/map-core/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapState {
  mapType: number;
  civil: CivilType;
  noWood: boolean;
  rotated: boolean;
}

const initialState = { mapType: 5, civil: CivilType.China, noWood: false, rotated: false };

const mapReducer = createSlice({
  name: 'map',
  initialState,
  reducers: {
    changeMapType(state, action: PayloadAction<number>) {
      state.mapType = action.payload;
    },
    changeCivil(state, action: PayloadAction<CivilType>) {
      state.civil = action.payload;
    },
    changeNoWood(state, action: PayloadAction<boolean>) {
      state.noWood = action.payload;
    },
    changeRotated(state, action: PayloadAction<boolean>) {
      state.rotated = action.payload;
    },
  },
});

export const { changeMapType, changeCivil, changeNoWood, changeRotated } = mapReducer.actions;

export default mapReducer.reducer;
