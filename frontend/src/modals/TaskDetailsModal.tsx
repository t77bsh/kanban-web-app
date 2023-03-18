import React, { useRef, useEffect, useState } from "react";
import Modall from "./Modal";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { useParams } from "react-router-dom";
// Redux
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
//Asset imports
import editIconNight from "../assets/edit-icon-night.svg";
import editIconDay from "../assets/edit-icon-day.svg";
import deleteIcon from "../assets/delete-icon.svg";
import AddMoreDetailsModal from "./AddMoreDetailsModal";
import DeleteTaskModal from "./DeleteTaskModal";
import { setUserBoards } from "../redux/features/dashboardSlice";

interface subtask {
  subtaskTitle: string;
  subtaskDone: boolean;
  _id?: string;
}

interface Props {
  onClickOutside: () => void;
  taskTitle: string;
  taskDescription: string;
  taskSubtasks: subtask[];
  taskIdx: number;
  colID: string;
  colIdx: number;
}

function TaskDetailsModal(props: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const userBoards = useAppSelector((state) => state.dashboard.userBoards);
  // Contexts
  const { dayMode } = useTheme();
  //Params
  const { uid, boardUrlID } = useParams<{ uid: string; boardUrlID: string }>();
  //Refs
  const taskDetailsModalRef = useRef<HTMLDivElement>(null);
  const taskNameRef = useRef<HTMLHeadingElement>(null);
  const taskNameTextareaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const newSubtaskInputRef = useRef<HTMLInputElement>(null);
  const newSubtaskFormRef = useRef<HTMLFormElement>(null);
  const subtasksScrollAreaRef = useRef<HTMLDivElement>(null);
  const subtaskNameRef = useRef<HTMLLabelElement>(null);
  const subtaskEditRef = useRef<HTMLInputElement>(null);
  const confirmDeleteSubtaskButtonRef = useRef<HTMLButtonElement>(null);
  //States
  const [subtasks, setSubtasks] = useState<subtask[]>(props.taskSubtasks);
  const [toggleTitleTextarea, setToggleTitleTextarea] = useState(true);
  const [toggleDescriptionTextarea, setToggleDescriptionTextarea] =
    useState(true);
  const [taskTitle, setTaskTitle] = useState(props.taskTitle);
  const [taskDescription, setTaskDescription] = useState(props.taskDescription);
  const [toggleNewSubtask, setToggleNewSubtask] = useState(true);
  const [showIndexedEditDeleteIcons, setShowIndexedEditDeleteIcons] =
    useState(-1);
  const [editSubtaskName, setEditSubtaskName] = useState(-1);
  const [showOnlyDelete, setShowOnlyDelete] = useState(-1);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  //Effects
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        taskDetailsModalRef.current &&
        !taskDetailsModalRef.current.contains(event.target)
      ) {
        props.onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [taskDetailsModalRef]);

  // Handle Click Outside of Task Name, Description or New Subtask UI
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const taskName = taskNameTextareaRef.current?.contains(
        event.target as Node
      );
      const description = descriptionTextareaRef.current?.contains(
        event.target as Node
      );

      const newSubtaskForm = newSubtaskFormRef.current?.contains(
        event.target as Node
      );
      const confirmDeleteSubtaskButton =
        confirmDeleteSubtaskButtonRef.current?.contains(event.target as Node);
      if (!toggleTitleTextarea && !taskName) {
        if (
          taskNameTextareaRef.current?.value &&
          taskNameTextareaRef.current?.value.trim() !== "" &&
          taskNameTextareaRef.current?.value !== taskTitle
        ) {
          setTaskTitle(taskNameTextareaRef.current?.value);
        }
        setToggleTitleTextarea(true);
      }
      if (!toggleDescriptionTextarea && !description) {
        if (descriptionTextareaRef.current?.value !== taskDescription) {
          setTaskDescription(descriptionTextareaRef.current?.value || "");
        }
        setToggleDescriptionTextarea(true);
      }
      if (!toggleNewSubtask && !newSubtaskForm) {
        setToggleNewSubtask(true);
      }
      if (!confirmDeleteSubtaskButton) {
        setShowOnlyDelete(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    taskNameTextareaRef,
    descriptionTextareaRef,
    toggleTitleTextarea,
    toggleDescriptionTextarea,
    toggleNewSubtask,
    newSubtaskFormRef,
    confirmDeleteSubtaskButtonRef,
  ]);

  // Scroll to the bottom of the subtasks div when new subtask is added
  const scrollToBottom = () => {
    if (subtasksScrollAreaRef.current) {
      setTimeout(() => {
        subtasksScrollAreaRef.current!.scrollTop =
          subtasksScrollAreaRef.current!.scrollHeight;
      }, 0);
    }
  };

  // CLICK HANDLERS
  const handleDoneStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexSubtask: number
  ) => {
    let newSubtasks = subtasks.map((subtask, index) => {
      if (index == indexSubtask) {
        return { ...subtask, subtaskDone: e.target.checked };
      }
      return subtask;
    });
    setSubtasks(newSubtasks);
  };

  const saveChanges = () => {
    if (userBoards) {
      let originalBoards = [...userBoards];

      let boardsAfterTaskUpdate = userBoards.map((board) => {
        if (board.boardUrlID === boardUrlID) {
          return {
            ...board,
            cols: board.cols.map((col: any, index: number) => {
              if (index === props.colIdx) {
                return {
                  ...col,
                  tasks: col.tasks.map((task: any, index: number) => {
                    if (index === props.taskIdx) {
                      return {
                        ...task,
                        taskTitle: taskTitle,
                        description: taskDescription,
                        subtasks: subtasks,
                      };
                    }
                    return task;
                  }),
                };
              }
              return col;
            }),
          };
        }
        return board;
      });

      dispatch(setUserBoards(boardsAfterTaskUpdate));

      axios
        .patch(
          `http://localhost:8000/api/user_boards/update-task/${uid}/${boardUrlID}/${props.colID}/${props.taskIdx}`,
          {
            taskTitle: taskTitle,
            description: taskDescription,
            subtasks: subtasks,
          }
        )
        .catch((err: any) => {
          dispatch(setUserBoards(originalBoards));
          alert(
            `${err.message}: Unable to save changes. Please try again later`
          );
        });
    }
    props.onClickOutside();
  };

  const deleteTask = () => {
    if (userBoards && props.taskIdx !== -1) {
      let originalBoards = [...userBoards];
      console.log(props.taskIdx, props.colIdx);

      const boardsAfterDeletingTask = userBoards.map((board) => {
        if (board.boardUrlID === boardUrlID) {
          let newTasks = [...board.cols[props.colIdx].tasks];
          newTasks.splice(props.taskIdx, 1);
          return {
            ...board,
            cols: board.cols.map((col: any, index: number) => {
              if (index === props.colIdx) {
                return {
                  ...col,
                  tasks: newTasks,
                };
              }
              return col;
            }),
          };
        }
        return board;
      });

      dispatch(setUserBoards(boardsAfterDeletingTask));
      axios
        .delete(
          `http://localhost:8000/api/user_boards/delete-task/${uid}/${boardUrlID}/${props.colIdx}/${props.taskIdx}`
        )
        .catch((err) => {
          dispatch(setUserBoards(originalBoards));
          alert(
            `${err.message}: Unable to delete task. Please try again later.`
          );
        });
    }
    props.onClickOutside();
  };

  const deleteSubtask = (indexSubtask: number) => {
    let newSubtasks = subtasks.filter((subtask, index) => {
      return index !== indexSubtask;
    });
    setSubtasks(newSubtasks);
  };

  return (
    <Modall>
      <div
        ref={taskDetailsModalRef}
        className="bg-white dark:bg-grey flex flex-col w-[30rem] max-h-[600px] rounded-md p-6 gap-y-3 select-none text-white"
      >
        {/* Task Title */}
        {toggleTitleTextarea ? (
          <h2
            ref={taskNameRef}
            onClick={() => setToggleTitleTextarea(false)}
            className="text-dark break-words max-h-20 overflow-auto dark:text-white rounded-[4px] p-0.5 cursor-pointer grow hover:bg-hollow-grey"
          >
            {taskTitle}
          </h2>
        ) : (
          <textarea
            ref={taskNameTextareaRef}
            rows={1}
            onFocus={(e) => e.target.select()}
            className="border-day text-dark dark:border-night dark:bg-transparent dark:text-white border rounded-[4px] pl-1 text-lg"
            defaultValue={taskNameRef.current?.innerHTML}
            autoFocus
          />
        )}

        {/* Description */}
        <div className="flex flex-col">
          {toggleDescriptionTextarea ? (
            <>
              <div
                className={`${
                  taskDescription && !/^\s+$/.test(taskDescription)
                    ? ""
                    : "hidden"
                } text-grey dark:text-white text-[13px] font-semibold`}
              >
                Description
              </div>
              <div
                ref={descriptionRef}
                onClick={() => setToggleDescriptionTextarea(false)}
                className={`${
                  taskDescription && !/^\s+$/.test(taskDescription)
                    ? null
                    : "text-xs italic h-12"
                } text-grey rounded-[4px] p-0.5 cursor-pointer hover:bg-hollow-grey`}
              >
                {taskDescription && !/^\s+$/.test(taskDescription)
                  ? taskDescription
                  : "Add description..."}
              </div>
            </>
          ) : (
            <textarea
              ref={descriptionTextareaRef}
              rows={2}
              onFocus={(e) => e.target.select()}
              className="border-day dark:border-night dark:bg-transparent pl-1 text-grey border rounded-[4px]"
              defaultValue={
                descriptionRef.current?.innerHTML.trim() !==
                "Add description..."
                  ? descriptionRef.current?.innerHTML
                  : ""
              }
              placeholder="Add description..."
              autoFocus
            />
          )}
        </div>

        {/* Subtasks */}
        <div className="text-grey dark:text-white text-[13px] font-semibold">
          Subtasks ({subtasks.filter((subtask) => subtask.subtaskDone).length}{" "}
          of {subtasks.length})
        </div>
        {subtasks.length > 0 ? (
          <div
            ref={subtasksScrollAreaRef}
            className="overflow-y-auto py-1 flex flex-col gap-y-2"
          >
            {subtasks.map((subtask, index) => {
              if (
                subtask.subtaskTitle !== "" &&
                !/^\s+$/.test(subtask.subtaskTitle)
              )
                return (
                  <div
                    key={index}
                    className="bg-light-blue text-dark hover:bg-day-btn dark:bg-night dark:hover:bg-night-btn
                    flex gap-x-3 py-1 px-3 rounded-[4px]"
                    onMouseEnter={() => setShowIndexedEditDeleteIcons(index)}
                    onMouseLeave={() => setShowIndexedEditDeleteIcons(-1)}
                  >
                    <input
                      type="checkbox"
                      className="cursor-pointer rounded-sm accent-purple" // TODO: sort out default background color for the checkbox
                      name={index.toString()}
                      id={index.toString()}
                      defaultChecked={subtask.subtaskDone}
                      onChange={(e) => handleDoneStatus(e, index)}
                    />

                    {/* Edit Subtask */}
                    {editSubtaskName !== index ? (
                      <label
                        ref={subtaskNameRef}
                        className={`${
                          subtask.subtaskDone
                            ? "line-through text-grey"
                            : "font-semibold  dark:text-white"
                        } w-full cursor-pointer`}
                        htmlFor={index.toString()}
                      >
                        {subtask.subtaskTitle}
                      </label>
                    ) : (
                      <input
                        ref={subtaskEditRef}
                        type="text"
                        className="dark:bg-transparent  dark:text-white w-full pl-1"
                        defaultValue={subtask.subtaskTitle}
                        autoFocus
                        onFocus={(e) => e.target.select()}
                        onBlur={(e) => {
                          setEditSubtaskName(-1);
                          if (
                            e.target.value.trim() !== "" &&
                            !/^\s+$/.test(e.target.value.trim())
                          ) {
                            subtask.subtaskTitle = e.target.value.trim();
                          } else {
                            alert("Subtask name cannot be empty!");
                          }
                        }}
                        required
                      />
                    )}

                    {/* Subtask Edit and Delete Icons */}
                    {showIndexedEditDeleteIcons == index ? (
                      <>
                        {showOnlyDelete == index ? (
                          <button
                            className="bg-red px-1 rounded-[4px]"
                            ref={confirmDeleteSubtaskButtonRef}
                            onClick={() => deleteSubtask(index)}
                          >
                            Delete?
                          </button>
                        ) : (
                          <span className="flex gap-1 scale-75 mr-3">
                            <img
                              src={dayMode ? editIconDay : editIconNight}
                              alt="edit-icon"
                              className="cursor-pointer p-0.5 hover:bg-hollow-grey rounded-sm"
                              onClick={() => setEditSubtaskName(index)}
                            />
                            <img
                              src={deleteIcon}
                              alt="delete-icon"
                              className="cursor-pointer p-0.5 hover:bg-hollow-grey rounded-sm"
                              onClick={() => setShowOnlyDelete(index)}
                            />
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>
                );
            })}
          </div>
        ) : null}
        {/* Add subtasks */}
        {toggleNewSubtask ? (
          <button
            type="button"
            className="rounded-sm w-fit px-0.5 flex text-purple hover:font-[550]"
            onClick={() => setToggleNewSubtask(false)}
          >
            + Add New Subtask
          </button>
        ) : (
          <form
            ref={newSubtaskFormRef}
            onSubmit={(e) => {
              e.preventDefault();
              scrollToBottom();
              let newSubtasks = [...subtasks];
              let newSubtaskTitle = newSubtaskInputRef.current!.value.trim();
              if (!newSubtaskTitle) {
                alert("Error: Subtask name cannot be empty.");
                return;
              }
              newSubtasks.push({
                subtaskTitle: newSubtaskTitle,
                subtaskDone: false,
              });
              setSubtasks(newSubtasks);
              newSubtaskInputRef.current!.value = "";
              setToggleNewSubtask(true);
            }}
            className="flex gap-x-1"
          >
            <input
              ref={newSubtaskInputRef}
              type="text"
              className="text-dark dark:text-white dark:bg-transparent
          py-1 px-3 w-full border border-day rounded-[4px]"
              autoFocus
              placeholder="Subtask name..."
              required
            />
            <button
              className="text-purple dark:text-white font-semibold underline text-xs"
              type="submit"
            >
              Add
            </button>
          </form>
        )}

        {/* Save Button */}
        <button
          onClick={saveChanges}
          className="bg-purple bg-purple-gradient rounded-3xl text-white py-1.5 hover:shadow-inner-md"
        >
          Save Changes
        </button>
        <button
          onClick={() => setShowDeleteTaskModal(true)}
          className="text-red underline text-center"
        >
          Delete Task
        </button>
        {/* Delete Task Modal */}
        {showDeleteTaskModal ? (
          <DeleteTaskModal
            index={props.taskIdx}
            onClickOutside={() => setShowDeleteTaskModal(false)}
            confirmDelete={deleteTask}
          />
        ) : null}
      </div>
    </Modall>
  );
}

export default TaskDetailsModal;
