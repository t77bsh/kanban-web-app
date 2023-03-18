import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
// Component imports
import NightModeToggleSwitch from "../misc/NightModeToggleSwitch";
import AddNewBoardModal from "../modals/AddNewBoardModal";
import NoBoardsNavbar from "../components/NoBoardsNavbar";

// Redux
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import { setUserBoards } from "../redux/features/dashboardSlice";
// Axios
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function NoBoards() {
  // States
  const [showAddNewBoardModal, setShowAddNewBoardModal] = useState(false);

  // Params
  const { uid } = useParams();

  // Auth
  const { user } = useAuth();

  //Redux
  const boards = useAppSelector((state) => state.dashboard.userBoards);
  const dispatch = useAppDispatch();

  const fetchBoards = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/user_boards/${uid}`
      );
      dispatch(setUserBoards(res.data.boards));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!boards) {
    useEffect(() => {
      fetchBoards();
    }, []);

    return <Navigate to="/" />;
  } else if (boards.length == 0) {
    // if display name is separated by spaces, only use the first word
    let boardName = null;
    if (user && "displayName" in user && user.displayName) {
      let boardNameSpaces = user.displayName.split(" ");
      boardName = boardNameSpaces[0];
    }
    return (
      <>
        {/* Navbar */}
        <NoBoardsNavbar />

        {/* Create new board button  */}
        <div className="flex flex-col gap-2 page-center">
          <p className="text-italic text-lg text-center">
            You have no boards. Create a new board to get started!
          </p>
          <button
            onClick={() => setShowAddNewBoardModal(true)}
            className="flex mx-auto rounded-3xl bg-purple-gradient px-7 py-2"
          >
            <svg
              className="my-auto mr-4"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                fill="white"
              />
            </svg>
            <div className="text-white">Create A Board</div>
          </button>
        </div>
        <div className="absolute top-7 right-16">
          <NightModeToggleSwitch />
        </div>

        {/* Modal for adding new board */}
        {showAddNewBoardModal ? (
          <AddNewBoardModal
            onClickOutside={() => setShowAddNewBoardModal(false)}
          />
        ) : null}
      </>
    );
  } else {
    return (
      <Navigate
        to={`/${uid}/b/${boards[0].boardUrlId}/${boards[0].boardNameUrl}`}
      />
    );
  }
}

export default NoBoards;
