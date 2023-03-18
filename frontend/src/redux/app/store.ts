import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/dashboardSlice";
// import sidebarReducer from "../features/sidebarSlice";
// import navbarReducer from "../features/navbarSlice";
import boardReducer from "../features/boardSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    // sidebar: sidebarReducer,
    // navbar: navbarReducer,
    board: boardReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
