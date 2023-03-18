import { useRef, useEffect } from "react";
import Modal from "./Modal";
import { useTheme } from "../context/ThemeContext";

interface Props {
  colID: string;
  colIdx: number;
  confirmDelete: (colID: string, colIdx: number) => void;
  onClickOutside: () => void;
}

function DeleteTaskModal(props: Props) {
  const deleteModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        deleteModalRef.current &&
        !deleteModalRef.current.contains(event.target)
      ) {
        props.onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteModalRef]);

  // Contexts
  const { dayMode } = useTheme();

  return (
    <Modal>
      <div
        ref={deleteModalRef}
        className="bg-white dark:bg-night flex flex-col rounded-md p-4 gap-3 w-80"
      >
        <div className="text-2xl text-grey font-semibold">Delete Column?</div>
        <div className="text-grey">
          Are you sure you want to delete this column? All related tasks and
          data would be deleted. This action cannot be undone.
        </div>
        <div className="flex gap-5">
          <button
            onClick={() => props.onClickOutside()}
            className="text-white grow rounded py-1 bg-purple bg-purple-gradient hover:shadow-inner-md "
          >
            Cancel
          </button>
          <button
            onClick={() => {
              props.confirmDelete(props.colID, props.colIdx);
              props.onClickOutside();
            }}
            className="bg-red hover:shadow-inner-md grow rounded text-white py-1"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteTaskModal;
