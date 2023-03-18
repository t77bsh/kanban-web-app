import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface DashboardState {
  sidebarOpen: boolean;
  newBoard: any | null;
  updatedBoard: any | null;
  userBoards: any[] | null | undefined;
  navTitle: string | null;
}

const initialState: DashboardState = {
  sidebarOpen: true,
  newBoard: null,
  updatedBoard: null,
  userBoards: null,
  navTitle: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    toggle: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    updateNewBoard: (state, action: PayloadAction<any>) => {
      state.newBoard = action.payload;
    },
    updateBoardName: (state, action: PayloadAction<any>) => {
      state.updatedBoard = action.payload;
    },
    setUserBoards: (state, action: PayloadAction<any>) => {
      state.userBoards = action.payload;
    },
    updateNavTitle: (state, action) => {
      state.navTitle = action.payload;
    },
  },
});

export const {
  toggle,
  updateNewBoard,
  updateBoardName,
  setUserBoards,
  updateNavTitle,
} = dashboardSlice.actions;
export const selectDashboard = (state: RootState) =>
  state.dashboard.sidebarOpen;
export const selectNewBoard = (state: RootState) => state.dashboard.newBoard;
export const selectUpdatedBoard = (state: RootState) =>
  state.dashboard.updatedBoard;
export const selectUserBoards = (state: RootState) =>
  state.dashboard.userBoards;
export default dashboardSlice.reducer;
