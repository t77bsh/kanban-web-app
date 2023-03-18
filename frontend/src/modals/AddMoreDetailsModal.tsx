import React, { useState, useRef, useEffect } from "react";
import Modall from "./Modal";
import { useTheme } from "../context/ThemeContext";
import crossIcon from "../assets/icon-cross.svg";
import axios from "axios";
import { useParams } from "react-router-dom";
// Redux
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { updateNewTask } from "../redux/features/boardSlice";
import { setUserBoards } from "../redux/features/dashboardSlice";

interface Props {
  taskName: string | undefined;
  colID: string;
  colIdx: number;
  onClickOutside: () => void;
  afterTaskAdded: () => NodeJS.Timeout;
}

function AddMoreDetailsModal(props: Props) {
  const addMoreDetailsModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        addMoreDetailsModalRef.current &&
        !addMoreDetailsModalRef.current.contains(event.target)
      ) {
        props.onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addMoreDetailsModalRef]);

  //Redux
  const dispatch = useAppDispatch();
  let userBoards = useAppSelector((state) => state.dashboard.userBoards);

  //States
  const [subtasks, setSubtasks] = useState<
    {
      placeholder: string;
      autoFocus: boolean;
    }[]
  >([
    {
      placeholder: "e.g. Check grammar",
      autoFocus: false,
    },
    {
      placeholder: "e.g. Add FAQ slide",
      autoFocus: false,
    },
  ]);

  //Refs
  const taskNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const subtasksRef = useRef<HTMLInputElement[]>([]);

  //Params
  const { uid, boardUrlID } = useParams();

  // Form submit handler
  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newTask = {
      taskTitle: taskNameRef.current?.value,
      description: descriptionRef.current?.value,
      subtasks: subtasksRef.current
        .filter((ref) => ref.value !== "")
        .map((ref) => ({ subtaskTitle: ref.value, subtaskDone: false })),
    };

    if (userBoards) {
      let originalBoards = [...userBoards];
      let boardsAfterUpdatingTask = userBoards.map((board: any) => {
        if (board.boardUrlID === boardUrlID) {
          const cols = [...board.cols];
          cols[props.colIdx] = {
            ...cols[props.colIdx],
            tasks: [...cols[props.colIdx].tasks, newTask],
          };

          return {
            ...board,
            cols,
          };
        }
        return board;
      });
      dispatch(setUserBoards(boardsAfterUpdatingTask));
      props.afterTaskAdded();

      axios
        .patch(
          `http://localhost:8000/api//user_boards/add-task/${uid}/${boardUrlID}/${props.colID}`,
          newTask
        )
        .catch((err) => {
          dispatch(setUserBoards(originalBoards));
          alert(
            `${err.message}: Sorry, unable to update task details. Please try again later.`
          );
        });
    }

    props.onClickOutside();
  };
  return (
    <Modall>
      <div
        ref={addMoreDetailsModalRef}
        className="bg-white dark:bg-grey flex flex-col w-96 rounded-md p-6 gap-y-3 text-white"
      >
        <div>
          <h2 className="text-dark dark:text-white">Add details</h2>
        </div>

        <form onSubmit={addTask} className="flex flex-col gap-y-3">
          {/* Task Name*/}
          <div className="flex flex-col dark:text-white">
            <label className="text-grey dark:text-white" htmlFor="task">
              Task
            </label>
            <input
              ref={taskNameRef}
              type="text"
              name="task"
              id="task"
              placeholder="e.g. Finish presentation"
              className="border-day text-dark dark:text-white dark:border-night bg-transparent border rounded-sm pl-2"
              required
              defaultValue={props.taskName}
              autoFocus
            />
          </div>
          {/* Description */}
          <div className="flex flex-col">
            <label className="text-grey dark:text-white" htmlFor="description">
              Description (optional)
            </label>
            <textarea
              ref={descriptionRef}
              name="description"
              id="description"
              rows={2}
              className="border-day text-dark dark:text-white dark:border-night bg-transparent border rounded-sm pl-2"
              placeholder="e.g. This presentation is about the new features of our product."
            />
          </div>
          {/* Subtasks */}
          <div className="flex flex-col gap-y-1.5">
            <label className="text-grey dark:text-white" htmlFor="subtasks">
              Subtasks (optional)
            </label>

            {subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center gap-x-2">
                <input
                  ref={(el: HTMLInputElement) =>
                    (subtasksRef.current[index] = el)
                  }
                  type="text"
                  name="subtasks"
                  id={"subtasks-" + index}
                  placeholder={subtask.placeholder}
                  className="border-day text-dark dark:text-white dark:border-night bg-transparent border w-full rounded-sm pl-2"
                  autoFocus={subtask.autoFocus}
                />
                <div>
                  <img
                    src={crossIcon}
                    alt="cross-icon"
                    onClick={(e) => {
                      (
                        e.currentTarget.parentElement!
                          .parentElement as HTMLDivElement
                      ).style.display = "none";
                      (
                        e.currentTarget.parentElement!.parentElement
                          ?.firstElementChild as HTMLInputElement
                      ).disabled = true;
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="rounded-sm w-fit px-0.5 flex text-purple hover:font-[550]"
              onClick={() =>
                setSubtasks([
                  ...subtasks,
                  { placeholder: "New subtask", autoFocus: true },
                ])
              }
            >
              + Add New Subtask
            </button>
          </div>

          <button
            type="submit"
            className="bg-purple bg-purple-gradient rounded-3xl text-white py-1.5 hover:shadow-inner-md"
          >
            Add Task
          </button>
        </form>
      </div>
    </Modall>
  );
}

export default AddMoreDetailsModal;
