import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark';

export interface SettingState {
  theme: ThemeType;
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
