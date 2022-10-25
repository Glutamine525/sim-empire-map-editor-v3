import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingState {
  theme: 'light' | 'dark';
}

const initialState = {
  theme: 'light' as 'light' | 'dark',
};

const settingReducer = createSlice({
  name: 'settingReducer',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
  },
});

export const { changeTheme } = settingReducer.actions;

export default settingReducer.reducer;
