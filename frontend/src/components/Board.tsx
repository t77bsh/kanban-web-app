// React
import React, { useState, useRef, FormEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
// Component imports
import crossIcon from "../assets/icon-cross.svg";
import AddMoreDetailsModal from "../modals/AddMoreDetailsModal";
import TaskDetailsModal from "../modals/TaskDetailsModal";
import DeleteColumnModal from "../modals/DeleteColumnModal";
import dotsIcon from "../assets/icon-dots.svg";
import dotsIconNight from "../assets/icon-dots-night.svg";
import ErrorNavbar from "./ErrorNavbar";
//Redux
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import { setUserBoards } from "../redux/features/dashboardSlice";
// misc
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Board() {
  // Redux
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.dashboard.sidebarOpen);
  const userBoards = useAppSelector((state) => state.dashboard.userBoards);

  // Context
  const { dayMode } = useTheme();

  // States
  const [board, setBoard] = useState<any | null>(null);
  const [cols, setCols] = useState<any>(null);
  const [newColUI, setNewColUI] = useState(true);
  const [addTaskUI, setAddTaskUI] = useState<number>(-1);
  const [showModal, setShowModal] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [toggleColTitleEdit, setToggleColTitleEdit] = useState<number>(-1);
  const [currentColsIdx, setCurrentColsIdx] = useState<number>(-1);
  const [showDeleteColModal, setShowDeleteColModal] = useState(false);
  const [error, setError] = useState<string>();

  //Params
  const { uid, boardUrlID } = useParams();

  // Refs
  const columnTitleRef = useRef<HTMLInputElement>(null);
  const newColUIRef = useRef<HTMLDivElement>(null);
  const taskNameRef = useRef<HTMLInputElement>(null);
  const taskUIRef = useRef<HTMLFormElement>(null);
  const editColTitleRef = useRef<HTMLTextAreaElement>(null);
  const colsDropdownRef = useRef<HTMLDivElement>(null);

  // EFFECTS //

  // Get board data
  useEffect(() => {
    if (userBoards) {
      const board = userBoards.find((board) => boardUrlID === board.boardUrlID);
      if (board) {
        setBoard(board);
        setCols(board.cols);
      }
    } else if (userBoards === undefined) {
      setBoard(undefined);
    }
  }, [userBoards, boardUrlID]);

  // Close pop-up UIs when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const newCol = newColUIRef.current?.contains(event.target as Node);
      const taskUI = taskUIRef.current?.contains(event.target as Node);
      if (!newColUI && !newCol) {
        setNewColUI(true);
      }
      if (addTaskUI !== -1 && !taskUI && !showModal) {
        setAddTaskUI(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newColUIRef, taskUIRef, showModal, addTaskUI, newColUI]);

  // Handle click outside column dropdown
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        colsDropdownRef.current &&
        !colsDropdownRef.current.contains(event.target)
      ) {
        setCurrentColsIdx(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colsDropdownRef]);

  // CLICK HANDLERS //
  const toggleNewCol = () => {
    setNewColUI(!newColUI);
  };

  const addTask = (
    e: FormEvent<HTMLFormElement>,
    index: number,
    colID: string
  ) => {
    e.preventDefault();

    let newTask = {
      taskTitle: taskNameRef.current!.value,
      description: "",
      subtasks: [],
    };

    if (userBoards) {
      let originalBoards = [...userBoards];

      // Add task to client-side
      const boardsAfterAddingTask = userBoards.map((board) => {
        if (board.boardUrlID === boardUrlID) {
          const cols = [...board.cols];
          cols[index] = {
            ...cols[index],
            tasks: [...cols[index].tasks, newTask],
          };

          return {
            ...board,
            cols,
          };
        }
        return board;
      });
      dispatch(setUserBoards(boardsAfterAddingTask));
      setTimeout(() => {
        taskNameRef.current!.value = "";
        taskNameRef.current?.focus();
      }, 1);

      // Add task to database
      axios
        .patch(
          `http://localhost:8000/api/user_boards/add-task/${uid}/${boardUrlID}/${colID}`,
          newTask
        )
        .catch((err) => {
          // If issue adding to db, remove task from client-side
          dispatch(setUserBoards(originalBoards));
          setAddTaskUI(-1);
          alert(`${err.message}: Sorry, unable to add task`);
        });
    }
  };

  // Show add task UI
  const showAddTaskUI = (index: number) => {
    setAddTaskUI(index);
  };

  // Add new column function
  const addNewCol = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      columnTitleRef.current!.value.trim() !== "" &&
      !/^\s+$/.test(columnTitleRef.current!.value) &&
      userBoards
    ) {
      const newCol = {
        colTitle: columnTitleRef.current!.value.trim(),
        tasks: [],
      };
      setNewColUI(!newColUI);

      let originalBoards = [...userBoards];

      setCols([...cols, newCol]);

      // Add column to client-side
      const boardsAfterAddingCol = userBoards.map((board) => {
        if (board.boardUrlID === boardUrlID) {
          return {
            ...board,
            cols: [...board.cols, newCol],
          };
        }
        return board;
      });
      setTimeout(() => dispatch(setUserBoards(boardsAfterAddingCol)), 4);

      axios
        .patch(
          `http://localhost:8000/api/user_boards/add-col/${uid}/${boardUrlID}`,
          newCol
        )
        .then((res) => {
          const newlyAddedCol: object = res.data[res.data.length - 1];
          const updatedBoards = originalBoards.map((board) => {
            if (board.boardUrlID === boardUrlID) {
              return {
                ...board,
                cols: [...board.cols, newlyAddedCol],
              };
            }
            return board;
          });
          dispatch(setUserBoards(updatedBoards));
        })
        .catch(() => dispatch(setUserBoards(originalBoards)));
    } else {
      alert("Column title cannot be empty!");
    }
  };

  // Delete column
  const deleteCol = (colID: string, colIdx: number) => {
    if (userBoards) {
      let originalBoards = [...userBoards];
      setCols(cols.filter((col: any, index: number) => colIdx !== index));

      const boardsAfterDeletingCol = userBoards.map((board) => {
        if (board.boardUrlID === boardUrlID) {
          let newCols = [...board.cols];
          newCols.splice(colIdx, 1);
          return {
            ...board,
            cols: newCols,
          };
        }
        return board;
      });
      setTimeout(() => dispatch(setUserBoards(boardsAfterDeletingCol)), 4);

      axios
        .patch(
          `http://localhost:8000/api/user_boards/delete-col/${uid}/${boardUrlID}/${colID}`
        )
        .catch((err) => {
          dispatch(setUserBoards(originalBoards));
          alert(`${err.message}: Sorry, unable to delete column`);
        });
    }
  };

  // Drag and drop functionality
  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    // If there is no destination, or the source and destination are the same, do nothing
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // DRAGGING AND DROPPING COLUMNS //
    if (type === "column" && userBoards) {
      const newCols = Array.from(cols);
      const col = newCols[source.index];
      newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, col);
      let originalBoards = [...userBoards];
      setCols(newCols);
      let boardsAfterReorderingCols = userBoards.map((board) => {
        if (board.boardUrlID === boardUrlID) {
          return {
            ...board,
            cols: newCols,
          };
        }
        return board;
      });
      setTimeout(() => dispatch(setUserBoards(boardsAfterReorderingCols)), 4);

      axios
        .patch(
          `http://localhost:8000/api/user_boards/update-cols/${uid}/${boardUrlID}`,
          newCols
        )
        .catch((err) => {
          alert(`${err.message}: Sorry, unable to re-order columns`);
          dispatch(setUserBoards(originalBoards));
        });
      return;
    }

    // DRAGGING AND DROPPING TASKS  //
    if (type === "task" && userBoards) {
      // Get the column that the task was moved from
      const sourceCol = cols.find(
        (col: { _id: string }) => col._id === source.droppableId
      );

      // Get the column that the task is being moved to
      const destCol = cols.find(
        (col: { _id: string }) => col._id === destination.droppableId
      );

      // Get the tasks arrays from the source and destination columns
      let tasks = Array.from(sourceCol.tasks);
      let destTasks = Array.from(destCol.tasks);

      // If the task is being moved to the same column, make source and destination the same
      if (destination.droppableId === source.droppableId) {
        destTasks = tasks;
      }

      // Get the task being moved
      const task = tasks[source.index];

      // Remove the task original position and insert it into the new position
      tasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, task);

      // Update the source column's tasks array
      const fromCol = {
        ...sourceCol,
        tasks,
      };

      // Update the destination column's tasks array
      const toCol = {
        ...destCol,
        tasks: destTasks,
      };

      // Render the new column client-side
      let originalBoards = [...userBoards];
      setCols((cols: any) => {
        return cols.map((col: any) => {
          if (col._id === destination.droppableId) {
            return toCol;
          } else if (col._id === source.droppableId) {
            return fromCol;
          } else return col;
        });
      });

      let boardsAfterReorderingTasks = userBoards.map((board) => {
        if (board.boardUrlID === boardUrlID) {
          let cols = [...board.cols];
          return {
            ...board,
            cols: cols.map((col: any) => {
              if (col._id === destination.droppableId) {
                return toCol;
              } else if (col._id === source.droppableId) {
                return fromCol;
              } else return col;
            }),
          };
        }
        return board;
      });
      setTimeout(() => dispatch(setUserBoards(boardsAfterReorderingTasks)), 4);

      // Save the columns to the database server-side
      axios
        .patch(
          `http://localhost:8000/api/user_boards/update-cols/${uid}/${boardUrlID}`,
          boardsAfterReorderingTasks.find(
            (board) => board.boardUrlID === boardUrlID
          ).cols
        )
        .catch((err) => {
          alert(`${err.message}: Sorry, unable to reoder tasks`);
          dispatch(setUserBoards(originalBoards));
        });
    }
  };

  if (board === null) {
    return (
      <>
        <ErrorNavbar />
        <div className="page-center text-lg">{error}</div>
      </>
    );
  }

  return (
    <div
      className={`${
        sidebarOpen ? "ml-64" : "ml-0"
      } flex p-6 grow overflow-auto`}
    >
      {/* Columns + New Col Btn */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-x-7 min-h-full"
              id="columns"
            >
              {/* Added Columns */}

              {cols.map((col: any, colIdx: number) => (
                <Draggable
                  draggableId={colIdx.toString()}
                  index={colIdx}
                  key={colIdx.toString()}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      id={colIdx.toString()}
                      className="bg-light-blue dark:bg-[#262833] h-fit min-h-full shadow-lg px-1.5 py-7 rounded-md"
                    >
                      {/* Column Title */}
                      {toggleColTitleEdit !== colIdx ? (
                        <div className="flex items-center relative w-64 mb-4">
                          <div
                            onClick={() => {
                              setToggleColTitleEdit(colIdx);
                            }}
                            className="max-h-32 w-full overflow-auto break-words cursor-pointer p-0.5 rounded-[4px] hover:bg-hollow-grey"
                          >
                            {col.colTitle}{" "}
                            {"tasks" in col && col.tasks.length > 0
                              ? `(${col.tasks.length})`
                              : null}
                          </div>

                          <input
                            onClick={() => {
                              setCurrentColsIdx(colIdx);
                            }}
                            type="image"
                            src={dayMode ? dotsIconNight : dotsIcon}
                            className="h-6"
                          />

                          {/* Columns Edit Dropdown */}
                          {currentColsIdx == colIdx ? (
                            <div
                              ref={colsDropdownRef}
                              className="bg-white dark:bg-grey flex flex-col top-7 right-0 rounded-sm absolute z-50 shadow-md w-32 py-1"
                            >
                              <button
                                onClick={() => {
                                  setShowDeleteColModal(true);
                                }}
                                className="hover:bg-light dark:hover:bg-night text-red text-center"
                              >
                                Delete Column
                              </button>
                              {showDeleteColModal ? (
                                <DeleteColumnModal
                                  colID={col._id}
                                  colIdx={colIdx}
                                  confirmDelete={() =>
                                    deleteCol(col._id, colIdx)
                                  }
                                  onClickOutside={() => {
                                    setShowDeleteColModal(false);
                                    setCurrentColsIdx(-1);
                                  }}
                                />
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <textarea
                          ref={editColTitleRef}
                          rows={2}
                          className="text-dark border-day dark:text-white dark:bg-grey dark:border-night mb-4 max-h-14 w-64 p-0.5"
                          defaultValue={col.colTitle}
                          placeholder="Title cannot be empty"
                          autoFocus
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              editColTitleRef.current!.blur();
                            }
                          }}
                          onBlur={() => {
                            if (
                              editColTitleRef.current!.value.trim() !== "" &&
                              editColTitleRef.current!.value.trim() !==
                                col.colTitle &&
                              !/^\s+$/.test(editColTitleRef.current!.value)
                            ) {
                              let originalBoards = [...userBoards!];
                              dispatch(
                                setUserBoards(
                                  userBoards?.map((board) => {
                                    if (board.boardUrlID === boardUrlID) {
                                      let cols = [...board.cols];
                                      return {
                                        ...board,
                                        cols: cols.map(
                                          (col: any, index: number) => {
                                            if (colIdx === index) {
                                              return {
                                                ...col,
                                                colTitle:
                                                  editColTitleRef.current!.value.trim(),
                                              };
                                            } else return col;
                                          }
                                        ),
                                      };
                                    }
                                    return board;
                                  })
                                )
                              );

                              axios
                                .patch(
                                  `http://localhost:8000/api/user_boards/update-col-name/${uid}/${boardUrlID}/${col._id}`,
                                  {
                                    colTitle:
                                      editColTitleRef.current!.value.trim(),
                                  }
                                )
                                .catch((err) => {
                                  dispatch(setUserBoards(originalBoards));
                                  alert(
                                    `${err.message}: Sorry, unable to update column title`
                                  );
                                });
                            }
                            setToggleColTitleEdit(-1);
                          }}
                        />
                      )}

                      {/* Task Cards */}
                      <Droppable droppableId={col._id} type="task">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex flex-col gap-4"
                            id={col._id}
                          >
                            {"tasks" in col && col.tasks.length > 0 ? (
                              col.tasks.map((task: any, taskIdx: number) => (
                                <Draggable
                                  draggableId={col._id + "_" + taskIdx}
                                  index={taskIdx}
                                  key={col._id + "_" + taskIdx}
                                >
                                  {(provided) => (
                                    <div
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                      id={col._id + "_" + taskIdx}
                                      onClick={() => {
                                        setTaskDetails({
                                          ...task,
                                          colID: col._id,
                                          colIdx: colIdx,
                                          taskIdx: taskIdx,
                                        });
                                        setShowTaskDetailsModal(true);
                                      }}
                                      className="bg-white dark:bg-grey w-64 min-h-20 max-h-35 rounded-md shadow-md cursor-pointer flex flex-col justify-center p-3"
                                    >
                                      <div className="text-dark max-h-20 overflow-auto break-words dark:text-white font-semibold">
                                        {task.taskTitle}
                                      </div>

                                      {/* Subtasks */}
                                      {task.subtasks &&
                                      task.subtasks.length > 0 ? (
                                        <span className="italic">
                                          {
                                            task.subtasks.filter(
                                              (subtask: any) =>
                                                subtask.subtaskDone === true
                                            ).length
                                          }{" "}
                                          of {task.subtasks.length} subtasks
                                        </span>
                                      ) : null}
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            ) : addTaskUI !== colIdx ? (
                              <div
                                className="text-center w-64 h-20 rounded-md border-4 dark:border-grey border-dashed flex flex-col justify-center p-3
                              text-sm italic"
                              >
                                No tasks added yet
                              </div>
                            ) : null}
                            {provided.placeholder}

                            {/* Add Task UI */}
                            {addTaskUI == colIdx ? (
                              <form
                                ref={taskUIRef}
                                onSubmit={(e) => addTask(e, colIdx, col._id)}
                                className="flex flex-col gap-4"
                              >
                                <div className="bg-white dark:bg-grey w-64 rounded-md shadow-md flex flex-col gap-2 p-1.5">
                                  <input
                                    ref={taskNameRef}
                                    type="text"
                                    className="text-dark border-day dark:text-white dark:bg-grey dark:border-night border rounded-sm pl-2 shadow-sm"
                                    placeholder="Task name"
                                    autoFocus
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowModal(true)}
                                    className="w-1/2 text-sm flex cursor-pointer rounded-sm hover:bg-light-blue"
                                  >
                                    + Add more details
                                  </button>
                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      className="rounded text-white px-5 bg-purple bg-purple-gradient hover:shadow-inner-md"
                                    >
                                      Add
                                    </button>
                                    <button
                                      onClick={() => setAddTaskUI(-1)}
                                      type="button"
                                    >
                                      <img src={crossIcon} alt="cross-icon" />
                                    </button>
                                  </div>
                                </div>
                              </form>
                            ) : (
                              <button
                                type="button"
                                onClick={() => showAddTaskUI(colIdx)}
                                className="rounded text-white px-1 py-1 bg-purple bg-purple-gradient hover:shadow-inner-md"
                              >
                                + Add Task
                              </button>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add more details modal */}
              {showModal ? (
                <AddMoreDetailsModal
                  taskName={
                    taskNameRef.current ? taskNameRef.current.value : undefined
                  }
                  colID={cols[addTaskUI]._id}
                  colIdx={addTaskUI}
                  onClickOutside={() => setShowModal(false)}
                  afterTaskAdded={() =>
                    setTimeout(() => {
                      taskNameRef.current!.value = "";
                      taskNameRef.current?.focus();
                    }, 1)
                  }
                />
              ) : null}

              {/* Task Details Modal */}
              {showTaskDetailsModal ? (
                <TaskDetailsModal
                  taskTitle={taskDetails.taskTitle}
                  taskDescription={taskDetails.description}
                  colID={taskDetails.colID}
                  colIdx={taskDetails.colIdx}
                  taskIdx={taskDetails.taskIdx}
                  onClickOutside={() => setShowTaskDetailsModal(false)}
                  taskSubtasks={taskDetails.subtasks}
                />
              ) : null}

              {/* New Col Btn */}
              {newColUI ? (
                <div
                  ref={newColUIRef}
                  className="bg-light-blue dark:bg-[#262833] cursor-pointer hover:text-purple w-64 min-w-[256px] flex flex-col items-center justify-center rounded-md shadow-lg h-20 p-2"
                  onClick={toggleNewCol}
                >
                  <h3>+ Add New Column</h3>
                </div>
              ) : (
                <div className="bg-light-blue dark:bg-[#262833] h-fit min-h-full shadow-lg px-1.5 py-7 rounded-md">
                  <div ref={newColUIRef} className="w-64 min-w-[256px] mt-1">
                    <form className="flex flex-col gap-2" onSubmit={addNewCol}>
                      <input
                        ref={columnTitleRef}
                        type="text"
                        className="bg-white border-day text-dark dark:bg-night dark:text-white dark:border-night border rounded-sm pl-2 shadow-sm"
                        placeholder="Column title..."
                        autoFocus
                        required
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="rounded text-white px-1 bg-purple bg-purple-gradient hover:shadow-inner-md"
                        >
                          Add Column
                        </button>
                        <button onClick={toggleNewCol}>
                          <img src={crossIcon} alt="cross-icon" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Board;
