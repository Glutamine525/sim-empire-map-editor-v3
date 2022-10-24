import { CivilType, OperationType } from '@/map-core/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapState {
  mapType: number;
  civil: CivilType;
  noWood: boolean;
  rotated: boolean;
  operation: OperationType;
}

const initialState = {
  mapType: 5,
  civil: CivilType.China,
  noWood: false,
  rotated: false,
  operation: OperationType.Empty,
};

const mapReducer = createSlice({
  name: 'mapReducer',
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
    changeOperation(state, action: PayloadAction<OperationType>) {
      state.operation = action.payload;
    },
  },
});

export const { changeMapType, changeCivil, changeNoWood, changeRotated, changeOperation } =
  mapReducer.actions;

export default mapReducer.reducer;
