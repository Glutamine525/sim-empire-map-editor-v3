import { CivilType, OperationType } from '@/map-core/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapState {
  mapType: number;
  civil: CivilType;
  noTree: boolean;
  rotated: boolean;
  operation: OperationType;
  hoveredCoord: { line: number; column: number };
}

const initialState = {
  mapType: 5,
  civil: CivilType.China,
  noTree: false,
  rotated: false,
  operation: OperationType.Empty,
  hoveredCoord: { line: 0, column: 0 },
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
    changeNoTree(state, action: PayloadAction<boolean>) {
      state.noTree = action.payload;
    },
    changeRotated(state, action: PayloadAction<boolean>) {
      state.rotated = action.payload;
    },
    changeOperation(state, action: PayloadAction<OperationType>) {
      state.operation = action.payload;
    },
    changeHoveredCoord(state, action: PayloadAction<{ line: number; column: number }>) {
      state.hoveredCoord = action.payload;
    },
  },
});

export const {
  changeMapType,
  changeCivil,
  changeNoTree,
  changeRotated,
  changeOperation,
  changeHoveredCoord,
} = mapReducer.actions;

export default mapReducer.reducer;
