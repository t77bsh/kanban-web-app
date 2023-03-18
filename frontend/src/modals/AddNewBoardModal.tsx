import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../redux/app/hooks";
import {
  setUserBoards,
  updateNewBoard,
} from "../redux/features/dashboardSlice";
import Modal from "./Modal";
// Spinner
import { ClipLoader } from "react-spinners";

interface Props {
  onClickOutside: () => void;
}

function AddNewBoardModal(props: Props) {
  // Params
  const { uid } = useParams();

  // Refs
  const boardNameRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const addBoardModalRef = useRef<HTMLDivElement>(null);

  // States
  const [disableAddButton, setDisableAddButton] = useState(false);

  // Redux
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSubmitBoardName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisableAddButton(true);
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/user_boards/add-board/" + uid,
        {
          boardName: boardNameRef.current!.value.trim(),
        }
      );
      const addedBoard = res.data.boards[res.data.boards.length - 1];
      dispatch(setUserBoards(res.data.boards));
      navigate(`/${uid}/b/${addedBoard.boardUrlID}/${addedBoard.boardNameUrl}`);
      boardNameRef.current!.value = "";
    } catch (error: any) {
      alert(error.response.data.error | error.message);
    } finally {
      setDisableAddButton(false);
      props.onClickOutside();
    }
  };

  // Effects
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        addBoardModalRef.current &&
        !addBoardModalRef.current.contains(event.target)
      ) {
        props.onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addBoardModalRef]);

  return (
    <Modal>
      <div
        ref={addBoardModalRef}
        className="bg-white dark:bg-grey flex flex-col w-96 rounded-md text-white p-6 gap-y-3"
      >
        {/*  Add New Board (flex-item-1) */}
        <div>
          <h2 className="text-dark dark:text-white">Add New Board</h2>
        </div>

        {/* Board Name + Add Btn (flex-item-2) */}
        <form
          onSubmit={handleSubmitBoardName}
          className="flex flex-col gap-y-3"
        >
          <div className="flex flex-col">
            <label className="text-grey dark:text-white" htmlFor="boardName">
              Board Name
            </label>
            <input
              ref={boardNameRef}
              type="text"
              name="boardName"
              id="boardName"
              placeholder="e.g. Web Design"
              className="border-day text-dark dark:text-white dark:border-night bg-transparent border rounded-sm pl-2"
              pattern=".*\S+.*"
              autoFocus
              required
              title="No empty text allowed."
            />
          </div>

          <button
            ref={addButtonRef}
            type="submit"
            className={`${
              disableAddButton ? "cursor-not-allowed" : "hover:shadow-inner-md"
            } rounded-3xl text-white px-4 py-1.5 bg-purple bg-purple-gradient hover:font-semibold`}
            disabled={disableAddButton}
          >
            {disableAddButton ? (
              <div className="flex justify-center items-center font-semibold gap-x-2">
                <ClipLoader color="#fff" size={15} />
                Adding...
              </div>
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}
export default AddNewBoardModal;
