// Hook imports
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, NavLink, useParams } from "react-router-dom";
// Component imports
import AddNewBoardModal from "../modals/AddNewBoardModal";
import DeleteBoardModal from "../modals/DeleteBoardModal";
// Context imports
import { useTheme } from "../context/ThemeContext";
// Asset imports
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";
import NightModeToggleSwitch from "../misc/NightModeToggleSwitch";
import hideSideEyeIcon from "../assets/icon-hide-sidebar.svg";
import showSideEyeIcon from "../assets/icon-show-sidebar.svg";
import dotsIcon from "../assets/icon-dots.svg";
import dotsIconNight from "../assets/icon-dots-night.svg";
// Redux
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { setUserBoards, toggle } from "../redux/features/dashboardSlice";
// Libary imports
import axios from "axios";

function Sidebar() {
  // Contexts
  const { dayMode } = useTheme();

  // States
  const [boards, setBoards] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showSideEye, setShowSideEye] = useState(false);
  const [showBoardDots, setShowBoardDots] = useState(-1);
  const [editBoardDropdown, setEditBoardDropdown] = useState({
    showing: false,
    index: -1,
  });
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  //Refs
  const editBoardDropdownRef = useRef<HTMLDivElement>(null);

  // Redux
  const dispatch = useAppDispatch();
  const updatedBoardName = useAppSelector(
    (state) => state.dashboard.updatedBoard
  );
  const userBoards = useAppSelector((state) => state.dashboard.userBoards);

  // CLICK HANDLERS
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    setShowSideEye(!showSideEye);
    dispatch(toggle());
  };
  const navigate = useNavigate();
  const deleteBoard = (index: number) => {
    let originalBoards = [...boards];
    dispatch(setUserBoards(boards.filter((board, i) => i !== index)));

    // If any board except first is deleted, navigate to the first board
    if (
      index == 0 &&
      boards.length > 1 &&
      boardUrlID === boards[index].boardUrlID
    ) {
      navigate(`/${uid}/b/${boards[1].boardUrlID}/${boards[1].boardNameUrl}`);
    } else if (
      index == 0 &&
      boards.length == 1 &&
      boardUrlID === boards[index].boardUrlID
    ) {
      // dispatch(setUserBoards([]));
      navigate(`/${uid}/b/`);
    } else if (index > 0 && boardUrlID === boards[index].boardUrlID) {
      navigate(`/${uid}/b/${boards[0].boardUrlID}/${boards[0].boardNameUrl}`);
    }

    axios
      .patch(
        `http://localhost:8000/api/user_boards/delete-board/${uid}/${boards[index].boardUrlID}`
      )
      .then((res) => {
        console.log("Deleted board successfully");
      })
      .catch((err) => {
        alert(
          `${err.message}: Oops! Could not delete board likely due to a server error. Please try again later.`
        );
        dispatch(setUserBoards(originalBoards));
        navigate(
          `/${uid}/b/${boards[index].boardUrlID}/${boards[index].boardNameUrl}`
        );
      });
    setEditBoardDropdown({ showing: false, index: -1 });
  };

  // EFFECTS //

  // URL Params for HTTP requests
  const { uid, boardUrlID } = useParams();

  // Get boards from backend
  useEffect(() => {
    if (userBoards) {
      setBoards(userBoards);
    }
  }, [userBoards]);

  useEffect(() => {
    if (updatedBoardName) {
      const updatedBoards = boards.map((board) => {
        if (board.boardUrlID === updatedBoardName.boardUrlID) {
          return updatedBoardName;
        }
        return board;
      });
      dispatch(setUserBoards(updatedBoards));
    }
  }, [updatedBoardName]);

  // Close edit board dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (
        editBoardDropdownRef.current &&
        !editBoardDropdownRef.current.contains(event.target)
      ) {
        setEditBoardDropdown({ showing: false, index: -1 });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editBoardDropdownRef]);

  // CLASS NAMES //
  const boardClassActive =
    "bg-purple bg-purple-gradient hover:shadow-inner-md flex active relative rounded-r-3xl text-left pl-7 py-2 mr-7";
  const boardClassInactive =
    "hover:bg-lighter-purple dark:hover:bg-night flex rounded-r-3xl relative cursor-pointer text-grey text-left pl-7 py-2 mr-7 hover:text-purple [&_path]:hover:fill-purple";

  //SVGBoardIcon
  const SVGBoardIcon = (
    <svg
      className="my-auto mr-4 z-0"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="z-0"
        d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
        fill="#828FA3"
      />
    </svg>
  );

  return (
    <aside className="absolute z-40">
      <div
        className={`bg-white border-day dark:bg-grey dark:border-night ${
          sidebarVisible ? "flex flex-col" : "hidden"
        } w-64 h-screen border-r-2`}
      >
        {/* Logo */}
        <div className="flex p-7">
          <Link to="/">
            <img src={dayMode ? logoLight : logoDark} alt="logo" />
          </Link>
        </div>

        {/* All Boards */}
        <h4 className="pl-7 mb-2.5">ALL BOARDS ({boards.length})</h4>

        {/* New Boards Render Here */}
        <div className="flex flex-col gap-1 pt-2 pb-8 overflow-auto">
          {boards.map((board: any, index: number) => (
            <div key={index} className="relative">
              <NavLink
                to={`/${uid}/b/${board.boardUrlID}/${board.boardNameUrl}`}
                key={index}
                className={({ isActive }: { isActive: boolean }) =>
                  isActive ? boardClassActive : boardClassInactive
                }
                onMouseEnter={() => setShowBoardDots(index)}
                onMouseLeave={() => setShowBoardDots(-1)}
              >
                {SVGBoardIcon}

                <p className="z-0 truncate w-36">{board.boardName}</p>

                {showBoardDots == index ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditBoardDropdown((prevState) => ({
                        ...prevState,
                        showing: !prevState.showing,
                        index: index,
                      }));
                    }}
                    className="absolute rounded-sm hover:bg-hollow-grey w-5 h-5 top-2 right-2"
                  >
                    <img
                      className="h-5"
                      src={
                        dayMode || boardUrlID === board.boardUrlID
                          ? dotsIconNight
                          : dotsIcon
                      }
                      alt="dots"
                    />
                  </button>
                ) : null}
              </NavLink>
              {editBoardDropdown.showing && editBoardDropdown.index == index ? (
                <div
                  ref={editBoardDropdownRef}
                  className="-bottom-7 bg-white dark:bg-grey flex flex-col rounded-sm absolute z-50 shadow-md right-7 w-32 py-1"
                >
                  <button
                    onClick={() => setShowConfirmDeleteModal(true)}
                    className="hover:bg-light dark:hover:bg-night text-red text-center"
                  >
                    Delete Board
                  </button>
                  {showConfirmDeleteModal ? (
                    <DeleteBoardModal
                      index={index}
                      onClickOutside={() => setShowConfirmDeleteModal(false)}
                      confirmDelete={() => deleteBoard(index)}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Create New Board */}
        {boards.length >= 8 ? (
          <div className="text-center text-xs italic">
            Maximum boards limit reached.
          </div>
        ) : (
          <button onClick={() => setShowModal(true)} className="flex pl-7">
            <svg
              className="my-auto mr-4"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                fill="#635FC7"
              />
            </svg>
            <div className="text-purple">+ Create New Board</div>
          </button>
        )}

        {/* Night Mode + Hide Sidebar */}
        <div className="mx-7 mt-auto mb-4">
          {/* Night Mode Switch */}
          <div className="bg-day dark:bg-night p-3.5 rounded-lg">
            <NightModeToggleSwitch />
          </div>
          {/* Hide Sidebar */}
          <div
            onClick={toggleSidebar}
            className="flex gap-4 my-5 cursor-pointer"
          >
            <img
              className="object-contain"
              src={hideSideEyeIcon}
              alt="eye-icon"
            />
            <div className="font-bold">Hide Sidebar</div>
          </div>
        </div>
      </div>

      {/* Show Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className={`${
          showSideEye ? "block" : "hidden"
        } bg-purple bg-purple-gradient hover:shadow-inner-md w-16 h-12 rounded-r-3xl fixed bottom-10 `}
      >
        <img className="m-auto" src={showSideEyeIcon} alt="show-sidebar" />
      </button>

      {showModal ? (
        <AddNewBoardModal onClickOutside={() => setShowModal(false)} />
      ) : null}
    </aside>
  );
}

export default Sidebar;
