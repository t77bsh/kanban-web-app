import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// Asset imports
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";
// Context imports
import { useTheme } from "../context/ThemeContext";
import Dropdown from "./Dropdown";
//Redux
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";

//Axios
import axios from "axios";
import {
  setUserBoards,
  updateNavTitle,
} from "../redux/features/dashboardSlice";

function Navbar() {
  //Redux
  const dispatch = useAppDispatch();

  //Hooks
  const navigate = useNavigate();
  const { dayMode } = useTheme();

  //States
  const [toggleHeadingInput, setToggleHeadingInput] = useState(true);
  const [navTitle, setNavTitle] = useState("");

  // Refs
  const titleRef = useRef<HTMLInputElement>(null);

  // Params
  const { uid, boardUrlID, boardName } = useParams<{
    uid: string;
    boardUrlID: string;
    boardName: string;
  }>();

  let userBoards = useAppSelector((state) => state.dashboard.userBoards);

  // Effects
  useEffect(() => {
    if (userBoards) {
      const board = userBoards.find(
        (board) =>
          boardUrlID === board.boardUrlID && boardName === board.boardNameUrl
      );
      if (board) {
        setNavTitle(board.boardName);
      }
    }
  }, [userBoards, boardUrlID, boardName]);

  // Change board name
  const handleClickOutside = (event: { target: any }) => {
    setToggleHeadingInput(true);
    if (
      titleRef.current &&
      titleRef.current.value !== navTitle &&
      !/^\s*$/.test(titleRef.current.value) &&
      userBoards
    ) {
      const newTitle = titleRef.current.value.trim();

      let originalBoards = [...userBoards];

      const boardsAfterUpdatingBoardName = userBoards.map((board: any) => {
        if (board.boardUrlID === boardUrlID) {
          return {
            ...board,
            boardName: newTitle,
            boardNameUrl: boardNameURLify(newTitle),
          };
        }
        return board;
      });

      let oldBoardName = boardName;

      dispatch(setUserBoards(boardsAfterUpdatingBoardName));
      navigate(`/${uid}/b/${boardUrlID}/${boardNameURLify(newTitle)}`);

      axios
        .patch(
          `http://localhost:8000/api/user_boards/update-board-name/${uid}/${boardUrlID}`,
          {
            boardName: newTitle,
            boardNameUrl: boardNameURLify(newTitle),
          }
        )
        .then(() => {
          dispatch(updateNavTitle(newTitle));
        })
        .catch((err) => {
          navigate(`/${uid}/b/${boardUrlID}/${oldBoardName}`);
          alert(err.message);
          dispatch(setUserBoards(originalBoards));
        });
    }
  };

  return (
    <nav className="bg-white border-day dark:bg-grey dark:border-night flex w-full shrink h-20 border-b-2">
      {/* Logo */}
      <div className="border-day dark:border-night min-w-64 border-r-2">
        <div className="flex p-7">
          <Link to="/">
            <img src={dayMode ? logoLight : logoDark} alt="logo" />
          </Link>
        </div>
      </div>

      <div className="flex items-center ml-10 mr-7 justify-between flex-grow">
        {/* Board Name */}
        {toggleHeadingInput ? (
          <h1
            onClick={() => setToggleHeadingInput(!toggleHeadingInput)}
            className="text-dark overflow-auto min-w-8 max-w-full max-h-12 dark:text-white break-words cursor-pointer rounded-[4px] px-2 hover:bg-hollow-grey"
          >
            {navTitle}
          </h1>
        ) : (
          <input
            ref={titleRef}
            type="text"
            autoFocus
            onFocus={(e) => e.target.select()}
            defaultValue={navTitle}
            className="text-dark border-day dark:text-white dark:bg-grey dark:border-night border rounded-[4px] px-2 text-2xl font-semibold"
            pattern=".*\S+.*"
            title="No empty text allowed."
            required
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                titleRef.current?.blur();
              }
            }
            }
            onBlur={handleClickOutside}
          />
        )}

        {/* Three Dots Dropdown */}
        <Dropdown />
      </div>
    </nav>
  );
}

const boardNameURLify = (boardName: string) =>
  boardName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-");

export default Navbar;
