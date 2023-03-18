import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface sidebarState {
  newBoardsNames: string[];
}

const initialState: sidebarState = {
  newBoardsNames: [],
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    updateNewBoardsNames: (state, action: PayloadAction<string>) => {
      if (state.newBoardsNames) {
        state.newBoardsNames = [...state.newBoardsNames, action.payload];
      }
    },
  },
});

export const { updateNewBoardsNames } = sidebarSlice.actions;
export const selectSidebar = (state: RootState) => state.dashboard.sidebarOpen;
export default sidebarSlice.reducer;