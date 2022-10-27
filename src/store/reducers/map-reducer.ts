import { Building } from '@/map-core/building';
import { CivilType, OperationType } from '@/map-core/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapState {
  mapType: number;
  civil: CivilType;
  noTree: boolean;
  rotated: boolean;
  operation: OperationType;
  brush: Building;
  mapUpdater: { diff: number; building: Building };
}

const initialState = {
  mapType: 5,
  civil: CivilType.China,
  noTree: false,
  rotated: false,
  operation: OperationType.Empty,
  brush: {},
  mapUpdater: Object.create(null),
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
    changeBrush(state, action: PayloadAction<Building>) {
      state.brush = action.payload;
    },
    triggerMapUpdater(state, action: PayloadAction<{ diff: number; building: Building }>) {
      state.mapUpdater = action.payload;
    },
  },
});

export const {
  changeMapType,
  changeCivil,
  changeNoTree,
  changeRotated,
  changeOperation,
  changeBrush,
  triggerMapUpdater,
} = mapReducer.actions;

export default mapReducer.reducer;
