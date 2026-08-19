import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  defaultColorTheme,
  type ColorThemeId,
} from "@/lib/themes";

interface ThemeState {
  colorTheme: ColorThemeId;
}

const initialState: ThemeState = {
  colorTheme: defaultColorTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColorTheme: (state, action: PayloadAction<ColorThemeId>) => {
      state.colorTheme = action.payload;
    },
  },
});

export const { setColorTheme } = themeSlice.actions;
export default themeSlice.reducer;
