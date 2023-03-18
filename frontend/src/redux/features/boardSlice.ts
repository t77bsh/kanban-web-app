import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface sutaskObject {
  subtaskTitle: string;
  subtaskDone: boolean;
}
interface taskObject {
  taskTitle: string;
  description: string;
  subtasks: sutaskObject[];
}
interface updatedTaskObject {
  taskTitle: string;
  description: string;
  subtasks: sutaskObject[];
  colIdx: number;
  taskIdx: number;
}

export interface BoardState {
  newTask: taskObject;
  updatedTask: updatedTaskObject;
}

const initialState: BoardState = {
  newTask: {
    taskTitle: "",
    description: "",
    subtasks: [],
  },
  updatedTask: {
    taskTitle: "",
    description: "",
    subtasks: [],
    colIdx: -1,
    taskIdx: -1,
  },
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateNewTask: (state, action) => {
      state.newTask = action.payload;
    },
    changeTaskDetails: (state, action) => {
      state.updatedTask = action.payload;
    },
  },
});

export const { updateNewTask, changeTaskDetails } = boardSlice.actions;
export const selectBoard = (state: RootState) => state.board.newTask;
export default boardSlice.reducer;
